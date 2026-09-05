import React from 'react';
import { CollageLayout, PhotoItem } from '@/types/collage';

interface LayoutPreviewSvgProps {
  layout: CollageLayout;
  photos?: PhotoItem[];
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const LayoutPreviewSvg: React.FC<LayoutPreviewSvgProps> = ({
  layout,
  photos = [],
  isSelected = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-16 h-16 sm:w-20 sm:h-20 p-1 rounded-xl transition-all duration-150 flex items-center justify-center shrink-0 ${
        isSelected
          ? 'ring-2 ring-[#ff2b6d] bg-pink-50/50 shadow-sm'
          : 'hover:bg-neutral-100 bg-white border border-neutral-200/80 shadow-xs'
      } ${className}`}
      title={layout.name}
    >
      <div className="relative w-full h-full rounded-md overflow-hidden bg-neutral-100">
        {layout.cells.map((cell, idx) => {
          const photo = photos && photos.length > 0 ? photos[idx % photos.length] : undefined;
          return (
            <div
              key={cell.id}
              style={{
                position: 'absolute',
                left: `${cell.x}%`,
                top: `${cell.y}%`,
                width: `${cell.width}%`,
                height: `${cell.height}%`,
                clipPath: cell.clipPath,
                padding: '0.75px',
              }}
            >
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo.url}
                  alt=""
                  className="w-full h-full object-cover pointer-events-none"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-[#ff2b6d] rounded-[1px] opacity-90 transition-opacity hover:opacity-100" />
              )}
            </div>
          );
        })}
      </div>
    </button>
  );
};
