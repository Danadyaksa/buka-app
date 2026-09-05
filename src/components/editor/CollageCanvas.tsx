"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useCollage } from '@/context/CollageContext';
import { PhotoCell } from '@/components/editor/PhotoCell';
import { TextOverlay } from '@/components/editor/TextOverlay';
import { GridDividerHandle } from '@/components/editor/GridDividerHandle';
import { CellLayout, TextOverlayItem } from '@/types/collage';

interface CollageCanvasProps {
  onEditText?: (item: TextOverlayItem) => void;
}

export const CollageCanvas: React.FC<CollageCanvasProps> = ({ onEditText }) => {
  const {
    selectedLayout,
    customCells,
    setCustomCells,
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
    height: 425,
  });

  // Calculate pixel-perfect dimensions to fill available screen area
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth === 0 || clientHeight === 0) return;

      const padding = clientWidth < 640 ? 12 : 24;
      const availW = Math.max(100, clientWidth - padding * 2);
      const availH = Math.max(100, clientHeight - padding * 2);

      const targetRatio = canvasConfig.aspectRatio || 0.8; // default 4:5
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

  // Use customCells if available, otherwise selectedLayout.cells
  const currentCells: CellLayout[] = customCells || selectedLayout.cells;

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

  // --- CALCULATE OUTER AND INNER MARGIN AREA ---
  const outerMarginPx = canvasConfig.outerMargin || 0;
  const innerMarginPx = canvasConfig.innerMargin || 0;

  const innerAreaW = Math.max(10, canvasSize.width - outerMarginPx * 2);
  const innerAreaH = Math.max(10, canvasSize.height - outerMarginPx * 2);

  // --- GRID DIVIDER HANDLERS (Resize grid splits in real-time) ---
  const handleDragRowDivider = (dividerIndex: number, newY: number) => {
    if (selectedLayout.id === 'classic-3-rows' && currentCells.length === 3) {
      const updated = [...currentCells];
      if (dividerIndex === 1) {
        // Divider between row 1 and row 2
        const clampedY = Math.max(15, Math.min(newY, currentCells[2].y - 15));
        updated[0] = { ...updated[0], height: clampedY };
        updated[1] = {
          ...updated[1],
          y: clampedY,
          height: currentCells[2].y - clampedY,
        };
      } else if (dividerIndex === 2) {
        // Divider between row 2 and row 3
        const clampedY = Math.max(currentCells[0].height + 15, Math.min(newY, 85));
        updated[1] = {
          ...updated[1],
          height: clampedY - currentCells[1].y,
        };
        updated[2] = {
          ...updated[2],
          y: clampedY,
          height: 100 - clampedY,
        };
      }
      setCustomCells(updated);
    } else if (selectedLayout.id === 'classic-3-1top-2bot' && currentCells.length === 3) {
      const clampedY = Math.max(15, Math.min(newY, 85));
      setCustomCells([
        { ...currentCells[0], height: clampedY },
        { ...currentCells[1], y: clampedY, height: 100 - clampedY },
        { ...currentCells[2], y: clampedY, height: 100 - clampedY },
      ]);
    } else if (selectedLayout.id === 'classic-3-2top-1bot' && currentCells.length === 3) {
      const clampedY = Math.max(15, Math.min(newY, 85));
      setCustomCells([
        { ...currentCells[0], height: clampedY },
        { ...currentCells[1], height: clampedY },
        { ...currentCells[2], y: clampedY, height: 100 - clampedY },
      ]);
    } else if (selectedLayout.id === 'classic-3-1left-2right' && currentCells.length === 3) {
      const clampedY = Math.max(15, Math.min(newY, 85));
      setCustomCells([
        currentCells[0],
        { ...currentCells[1], height: clampedY },
        { ...currentCells[2], y: clampedY, height: 100 - clampedY },
      ]);
    } else if (selectedLayout.id === 'classic-3-2left-1right' && currentCells.length === 3) {
      const clampedY = Math.max(15, Math.min(newY, 85));
      setCustomCells([
        { ...currentCells[0], height: clampedY },
        { ...currentCells[1], y: clampedY, height: 100 - clampedY },
        currentCells[2],
      ]);
    } else if (selectedLayout.id === 'classic-4-2x2' && currentCells.length === 4) {
      const clampedY = Math.max(15, Math.min(newY, 85));
      setCustomCells([
        { ...currentCells[0], height: clampedY },
        { ...currentCells[1], height: clampedY },
        { ...currentCells[2], y: clampedY, height: 100 - clampedY },
        { ...currentCells[3], y: clampedY, height: 100 - clampedY },
      ]);
    } else if (
      (selectedLayout.id.includes('classic-2-h') || currentCells.length === 2) &&
      currentCells[0].width === 100
    ) {
      // 2 Rows
      const clampedY = Math.max(15, Math.min(newY, 85));
      setCustomCells([
        { ...currentCells[0], height: clampedY },
        { ...currentCells[1], y: clampedY, height: 100 - clampedY },
      ]);
    }
  };

  const handleDragColDivider = (dividerIndex: number, newX: number) => {
    if (selectedLayout.id === 'classic-3-cols' && currentCells.length === 3) {
      const updated = [...currentCells];
      if (dividerIndex === 1) {
        const clampedX = Math.max(15, Math.min(newX, currentCells[2].x - 15));
        updated[0] = { ...updated[0], width: clampedX };
        updated[1] = {
          ...updated[1],
          x: clampedX,
          width: currentCells[2].x - clampedX,
        };
      } else if (dividerIndex === 2) {
        const clampedX = Math.max(currentCells[0].width + 15, Math.min(newX, 85));
        updated[1] = {
          ...updated[1],
          width: clampedX - currentCells[1].x,
        };
        updated[2] = {
          ...updated[2],
          x: clampedX,
          width: 100 - clampedX,
        };
      }
      setCustomCells(updated);
    } else if (selectedLayout.id === 'classic-3-1top-2bot' && currentCells.length === 3) {
      const clampedX = Math.max(15, Math.min(newX, 85));
      setCustomCells([
        currentCells[0],
        { ...currentCells[1], width: clampedX },
        { ...currentCells[2], x: clampedX, width: 100 - clampedX },
      ]);
    } else if (selectedLayout.id === 'classic-3-2top-1bot' && currentCells.length === 3) {
      const clampedX = Math.max(15, Math.min(newX, 85));
      setCustomCells([
        { ...currentCells[0], width: clampedX },
        { ...currentCells[1], x: clampedX, width: 100 - clampedX },
        currentCells[2],
      ]);
    } else if (selectedLayout.id === 'classic-3-1left-2right' && currentCells.length === 3) {
      const clampedX = Math.max(15, Math.min(newX, 85));
      setCustomCells([
        { ...currentCells[0], width: clampedX },
        { ...currentCells[1], x: clampedX, width: 100 - clampedX },
        { ...currentCells[2], x: clampedX, width: 100 - clampedX },
      ]);
    } else if (selectedLayout.id === 'classic-3-2left-1right' && currentCells.length === 3) {
      const clampedX = Math.max(15, Math.min(newX, 85));
      setCustomCells([
        { ...currentCells[0], width: clampedX },
        { ...currentCells[1], width: clampedX },
        { ...currentCells[2], x: clampedX, width: 100 - clampedX },
      ]);
    } else if (selectedLayout.id === 'classic-4-2x2' && currentCells.length === 4) {
      const clampedX = Math.max(15, Math.min(newX, 85));
      setCustomCells([
        { ...currentCells[0], width: clampedX },
        { ...currentCells[1], x: clampedX, width: 100 - clampedX },
        { ...currentCells[2], width: clampedX },
        { ...currentCells[3], x: clampedX, width: 100 - clampedX },
      ]);
    } else if (
      (selectedLayout.id.includes('classic-2-v') || currentCells.length === 2) &&
      currentCells[0].height === 100
    ) {
      // 2 Columns
      const clampedX = Math.max(15, Math.min(newX, 85));
      setCustomCells([
        { ...currentCells[0], width: clampedX },
        { ...currentCells[1], x: clampedX, width: 100 - clampedX },
      ]);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-0 flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none"
    >
      {/* Outer Canvas Box Container with Computed Pixel Dimensions */}
      <div
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          transition: 'width 0.15s ease-out, height 0.15s ease-out',
        }}
        className={`relative overflow-hidden ${getFrameClasses()}`}
      >
        {/* Background layer */}
        <div
          style={getBackgroundStyle()}
          className="absolute inset-0 w-full h-full transition-all duration-200 pointer-events-none"
        />

        {/* Inner Cells Grid Layer with Outer & Inner Margin */}
        <div
          style={{
            position: 'absolute',
            left: `${outerMarginPx}px`,
            top: `${outerMarginPx}px`,
            width: `${innerAreaW}px`,
            height: `${innerAreaH}px`,
          }}
          onClick={() => setActiveCellId(null)}
          className="relative"
        >
          {currentCells.map((cell) => {
            const assignedPhotoId = cellAssignments[cell.id];
            const photo = photos.find((p) => p.id === assignedPhotoId);
            const transform = assignedPhotoId ? photoTransforms[assignedPhotoId] : undefined;

            const cellLeft = (cell.x / 100) * innerAreaW;
            const cellTop = (cell.y / 100) * innerAreaH;
            const cellW = (cell.width / 100) * innerAreaW;
            const cellH = (cell.height / 100) * innerAreaH;

            return (
              <PhotoCell
                key={cell.id}
                cell={cell}
                photo={photo}
                transform={transform}
                cellLeft={cellLeft}
                cellTop={cellTop}
                cellW={cellW}
                cellH={cellH}
                innerMarginPx={innerMarginPx}
                cornerRadius={canvasConfig.cornerRadius}
                shadow={canvasConfig.shadow}
                isSelected={activeCellId === cell.id}
                onSelect={() => setActiveCellId(cell.id)}
                onSwap={(sId, tId) => swapCells(sId, tId)}
              />
            );
          })}

          {/* Interactive Grid Divider Handles (Video 01:08: Pill buttons with ↕ / ↔) */}
          {selectedLayout.id === 'classic-3-rows' && currentCells.length === 3 && (
            <>
              <GridDividerHandle
                type="horizontal"
                position={{ x: 50, y: currentCells[0].height }}
                onDrag={(pos) => handleDragRowDivider(1, pos.y)}
                containerRect={{ width: innerAreaW, height: innerAreaH }}
              />
              <GridDividerHandle
                type="horizontal"
                position={{ x: 50, y: currentCells[2].y }}
                onDrag={(pos) => handleDragRowDivider(2, pos.y)}
                containerRect={{ width: innerAreaW, height: innerAreaH }}
              />
            </>
          )}

          {selectedLayout.id === 'classic-3-1top-2bot' && currentCells.length === 3 && (
            <>
              <GridDividerHandle
                type="horizontal"
                position={{ x: 50, y: currentCells[0].height }}
                onDrag={(pos) => handleDragRowDivider(1, pos.y)}
                containerRect={{ width: innerAreaW, height: innerAreaH }}
              />
              <GridDividerHandle
                type="vertical"
                position={{
                  x: currentCells[1].width,
                  y: currentCells[0].height + (100 - currentCells[0].height) / 2,
                }}
                onDrag={(pos) => handleDragColDivider(1, pos.x)}
                containerRect={{ width: innerAreaW, height: innerAreaH }}
              />
            </>
          )}

          {selectedLayout.id === 'classic-3-2top-1bot' && currentCells.length === 3 && (
            <>
              <GridDividerHandle
                type="horizontal"
                position={{ x: 50, y: currentCells[0].height }}
                onDrag={(pos) => handleDragRowDivider(1, pos.y)}
                containerRect={{ width: innerAreaW, height: innerAreaH }}
              />
              <GridDividerHandle
                type="vertical"
                position={{
                  x: currentCells[0].width,
                  y: currentCells[0].height / 2,
                }}
                onDrag={(pos) => handleDragColDivider(1, pos.x)}
                containerRect={{ width: innerAreaW, height: innerAreaH }}
              />
            </>
          )}

          {selectedLayout.id === 'classic-3-1left-2right' && currentCells.length === 3 && (
            <>
              <GridDividerHandle
                type="vertical"
                position={{ x: currentCells[0].width, y: 50 }}
                onDrag={(pos) => handleDragColDivider(1, pos.x)}
                containerRect={{ width: innerAreaW, height: innerAreaH }}
              />
              <GridDividerHandle
                type="horizontal"
                position={{
                  x: currentCells[0].width + (100 - currentCells[0].width) / 2,
                  y: currentCells[1].height,
                }}
                onDrag={(pos) => handleDragRowDivider(1, pos.y)}
                containerRect={{ width: innerAreaW, height: innerAreaH }}
              />
            </>
          )}

          {selectedLayout.id === 'classic-3-2left-1right' && currentCells.length === 3 && (
            <>
              <GridDividerHandle
                type="vertical"
                position={{ x: currentCells[0].width, y: 50 }}
                onDrag={(pos) => handleDragColDivider(1, pos.x)}
                containerRect={{ width: innerAreaW, height: innerAreaH }}
              />
              <GridDividerHandle
                type="horizontal"
                position={{
                  x: currentCells[0].width / 2,
                  y: currentCells[0].height,
                }}
                onDrag={(pos) => handleDragRowDivider(1, pos.y)}
                containerRect={{ width: innerAreaW, height: innerAreaH }}
              />
            </>
          )}

          {selectedLayout.id === 'classic-4-2x2' && currentCells.length === 4 && (
            <>
              <GridDividerHandle
                type="horizontal"
                position={{ x: 50, y: currentCells[0].height }}
                onDrag={(pos) => handleDragRowDivider(1, pos.y)}
                containerRect={{ width: innerAreaW, height: innerAreaH }}
              />
              <GridDividerHandle
                type="vertical"
                position={{ x: currentCells[0].width, y: 50 }}
                onDrag={(pos) => handleDragColDivider(1, pos.x)}
                containerRect={{ width: innerAreaW, height: innerAreaH }}
              />
            </>
          )}

          {selectedLayout.id === 'classic-3-cols' && currentCells.length === 3 && (
            <>
              <GridDividerHandle
                type="vertical"
                position={{ x: currentCells[0].width, y: 50 }}
                onDrag={(pos) => handleDragColDivider(1, pos.x)}
                containerRect={{ width: innerAreaW, height: innerAreaH }}
              />
              <GridDividerHandle
                type="vertical"
                position={{ x: currentCells[2].x, y: 50 }}
                onDrag={(pos) => handleDragColDivider(2, pos.x)}
                containerRect={{ width: innerAreaW, height: innerAreaH }}
              />
            </>
          )}

          {(selectedLayout.id.includes('classic-2-h') || (currentCells.length === 2 && currentCells[0].width === 100)) && (
            <GridDividerHandle
              type="horizontal"
              position={{ x: 50, y: currentCells[0].height }}
              onDrag={(pos) => handleDragRowDivider(1, pos.y)}
              containerRect={{ width: innerAreaW, height: innerAreaH }}
            />
          )}

          {(selectedLayout.id.includes('classic-2-v') || (currentCells.length === 2 && currentCells[0].height === 100)) && (
            <GridDividerHandle
              type="vertical"
              position={{ x: currentCells[0].width, y: 50 }}
              onDrag={(pos) => handleDragColDivider(1, pos.x)}
              containerRect={{ width: innerAreaW, height: innerAreaH }}
            />
          )}

          {/* Text Overlays Layer */}
          <TextOverlay onEditText={onEditText} />
        </div>
      </div>
    </div>
  );
};
