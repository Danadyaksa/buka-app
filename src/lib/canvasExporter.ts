import {
  CollageLayout,
  PhotoItem,
  PhotoTransform,
  CanvasConfig,
  BackgroundConfig,
  TextOverlayItem,
  StickerOverlayItem,
  FrameConfig,
} from '@/types/collage';

interface ExportRenderInput {
  layout: CollageLayout;
  photos: PhotoItem[];
  cellAssignments: Record<string, string>;
  photoTransforms: Record<string, PhotoTransform>;
  canvasConfig: CanvasConfig;
  backgroundConfig: BackgroundConfig;
  textElements: TextOverlayItem[];
  stickerElements: StickerOverlayItem[];
  frameConfig: FrameConfig;
}

// Helper: load image safely
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Fallback: try without crossOrigin
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = reject;
      fallbackImg.src = src;
    };
    img.src = src;
  });
}

// Helper: parse polygon clip-path string into 2D points relative to width & height
function parsePolygonPoints(
  clipPathStr: string,
  width: number,
  height: number
): { x: number; y: number }[] {
  const match = clipPathStr.match(/polygon\((.*?)\)/);
  if (!match || !match[1]) return [];

  return match[1].split(',').map((coordPair) => {
    const parts = coordPair.trim().split(/\s+/);
    const xPct = parseFloat(parts[0]) / 100;
    const yPct = parseFloat(parts[1]) / 100;
    return {
      x: xPct * width,
      y: yPct * height,
    };
  });
}

