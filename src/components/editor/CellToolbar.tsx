"use client";

import React, { useRef, useState } from 'react';
import {
  Image as ImageIcon,
  SlidersHorizontal,
  FlipHorizontal,
  RotateCw,
  Trash2,
  X,
  Check,
} from 'lucide-react';
import { useCollage } from '@/context/CollageContext';
import { FilterType, PhotoItem } from '@/types/collage';

const FILTERS: { id: FilterType; name: string }[] = [
  { id: 'none', name: 'Original' },
  { id: 'bw', name: 'B&W' },
  { id: 'warm', name: 'Warm' },
  { id: 'vintage', name: 'Vintage' },
  { id: 'bright', name: 'Bright' },
  { id: 'contrast', name: 'Contrast' },
  { id: 'sepia', name: 'Sepia' },
];

export const CellToolbar: React.FC = () => {
  const {
    activeCellId,
    setActiveCellId,
    cellAssignments,
    photos,
    photoTransforms,
    updatePhotoTransform,
    replaceCellPhoto,
    deleteCellPhoto,
  } = useCollage();

  const [showFilterPicker, setShowFilterPicker] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  if (!activeCellId) return null;

  const assignedPhotoId = cellAssignments[activeCellId];
  const photo = photos.find((p) => p.id === assignedPhotoId);
  const transform = assignedPhotoId ? photoTransforms[assignedPhotoId] : undefined;

  if (!photo) return null;

  // Handle Replace photo
  const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newPhoto: PhotoItem = {
      id: 'upload-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: file.name,
      url: URL.createObjectURL(file),
      width: 800,
      height: 800,
    };
    replaceCellPhoto(activeCellId, newPhoto);
    if (replaceInputRef.current) replaceInputRef.current.value = '';
  };

  // Handle Flip Horizontal
  const handleFlip = () => {
    updatePhotoTransform(photo.id, { flipH: !transform?.flipH });
  };

  // Handle Rotate 90 deg clockwise
  const handleRotate = () => {
    const currentRotate = transform?.rotate || 0;
    updatePhotoTransform(photo.id, { rotate: (currentRotate + 90) % 360 });
  };

  // Handle Delete photo from cell
  const handleDelete = () => {
    deleteCellPhoto(activeCellId);
  };

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 px-2 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150 max-w-[95%] pointer-events-auto">
      {/* Filter Row Popup */}
      {showFilterPicker && (
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-xl border border-neutral-200/80 overflow-x-auto no-scrollbar max-w-[90vw]">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                updatePhotoTransform(photo.id, { filter: f.id });
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                transform?.filter === f.id
                  ? 'bg-[#ff2b6d] text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {f.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowFilterPicker(false)}
            className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 shrink-0 ml-1"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main 5-Action Floating Bar (Video 00:54) */}
      <div className="flex items-center gap-1 sm:gap-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-neutral-200/90">
        {/* 1. Replace */}
        <button
          type="button"
          onClick={() => replaceInputRef.current?.click()}
          className="p-2 sm:px-3 text-neutral-700 hover:text-[#ff2b6d] hover:bg-neutral-100 rounded-full flex items-center gap-1.5 transition-colors"
          title="Replace Photo"
        >
          <ImageIcon className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-semibold">Replace</span>
        </button>
        <input
          ref={replaceInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleReplaceFile}
        />

        <div className="w-[1px] h-4 bg-neutral-200" />

        {/* 2. Filter */}
        <button
          type="button"
          onClick={() => setShowFilterPicker((prev) => !prev)}
          className={`p-2 sm:px-3 rounded-full flex items-center gap-1.5 transition-colors ${
            showFilterPicker
              ? 'text-[#ff2b6d] bg-pink-50'
              : 'text-neutral-700 hover:text-[#ff2b6d] hover:bg-neutral-100'
          }`}
          title="Photo Filters"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-semibold">Filter</span>
        </button>

        <div className="w-[1px] h-4 bg-neutral-200" />

        {/* 3. Flip Horizontal */}
        <button
          type="button"
          onClick={handleFlip}
          className={`p-2 sm:px-3 rounded-full flex items-center gap-1.5 transition-colors ${
            transform?.flipH
              ? 'text-[#ff2b6d] bg-pink-50'
              : 'text-neutral-700 hover:text-[#ff2b6d] hover:bg-neutral-100'
          }`}
          title="Flip Horizontal"
        >
          <FlipHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-semibold">Flip</span>
        </button>

        <div className="w-[1px] h-4 bg-neutral-200" />

        {/* 4. Rotate 90° */}
        <button
          type="button"
          onClick={handleRotate}
          className="p-2 sm:px-3 text-neutral-700 hover:text-[#ff2b6d] hover:bg-neutral-100 rounded-full flex items-center gap-1.5 transition-colors"
          title="Rotate 90°"
        >
          <RotateCw className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-semibold">Rotate</span>
        </button>

        <div className="w-[1px] h-4 bg-neutral-200" />

        {/* 5. Delete */}
        <button
          type="button"
          onClick={handleDelete}
          className="p-2 sm:px-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full flex items-center gap-1.5 transition-colors"
          title="Remove Photo"
        >
          <Trash2 className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-semibold">Delete</span>
        </button>

        {/* Confirm Done Checkmark */}
        <button
          type="button"
          onClick={() => setActiveCellId(null)}
          className="w-7 h-7 rounded-full bg-[#ff2b6d] text-white flex items-center justify-center shadow-sm hover:bg-[#e0245e] active:scale-95 transition-all ml-1"
          title="Done"
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
