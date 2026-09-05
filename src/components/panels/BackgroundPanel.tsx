"use client";

import React, { useState } from 'react';
import { useCollage } from '@/context/CollageContext';
import { BackgroundConfig, BackgroundType } from '@/types/collage';

const SOLID_COLORS = [
  '#ffffff',
  '#f8fafc',
  '#18181b',
  '#ffe4e6',
  '#fef3c7',
  '#dcfce7',
  '#e0e7ff',
  '#f3e8ff',
  '#ffedd5',
  '#e2e8f0',
];

const GRADIENTS = [
  { name: 'Peach Sunset', val: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' },
  { name: 'Soft Neon', val: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)' },
  { name: 'Warm Flame', val: 'linear-gradient(to top, #ff0844 0%, #ffb199 100%)' },
  { name: 'Aesthetic Lavender', val: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Pastel Mint', val: 'linear-gradient(to top, #96fbc4 0%, #f9f586 100%)' },
  { name: 'Dark Velvet', val: 'linear-gradient(to bottom right, #2c3e50, #000000)' },
];

const PATTERNS = [
  { id: 'dots', name: 'Polka Dots' },
  { id: 'grid', name: 'Clean Grid' },
  { id: 'terrazzo', name: 'Terrazzo' },
];

import { Check } from 'lucide-react';

export const BackgroundPanel: React.FC = () => {
  const { backgroundConfig, setBackgroundConfig, photos, setActiveTab } = useCollage();
  const [activeSubTab, setActiveSubTab] = useState<'color' | 'gradient' | 'pattern' | 'blur'>('color');

  return (
    <div className="w-full bg-white border-t border-neutral-200/80 p-3 flex flex-col gap-3 select-none">
      {/* Category selector & Confirm Checkmark */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-2 px-1">
        <div className="w-7" />
        <div className="flex items-center justify-center gap-6 text-xs font-bold tracking-wider text-neutral-400">
          <button
            type="button"
            onClick={() => setActiveSubTab('color')}
            className={`uppercase transition-colors ${
              activeSubTab === 'color' ? 'text-black font-extrabold' : 'hover:text-neutral-600'
            }`}
          >
            Color
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('gradient')}
            className={`uppercase transition-colors ${
              activeSubTab === 'gradient' ? 'text-black font-extrabold' : 'hover:text-neutral-600'
            }`}
          >
            Gradient
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('pattern')}
            className={`uppercase transition-colors ${
              activeSubTab === 'pattern' ? 'text-black font-extrabold' : 'hover:text-neutral-600'
            }`}
          >
            Pattern
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('blur')}
            className={`uppercase transition-colors ${
              activeSubTab === 'blur' ? 'text-black font-extrabold' : 'hover:text-neutral-600'
            }`}
          >
            Photo Blur
          </button>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab(null)}
          className="w-7 h-7 rounded-full bg-[#ff2b6d] text-white flex items-center justify-center shadow-sm hover:bg-[#e0245e] active:scale-95 transition-all"
          title="Done"
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      {/* Sub-Panel Options */}
      <div className="flex items-center justify-center min-h-[50px] py-1">
        {/* Color swatches */}
        {activeSubTab === 'color' && (
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
            {SOLID_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setBackgroundConfig({ type: 'color', value: c })}
                style={{ backgroundColor: c }}
                className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 shrink-0 shadow-xs ${
                  backgroundConfig.type === 'color' && backgroundConfig.value === c
                    ? 'border-[#ff2b6d] ring-2 ring-[#ff2b6d]/30 scale-105'
                    : 'border-neutral-300'
                }`}
              />
            ))}
          </div>
        )}

        {/* Gradient swatches */}
        {activeSubTab === 'gradient' && (
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
            {GRADIENTS.map((g) => (
              <button
                key={g.name}
                type="button"
                onClick={() => setBackgroundConfig({ type: 'gradient', value: g.val })}
                style={{ backgroundImage: g.val }}
                className={`w-11 h-11 rounded-xl transition-transform hover:scale-105 shrink-0 shadow-xs ${
                  backgroundConfig.type === 'gradient' && backgroundConfig.value === g.val
                    ? 'ring-3 ring-[#ff2b6d] scale-105'
                    : 'border border-neutral-200'
                }`}
                title={g.name}
              />
            ))}
          </div>
        )}

        {/* Pattern swatches */}
        {activeSubTab === 'pattern' && (
          <div className="flex gap-3">
            {PATTERNS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setBackgroundConfig({ type: 'pattern', value: p.id })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  backgroundConfig.type === 'pattern' && backgroundConfig.value === p.id
                    ? 'bg-[#ff2b6d] text-white border-[#ff2b6d]'
                    : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border-neutral-200'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        {/* Blur Photo Option */}
        {activeSubTab === 'blur' && (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setBackgroundConfig({ type: 'blur', value: photos[0]?.id || '', blurIntensity: 18 })}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                backgroundConfig.type === 'blur'
                  ? 'bg-[#ff2b6d] text-white shadow-pink-500/20'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Apply Photo Blur Background
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
