"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Check,
  Keyboard,
  SlidersHorizontal,
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
  '#ff7597',
  '#ff2b6d',
  '#8b5cf6',
  '#3b82f6',
  '#38bdf8',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#64748b',
  '#d946ef',
];

export const TextEditorModal: React.FC<TextEditorModalProps> = ({
  initialItem,
  onSave,
  onClose,
}) => {
  const [text, setText] = useState(initialItem?.text || '');
  const [font, setFont] = useState(initialItem?.font || FONTS[0].family);
  const [fontSize, setFontSize] = useState(initialItem?.fontSize || 28);
  const [color, setColor] = useState(initialItem?.color || '#ffffff');
  const [letterSpacing, setLetterSpacing] = useState(initialItem?.letterSpacing || 2);
  const [lineHeight, setLineHeight] = useState(initialItem?.lineHeight || 1.2);
  const [align, setAlign] = useState<'left' | 'center' | 'right'>(initialItem?.align || 'center');
  const [bgStyle, setBgStyle] = useState<TextBgStyle>(initialItem?.bgStyle || 'none');
  const [bgColor, setBgColor] = useState(initialItem?.bgColor || '#38bdf8');

  // Sub-tab: keyboard, fonts, spacing, color
  const [activeSubTab, setActiveSubTab] = useState<'keyboard' | 'fonts' | 'spacing' | 'color'>('keyboard');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus and auto-resize textarea
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      adjustHeight();
    }
  }, [fontSize, lineHeight, font, text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

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
    <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs text-white flex flex-col justify-between select-none animate-in fade-in duration-200">
      {/* Top Navbar: Only X Close button on top-left (matches user screenshot) */}
      <div className="flex items-center justify-between p-4 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-white transition-opacity active:scale-95"
          title="Close"
        >
          <X className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* Middle Live Preview & Direct Editable Input */}
      <div
        onClick={() => {
          setActiveSubTab('keyboard');
          textareaRef.current?.focus();
        }}
        className="flex-1 flex flex-col items-center justify-center p-6 overflow-hidden cursor-text"
      >
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
          <div
            style={{
              backgroundColor: bgStyle === 'pill' || bgStyle === 'box' ? bgColor : 'transparent',
              padding:
                bgStyle === 'pill'
                  ? `${Math.round(fontSize * 0.35)}px ${Math.round(fontSize * 0.9)}px`
                  : bgStyle === 'box'
                  ? `${Math.round(fontSize * 0.25)}px ${Math.round(fontSize * 0.6)}px`
                  : '4px',
              borderRadius: bgStyle === 'pill' ? '9999px' : bgStyle === 'box' ? '10px' : '0',
            }}
            className="inline-flex items-center justify-center max-w-full font-bold shadow-md transition-all duration-100"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={handleTextChange}
              placeholder="Ketik teks..."
              style={{
                fontFamily: font,
                fontSize: `${fontSize}px`,
                color: color,
                letterSpacing: `${letterSpacing}px`,
                lineHeight: lineHeight,
                textAlign: align,
                caretColor: '#ffffff',
                marginRight: letterSpacing ? `-${letterSpacing}px` : 0,
              }}
              className="w-full max-w-full bg-transparent resize-none border-none outline-none overflow-hidden placeholder-white/50 font-bold focus:ring-0 p-0 m-0 block text-center leading-none"
            />
          </div>
        </div>
      </div>

      {/* Bottom Container: White Toolbar + Sub-Panels */}
      <div className="flex flex-col shrink-0">
        {/* White Toolbar matching Screenshot: Keyboard | Aa | Sliders | A | Pink Checkmark */}
        <div className="w-full bg-white border-t border-neutral-200/90 shadow-xl px-4 py-2.5 flex items-center justify-around shrink-0">
          {/* 1. KEYBOARD ICON */}
          <button
            type="button"
            onClick={() => {
              setActiveSubTab('keyboard');
              textareaRef.current?.focus();
            }}
            className="p-1.5 transition-transform active:scale-95"
            title="Keyboard"
          >
            <div
              className={`p-1 rounded-lg border-2 transition-colors ${
                activeSubTab === 'keyboard'
                  ? 'border-[#ff7597] text-[#ff7597]'
                  : 'border-[#c7d2fe] text-[#818cf8]'
              }`}
            >
              <Keyboard className="w-5 h-5 stroke-[2]" />
            </div>
          </button>

          {/* 2. FONTS ("Aa") */}
          <button
            type="button"
            onClick={() => {
              setActiveSubTab(activeSubTab === 'fonts' ? 'keyboard' : 'fonts');
            }}
            className={`px-3 py-1 transition-all active:scale-95 text-xl font-bold font-serif ${
              activeSubTab === 'fonts' ? 'text-[#ff2b6d] scale-110' : 'text-[#818cf8]'
            }`}
            title="Fonts"
          >
            Aa
          </button>

          {/* 3. SLIDERS */}
          <button
            type="button"
            onClick={() => {
              setActiveSubTab(activeSubTab === 'spacing' ? 'keyboard' : 'spacing');
            }}
            className={`p-1.5 transition-all active:scale-95 ${
              activeSubTab === 'spacing' ? 'text-[#ff2b6d] scale-110' : 'text-[#818cf8]'
            }`}
            title="Sliders / Spacing"
          >
            <SlidersHorizontal className="w-6 h-6 stroke-[2]" />
          </button>

          {/* 4. STYLE / COLOR ("A") */}
          <button
            type="button"
            onClick={() => {
              setActiveSubTab(activeSubTab === 'color' ? 'keyboard' : 'color');
            }}
            className="p-1.5 transition-transform active:scale-95"
            title="Color & Highlight"
          >
            <div
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center font-bold text-xs transition-colors ${
                activeSubTab === 'color'
                  ? 'border-[#ff2b6d] text-[#ff2b6d] bg-pink-50'
                  : 'border-[#c7d2fe] text-[#818cf8]'
              }`}
            >
              A
            </div>
          </button>

          {/* 5. PINK CONFIRM CHECKMARK CIRCLE */}
          <button
            type="button"
            onClick={handleConfirm}
            className="w-8 h-8 rounded-full bg-[#ff7597] hover:bg-[#ff2b6d] flex items-center justify-center text-white shadow-md active:scale-95 transition-all"
            title="Confirm"
          >
            <Check className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Sub-Panel Drawer (When Aa, Sliders, or Color is active) */}
        {activeSubTab !== 'keyboard' && (
          <div className="bg-neutral-900/95 backdrop-blur-xl border-t border-white/10 flex flex-col shrink-0 overflow-x-hidden animate-in slide-in-from-bottom-2 duration-150">
            <div className="p-4 min-h-[150px] flex items-center justify-center overflow-x-hidden">
              {/* FONTS SELECTOR (Strictly Vertical Scroll List from video, zero horizontal scroll) */}
              {activeSubTab === 'fonts' && (
                <div className="w-full max-w-sm flex flex-col items-center overflow-x-hidden">
                  <div
                    style={{ touchAction: 'pan-y' }}
                    className="w-full h-56 overflow-y-auto overflow-x-hidden no-scrollbar py-6 flex flex-col items-center gap-3.5 text-center scroll-smooth touch-pan-y select-none"
                  >
                    {FONTS.map((f) => {
                      const isSelected = font === f.family;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFont(f.family)}
                          style={{ fontFamily: f.family }}
                          className={`w-full py-1 text-base sm:text-lg transition-colors ${
                            isSelected
                              ? 'text-[#ff7597] font-black tracking-wide text-xl sm:text-2xl'
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

              {/* SPACING & FORMATTING */}
              {activeSubTab === 'spacing' && (
                <div className="w-full max-w-md flex flex-col gap-4">
                  {/* Letter Spacing */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-bold text-neutral-300">
                      <span>LETTER SPACING (KERNING)</span>
                      <span className="text-[#ff7597]">{letterSpacing}px</span>
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

                  {/* Font Size */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-bold text-neutral-300">
                      <span>FONT SIZE</span>
                      <span className="text-[#ff7597]">{fontSize}px</span>
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
                        align === 'left' ? 'bg-[#ff7597] text-white' : 'bg-white/10 text-neutral-400'
                      }`}
                      title="Align Left"
                    >
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlign('center')}
                      className={`p-2 rounded-lg transition-colors ${
                        align === 'center' ? 'bg-[#ff7597] text-white' : 'bg-white/10 text-neutral-400'
                      }`}
                      title="Align Center"
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlign('right')}
                      className={`p-2 rounded-lg transition-colors ${
                        align === 'right' ? 'bg-[#ff7597] text-white' : 'bg-white/10 text-neutral-400'
                      }`}
                      title="Align Right"
                    >
                      <AlignRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* COLOR & HIGHLIGHT STYLE */}
              {activeSubTab === 'color' && (
                <div className="w-full max-w-md flex flex-col gap-3">
                  {/* Highlight Style */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBgStyle('none')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        bgStyle === 'none' ? 'bg-[#ff7597] text-white' : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      No Box
                    </button>
                    <button
                      type="button"
                      onClick={() => setBgStyle('pill')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        bgStyle === 'pill' ? 'bg-[#ff7597] text-white' : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      Pill Box
                    </button>
                    <button
                      type="button"
                      onClick={() => setBgStyle('box')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        bgStyle === 'box' ? 'bg-[#ff7597] text-white' : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      Square Box
                    </button>
                  </div>

                  {/* Color Swatches */}
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
                            ? 'border-white ring-2 ring-[#ff7597]'
                            : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
