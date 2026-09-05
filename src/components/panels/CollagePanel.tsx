"use client";

import React, { useState } from 'react';
import {
  Grid,
  Maximize2,
  Minimize2,
  BoxSelect,
  Layers,
  Sparkles,
  Check,
} from 'lucide-react';
import { useCollage } from '@/context/CollageContext';
import { CustomSlider } from '@/components/ui/CustomSlider';
import { CLASSIC_LAYOUTS } from '@/config/layoutsClassic';
import { STYLISH_LAYOUTS } from '@/config/layoutsStylish';
import { LayoutPreviewSvg } from '@/components/ui/LayoutPreviewSvg';

type CollageControlMode = 'layout' | 'ratio' | 'outerMargin' | 'innerMargin' | 'cornerRadius' | 'shadow';

const ASPECT_RATIOS = [
  { name: '1:1', ratio: 1, label: 'Instagram Square' },
  { name: '4:5', ratio: 4 / 5, label: 'Instagram Portrait' },
  { name: '9:16', ratio: 9 / 16, label: 'Story / Reels / TikTok' },
  { name: '4:3', ratio: 4 / 3, label: 'Facebook / Tablet' },
  { name: '16:9', ratio: 16 / 9, label: 'Landscape' },
  { name: '1:2', ratio: 1 / 2, label: 'Tall Banner' },
];

