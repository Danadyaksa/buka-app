"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, Pencil, ArrowUpDown } from 'lucide-react';
import { useCollage } from '@/context/CollageContext';
import { TextOverlayItem } from '@/types/collage';

interface TextOverlayProps {
  onEditText?: (item: TextOverlayItem) => void;
}

export const TextOverlay: React.FC<TextOverlayProps> = ({ onEditText }) => {
  const { textElements, updateTextElement, deleteTextElement } = useCollage();
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const elementRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Deselect when clicking outside or on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedTextId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!selectedTextId) return;
    const handleOutsideClick = (e: PointerEvent) => {
      const activeElem = elementRefs.current[selectedTextId];
      if (activeElem && !activeElem.contains(e.target as Node)) {
        setSelectedTextId(null);
      }
    };
    window.addEventListener('pointerdown', handleOutsideClick);
    return () => window.removeEventListener('pointerdown', handleOutsideClick);
  }, [selectedTextId]);

  // --- 1. HANDLE MOVE (PAN TEXT) - BUTTER SMOOTH WITH RAF & CONTAINER RECT ---
  const handleMovePointerDown = (
    e: React.PointerEvent,
    item: TextOverlayItem
  ) => {
    e.stopPropagation();
    setSelectedTextId(item.id);

    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    if (containerRect.width === 0 || containerRect.height === 0) return;

    const startPointerX = e.clientX;
    const startPointerY = e.clientY;
    const startX = item.x;
    const startY = item.y;

    let latestX = startX;
    let latestY = startY;
    let rafId: number | null = null;

    const onPointerMove = (moveEvt: PointerEvent) => {
      moveEvt.preventDefault();
      const dx = moveEvt.clientX - startPointerX;
      const dy = moveEvt.clientY - startPointerY;

      // Exact 1:1 pixel to percentage calculation based on actual canvas size
      const dxPercent = (dx / containerRect.width) * 100;
      const dyPercent = (dy / containerRect.height) * 100;

      latestX = Math.max(0, Math.min(100, Math.round((startX + dxPercent) * 10) / 10));
      latestY = Math.max(0, Math.min(100, Math.round((startY + dyPercent) * 10) / 10));

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          updateTextElement(item.id, { x: latestX, y: latestY });
          rafId = null;
        });
      }
    };

    const onPointerUp = () => {
      if (rafId) cancelAnimationFrame(rafId);
      updateTextElement(item.id, { x: latestX, y: latestY });
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // --- 2. HANDLE RESIZE & ROTATE (BOTTOM-RIGHT CORNER) ---
  const handleResizeRotatePointerDown = (
    e: React.PointerEvent,
    item: TextOverlayItem
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const elem = elementRefs.current[item.id];
    if (!elem) return;

    const rect = elem.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const startPointerX = e.clientX;
    const startPointerY = e.clientY;
    const initialDist = Math.hypot(startPointerX - centerX, startPointerY - centerY);
    const initialAngleRad = Math.atan2(startPointerY - centerY, startPointerX - centerX);
    const initialAngleDeg = (initialAngleRad * 180) / Math.PI;

    const startFontSize = item.fontSize;
    const startRotation = item.rotation || 0;

    let latestFontSize = startFontSize;
    let latestRotation = startRotation;
    let rafId: number | null = null;

    const onPointerMove = (moveEvt: PointerEvent) => {
      moveEvt.preventDefault();
      const curDist = Math.hypot(moveEvt.clientX - centerX, moveEvt.clientY - centerY);
      const curAngleRad = Math.atan2(moveEvt.clientY - centerY, moveEvt.clientX - centerX);
      const curAngleDeg = (curAngleRad * 180) / Math.PI;

      // Scale font size based on distance from center
      const scale = curDist / (initialDist || 1);
      latestFontSize = Math.max(12, Math.min(160, Math.round(startFontSize * scale)));

      // Rotate based on angle around center
      const deltaAngle = curAngleDeg - initialAngleDeg;
      let newRot = Math.round(startRotation + deltaAngle);
      newRot = ((newRot % 360) + 360) % 360;
      latestRotation = newRot;

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          updateTextElement(item.id, {
            fontSize: latestFontSize,
            rotation: latestRotation,
          });
          rafId = null;
        });
      }
    };

    const onPointerUp = () => {
      if (rafId) cancelAnimationFrame(rafId);
      updateTextElement(item.id, {
        fontSize: latestFontSize,
        rotation: latestRotation,
      });
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  if (textElements.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-30 pointer-events-none overflow-hidden select-none"
    >
      {textElements.map((item) => {
        const isSelected = selectedTextId === item.id;

        return (
          <div
            key={item.id}
            ref={(el) => {
              elementRefs.current[item.id] = el;
            }}
            onPointerDown={(e) => handleMovePointerDown(e, item)}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTextId(item.id);
            }}
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
              lineHeight: item.lineHeight || 1.2,
              textAlign: item.align,
            }}
            className="pointer-events-auto cursor-move select-none inline-flex items-center justify-center touch-none transition-none"
          >
            {/* Bounding Box Container */}
            <div
              className={`relative inline-flex items-center justify-center p-2.5 transition-all ${
                isSelected ? 'rounded-xl' : ''
              }`}
              style={
                isSelected
                  ? {
                      border: '2px dashed rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)',
                    }
                  : undefined
              }
            >
              {/* Text Badge / Box Background */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: item.align,
                  backgroundColor:
                    item.bgStyle === 'pill' || item.bgStyle === 'box'
                      ? item.bgColor
                      : 'transparent',
                  padding:
                    item.bgStyle === 'pill'
                      ? `${Math.round(item.fontSize * 0.35)}px ${Math.round(item.fontSize * 0.85)}px`
                      : item.bgStyle === 'box'
                      ? `${Math.round(item.fontSize * 0.25)}px ${Math.round(item.fontSize * 0.55)}px`
                      : '0',
                  borderRadius:
                    item.bgStyle === 'pill' ? '9999px' : item.bgStyle === 'box' ? '10px' : '0',
                  lineHeight: 1.2,
                }}
                className="font-bold select-none leading-none shadow-xs"
              >
                {/* Compensate for letterSpacing on the last character to guarantee exact centering */}
                <span
                  style={{
                    display: 'inline-block',
                    marginRight: item.letterSpacing ? `-${item.letterSpacing}px` : 0,
                  }}
                  className="whitespace-pre"
                >
                  {item.text}
                </span>
              </span>

              {/* 3 iOS-Style Corner Control Handles (Matching User Screenshot 1) */}
              {isSelected && (
                <>
                  {/* Top-Left: Red X Delete Button */}
                  <button
                    type="button"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTextElement(item.id);
                      setSelectedTextId(null);
                    }}
                    className="absolute -top-3.5 -left-3.5 w-7 h-7 rounded-full bg-white shadow-md border border-neutral-200/90 flex items-center justify-center active:scale-95 transition-transform z-40 cursor-pointer hover:bg-red-50"
                    title="Hapus Teks"
                  >
                    <X className="w-4 h-4 text-red-500 stroke-[3]" />
                  </button>

                  {/* Top-Right: Blue Pencil Edit Button */}
                  <button
                    type="button"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditText?.(item);
                    }}
                    className="absolute -top-3.5 -right-3.5 w-7 h-7 rounded-full bg-white shadow-md border border-neutral-200/90 flex items-center justify-center active:scale-95 transition-transform z-40 cursor-pointer hover:bg-blue-50"
                    title="Edit Teks"
                  >
                    <Pencil className="w-3.5 h-3.5 text-blue-600 fill-blue-600/20 stroke-[2.5]" />
                  </button>

                  {/* Bottom-Right: Resize & Rotate Dual Handle */}
                  <div
                    onPointerDown={(e) => handleResizeRotatePointerDown(e, item)}
                    className="absolute -bottom-3.5 -right-3.5 w-7 h-7 rounded-full bg-white shadow-md border border-neutral-200/90 flex items-center justify-center active:scale-110 transition-transform z-40 cursor-nwse-resize hover:bg-blue-50 touch-none"
                    title="Ubah Ukuran & Putar Teks"
                  >
                    {/* Diagonal expand & rotate corner arrows icon */}
                    <svg
                      className="w-3.5 h-3.5 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

