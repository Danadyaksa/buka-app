export type FilterType = 'none' | 'bw' | 'warm' | 'vintage' | 'bright' | 'contrast' | 'sepia';

export interface PhotoTransform {
  panX: number; // percentage offset -50 to 50
  panY: number;
  scale: number; // 1.0 to 3.0
  rotate: number; // 0, 90, 180, 270
  flipH: boolean;
  filter: FilterType;
}

export interface PhotoItem {
  id: string;
  url: string; // Object URL or Base64
  name: string;
  width: number;
  height: number;
}

export interface CellLayout {
  id: string;
  x: number; // 0 to 100 (%)
  y: number; // 0 to 100 (%)
  width: number; // 0 to 100 (%)
  height: number; // 0 to 100 (%)
  clipPath?: string; // CSS clip-path polygon or path
}

export interface CollageLayout {
  id: string;
  name: string;
  type: 'classic' | 'stylish';
  photoCount: number;
  cells: CellLayout[];
}

export interface CanvasConfig {
  aspectRatio: number; // width / height (e.g. 1, 4/5, 9/16, etc.)
  aspectRatioName: string;
  outerMargin: number; // 0 to 40 px
  innerMargin: number; // 0 to 30 px
  cornerRadius: number; // 0 to 40 px
  shadow: number; // 0 to 30 px
}

export type BackgroundType = 'color' | 'gradient' | 'pattern' | 'blur';

export interface BackgroundConfig {
  type: BackgroundType;
  value: string; // hex, gradient string, or pattern identifier
  blurIntensity?: number;
}

export type TextBgStyle = 'none' | 'pill' | 'box' | 'pattern';

export interface TextOverlayItem {
  id: string;
  text: string;
  font: string;
  fontSize: number;
  color: string;
  letterSpacing: number; // px (-2 to 20)
  lineHeight: number;
  align: 'left' | 'center' | 'right';
  bgStyle: TextBgStyle;
  bgColor: string;
  bgPattern?: string;
  x: number; // 0 to 100 (%)
  y: number; // 0 to 100 (%)
  rotation: number; // degrees
}

export interface StickerOverlayItem {
  id: string;
  stickerId: string;
  svgContent: string;
  x: number; // 0 to 100 (%)
  y: number; // 0 to 100 (%)
  scale: number;
  rotation: number;
}

export type FrameType = 'none' | 'polaroid' | 'filmstrip' | 'vintage' | 'minimal';

export interface FrameConfig {
  type: FrameType;
  color: string;
}

export type ActiveToolTab = 'collage' | 'background' | 'sticker' | 'frame' | 'text';

export type CollageSubMode = 'layout' | 'ratio' | 'outerMargin' | 'innerMargin' | 'cornerRadius' | 'shadow';

export interface CollageProject {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  thumbnailUrl?: string;
  photos: {
    id: string;
    name: string;
    dataUrl: string; // Stored as base64 in IndexedDB
  }[];
  cellAssignments: Record<string, string>; // cellId -> photoId
  photoTransforms: Record<string, PhotoTransform>; // photoId -> transform
  layoutId: string;
  canvasConfig: CanvasConfig;
  backgroundConfig: BackgroundConfig;
  textElements: TextOverlayItem[];
  stickerElements: StickerOverlayItem[];
  frameConfig: FrameConfig;
}