export const CollagePanel: React.FC = () => {
  const {
    selectedLayout,
    setLayout,
    canvasConfig,
    setCanvasConfig,
  } = useCollage();

  const [controlMode, setControlMode] = useState<CollageControlMode>('layout');
  const [layoutCategory, setLayoutCategory] = useState<'classic' | 'stylish'>('classic');

  const layoutsToDisplay = layoutCategory === 'classic' ? CLASSIC_LAYOUTS : STYLISH_LAYOUTS;

  return (
    <div className="w-full bg-white border-t border-neutral-200/80 shadow-lg flex flex-col justify-between select-none">
      {/* Dynamic Upper Sub-Panel depending on controlMode */}
      <div className="p-3 min-h-[120px] flex items-center justify-center">
        {/* --- 1. LAYOUT SELECTOR MODE --- */}
        {controlMode === 'layout' && (
          <div className="w-full flex flex-col gap-2">
            {/* Category tabs */}
            <div className="flex items-center justify-center gap-8 text-xs font-bold tracking-wider text-neutral-400 border-b border-neutral-100 pb-1.5">
              <button
                type="button"
                onClick={() => setLayoutCategory('classic')}
                className={`uppercase transition-colors ${
                  layoutCategory === 'classic' ? 'text-black font-extrabold' : 'hover:text-neutral-600'
                }`}
              >
                CLASSIC
              </button>
              <button
                type="button"
                onClick={() => setLayoutCategory('stylish')}
                className={`uppercase transition-colors ${
                  layoutCategory === 'stylish' ? 'text-black font-extrabold' : 'hover:text-neutral-600'
                }`}
              >
                STYLISH
              </button>
            </div>

            {/* Layout carousel */}
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
              {layoutsToDisplay.map((layout) => (
                <LayoutPreviewSvg
                  key={layout.id}
                  layout={layout}
                  isSelected={selectedLayout.id === layout.id}
                  onClick={() => setLayout(layout)}
                />
              ))}
            </div>
          </div>
        )}

        {/* --- 2. ASPECT RATIO MODE --- */}
        {controlMode === 'ratio' && (
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-bold tracking-wider text-neutral-800 uppercase px-4">
              <span>ASPECT RATIO: {canvasConfig.aspectRatioName}</span>
              <span className="text-[#ff2b6d] font-mono">
                1:{ (1 / canvasConfig.aspectRatio).toFixed(2) }
              </span>
            </div>

            {/* Presets buttons */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
              {ASPECT_RATIOS.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    setCanvasConfig({
                      aspectRatio: item.ratio,
                      aspectRatioName: item.name,
                    })
                  }
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    canvasConfig.aspectRatioName === item.name
                      ? 'bg-[#ff2b6d] text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Continuous aspect ratio slider */}
            <input
              type="range"
              min={0.4}
              max={2.4}
              step={0.02}
              value={canvasConfig.aspectRatio}
              onChange={(e) =>
                setCanvasConfig({
                  aspectRatio: parseFloat(e.target.value),
                  aspectRatioName: 'Custom',
                })
              }
              className="ios-slider px-4"
            />
          </div>
        )}

        {/* --- 3. OUTER MARGIN MODE --- */}
        {controlMode === 'outerMargin' && (
          <CustomSlider
            label="OUTER MARGIN"
            value={canvasConfig.outerMargin}
            min={0}
            max={40}
            valueDisplay={`${canvasConfig.outerMargin}px`}
            onChange={(val) => setCanvasConfig({ outerMargin: val })}
            onConfirm={() => setControlMode('layout')}
          />
        )}

        {/* --- 4. INNER MARGIN MODE --- */}
        {controlMode === 'innerMargin' && (
          <CustomSlider
            label="INNER MARGIN"
            value={canvasConfig.innerMargin}
            min={0}
            max={30}
            valueDisplay={`${canvasConfig.innerMargin}px`}
            onChange={(val) => setCanvasConfig({ innerMargin: val })}
            onConfirm={() => setControlMode('layout')}
          />
        )}

        {/* --- 5. CORNER RADIUS MODE --- */}
        {controlMode === 'cornerRadius' && (
          <CustomSlider
            label="CORNER RADIUS"
            value={canvasConfig.cornerRadius}
            min={0}
            max={40}
            valueDisplay={`${canvasConfig.cornerRadius}px`}
            onChange={(val) => setCanvasConfig({ cornerRadius: val })}
            onConfirm={() => setControlMode('layout')}
          />
        )}

        {/* --- 6. SHADOW MODE --- */}
        {controlMode === 'shadow' && (
          <CustomSlider
            label="SHADOW"
            value={canvasConfig.shadow}
            min={0}
            max={30}
            valueDisplay={`${canvasConfig.shadow}px`}
            onChange={(val) => setCanvasConfig({ shadow: val })}
            onConfirm={() => setControlMode('layout')}
          />
        )}
      </div>

      {/* Sub-Mode Navigation Toolbar (Icons at bottom of collage panel) */}
      <div className="flex items-center justify-around border-t border-neutral-100 py-2.5 px-4 bg-neutral-50/70">
        <button
          type="button"
          onClick={() => setControlMode('layout')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
            controlMode === 'layout' ? 'text-[#ff2b6d]' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>Layout</span>
        </button>

        <button
          type="button"
          onClick={() => setControlMode('ratio')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
            controlMode === 'ratio' ? 'text-[#ff2b6d]' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Maximize2 className="w-5 h-5" />
          <span>Ratio</span>
        </button>

        <button
          type="button"
          onClick={() => setControlMode('outerMargin')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
            controlMode === 'outerMargin' ? 'text-[#ff2b6d]' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <BoxSelect className="w-5 h-5" />
          <span>Outer</span>
        </button>

        <button
          type="button"
          onClick={() => setControlMode('innerMargin')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
            controlMode === 'innerMargin' ? 'text-[#ff2b6d]' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Minimize2 className="w-5 h-5" />
          <span>Inner</span>
        </button>

        <button
          type="button"
          onClick={() => setControlMode('cornerRadius')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
            controlMode === 'cornerRadius' ? 'text-[#ff2b6d]' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>Radius</span>
        </button>

        <button
          type="button"
          onClick={() => setControlMode('shadow')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
            controlMode === 'shadow' ? 'text-[#ff2b6d]' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Shadow</span>
        </button>
      </div>
    </div>
  );
};
