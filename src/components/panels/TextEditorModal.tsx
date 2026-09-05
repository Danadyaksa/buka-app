"use client";

import React, { useState } from 'react';
import {
  X,
  Check,
  Keyboard,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { FONTS } from '@/config/fonts';
import { TextOverlayItem, TextBgStyle } from '@/types/collage';

interface TextEditorModalProps {
  initialItem?: TextOverlayItem | null;
  onSave: (item: Omit<TextOverlayItem, 'id'>) => void;
  onClose: () => void;
}

const POPULAR_COLORS = [
  '#ffffff',
  '#000000',
  '#ff2b6d',
  '#8b5cf6',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#64748b',
];

export const TextEditorModal: React.FC<TextEditorModalProps> = ({
  initialItem,
  onSave,
  onClose,
}) => {
  const [text, setText] = useState(initialItem?.text || 'cekkk');
  const [font, setFont] = useState(initialItem?.font || FONTS[0].family);
  const [fontSize, setFontSize] = useState(initialItem?.fontSize || 28);
  const [color, setColor] = useState(initialItem?.color || '#ffffff');
  const [letterSpacing, setLetterSpacing] = useState(initialItem?.letterSpacing || 2);
  const [lineHeight, setLineHeight] = useState(initialItem?.lineHeight || 1.2);
  const [align, setAlign] = useState<'left' | 'center' | 'right'>(initialItem?.align || 'center');
  const [bgStyle, setBgStyle] = useState<TextBgStyle>(initialItem?.bgStyle || 'none');
  const [bgColor, setBgColor] = useState(initialItem?.bgColor || '#38bdf8');

  const [activeSubTab, setActiveSubTab] = useState<'keyboard' | 'fonts' | 'spacing' | 'color'>('fonts');

  const handleConfirm = () => {
    if (!text.trim()) {
      onClose();
      return;
    }
    onSave({
      text,
      font,
      fontSize,
      color,
      letterSpacing,
      lineHeight,
      align,
      bgStyle,
      bgColor,
      x: initialItem?.x ?? 50,
      y: initialItem?.y ?? 50,
      rotation: initialItem?.rotation ?? 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#6b7280] text-white flex flex-col justify-between select-none animate-in fade-in duration-200">
      {/* Top Navbar */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-xs font-bold uppercase tracking-widest text-white/60">Text Editor</span>

        <button
          type="button"
          onClick={handleConfirm}
          className="w-9 h-9 rounded-full bg-[#ff2b6d] hover:bg-[#e0245e] flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
        >
          <Check className="w-5 h-5 stroke-[3]" />
        </button>
      </div>

      {/* Middle Live Preview & Input Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-hidden">
        <div
          style={{
            fontFamily: font,
            fontSize: `${fontSize}px`,
            color: color,
            letterSpacing: `${letterSpacing}px`,
            lineHeight: lineHeight,
            textAlign: align,
          }}
          className="max-w-xl w-full flex items-center justify-center transition-all duration-100"
        >
          <span
            style={{
              backgroundColor: bgStyle === 'pill' || bgStyle === 'box' ? bgColor : 'transparent',
              padding: bgStyle === 'pill' ? '6px 18px' : bgStyle === 'box' ? '6px 12px' : '0',
              borderRadius: bgStyle === 'pill' ? '9999px' : bgStyle === 'box' ? '8px' : '0',
            }}
            className="inline-block whitespace-pre-wrap font-bold shadow-sm"
          >
            {text || 'Type something...'}
          </span>
        </div>
      </div>

      {/* Bottom Sub-Panel Controls */}
      <div className="bg-neutral-900/95 backdrop-blur-xl border-t border-white/10 flex flex-col shrink-0">
        {/* Sub-Panel Content */}
        <div className="p-4 min-h-[140px] flex items-center justify-center">
          {/* 1. KEYBOARD INPUT MODE */}
          {activeSubTab === 'keyboard' && (
            <div className="w-full max-w-md flex flex-col gap-2">
              <label className="text-xs font-semibold text-neutral-400">Edit Text</label>
              <input
                type="text"
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text..."
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-neutral-500 border border-white/20 focus:border-[#ff2b6d] outline-none text-base"
              />
            </div>
          )}

          {/* 2. FONTS SELECTOR MODE (Video 01:46 - 02:22: Vertical Scroll List) */}
          {activeSubTab === 'fonts' && (
            <div className="w-full max-w-sm flex flex-col items-center">
              <div className="w-full h-56 overflow-y-auto no-scrollbar py-6 flex flex-col items-center gap-3 text-center scroll-smooth">
                {FONTS.map((f) => {
                  const isSelected = font === f.family;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFont(f.family)}
                      style={{ fontFamily: f.family }}
                      className={`w-full py-1.5 text-base sm:text-lg transition-all duration-150 ${
                        isSelected
                          ? 'text-[#ff2b6d] font-extrabold scale-110 tracking-wide'
                          : 'text-neutral-400 hover:text-white font-normal'
                      }`}
                    >
                      {f.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. SPACING & FORMATTING MODE (Video 02:23 - 02:35) */}
          {activeSubTab === 'spacing' && (
            <div className="w-full max-w-md flex flex-col gap-4">
              {/* Letter Spacing (Kerning) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold text-neutral-300">
                  <span>LETTER SPACING (KERNING)</span>
                  <span className="text-[#ff2b6d]">{letterSpacing}px</span>
                </div>
                <input
                  type="range"
                  min={-2}
                  max={24}
                  step={1}
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(parseInt(e.target.value))}
                  className="ios-slider"
                />
              </div>

              {/* Font Size Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold text-neutral-300">
                  <span>FONT SIZE</span>
                  <span className="text-[#ff2b6d]">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min={14}
                  max={64}
                  step={1}
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="ios-slider"
                />
              </div>

              {/* Alignment */}
              <div className="flex items-center justify-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => setAlign('left')}
                  className={`p-2 rounded-lg transition-colors ${
                    align === 'left' ? 'bg-[#ff2b6d] text-white' : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setAlign('center')}
                  className={`p-2 rounded-lg transition-colors ${
                    align === 'center' ? 'bg-[#ff2b6d] text-white' : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setAlign('right')}
                  className={`p-2 rounded-lg transition-colors ${
                    align === 'right' ? 'bg-[#ff2b6d] text-white' : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 4. COLOR & HIGHLIGHT STYLE (Video 02:43 - 02:46) */}
          {activeSubTab === 'color' && (
            <div className="w-full max-w-md flex flex-col gap-3">
              {/* Highlight Style Choice */}
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setBgStyle('none')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    bgStyle === 'none' ? 'bg-[#ff2b6d] text-white' : 'bg-white/10 text-neutral-300'
                  }`}
                >
                  No Box
                </button>
                <button
                  type="button"
                  onClick={() => setBgStyle('pill')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    bgStyle === 'pill' ? 'bg-[#ff2b6d] text-white' : 'bg-white/10 text-neutral-300'
                  }`}
                >
                  Pill Box
                </button>
                <button
                  type="button"
                  onClick={() => setBgStyle('box')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    bgStyle === 'box' ? 'bg-[#ff2b6d] text-white' : 'bg-white/10 text-neutral-300'
                  }`}
                >
                  Square Box
                </button>
              </div>

              {/* Color Swatches for text or highlight */}
              <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-2">
                {POPULAR_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      if (bgStyle === 'none') {
                        setColor(c);
                      } else {
                        setBgColor(c);
                      }
                    }}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 shrink-0 ${
                      (bgStyle === 'none' ? color === c : bgColor === c)
                        ? 'border-white ring-2 ring-[#ff2b6d]'
                        : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Sub-mode Switcher Icons (Video 01:46) */}
        <div className="flex items-center justify-around border-t border-white/10 py-3 px-6">
          <button
            type="button"
            onClick={() => setActiveSubTab('keyboard')}
            className={`p-2 transition-colors ${
              activeSubTab === 'keyboard' ? 'text-[#ff2b6d]' : 'text-neutral-400 hover:text-white'
            }`}
            title="Keyboard"
          >
            <Keyboard className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('fonts')}
            className={`text-lg font-serif font-bold transition-colors ${
              activeSubTab === 'fonts' ? 'text-[#ff2b6d]' : 'text-neutral-400 hover:text-white'
            }`}
            title="Fonts"
          >
            Aa
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('spacing')}
            className={`p-2 transition-colors ${
              activeSubTab === 'spacing' ? 'text-[#ff2b6d]' : 'text-neutral-400 hover:text-white'
            }`}
            title="Kerning & Formatting"
          >
            <Sliders className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('color')}
            className={`px-2.5 py-1 rounded border text-sm font-bold transition-colors ${
              activeSubTab === 'color'
                ? 'border-[#ff2b6d] text-[#ff2b6d]'
                : 'border-neutral-500 text-neutral-400 hover:text-white'
            }`}
            title="Color & Highlight"
          >
            A
          </button>
        </div>
      </div>
    </div>
  );
};
