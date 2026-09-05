import React from 'react';
import { CollageLayout } from '@/types/collage';

interface LayoutPreviewSvgProps {
  layout: CollageLayout;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const LayoutPreviewSvg: React.FC<LayoutPreviewSvgProps> = ({
  layout,
  isSelected = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-16 h-16 sm:w-20 sm:h-20 p-1.5 rounded-xl transition-all duration-150 flex items-center justify-center shrink-0 ${
        isSelected
          ? 'ring-2 ring-[#ff2b6d] bg-pink-50/50 shadow-sm'
          : 'hover:bg-neutral-100 bg-white border border-neutral-200/80 shadow-xs'
      } ${className}`}
      title={layout.name}
    >
      <div className="relative w-full h-full rounded-md overflow-hidden bg-neutral-100">
        {layout.cells.map((cell) => (
          <div
            key={cell.id}
            style={{
              position: 'absolute',
              left: `${cell.x}%`,
              top: `${cell.y}%`,
              width: `${cell.width}%`,
              height: `${cell.height}%`,
              clipPath: cell.clipPath,
              padding: '1px',
            }}
          >
            <div className="w-full h-full bg-[#ff2b6d] rounded-[2px] opacity-90 transition-opacity hover:opacity-100" />
          </div>
        ))}
      </div>
    </button>
  );
};
