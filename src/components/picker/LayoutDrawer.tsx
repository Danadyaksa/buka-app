"use client";

import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useCollage, ALL_LAYOUTS } from '@/context/CollageContext';
import { CLASSIC_LAYOUTS } from '@/config/layoutsClassic';
import { STYLISH_LAYOUTS } from '@/config/layoutsStylish';
import { LayoutPreviewSvg } from '@/components/ui/LayoutPreviewSvg';

interface LayoutDrawerProps {
  onNext: () => void;
}

export const LayoutDrawer: React.FC<LayoutDrawerProps> = ({ onNext }) => {
  const { selectedLayout, setLayout, photos } = useCollage();
  const [activeTab, setActiveTab] = useState<'classic' | 'stylish'>('classic');
  const [isExpanded, setIsExpanded] = useState(false);

  const currentLayouts = activeTab === 'classic' ? CLASSIC_LAYOUTS : STYLISH_LAYOUTS;

  return (
    <div
      className={`bg-white border-t border-neutral-200/80 shadow-2xl transition-all duration-300 flex flex-col z-30 ${
        isExpanded ? 'h-[75vh]' : 'h-auto max-h-56'
      }`}
    >
      {/* Top Handle & Expand Button */}
      <div className="flex flex-col items-center pt-2 pb-1 border-b border-neutral-100">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center justify-center w-full py-1 text-neutral-400 hover:text-neutral-700 transition"
          aria-label={isExpanded ? 'Collapse layouts' : 'Expand layouts'}
        >
          {isExpanded ? <ChevronDown className="w-5 h-5 text-neutral-500" /> : <ChevronUp className="w-5 h-5 text-neutral-500" />}
        </button>

        {/* Category Tabs: CLASSIC & STYLISH */}
        <div className="flex items-center gap-8 text-sm font-semibold tracking-wider my-1">
          <button
            type="button"
            onClick={() => setActiveTab('classic')}
            className={`pb-1 uppercase transition-colors relative ${
              activeTab === 'classic' ? 'text-black font-bold' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            CLASSIC
            {activeTab === 'classic' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff2b6d] rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stylish')}
            className={`pb-1 uppercase transition-colors relative ${
              activeTab === 'stylish' ? 'text-black font-bold' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            STYLISH
            {activeTab === 'stylish' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff2b6d] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Layout items list */}
      <div className={`overflow-y-auto p-4 ${isExpanded ? 'flex-1 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 auto-rows-max' : 'flex gap-3 no-scrollbar overflow-x-auto'}`}>
        {currentLayouts.map((layout) => (
          <LayoutPreviewSvg
            key={layout.id}
            layout={layout}
            photos={photos}
            isSelected={selectedLayout.id === layout.id}
            onClick={() => setLayout(layout)}
          />
        ))}
      </div>

      {/* Bottom status & Next button */}
      <div className="p-3 sm:px-6 bg-white border-t border-neutral-100 flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-600">
          <span className="font-bold text-neutral-900">{photos.length}</span> Photos Selected
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={photos.length === 0}
          className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 flex items-center gap-1.5 shadow-sm ${
            photos.length > 0
              ? 'bg-[#ff2b6d] text-white hover:bg-[#e0245e] active:scale-95 shadow-pink-500/20'
              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }`}
        >
          Next
          <span className="text-xs">›</span>
        </button>
      </div>
    </div>
  );
};
