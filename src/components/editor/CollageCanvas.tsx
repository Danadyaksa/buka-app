"use client";

import React, { useRef } from 'react';
import { useCollage } from '@/context/CollageContext';
import { PhotoCell } from '@/components/editor/PhotoCell';
import { TextOverlay } from '@/components/editor/TextOverlay';
import { StickerOverlay } from '@/components/editor/StickerOverlay';

export const CollageCanvas: React.FC = () => {
  const {
    selectedLayout,
    photos,
    cellAssignments,
    photoTransforms,
    canvasConfig,
    backgroundConfig,
    frameConfig,
    activeCellId,
    setActiveCellId,
    swapCells,
    textElements,
    stickerElements,
  } = useCollage();

  const canvasRef = useRef<HTMLDivElement>(null);

  // Background styling
  const getBackgroundStyle = (): React.CSSProperties => {
    if (backgroundConfig.type === 'color') {
      return { backgroundColor: backgroundConfig.value };
    }
    if (backgroundConfig.type === 'gradient') {
      return { backgroundImage: backgroundConfig.value };
    }
    if (backgroundConfig.type === 'pattern') {
      if (backgroundConfig.value === 'dots') {
        return {
          backgroundColor: '#ffffff',
          backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
        };
      }
      if (backgroundConfig.value === 'grid') {
        return {
          backgroundColor: '#ffffff',
          backgroundImage:
            'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        };
      }
      if (backgroundConfig.value === 'terrazzo') {
        return {
          backgroundColor: '#fdfbf7',
          backgroundImage:
            'radial-gradient(#f43f5e 2px, transparent 2px), radial-gradient(#0ea5e9 2px, transparent 2px), radial-gradient(#eab308 2px, transparent 2px)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px, 7px 22px',
        };
      }
      return { backgroundColor: '#ffffff' };
    }
    if (backgroundConfig.type === 'blur') {
      const firstPhoto = photos[0];
      if (firstPhoto) {
        return {
          backgroundImage: `url(${firstPhoto.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: `blur(${backgroundConfig.blurIntensity || 16}px)`,
          transform: 'scale(1.15)',
        };
      }
    }
    return { backgroundColor: '#ffffff' };
  };

  // Frame styling
  const getFrameClasses = (): string => {
    switch (frameConfig.type) {
      case 'polaroid':
        return 'border-[12px] border-b-[40px] border-white shadow-2xl';
      case 'filmstrip':
        return 'border-[16px] border-black shadow-2xl';
      case 'minimal':
        return 'border-8 border-white shadow-xl';
      case 'vintage':
        return 'border-[14px] border-[#f5eedc] shadow-2xl';
      default:
        return 'shadow-lg';
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-6 overflow-hidden select-none">
      {/* Outer Aspect Ratio Box Container */}
      <div
        style={{
          aspectRatio: `${canvasConfig.aspectRatio}`,
          maxHeight: '100%',
          maxWidth: '100%',
        }}
        className={`relative transition-all duration-200 overflow-hidden flex items-center justify-center bg-white ${getFrameClasses()}`}
      >
        {/* Background layer */}
        <div
          style={getBackgroundStyle()}
          className="absolute inset-0 w-full h-full transition-all duration-200 pointer-events-none"
        />

        {/* Inner Cells Grid Layer with Outer & Inner Margin */}
        <div
          ref={canvasRef}
          style={{
            padding: `${canvasConfig.outerMargin}px`,
            gap: `${canvasConfig.innerMargin}px`,
          }}
          onClick={() => setActiveCellId(null)}
          className="relative w-full h-full"
        >
          {selectedLayout.cells.map((cell) => {
            const assignedPhotoId = cellAssignments[cell.id];
            const photo = photos.find((p) => p.id === assignedPhotoId);
            const transform = assignedPhotoId ? photoTransforms[assignedPhotoId] : undefined;

            return (
              <PhotoCell
                key={cell.id}
                cell={cell}
                photo={photo}
                transform={transform}
                cornerRadius={canvasConfig.cornerRadius}
                shadow={canvasConfig.shadow}
                isSelected={activeCellId === cell.id}
                onSelect={() => setActiveCellId(cell.id)}
                onSwap={(sId, tId) => swapCells(sId, tId)}
              />
            );
          })}

          {/* Text Overlays Layer */}
          <TextOverlay />

          {/* Sticker Overlays Layer */}
          <StickerOverlay />
        </div>
      </div>
    </div>
  );
};
