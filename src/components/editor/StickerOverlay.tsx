"use client";

import React, { useState, useRef } from 'react';
import { Trash2, RotateCw } from 'lucide-react';
import { useCollage } from '@/context/CollageContext';
import { StickerOverlayItem } from '@/types/collage';

export const StickerOverlay: React.FC = () => {
  const { stickerElements, updateStickerElement, deleteStickerElement } = useCollage();
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  const dragStart = useRef<{ x: number; y: number; itemX: number; itemY: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent, item: StickerOverlayItem) => {
    e.stopPropagation();
    setSelectedStickerId(item.id);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      itemX: item.x,
      itemY: item.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent, item: StickerOverlayItem) => {
    if (!dragStart.current || selectedStickerId !== item.id) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    const newX = Math.max(5, Math.min(95, dragStart.current.itemX + dx * 0.25));
    const newY = Math.max(5, Math.min(95, dragStart.current.itemY + dy * 0.25));

    updateStickerElement(item.id, { x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    dragStart.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  if (stickerElements.length === 0) return null;

  return (
    <div
      onClick={() => setSelectedStickerId(null)}
      className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
    >
      {stickerElements.map((item) => {
        const isSelected = selectedStickerId === item.id;

        return (
          <div
            key={item.id}
            onPointerDown={(e) => handlePointerDown(e, item)}
            onPointerMove={(e) => handlePointerMove(e, item)}
            onPointerUp={handlePointerUp}
            style={{
              position: 'absolute',
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
            }}
            className={`pointer-events-auto cursor-move select-none p-1.5 transition-shadow ${
              isSelected ? 'ring-2 ring-pink-500 rounded-xl bg-pink-500/10' : ''
            }`}
          >
            <div
              className="w-10 h-10 flex items-center justify-center pointer-events-none drop-shadow-md"
              dangerouslySetInnerHTML={{ __html: item.svgContent }}
            />

            {/* Quick Actions */}
            {isSelected && (
              <div
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-neutral-900/90 backdrop-blur-md px-2 py-1 rounded-full shadow-lg border border-white/20 text-white z-30"
              >
                <button
                  type="button"
                  onClick={() =>
                    updateStickerElement(item.id, {
                      rotation: (item.rotation + 45) % 360,
                    })
                  }
                  className="p-1 hover:text-[#ff2b6d] transition-colors"
                  title="Rotate"
                >
                  <RotateCw className="w-3 h-3" />
                </button>

                <button
                  type="button"
                  onClick={() => deleteStickerElement(item.id)}
                  className="p-1 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
