"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import {
  PhotoItem,
  CollageLayout,
  CanvasConfig,
  BackgroundConfig,
  TextOverlayItem,
  StickerOverlayItem,
  FrameConfig,
  ActiveToolTab,
  PhotoTransform,
  CollageProject,
} from '@/types/collage';
import { CLASSIC_LAYOUTS } from '@/config/layoutsClassic';
import { STYLISH_LAYOUTS } from '@/config/layoutsStylish';

const DEFAULT_TRANSFORM: PhotoTransform = {
  panX: 0,
  panY: 0,
  scale: 1,
  rotate: 0,
  flipH: false,
  filter: 'none',
};

const DEFAULT_CANVAS_CONFIG: CanvasConfig = {
  aspectRatio: 1,
  aspectRatioName: '1:1',
  outerMargin: 12,
  innerMargin: 8,
  cornerRadius: 8,
  shadow: 10,
};

const DEFAULT_BACKGROUND: BackgroundConfig = {
  type: 'color',
  value: '#ffffff',
};

const DEFAULT_FRAME: FrameConfig = {
  type: 'none',
  color: '#ffffff',
};

interface Snapshot {
  photos: PhotoItem[];
  cellAssignments: Record<string, string>;
  photoTransforms: Record<string, PhotoTransform>;
  layoutId: string;
  canvasConfig: CanvasConfig;
  backgroundConfig: BackgroundConfig;
  textElements: TextOverlayItem[];
  stickerElements: StickerOverlayItem[];
  frameConfig: FrameConfig;
}

interface CollageContextType {
  photos: PhotoItem[];
  selectedLayout: CollageLayout;
  cellAssignments: Record<string, string>;
  photoTransforms: Record<string, PhotoTransform>;
  canvasConfig: CanvasConfig;
  backgroundConfig: BackgroundConfig;
  textElements: TextOverlayItem[];
  stickerElements: StickerOverlayItem[];
  frameConfig: FrameConfig;
  activeTab: ActiveToolTab;
  activeCellId: string | null;
  canUndo: boolean;

  // Actions
  setPhotos: (photos: PhotoItem[]) => void;
  addPhoto: (photo: PhotoItem) => void;
  setLayout: (layout: CollageLayout) => void;
  setLayoutById: (layoutId: string) => void;
  setCanvasConfig: (partial: Partial<CanvasConfig>) => void;
  setBackgroundConfig: (bg: BackgroundConfig) => void;
  setActiveTab: (tab: ActiveToolTab) => void;
  setActiveCellId: (cellId: string | null) => void;
  updatePhotoTransform: (photoId: string, partial: Partial<PhotoTransform>) => void;
  swapCells: (cellId1: string, cellId2: string) => void;
  replaceCellPhoto: (cellId: string, newPhoto: PhotoItem) => void;
  deleteCellPhoto: (cellId: string) => void;
  addTextElement: (element: Omit<TextOverlayItem, 'id'>) => string;
  updateTextElement: (id: string, partial: Partial<TextOverlayItem>) => void;
  deleteTextElement: (id: string) => void;
  addStickerElement: (sticker: Omit<StickerOverlayItem, 'id'>) => string;
  updateStickerElement: (id: string, partial: Partial<StickerOverlayItem>) => void;
  deleteStickerElement: (id: string) => void;
  setFrameConfig: (frame: FrameConfig) => void;
  undo: () => void;
  loadProject: (project: CollageProject) => void;
  resetCollage: () => void;
}

const CollageContext = createContext<CollageContextType | undefined>(undefined);

export const ALL_LAYOUTS: CollageLayout[] = [...CLASSIC_LAYOUTS, ...STYLISH_LAYOUTS];