/** Render entire collage to an offscreen canvas at high resolution (up to 2048px) */
export async function renderCollageToBlob(
  input: ExportRenderInput,
  targetMaxDimension = 2048,
  mimeType: 'image/png' | 'image/jpeg' = 'image/png',
  quality = 0.95
): Promise<Blob> {
  const {
    layout,
    photos,
    cellAssignments,
    photoTransforms,
    canvasConfig,
    backgroundConfig,
    textElements,
    stickerElements,
    frameConfig,
  } = input;

  // Calculate canvas dimensions based on aspect ratio
  let canvasW = targetMaxDimension;
  let canvasH = Math.round(targetMaxDimension / canvasConfig.aspectRatio);

  if (canvasH > targetMaxDimension) {
    canvasH = targetMaxDimension;
    canvasW = Math.round(targetMaxDimension * canvasConfig.aspectRatio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  const scaleFactor = canvasW / 400; // Relative scale compared to editor display

  // --- 1. DRAW BACKGROUND ---
  if (backgroundConfig.type === 'color') {
    ctx.fillStyle = backgroundConfig.value;
    ctx.fillRect(0, 0, canvasW, canvasH);
  } else if (backgroundConfig.type === 'gradient') {
    const grad = ctx.createLinearGradient(0, 0, canvasW, canvasH);
    grad.addColorStop(0, '#ff9a9e');
    grad.addColorStop(1, '#fecfef');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasW, canvasH);
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasW, canvasH);
  }

  // --- 2. DRAW PHOTO CELLS ---
  const outerMarginPx = (canvasConfig.outerMargin || 0) * scaleFactor;
  const cornerRadiusPx = (canvasConfig.cornerRadius || 0) * scaleFactor;

  const innerAreaW = canvasW - outerMarginPx * 2;
  const innerAreaH = canvasH - outerMarginPx * 2;

  // Pre-load all photo images
  const loadedImages: Record<string, HTMLImageElement> = {};
  await Promise.all(
    photos.map(async (p) => {
      try {
        loadedImages[p.id] = await loadImage(p.url);
      } catch {
        // continue if image fails
      }
    })
  );

  for (const cell of layout.cells) {
    const assignedPhotoId = cellAssignments[cell.id];
    const photo = photos.find((p) => p.id === assignedPhotoId);
    const img = assignedPhotoId ? loadedImages[assignedPhotoId] : null;
    const transform = assignedPhotoId ? photoTransforms[assignedPhotoId] : null;

    const cellLeft = outerMarginPx + (cell.x / 100) * innerAreaW;
    const cellTop = outerMarginPx + (cell.y / 100) * innerAreaH;
    const cellW = (cell.width / 100) * innerAreaW;
    const cellH = (cell.height / 100) * innerAreaH;

    ctx.save();

    // Clipping path
    if (cell.clipPath && cell.clipPath.includes('polygon')) {
      const points = parsePolygonPoints(cell.clipPath, cellW, cellH);
      if (points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(cellLeft + points[0].x, cellTop + points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(cellLeft + points[i].x, cellTop + points[i].y);
        }
        ctx.closePath();
        ctx.clip();
      }
    } else {
      // Rounded rectangle
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(cellLeft, cellTop, cellW, cellH, cornerRadiusPx);
      } else {
        ctx.rect(cellLeft, cellTop, cellW, cellH);
      }
      ctx.clip();
    }

    // Draw photo inside cell
    if (img) {
      ctx.save();
      const cx = cellLeft + cellW / 2;
      const cy = cellTop + cellH / 2;
      ctx.translate(cx, cy);

      const rotate = transform?.rotate || 0;
      if (rotate) ctx.rotate((rotate * Math.PI) / 180);

      const flipH = transform?.flipH || false;
      if (flipH) ctx.scale(-1, 1);

      const scale = transform?.scale || 1;
      const panX = ((transform?.panX || 0) / 100) * cellW;
      const panY = ((transform?.panY || 0) / 100) * cellH;

      ctx.translate(panX, panY);

      // Scale to cover cell
      const imgAspect = img.width / img.height;
      const cellAspect = cellW / cellH;
      let drawW = cellW * scale;
      let drawH = cellH * scale;

      if (imgAspect > cellAspect) {
        drawW = cellH * imgAspect * scale;
      } else {
        drawH = (cellW / imgAspect) * scale;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    } else {
      // Empty cell placeholder
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(cellLeft, cellTop, cellW, cellH);
    }

    ctx.restore();
  }

  // --- 3. DRAW TEXT OVERLAYS ---
  for (const item of textElements) {
    ctx.save();
    const tx = (item.x / 100) * canvasW;
    const ty = (item.y / 100) * canvasH;
    ctx.translate(tx, ty);

    if (item.rotation) {
      ctx.rotate((item.rotation * Math.PI) / 180);
    }

    const scaledFontSize = Math.round(item.fontSize * scaleFactor);
    ctx.font = `bold ${scaledFontSize}px ${item.font || 'sans-serif'}`;
    ctx.textAlign = (item.align as CanvasTextAlign) || 'center';
    ctx.textBaseline = 'middle';

    const textMetrics = ctx.measureText(item.text);
    const textWidth = textMetrics.width;
    const textHeight = scaledFontSize * (item.lineHeight || 1.2);

    // Draw background highlight box
    if (item.bgStyle === 'pill' || item.bgStyle === 'box') {
      ctx.fillStyle = item.bgColor || '#ff2b6d';
      const padX = (item.bgStyle === 'pill' ? 18 : 10) * scaleFactor;
      const padY = 6 * scaleFactor;
      const boxW = textWidth + padX * 2;
      const boxH = textHeight + padY * 2;
      const radius = item.bgStyle === 'pill' ? boxH / 2 : 8 * scaleFactor;

      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, radius);
      } else {
        ctx.rect(-boxW / 2, -boxH / 2, boxW, boxH);
      }
      ctx.fill();
    }

    // Draw text with kerning simulation
    ctx.fillStyle = item.color || '#ffffff';
    if (item.letterSpacing && item.letterSpacing > 0) {
      // Manual letter-spacing rendering
      const extraSpace = item.letterSpacing * scaleFactor;
      let startX = -textWidth / 2;
      if (item.align === 'left') startX = 0;
      if (item.align === 'right') startX = -textWidth;

      let currentX = startX;
      for (const char of item.text) {
        ctx.fillText(char, currentX, 0);
        currentX += ctx.measureText(char).width + extraSpace;
      }
    } else {
      ctx.fillText(item.text, 0, 0);
    }

    ctx.restore();
  }

  // --- 4. DRAW FRAME IF ANY ---
  if (frameConfig.type === 'polaroid') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 24 * scaleFactor;
    ctx.strokeRect(0, 0, canvasW, canvasH);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, canvasH - 70 * scaleFactor, canvasW, 70 * scaleFactor);
  } else if (frameConfig.type === 'filmstrip') {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 20 * scaleFactor;
    ctx.strokeRect(0, 0, canvasW, canvasH);
  } else if (frameConfig.type === 'minimal') {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 14 * scaleFactor;
    ctx.strokeRect(0, 0, canvasW, canvasH);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to generate image blob'));
      },
      mimeType,
      quality
    );
  });
}
