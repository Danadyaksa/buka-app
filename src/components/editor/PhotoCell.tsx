"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { CellLayout, PhotoItem, PhotoTransform, FilterType } from '@/types/collage';
import { useCollage } from '@/context/CollageContext';

interface PhotoCellProps {
  cell: CellLayout;
  photo?: PhotoItem;
  transform?: PhotoTransform;
  cellLeft: number;
  cellTop: number;
  cellW: number;
  cellH: number;
  innerMarginPx: number;
  cornerRadius: number;
  shadow: number;
  isSelected: boolean;
  onSelect: () => void;
  onSwap: (sourceCellId: string, targetCellId: string) => void;
}

const getFilterStyle = (filter?: FilterType): string => {
  switch (filter) {
    case 'bw':
      return 'grayscale(100%)';
    case 'warm':
      return 'sepia(30%) saturate(140%) hue-rotate(-10deg)';
    case 'vintage':
      return 'sepia(50%) contrast(115%) brightness(95%)';
    case 'bright':
      return 'brightness(120%) contrast(105%)';
    case 'contrast':
      return 'contrast(145%) saturate(110%)';
    case 'sepia':
      return 'sepia(85%)';
    default:
      return 'none';
  }
};

export const PhotoCell: React.FC<PhotoCellProps> = ({
  cell,
  photo,
  transform,
  cellLeft,
  cellTop,
  cellW,
  cellH,
  innerMarginPx,
  cornerRadius,
  shadow,
  isSelected,
  onSelect,
  onSwap,
}) => {
  const { updatePhotoTransform, replaceCellPhoto, activeCellId } = useCollage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gestureContainerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [naturalAR, setNaturalAR] = useState<number | null>(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.naturalWidth && imgRef.current.naturalHeight) {
      setNaturalAR(imgRef.current.naturalWidth / imgRef.current.naturalHeight);
    }
  }, [photo?.url]);

  // Fallback defaults from props
  const panX = transform?.panX ?? 0;
  const panY = transform?.panY ?? 0;
  const scale = transform?.scale ?? 1;
  const rotate = transform?.rotate ?? 0;
  const flipH = transform?.flipH ?? false;
  const filter = transform?.filter ?? 'none';

  // Live transform ref during gestures (prevents 120 FPS React re-renders)
  const currentTransform = useRef({
    scale,
    panX,
    panY,
  });

  // Cell effective dimensions
  const effectiveW = Math.max(1, cellW - innerMarginPx);
  const effectiveH = Math.max(1, cellH - innerMarginPx);
  const cellAR = effectiveW / effectiveH;

  const isRotated90 = (rotate || 0) % 180 !== 0;
  const rawAR = naturalAR || (photo?.width && photo?.height ? photo.width / photo.height : 1);
  const photoAR = isRotated90 ? 1 / rawAR : rawAR;

  // Base dimensions to COVER the cell without zoom (scale = 1)
  let baseW = effectiveW;
  let baseH = effectiveH;
  if (photoAR >= cellAR) {
    baseH = effectiveH;
    baseW = effectiveH * photoAR;
  } else {
    baseW = effectiveW;
    baseH = effectiveW / photoAR;
  }

  const drawW = baseW * scale;
  const drawH = baseH * scale;

  // Maximum allowable translation in pixels from center
  const maxPanX = Math.max(0, (drawW - effectiveW) / 2);
  const maxPanY = Math.max(0, (drawH - effectiveH) / 2);

  const tx = (panX / 100) * maxPanX;
  const ty = (panY / 100) * maxPanY;

  // Keep ref in sync when props change outside gestures
  useEffect(() => {
    currentTransform.current = { scale, panX, panY };
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = `translate(-50%, -50%) translate(${tx}px, ${ty}px)`;
    }
  }, [scale, panX, panY, tx, ty]);

  // Gestures calculate pan directly in pixels from touch/mouse delta
  const applyPanDelta = useCallback(
    (
      deltaScreenX: number,
      deltaScreenY: number,
      startTx: number,
      startTy: number,
      currentScale: number
    ) => {
      const currentDrawW = baseW * currentScale;
      const currentDrawH = baseH * currentScale;

      const currentMaxX = Math.max(0, (currentDrawW - effectiveW) / 2);
      const currentMaxY = Math.max(0, (currentDrawH - effectiveH) / 2);

      const targetTx = Math.max(-currentMaxX, Math.min(currentMaxX, startTx + deltaScreenX));
      const targetTy = Math.max(-currentMaxY, Math.min(currentMaxY, startTy + deltaScreenY));

      const newPanX = currentMaxX > 0 ? (targetTx / currentMaxX) * 100 : 0;
      const newPanY = currentMaxY > 0 ? (targetTy / currentMaxY) * 100 : 0;

      currentTransform.current = {
        scale: currentScale,
        panX: newPanX,
        panY: newPanY,
      };

      if (wrapperRef.current) {
        wrapperRef.current.style.width = `${currentDrawW}px`;
        wrapperRef.current.style.height = `${currentDrawH}px`;
        wrapperRef.current.style.transform = `translate(-50%, -50%) translate(${targetTx}px, ${targetTy}px)`;
      }
    },
    [baseW, baseH, effectiveW, effectiveH]
  );

  const commitTransform = useCallback(() => {
    if (!photo) return;
    updatePhotoTransform(photo.id, {
      scale: currentTransform.current.scale,
      panX: currentTransform.current.panX,
      panY: currentTransform.current.panY,
    });
  }, [photo, updatePhotoTransform]);

  // --- MOBILE NATIVE TOUCH GESTURE (Pinch-to-zoom & Pan without stutter) ---
  useEffect(() => {
    const el = gestureContainerRef.current;
    if (!el || !photo) return;

    let initialDist: number | null = null;
    let initialPinchScale = 1;
    let startCenter = { x: 0, y: 0 };
    let startTx = 0;
    let startTy = 0;
    let isPinching = false;
    let isPanning = false;
    let touchStartTime = 0;

    const touchStartHandler = (e: TouchEvent) => {
      touchStartTime = Date.now();
      const curMaxX = Math.max(0, (baseW * currentTransform.current.scale - effectiveW) / 2);
      const curMaxY = Math.max(0, (baseH * currentTransform.current.scale - effectiveH) / 2);

      startTx = (currentTransform.current.panX / 100) * curMaxX;
      startTy = (currentTransform.current.panY / 100) * curMaxY;

      if (e.touches.length === 1) {
        isPanning = true;
        isPinching = false;
        startCenter = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        isPinching = true;
        isPanning = false;
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        initialDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        initialPinchScale = currentTransform.current.scale;
        startCenter = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2,
        };
      }
    };

    const touchMoveHandler = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();

      if (e.touches.length === 1 && isPanning) {
        const t = e.touches[0];
        const dx = t.clientX - startCenter.x;
        const dy = t.clientY - startCenter.y;
        applyPanDelta(dx, dy, startTx, startTy, currentTransform.current.scale);
      } else if (e.touches.length === 2 && isPinching && initialDist && initialDist > 0) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const ratio = currentDist / initialDist;
        const newScale = Math.max(1, Math.min(4, initialPinchScale * ratio));

        const currentCenter = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2,
        };
        const dx = currentCenter.x - startCenter.x;
        const dy = currentCenter.y - startCenter.y;

        applyPanDelta(dx, dy, startTx, startTy, newScale);
      }
    };

    const touchEndHandler = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        const elapsed = Date.now() - touchStartTime;
        if (elapsed < 300 && !isPinching) {
          onSelect();
        }
        isPanning = false;
        isPinching = false;
        initialDist = null;
        commitTransform();
      } else if (e.touches.length === 1) {
        isPinching = false;
        isPanning = true;
        startCenter = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        const curMaxX = Math.max(0, (baseW * currentTransform.current.scale - effectiveW) / 2);
        const curMaxY = Math.max(0, (baseH * currentTransform.current.scale - effectiveH) / 2);
        startTx = (currentTransform.current.panX / 100) * curMaxX;
        startTy = (currentTransform.current.panY / 100) * curMaxY;
      }
    };

    el.addEventListener('touchstart', touchStartHandler, { passive: false });
    el.addEventListener('touchmove', touchMoveHandler, { passive: false });
    el.addEventListener('touchend', touchEndHandler);
    el.addEventListener('touchcancel', touchEndHandler);

    return () => {
      el.removeEventListener('touchstart', touchStartHandler);
      el.removeEventListener('touchmove', touchMoveHandler);
      el.removeEventListener('touchend', touchEndHandler);
      el.removeEventListener('touchcancel', touchEndHandler);
    };
  }, [photo, applyPanDelta, commitTransform, onSelect, baseW, baseH, effectiveW, effectiveH]);

  // --- DESKTOP MOUSE DRAG & WHEEL ZOOM ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || !photo) return;
    e.stopPropagation();
    onSelect();

    const startX = e.clientX;
    const startY = e.clientY;

    const curMaxX = Math.max(0, (baseW * currentTransform.current.scale - effectiveW) / 2);
    const curMaxY = Math.max(0, (baseH * currentTransform.current.scale - effectiveH) / 2);
    const startTx = (currentTransform.current.panX / 100) * curMaxX;
    const startTy = (currentTransform.current.panY / 100) * curMaxY;

    const handleMouseMove = (me: MouseEvent) => {
      const dx = me.clientX - startX;
      const dy = me.clientY - startY;
      applyPanDelta(dx, dy, startTx, startTy, currentTransform.current.scale);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      commitTransform();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!photo) return;
    e.preventDefault();
    e.stopPropagation();
    const zoomDelta = -e.deltaY * 0.002;
    const newScale = Math.max(1, Math.min(4, currentTransform.current.scale + zoomDelta));

    const curMaxX = Math.max(0, (baseW * currentTransform.current.scale - effectiveW) / 2);
    const curMaxY = Math.max(0, (baseH * currentTransform.current.scale - effectiveH) / 2);
    const startTx = (currentTransform.current.panX / 100) * curMaxX;
    const startTy = (currentTransform.current.panY / 100) * curMaxY;

    applyPanDelta(0, 0, startTx, startTy, newScale);
    commitTransform();
  };

  // --- DRAG AND DROP SWAP ---
  const handleDragStart = (e: React.DragEvent) => {
    if (!photo) return;
    e.dataTransfer.setData('text/plain', cell.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const sourceCellId = e.dataTransfer.getData('text/plain');
    if (sourceCellId && sourceCellId !== cell.id) {
      onSwap(sourceCellId, cell.id);
    }
  };

  const handleEmptyCellUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newPhoto: PhotoItem = {
      id: 'upload-' + Date.now(),
      name: file.name,
      url: URL.createObjectURL(file),
      width: 800,
      height: 800,
    };
    replaceCellPhoto(cell.id, newPhoto);
  };

  const isAnyCellSelected = activeCellId !== null;
  const isOtherCellSelected = isAnyCellSelected && !isSelected;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${cellLeft}px`,
        top: `${cellTop}px`,
        width: `${cellW}px`,
        height: `${cellH}px`,
        padding: `${innerMarginPx / 2}px`,
        clipPath: cell.clipPath,
        boxSizing: 'border-box',
        zIndex: isSelected ? 20 : 10,
      }}
      className="select-none"
    >
      <div
        draggable={!!photo}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        style={{
          borderRadius: `${cornerRadius}px`,
          boxShadow:
            shadow > 0
              ? `0 ${shadow * 0.4}px ${shadow * 1.2}px rgba(0,0,0,${Math.min(0.5, shadow * 0.02 + 0.15)})`
              : 'none',
        }}
        className={`relative w-full h-full overflow-hidden select-none touch-none bg-neutral-100 transition-all duration-200 ${
          isSelected
            ? 'z-20 opacity-100 shadow-lg'
            : isOtherCellSelected
            ? 'opacity-35 grayscale-[20%] hover:opacity-60 cursor-pointer'
            : 'opacity-100'
        } ${isDraggingOver ? 'ring-4 ring-pink-400 bg-pink-50' : ''}`}
      >
        {/* Crisp Pink Selection Outline Matching Video */}
        {isSelected && (
          <div
            style={{ borderRadius: `${cornerRadius}px` }}
            className="absolute inset-0 pointer-events-none border-[2.5px] border-[#ff2b6d] z-30"
          />
        )}
        {photo ? (
          <div
            ref={gestureContainerRef}
            onMouseDown={handleMouseDown}
            onWheel={handleWheel}
            className="relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden touch-none"
          >
            <div
              ref={wrapperRef}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: `${drawW}px`,
                height: `${drawH}px`,
                transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px)`,
                transformOrigin: 'center center',
              }}
              className="pointer-events-none flex items-center justify-center will-change-transform"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={photo.url}
                alt={photo.name}
                onLoad={(e) => {
                  if (e.currentTarget.naturalWidth && e.currentTarget.naturalHeight) {
                    setNaturalAR(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight);
                  }
                }}
                style={{
                  width: isRotated90 ? `${drawH}px` : '100%',
                  height: isRotated90 ? `${drawW}px` : '100%',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  transform: `rotate(${rotate}deg) ${flipH ? 'scaleX(-1)' : ''}`,
                  filter: getFilterStyle(filter),
                  transformOrigin: 'center center',
                }}
                className="object-cover pointer-events-none select-none"
                draggable={false}
              />
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center text-neutral-400 hover:text-[#ff2b6d] hover:bg-neutral-200/50 cursor-pointer transition-colors"
          >
            <Plus className="w-7 h-7" />
            <span className="text-[11px] font-medium mt-1">Add Photo</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleEmptyCellUpload}
            />
          </div>
        )}
      </div>
    </div>
  );
};
