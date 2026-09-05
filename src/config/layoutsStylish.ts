import { CollageLayout } from '@/types/collage';

export const STYLISH_LAYOUTS: CollageLayout[] = [
  // --- 2 PHOTOS: DIAGONAL SLICE ---
  {
    id: 'stylish-2-diag-tl-br',
    name: 'Diagonal Split TL-BR',
    type: 'stylish',
    photoCount: 2,
    cells: [
      {
        id: 'c1',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)',
      },
      {
        id: 'c2',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%)',
      },
    ],
  },
  {
    id: 'stylish-2-diag-tr-bl',
    name: 'Diagonal Split TR-BL',
    type: 'stylish',
    photoCount: 2,
    cells: [
      {
        id: 'c1',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%)',
      },
      {
        id: 'c2',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
      },
    ],
  },

  // --- 3 PHOTOS: 3-WAY TRIANGLE ORIGAMI ---
  {
    id: 'stylish-3-origami',
    name: '3-Way Origami Center',
    type: 'stylish',
    photoCount: 3,
    cells: [
      {
        id: 'c1',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(0% 0%, 100% 0%, 50% 50%)',
      },
      {
        id: 'c2',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)',
      },
      {
        id: 'c3',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%, 50% 50%)',
      },
    ],
  },

  // --- 3 PHOTOS: ISOMETRIC 3D CUBE (Video 00:32) ---
  {
    id: 'stylish-3-cube',
    name: 'Isometric 3D Cube',
    type: 'stylish',
    photoCount: 3,
    cells: [
      {
        id: 'c1',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(50% 5%, 95% 28%, 50% 50%, 5% 28%)',
      },
      {
        id: 'c2',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(5% 28%, 50% 50%, 50% 95%, 5% 72%)',
      },
      {
        id: 'c3',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(50% 50%, 95% 28%, 95% 72%, 50% 95%)',
      },
    ],
  },

  // --- 3 PHOTOS: 3 DIAGONAL STRIPES (Video 00:32) ---
  {
    id: 'stylish-3-parallelogram',
    name: '3 Diagonal Parallelograms',
    type: 'stylish',
    photoCount: 3,
    cells: [
      {
        id: 'c1',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(0% 0%, 30% 0%, 10% 100%, 0% 100%)',
      },
      {
        id: 'c2',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(35% 0%, 65% 0%, 45% 100%, 15% 100%)',
      },
      {
        id: 'c3',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(70% 0%, 100% 0%, 100% 100%, 50% 100%)',
      },
    ],
  },

  // --- 3 PHOTOS: CHEVRON / ENVELOPE (Video 00:28) ---
  {
    id: 'stylish-3-chevron',
    name: 'Chevron Envelope Split',
    type: 'stylish',
    photoCount: 3,
    cells: [
      {
        id: 'c1',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(0% 0%, 100% 0%, 50% 40%)',
      },
      {
        id: 'c2',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(0% 0%, 50% 40%, 100% 0%, 100% 60%, 50% 100%, 0% 60%)',
      },
      {
        id: 'c3',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(0% 60%, 50% 100%, 100% 60%, 100% 100%, 0% 100%)',
      },
    ],
  },

  // --- 3 PHOTOS: 3 FLOATING ROTATED SQUARES (Video 00:32) ---
  {
    id: 'stylish-3-diamonds',
    name: '3 Floating Diamonds',
    type: 'stylish',
    photoCount: 3,
    cells: [
      {
        id: 'c1',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(25% 5%, 45% 25%, 25% 45%, 5% 25%)',
      },
      {
        id: 'c2',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(75% 25%, 95% 45%, 75% 65%, 55% 45%)',
      },
      {
        id: 'c3',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(35% 55%, 55% 75%, 35% 95%, 15% 75%)',
      },
    ],
  },

  // --- 4 PHOTOS: 4-WAY X-SPLIT (Video 00:33) ---
  {
    id: 'stylish-4-x-split',
    name: '4-Way Center X Split',
    type: 'stylish',
    photoCount: 4,
    cells: [
      {
        id: 'c1',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(0% 0%, 100% 0%, 50% 50%)',
      },
      {
        id: 'c2',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(100% 0%, 100% 100%, 50% 50%)',
      },
      {
        id: 'c3',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(100% 100%, 0% 100%, 50% 50%)',
      },
      {
        id: 'c4',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(0% 100%, 0% 0%, 50% 50%)',
      },
    ],
  },

  // --- 4 PHOTOS: DIAGONAL QUARTERS ---
  {
    id: 'stylish-4-diagonal-quarters',
    name: '4 Diagonal Quarters',
    type: 'stylish',
    photoCount: 4,
    cells: [
      {
        id: 'c1',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(0% 0%, 50% 0%, 35% 50%, 0% 40%)',
      },
      {
        id: 'c2',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(50% 0%, 100% 0%, 100% 40%, 35% 50%)',
      },
      {
        id: 'c3',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(0% 40%, 35% 50%, 50% 100%, 0% 100%)',
      },
      {
        id: 'c4',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath: 'polygon(35% 50%, 100% 40%, 100% 100%, 50% 100%)',
      },
    ],
  },

  // --- 1 PHOTO: OCTAGRAM / STAR (Video 00:28) ---
  {
    id: 'stylish-1-octagram',
    name: 'Octagram Star Cutout',
    type: 'stylish',
    photoCount: 1,
    cells: [
      {
        id: 'c1',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        clipPath:
          'polygon(50% 0%, 65% 20%, 85% 15%, 80% 35%, 100% 50%, 80% 65%, 85% 85%, 65% 80%, 50% 100%, 35% 80%, 15% 85%, 20% 65%, 0% 50%, 20% 35%, 15% 15%, 35% 20%)',
      },
    ],
  },
];
