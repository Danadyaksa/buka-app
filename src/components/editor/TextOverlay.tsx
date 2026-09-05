"use client";

import React, { useState, useRef } from 'react';
import { Trash2, Edit3, RotateCw } from 'lucide-react';
import { useCollage } from '@/context/CollageContext';
import { TextOverlayItem } from '@/types/collage';

interface TextOverlayProps {
  onEditText?: (item: TextOverlayItem) => void;
}

export const TextOverlay: React.FC<TextOverlayProps> = ({ onEditText }) => {
  const { textElements, updateTextElement, deleteTextElement } = useCollage();
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  const dragStart = useRef<{ x: number; y: number; itemX: number; itemY: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent, item: TextOverlayItem) => {
    e.stopPropagation();
    setSelectedTextId(item.id);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      itemX: item.x,
      itemY: item.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent, item: TextOverlayItem) => {
    if (!dragStart.current || selectedTextId !== item.id) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    // Approximate delta to percentage (assuming ~400px canvas size)
    const newX = Math.max(5, Math.min(95, dragStart.current.itemX + dx * 0.25));
    const newY = Math.max(5, Math.min(95, dragStart.current.itemY + dy * 0.25));

    updateTextElement(item.id, { x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    dragStart.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  if (textElements.length === 0) return null;

  return (
    <div
      onClick={() => setSelectedTextId(null)}
      className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
    >
      {textElements.map((item) => {
        const isSelected = selectedTextId === item.id;

        return (
          <div
            key={item.id}
            onPointerDown={(e) => handlePointerDown(e, item)}
            onPointerMove={(e) => handlePointerMove(e, item)}
            onPointerUp={handlePointerUp}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onEditText?.(item);
            }}
            style={{
              position: 'absolute',
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
              fontFamily: item.font,
              fontSize: `${item.fontSize}px`,
              color: item.color,
              letterSpacing: `${item.letterSpacing}px`,
              lineHeight: item.lineHeight,
              textAlign: item.align,
            }}
            className={`pointer-events-auto cursor-move select-none p-2 group transition-shadow ${
              isSelected ? 'ring-2 ring-pink-500 rounded-lg bg-pink-500/10' : ''
            }`}
          >
            <span
              style={{
                backgroundColor:
                  item.bgStyle === 'pill' || item.bgStyle === 'box'
                    ? item.bgColor
                    : 'transparent',
                padding:
                  item.bgStyle === 'pill'
                    ? '4px 16px'
                    : item.bgStyle === 'box'
                    ? '4px 10px'
                    : '0',
                borderRadius:
                  item.bgStyle === 'pill' ? '9999px' : item.bgStyle === 'box' ? '6px' : '0',
              }}
              className="inline-block whitespace-pre font-bold shadow-sm"
            >
              {item.text}
            </span>

            {/* Quick Action Floating Controls when selected */}
            {isSelected && (
              <div
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-neutral-900/90 backdrop-blur-md px-2 py-1 rounded-full shadow-lg border border-white/20 text-white z-30"
              >
                <button
                  type="button"
                  onClick={() => onEditText?.(item)}
                  className="p-1 hover:text-[#ff2b6d] transition-colors"
                  title="Edit Text"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateTextElement(item.id, {
                      rotation: (item.rotation + 45) % 360,
                    })
                  }
                  className="p-1 hover:text-[#ff2b6d] transition-colors"
                  title="Rotate"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => deleteTextElement(item.id)}
                  className="p-1 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