export const CollageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photos, setPhotosState] = useState<PhotoItem[]>([]);
  const [selectedLayout, setSelectedLayoutState] = useState<CollageLayout>(
    CLASSIC_LAYOUTS.find((l) => l.id === 'classic-3-rows') || CLASSIC_LAYOUTS[0]
  );
  const [cellAssignments, setCellAssignments] = useState<Record<string, string>>({});
  const [photoTransforms, setPhotoTransforms] = useState<Record<string, PhotoTransform>>({});
  const [canvasConfig, setCanvasConfigState] = useState<CanvasConfig>(DEFAULT_CANVAS_CONFIG);
  const [backgroundConfig, setBackgroundConfigState] = useState<BackgroundConfig>(DEFAULT_BACKGROUND);
  const [textElements, setTextElements] = useState<TextOverlayItem[]>([]);
  const [stickerElements, setStickerElements] = useState<StickerOverlayItem[]>([]);
  const [frameConfig, setFrameConfigState] = useState<FrameConfig>(DEFAULT_FRAME);
  const [activeTab, setActiveTab] = useState<ActiveToolTab>('collage');
  const [activeCellId, setActiveCellId] = useState<string | null>(null);

  const historyRef = useRef<Snapshot[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  const pushSnapshot = useCallback(() => {
    const current: Snapshot = {
      photos: [...photos],
      cellAssignments: { ...cellAssignments },
      photoTransforms: { ...photoTransforms },
      layoutId: selectedLayout.id,
      canvasConfig: { ...canvasConfig },
      backgroundConfig: { ...backgroundConfig },
      textElements: [...textElements],
      stickerElements: [...stickerElements],
      frameConfig: { ...frameConfig },
    };
    historyRef.current.push(current);
    if (historyRef.current.length > 20) {
      historyRef.current.shift();
    }
    setCanUndo(true);
  }, [
    photos,
    cellAssignments,
    photoTransforms,
    selectedLayout.id,
    canvasConfig,
    backgroundConfig,
    textElements,
    stickerElements,
    frameConfig,
  ]);

  const undo = useCallback(() => {
    if (historyRef.current.length === 0) return;
    const prev = historyRef.current.pop();
    if (!prev) return;

    setPhotosState(prev.photos);
    setCellAssignments(prev.cellAssignments);
    setPhotoTransforms(prev.photoTransforms);
    const layout = ALL_LAYOUTS.find((l) => l.id === prev.layoutId) || CLASSIC_LAYOUTS[0];
    setSelectedLayoutState(layout);
    setCanvasConfigState(prev.canvasConfig);
    setBackgroundConfigState(prev.backgroundConfig);
    setTextElements(prev.textElements);
    setStickerElements(prev.stickerElements);
    setFrameConfigState(prev.frameConfig);

    setCanUndo(historyRef.current.length > 0);
  }, []);

  const setPhotos = useCallback(
    (newPhotos: PhotoItem[]) => {
      pushSnapshot();
      setPhotosState(newPhotos);

      // Auto assign photos to cells of current layout
      const newAssignments: Record<string, string> = {};
      const newTransforms: Record<string, PhotoTransform> = { ...photoTransforms };

      selectedLayout.cells.forEach((cell, idx) => {
        if (newPhotos[idx]) {
          newAssignments[cell.id] = newPhotos[idx].id;
          if (!newTransforms[newPhotos[idx].id]) {
            newTransforms[newPhotos[idx].id] = { ...DEFAULT_TRANSFORM };
          }
        }
      });

      setCellAssignments(newAssignments);
      setPhotoTransforms(newTransforms);
    },
    [pushSnapshot, selectedLayout.cells, photoTransforms]
  );

  const addPhoto = useCallback(
    (photo: PhotoItem) => {
      pushSnapshot();
      setPhotosState((prev) => {
        const next = [...prev, photo];
        // Assign to first empty cell
        const emptyCell = selectedLayout.cells.find((c) => !cellAssignments[c.id]);
        if (emptyCell) {
          setCellAssignments((a) => ({ ...a, [emptyCell.id]: photo.id }));
        }
        setPhotoTransforms((t) => ({ ...t, [photo.id]: { ...DEFAULT_TRANSFORM } }));
        return next;
      });
    },
    [pushSnapshot, selectedLayout.cells, cellAssignments]
  );

  const setLayout = useCallback(
    (layout: CollageLayout) => {
      pushSnapshot();
      setSelectedLayoutState(layout);

      // Reassign current photos to new layout's cells
      const newAssignments: Record<string, string> = {};
      layout.cells.forEach((cell, idx) => {
        if (photos[idx]) {
          newAssignments[cell.id] = photos[idx].id;
        }
      });
      setCellAssignments(newAssignments);
      setActiveCellId(null);
    },
    [pushSnapshot, photos]
  );

  const setLayoutById = useCallback(
    (layoutId: string) => {
      const layout = ALL_LAYOUTS.find((l) => l.id === layoutId);
      if (layout) {
        setLayout(layout);
      }
    },
    [setLayout]
  );

  const setCanvasConfig = useCallback(
    (partial: Partial<CanvasConfig>) => {
      pushSnapshot();
      setCanvasConfigState((prev) => ({ ...prev, ...partial }));
    },
    [pushSnapshot]
  );

  const setBackgroundConfig = useCallback(
    (bg: BackgroundConfig) => {
      pushSnapshot();
      setBackgroundConfigState(bg);
    },
    [pushSnapshot]
  );

  const updatePhotoTransform = useCallback(
    (photoId: string, partial: Partial<PhotoTransform>) => {
      setPhotoTransforms((prev) => ({
        ...prev,
        [photoId]: {
          ...(prev[photoId] || DEFAULT_TRANSFORM),
          ...partial,
        },
      }));
    },
    []
  );

  const swapCells = useCallback(
    (cellId1: string, cellId2: string) => {
      pushSnapshot();
      setCellAssignments((prev) => {
        const p1 = prev[cellId1];
        const p2 = prev[cellId2];
        const next = { ...prev };
        if (p2) next[cellId1] = p2;
        else delete next[cellId1];

        if (p1) next[cellId2] = p1;
        else delete next[cellId2];

        return next;
      });
    },
    [pushSnapshot]
  );

  const replaceCellPhoto = useCallback(
    (cellId: string, newPhoto: PhotoItem) => {
      pushSnapshot();
      setPhotosState((prev) => [...prev.filter((p) => p.id !== cellAssignments[cellId]), newPhoto]);
      setCellAssignments((prev) => ({ ...prev, [cellId]: newPhoto.id }));
      setPhotoTransforms((prev) => ({ ...prev, [newPhoto.id]: { ...DEFAULT_TRANSFORM } }));
    },
    [pushSnapshot, cellAssignments]
  );

  const deleteCellPhoto = useCallback(
    (cellId: string) => {
      pushSnapshot();
      setCellAssignments((prev) => {
        const next = { ...prev };
        delete next[cellId];
        return next;
      });
      setActiveCellId(null);
    },
    [pushSnapshot]
  );

  const addTextElement = useCallback(
    (element: Omit<TextOverlayItem, 'id'>) => {
      pushSnapshot();
      const id = 'text-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      const newElement: TextOverlayItem = { ...element, id };
      setTextElements((prev) => [...prev, newElement]);
      return id;
    },
    [pushSnapshot]
  );

  const updateTextElement = useCallback(
    (id: string, partial: Partial<TextOverlayItem>) => {
      setTextElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...partial } : el)));
    },
    []
  );

  const deleteTextElement = useCallback(
    (id: string) => {
      pushSnapshot();
      setTextElements((prev) => prev.filter((el) => el.id !== id));
    },
    [pushSnapshot]
  );

  const addStickerElement = useCallback(
    (sticker: Omit<StickerOverlayItem, 'id'>) => {
      pushSnapshot();
      const id = 'sticker-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      const newSticker: StickerOverlayItem = { ...sticker, id };
      setStickerElements((prev) => [...prev, newSticker]);
      return id;
    },
    [pushSnapshot]
  );

  const updateStickerElement = useCallback(
    (id: string, partial: Partial<StickerOverlayItem>) => {
      setStickerElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...partial } : el)));
    },
    []
  );

  const deleteStickerElement = useCallback(
    (id: string) => {
      pushSnapshot();
      setStickerElements((prev) => prev.filter((el) => el.id !== id));
    },
    [pushSnapshot]
  );

  const setFrameConfig = useCallback(
    (frame: FrameConfig) => {
      pushSnapshot();
      setFrameConfigState(frame);
    },
    [pushSnapshot]
  );

  const loadProject = useCallback((project: CollageProject) => {
    historyRef.current = [];
    setCanUndo(false);
    const restoredPhotos: PhotoItem[] = project.photos.map((p) => ({
      id: p.id,
      name: p.name,
      url: p.dataUrl,
      width: 800,
      height: 800,
    }));
    setPhotosState(restoredPhotos);
    setCellAssignments(project.cellAssignments);
    setPhotoTransforms(project.photoTransforms);
    const layout = ALL_LAYOUTS.find((l) => l.id === project.layoutId) || CLASSIC_LAYOUTS[0];
    setSelectedLayoutState(layout);
    setCanvasConfigState(project.canvasConfig);
    setBackgroundConfigState(project.backgroundConfig);
    setTextElements(project.textElements || []);
    setStickerElements(project.stickerElements || []);
    setFrameConfigState(project.frameConfig || DEFAULT_FRAME);
  }, []);

  const resetCollage = useCallback(() => {
    historyRef.current = [];
    setCanUndo(false);
    setPhotosState([]);
    setCellAssignments({});
    setPhotoTransforms({});
    setSelectedLayoutState(CLASSIC_LAYOUTS.find((l) => l.id === 'classic-3-rows') || CLASSIC_LAYOUTS[0]);
    setCanvasConfigState(DEFAULT_CANVAS_CONFIG);
    setBackgroundConfigState(DEFAULT_BACKGROUND);
    setTextElements([]);
    setStickerElements([]);
    setFrameConfigState(DEFAULT_FRAME);
    setActiveCellId(null);
  }, []);

  return (
    <CollageContext.Provider
      value={{
        photos,
        selectedLayout,
        cellAssignments,
        photoTransforms,
        canvasConfig,
        backgroundConfig,
        textElements,
        stickerElements,
        frameConfig,
        activeTab,
        activeCellId,
        canUndo,
        setPhotos,
        addPhoto,
        setLayout,
        setLayoutById,
        setCanvasConfig,
        setBackgroundConfig,
        setActiveTab,
        setActiveCellId,
        updatePhotoTransform,
        swapCells,
        replaceCellPhoto,
        deleteCellPhoto,
        addTextElement,
        updateTextElement,
        deleteTextElement,
        addStickerElement,
        updateStickerElement,
        deleteStickerElement,
        setFrameConfig,
        undo,
        loadProject,
        resetCollage,
      }}
    >
      {children}
    </CollageContext.Provider>
  );
};

export const useCollage = () => {
  const context = useContext(CollageContext);
  if (!context) {
    throw new Error('useCollage must be used within a CollageProvider');
  }
  return context;
};
