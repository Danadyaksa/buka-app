"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useCollage } from '@/context/CollageContext';
import { PhotoCell } from '@/components/editor/PhotoCell';
import { TextOverlay } from '@/components/editor/TextOverlay';

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
  } = useCollage();

  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({
    width: 340,
    height: 340,
  });

  // Calculate pixel-perfect dimensions to fill available screen area
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth === 0 || clientHeight === 0) return;

      // Leave padding around canvas (16px on mobile, 24px on desktop)
      const padding = clientWidth < 640 ? 16 : 28;
      const availW = Math.max(100, clientWidth - padding * 2);
      const availH = Math.max(100, clientHeight - padding * 2);

      const targetRatio = canvasConfig.aspectRatio || 1; // width / height
      const containerRatio = availW / availH;

      let finalW = availW;
      let finalH = availH;

      if (targetRatio > containerRatio) {
        finalW = availW;
        finalH = availW / targetRatio;
      } else {
        finalH = availH;
        finalW = availH * targetRatio;
      }

      setCanvasSize({ width: Math.round(finalW), height: Math.round(finalH) });
    };

    updateSize();
    const obs = new ResizeObserver(updateSize);
    if (containerRef.current) obs.observe(containerRef.current);
    window.addEventListener('resize', updateSize);

    return () => {
      obs.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [canvasConfig.aspectRatio]);

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
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-0 flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none"
    >
      {/* Outer Aspect Ratio Box Container with Exact Computed Dimensions */}
      <div
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
        }}
        className={`relative transition-all duration-150 overflow-hidden flex items-center justify-center bg-white ${getFrameClasses()}`}
      >
        {/* Background layer */}
        <div
          style={getBackgroundStyle()}
          className="absolute inset-0 w-full h-full transition-all duration-200 pointer-events-none"
        />

        {/* Inner Cells Grid Layer with Outer & Inner Margin */}
        <div
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
        </div>
      </div>
    </div>
  );
};
