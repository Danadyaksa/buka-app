"use client";

import React from 'react';
import { useCollage } from '@/context/CollageContext';
import { FrameType } from '@/types/collage';

const FRAMES: { id: FrameType; name: string; desc: string }[] = [
  { id: 'none', name: 'None', desc: 'Frameless' },
  { id: 'minimal', name: 'Minimal', desc: 'Clean White Mat' },
  { id: 'polaroid', name: 'Polaroid', desc: 'Classic Instant Border' },
  { id: 'filmstrip', name: 'Filmstrip', desc: 'Analog 35mm Black' },
  { id: 'vintage', name: 'Vintage', desc: 'Cream Parchment' },
];

export const FramePanel: React.FC = () => {
  const { frameConfig, setFrameConfig } = useCollage();

  return (
    <div className="w-full bg-white border-t border-neutral-200/80 p-3.5 flex flex-col gap-2.5 select-none">
      <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 text-center">
        Collage Frames & Borders
      </div>

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
        {FRAMES.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFrameConfig({ type: f.id, color: '#ffffff' })}
            className={`px-4 py-2.5 rounded-xl flex flex-col items-center gap-1 border transition-all shrink-0 ${
              frameConfig.type === f.id
                ? 'border-[#ff2b6d] bg-pink-50/50 ring-1 ring-[#ff2b6d] text-neutral-900 font-bold'
                : 'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100 text-neutral-600'
            }`}
          >
            <span className="text-xs">{f.name}</span>
            <span className="text-[10px] text-neutral-400 font-normal">{f.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
