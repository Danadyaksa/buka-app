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
  const { updatePhotoTransform, replaceCellPhoto } = useCollage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gestureContainerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [naturalAR, setNaturalAR] = useState<number | null>(null);

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

  // Keep ref in sync when props change outside gestures
  useEffect(() => {
    currentTransform.current = { scale, panX, panY };
    applyTransformStyle(scale, panX, panY);
  }, [scale, panX, panY, rotate, flipH]);

  const applyTransformStyle = useCallback(
    (s: number, px: number, py: number) => {
      if (!imgRef.current) return;
      imgRef.current.style.transform = `
        translate(${px}%, ${py}%)
        scale(${s})
        rotate(${rotate}deg)
        ${flipH ? 'scaleX(-1)' : ''}
      `;
    },
    [rotate, flipH]
  );

  // Calculate pan constraints based on photo aspect ratio & scale so whitespace never shows
  const calculateMaxPan = useCallback(
    (currentScale: number) => {
      const effectiveW = Math.max(1, cellW - innerMarginPx);
      const effectiveH = Math.max(1, cellH - innerMarginPx);
      const cellAR = effectiveW / effectiveH;

      const isRotated90 = rotate === 90 || rotate === 270;
      let rawImgAR = naturalAR || (photo?.width && photo?.height ? photo.width / photo.height : 1);
      if (isRotated90 && rawImgAR > 0) {
        rawImgAR = 1 / rawImgAR;
      }

      let baseW = effectiveW;
      let baseH = effectiveH;
      if (rawImgAR > cellAR) {
        baseW = effectiveH * rawImgAR;
      } else {
        baseH = effectiveW / rawImgAR;
      }

      const drawW = baseW * currentScale;
      const drawH = baseH * currentScale;

      // Max allowable translation in pixels from center
      const maxPx = Math.max(0, (drawW - effectiveW) / 2);
      const maxPy = Math.max(0, (drawH - effectiveH) / 2);

      const maxPanXPercent = (maxPx / effectiveW) * 100;
      const maxPanYPercent = (maxPy / effectiveH) * 100;

      return { maxPanXPercent, maxPanYPercent, effectiveW, effectiveH };
    },
    [cellW, cellH, innerMarginPx, naturalAR, photo?.width, photo?.height, rotate]
  );

  const applyPan = useCallback(
    (
      deltaScreenX: number,
      deltaScreenY: number,
      startPan: { x: number; y: number },
      currentScale: number
    ) => {
      const { maxPanXPercent, maxPanYPercent, effectiveW, effectiveH } =
        calculateMaxPan(currentScale);

      const deltaPercentX = (deltaScreenX / effectiveW) * 100;
      const deltaPercentY = (deltaScreenY / effectiveH) * 100;

      let targetPanX = startPan.x + deltaPercentX;
      let targetPanY = startPan.y + deltaPercentY;

      // Clamp so image always covers cell with 0 whitespace
      targetPanX = Math.max(-maxPanXPercent, Math.min(maxPanXPercent, targetPanX));
      targetPanY = Math.max(-maxPanYPercent, Math.min(maxPanYPercent, targetPanY));

      currentTransform.current = {
        scale: currentScale,
        panX: targetPanX,
        panY: targetPanY,
      };

      applyTransformStyle(currentScale, targetPanX, targetPanY);
    },
    [calculateMaxPan, applyTransformStyle]
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
    let startPan = { x: 0, y: 0 };
    let isPinching = false;
    let isPanning = false;
    let touchStartTime = 0;

    const touchStartHandler = (e: TouchEvent) => {
      touchStartTime = Date.now();
      if (e.touches.length === 1) {
        isPanning = true;
        isPinching = false;
        startCenter = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        startPan = { x: currentTransform.current.panX, y: currentTransform.current.panY };
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
        startPan = { x: currentTransform.current.panX, y: currentTransform.current.panY };
      }
    };

    const touchMoveHandler = (e: TouchEvent) => {
      // Crucial: non-passive e.preventDefault() prevents iOS Safari page rubber-banding / browser pinch zoom!
      if (e.cancelable) e.preventDefault();

      if (e.touches.length === 1 && isPanning) {
        const t = e.touches[0];
        const dx = t.clientX - startCenter.x;
        const dy = t.clientY - startCenter.y;
        applyPan(dx, dy, startPan, currentTransform.current.scale);
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

        applyPan(dx, dy, startPan, newScale);
      }
    };

    const touchEndHandler = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        const elapsed = Date.now() - touchStartTime;
        // Simple tap without movement selects the cell
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
        startPan = { x: currentTransform.current.panX, y: currentTransform.current.panY };
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
  }, [photo, applyPan, commitTransform, onSelect]);

  // --- DESKTOP MOUSE DRAG & WHEEL ZOOM ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || !photo) return;
    e.stopPropagation();
    onSelect();

    const startX = e.clientX;
    const startY = e.clientY;
    const startPan = { x: currentTransform.current.panX, y: currentTransform.current.panY };

    const handleMouseMove = (me: MouseEvent) => {
      const dx = me.clientX - startX;
      const dy = me.clientY - startY;
      applyPan(dx, dy, startPan, currentTransform.current.scale);
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
    applyPan(0, 0, { x: currentTransform.current.panX, y: currentTransform.current.panY }, newScale);
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
      }}
      className="transition-all duration-75"
    >
      <div
        draggable={!!photo}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={onSelect}
        style={{
          borderRadius: `${cornerRadius}px`,
          boxShadow:
            shadow > 0
              ? `0 ${shadow * 0.4}px ${shadow * 1.2}px rgba(0,0,0,${Math.min(0.5, shadow * 0.02 + 0.15)})`
              : 'none',
        }}
        className={`relative w-full h-full overflow-hidden select-none touch-none bg-neutral-100 transition-shadow ${
          isSelected ? 'ring-2 ring-[#ff2b6d] ring-offset-1 z-10' : ''
        } ${isDraggingOver ? 'ring-4 ring-pink-400 bg-pink-50' : ''}`}
      >
        {photo ? (
          <div
            ref={gestureContainerRef}
            onMouseDown={handleMouseDown}
            onWheel={handleWheel}
            className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden touch-none"
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
                filter: getFilterStyle(filter),
                transformOrigin: 'center center',
              }}
              className="w-full h-full object-cover pointer-events-none will-change-transform"
              draggable={false}
            />
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
