"use client";

import React from 'react';
import { useCollage } from '@/context/CollageContext';

export const StickerOverlay: React.FC = () => {
  const { stickerElements, updateStickerElement, deleteStickerElement } = useCollage();

  if (stickerElements.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {stickerElements.map((item) => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
          }}
          className="pointer-events-auto cursor-move select-none p-1"
          dangerouslySetInnerHTML={{ __html: item.svgContent }}
        />
      ))}
    </div>
  );
};
