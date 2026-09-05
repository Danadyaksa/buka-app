"use client";

import React from 'react';
import { useCollage } from '@/context/CollageContext';

const STICKERS = [
  {
    id: 'paw',
    name: 'Cat Paw',
    svg: `<svg viewBox="0 0 24 24" fill="#ff2b6d" width="48" height="48"><path d="M12 11c-2.2 0-4 1.8-4 4 0 1.8 1.4 3.3 3.2 3.8.3.1.6.2.8.2s.5-.1.8-.2c1.8-.5 3.2-2 3.2-3.8 0-2.2-1.8-4-4-4zm-5-3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-8-3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
  },
  {
    id: 'sparkles',
    name: 'Magic Sparkles',
    svg: `<svg viewBox="0 0 24 24" fill="#eab308" width="48" height="48"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>`,
  },
  {
    id: 'heart',
    name: 'Love Heart',
    svg: `<svg viewBox="0 0 24 24" fill="#ef4444" width="48" height="48"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
  },
  {
    id: 'star',
    name: 'Golden Star',
    svg: `<svg viewBox="0 0 24 24" fill="#f59e0b" width="48" height="48"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  },
  {
    id: 'tape',
    name: 'Washi Tape',
    svg: `<svg viewBox="0 0 60 20" width="60" height="20"><rect width="60" height="20" fill="#fbcfe8" opacity="0.85" rx="2"/><line x1="0" y1="0" x2="60" y2="20" stroke="#f472b6" stroke-width="2" stroke-dasharray="4"/></svg>`,
  },
  {
    id: 'coffee',
    name: 'Coffee Cup',
    svg: `<svg viewBox="0 0 24 24" fill="#854d0e" width="48" height="48"><path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7V8h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3zm1.5 3.5c0 .83-.67 1.5-1.5 1.5H18V5h.5c.83 0 1.5.67 1.5 1.5zM4 19h16v2H4v-2z"/></svg>`,
  },
];

export const StickerPanel: React.FC = () => {
  const { addStickerElement } = useCollage();

  const handleAdd = (svgContent: string, stickerId: string) => {
    addStickerElement({
      stickerId,
      svgContent,
      x: 50,
      y: 50,
      scale: 1.2,
      rotation: 0,
    });
  };

  return (
    <div className="w-full bg-white border-t border-neutral-200/80 p-3.5 flex flex-col gap-2.5 select-none">
      <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 text-center">
        Tap to Add Aesthetic Stickers
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 items-center justify-center">
        {STICKERS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => handleAdd(s.svg, s.id)}
            className="w-14 h-14 rounded-2xl bg-neutral-50 hover:bg-pink-50 border border-neutral-200 hover:border-[#ff2b6d] flex items-center justify-center p-2 transition-all hover:scale-110 active:scale-95 shadow-xs shrink-0"
            title={`Add ${s.name}`}
            dangerouslySetInnerHTML={{ __html: s.svg }}
          />
        ))}
      </div>
    </div>
  );
};
