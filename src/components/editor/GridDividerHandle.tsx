"use client";

import React, { useRef } from 'react';
import { ChevronsUpDown, ChevronsLeftRight, Move } from 'lucide-react';

interface GridDividerHandleProps {
  type: 'horizontal' | 'vertical' | 'both';
  position: { x: number; y: number }; // Percentage 0 to 100
  onDrag: (newPosition: { x: number; y: number }) => void;
  containerRect: { width: number; height: number };
}

export const GridDividerHandle: React.FC<GridDividerHandleProps> = ({
  type,
  position,
  onDrag,
  containerRect,
}) => {
  const isDragging = useRef(false);
  const dragStart = useRef<{ clientX: number; clientY: number; startPos: { x: number; y: number } } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startPos: { ...position },
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !dragStart.current || containerRect.width === 0 || containerRect.height === 0) return;

    const dx = e.clientX - dragStart.current.clientX;
    const dy = e.clientY - dragStart.current.clientY;

    const dxPct = (dx / containerRect.width) * 100;
    const dyPct = (dy / containerRect.height) * 100;

    const newX = Math.max(10, Math.min(90, dragStart.current.startPos.x + dxPct));
    const newY = Math.max(10, Math.min(90, dragStart.current.startPos.y + dyPct));

    onDrag({
      x: type === 'horizontal' ? position.x : newX,
      y: type === 'vertical' ? position.y : newY,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    dragStart.current = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        willChange: 'left, top',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="z-30 cursor-grab active:cursor-grabbing touch-none select-none w-10 h-10 flex items-center justify-center"
      title="Drag to resize grid"
    >
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-[#ff2b6d] border border-neutral-300 shadow-md shadow-black/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform pointer-events-none">
        {type === 'horizontal' && <ChevronsUpDown className="w-4 h-4 stroke-[2.5]" />}
        {type === 'vertical' && <ChevronsLeftRight className="w-4 h-4 stroke-[2.5]" />}
        {type === 'both' && <Move className="w-4 h-4 stroke-[2.5]" />}
      </div>
    </div>
  );
};
