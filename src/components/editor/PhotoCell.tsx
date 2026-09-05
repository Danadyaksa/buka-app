"use client";

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { CellLayout, PhotoItem, PhotoTransform, FilterType } from '@/types/collage';
import { useCollage } from '@/context/CollageContext';

interface PhotoCellProps {
  cell: CellLayout;
  photo?: PhotoItem;
  transform?: PhotoTransform;
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
  cornerRadius,
  shadow,
  isSelected,
  onSelect,
  onSwap,
}) => {
  const { updatePhotoTransform, replaceCellPhoto, photos } = useCollage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const initialPan = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isPanning = useRef(false);

  // Fallback defaults
  const panX = transform?.panX ?? 0;
  const panY = transform?.panY ?? 0;
  const scale = transform?.scale ?? 1;
  const rotate = transform?.rotate ?? 0;
  const flipH = transform?.flipH ?? false;
  const filter = transform?.filter ?? 'none';

  // --- MOUSE & TOUCH PAN HANDLER ---
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect();
    if (!photo) return;

    isPanning.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    initialPan.current = { x: panX, y: panY };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPanning.current || !dragStartPos.current || !photo) return;
    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;

    // Convert pixel delta to approximate % offset
    const newPanX = Math.max(-100, Math.min(100, initialPan.current.x + deltaX * 0.3));
    const newPanY = Math.max(-100, Math.min(100, initialPan.current.y + deltaY * 0.3));

    updatePhotoTransform(photo.id, { panX: newPanX, panY: newPanY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isPanning.current = false;
    dragStartPos.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // --- WHEEL ZOOM HANDLER (Laptop / Desktop) ---
  const handleWheel = (e: React.WheelEvent) => {
    if (!photo) return;
    e.preventDefault();
    e.stopPropagation();
    const zoomDelta = -e.deltaY * 0.002;
    const newScale = Math.max(1, Math.min(3.5, scale + zoomDelta));
    updatePhotoTransform(photo.id, { scale: newScale });
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

  // Handle local image upload if cell is empty
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

  // Construct transform string
  const transformStyle = `
    translate(${panX}%, ${panY}%)
    scale(${scale})
    rotate(${rotate}deg)
    ${flipH ? 'scaleX(-1)' : ''}
  `;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${cell.x}%`,
        top: `${cell.y}%`,
        width: `${cell.width}%`,
        height: `${cell.height}%`,
        clipPath: cell.clipPath,
      }}
      className="p-1"
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
        className={`relative w-full h-full overflow-hidden select-none touch-none bg-neutral-100 transition-all duration-150 ${
          isSelected ? 'ring-2 ring-[#ff2b6d] ring-offset-1 z-10' : ''
        } ${isDraggingOver ? 'ring-4 ring-pink-400 bg-pink-50' : ''}`}
      >
        {photo ? (
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
            className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={photo.name}
              style={{
                transform: transformStyle,
                filter: getFilterStyle(filter),
                transformOrigin: 'center center',
              }}
              className="w-full h-full object-cover transition-transform duration-75 pointer-events-none will-change-transform"
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
