import { CollageLayout } from '@/types/collage';

export const CLASSIC_LAYOUTS: CollageLayout[] = [
  // --- 1 PHOTO ---
  {
    id: 'classic-1-1',
    name: 'Single Full',
    type: 'classic',
    photoCount: 1,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 100, height: 100 },
    ],
  },

  // --- 2 PHOTOS ---
  {
    id: 'classic-2-v50',
    name: '2 Columns 50:50',
    type: 'classic',
    photoCount: 2,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 50, height: 100 },
      { id: 'c2', x: 50, y: 0, width: 50, height: 100 },
    ],
  },
  {
    id: 'classic-2-h50',
    name: '2 Rows 50:50',
    type: 'classic',
    photoCount: 2,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 100, height: 50 },
      { id: 'c2', x: 0, y: 50, width: 100, height: 50 },
    ],
  },
  {
    id: 'classic-2-v30-70',
    name: '2 Columns 30:70',
    type: 'classic',
    photoCount: 2,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 33.33, height: 100 },
      { id: 'c2', x: 33.33, y: 0, width: 66.67, height: 100 },
    ],
  },
  {
    id: 'classic-2-v70-30',
    name: '2 Columns 70:30',
    type: 'classic',
    photoCount: 2,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 66.67, height: 100 },
      { id: 'c2', x: 66.67, y: 0, width: 33.33, height: 100 },
    ],
  },
  {
    id: 'classic-2-h30-70',
    name: '2 Rows 30:70',
    type: 'classic',
    photoCount: 2,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 100, height: 33.33 },
      { id: 'c2', x: 0, y: 33.33, width: 100, height: 66.67 },
    ],
  },
  {
    id: 'classic-2-h70-30',
    name: '2 Rows 70:30',
    type: 'classic',
    photoCount: 2,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 100, height: 66.67 },
      { id: 'c2', x: 0, y: 66.67, width: 100, height: 33.33 },
    ],
  },

  // --- 3 PHOTOS ---
  {
    id: 'classic-3-rows',
    name: '3 Equal Rows',
    type: 'classic',
    photoCount: 3,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 100, height: 33.33 },
      { id: 'c2', x: 0, y: 33.33, width: 100, height: 33.34 },
      { id: 'c3', x: 0, y: 66.67, width: 100, height: 33.33 },
    ],
  },
  {
    id: 'classic-3-cols',
    name: '3 Equal Columns',
    type: 'classic',
    photoCount: 3,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 33.33, height: 100 },
      { id: 'c2', x: 33.33, y: 0, width: 33.34, height: 100 },
      { id: 'c3', x: 66.67, y: 0, width: 33.33, height: 100 },
    ],
  },
  {
    id: 'classic-3-1top-2bot',
    name: '1 Top, 2 Bottom',
    type: 'classic',
    photoCount: 3,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 100, height: 50 },
      { id: 'c2', x: 0, y: 50, width: 50, height: 50 },
      { id: 'c3', x: 50, y: 50, width: 50, height: 50 },
    ],
  },
  {
    id: 'classic-3-2top-1bot',
    name: '2 Top, 1 Bottom',
    type: 'classic',
    photoCount: 3,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 50, height: 50 },
      { id: 'c2', x: 50, y: 0, width: 50, height: 50 },
      { id: 'c3', x: 0, y: 50, width: 100, height: 50 },
    ],
  },
  {
    id: 'classic-3-1left-2right',
    name: '1 Left, 2 Right',
    type: 'classic',
    photoCount: 3,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 50, height: 100 },
      { id: 'c2', x: 50, y: 0, width: 50, height: 50 },
      { id: 'c3', x: 50, y: 50, width: 50, height: 50 },
    ],
  },
  {
    id: 'classic-3-2left-1right',
    name: '2 Left, 1 Right',
    type: 'classic',
    photoCount: 3,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 50, height: 50 },
      { id: 'c2', x: 0, y: 50, width: 50, height: 50 },
      { id: 'c3', x: 50, y: 0, width: 50, height: 100 },
    ],
  },

  // --- 4 PHOTOS ---
  {
    id: 'classic-4-grid',
    name: '2x2 Grid',
    type: 'classic',
    photoCount: 4,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 50, height: 50 },
      { id: 'c2', x: 50, y: 0, width: 50, height: 50 },
      { id: 'c3', x: 0, y: 50, width: 50, height: 50 },
      { id: 'c4', x: 50, y: 50, width: 50, height: 50 },
    ],
  },
  {
    id: 'classic-4-1left-3right',
    name: '1 Left Large, 3 Right',
    type: 'classic',
    photoCount: 4,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 60, height: 100 },
      { id: 'c2', x: 60, y: 0, width: 40, height: 33.33 },
      { id: 'c3', x: 60, y: 33.33, width: 40, height: 33.34 },
      { id: 'c4', x: 60, y: 66.67, width: 40, height: 33.33 },
    ],
  },
  {
    id: 'classic-4-1top-3bot',
    name: '1 Top Large, 3 Bottom',
    type: 'classic',
    photoCount: 4,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 100, height: 60 },
      { id: 'c2', x: 0, y: 60, width: 33.33, height: 40 },
      { id: 'c3', x: 33.33, y: 60, width: 33.34, height: 40 },
      { id: 'c4', x: 66.67, y: 60, width: 33.33, height: 40 },
    ],
  },
  {
    id: 'classic-4-cols',
    name: '4 Vertical Columns',
    type: 'classic',
    photoCount: 4,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 25, height: 100 },
      { id: 'c2', x: 25, y: 0, width: 25, height: 100 },
      { id: 'c3', x: 50, y: 0, width: 25, height: 100 },
      { id: 'c4', x: 75, y: 0, width: 25, height: 100 },
    ],
  },
  {
    id: 'classic-4-rows',
    name: '4 Horizontal Rows',
    type: 'classic',
    photoCount: 4,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 100, height: 25 },
      { id: 'c2', x: 0, y: 25, width: 100, height: 25 },
      { id: 'c3', x: 0, y: 50, width: 100, height: 25 },
      { id: 'c4', x: 0, y: 75, width: 100, height: 25 },
    ],
  },

  // --- 5 PHOTOS ---
  {
    id: 'classic-5-2top-3bot',
    name: '2 Top, 3 Bottom',
    type: 'classic',
    photoCount: 5,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 50, height: 50 },
      { id: 'c2', x: 50, y: 0, width: 50, height: 50 },
      { id: 'c3', x: 0, y: 50, width: 33.33, height: 50 },
      { id: 'c4', x: 33.33, y: 50, width: 33.34, height: 50 },
      { id: 'c5', x: 66.67, y: 50, width: 33.33, height: 50 },
    ],
  },
  {
    id: 'classic-5-3top-2bot',
    name: '3 Top, 2 Bottom',
    type: 'classic',
    photoCount: 5,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 33.33, height: 50 },
      { id: 'c2', x: 33.33, y: 0, width: 33.34, height: 50 },
      { id: 'c3', x: 66.67, y: 0, width: 33.33, height: 50 },
      { id: 'c4', x: 0, y: 50, width: 50, height: 50 },
      { id: 'c5', x: 50, y: 50, width: 50, height: 50 },
    ],
  },
  {
    id: 'classic-5-1center-4corners',
    name: 'Center Focus + 4 Corners',
    type: 'classic',
    photoCount: 5,
    cells: [
      { id: 'c1', x: 25, y: 25, width: 50, height: 50 },
      { id: 'c2', x: 0, y: 0, width: 50, height: 25 },
      { id: 'c3', x: 50, y: 0, width: 50, height: 25 },
      { id: 'c4', x: 0, y: 75, width: 50, height: 25 },
      { id: 'c5', x: 50, y: 75, width: 50, height: 25 },
    ],
  },

  // --- 6 PHOTOS ---
  {
    id: 'classic-6-3x2',
    name: '3x2 Grid',
    type: 'classic',
    photoCount: 6,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 33.33, height: 50 },
      { id: 'c2', x: 33.33, y: 0, width: 33.34, height: 50 },
      { id: 'c3', x: 66.67, y: 0, width: 33.33, height: 50 },
      { id: 'c4', x: 0, y: 50, width: 33.33, height: 50 },
      { id: 'c5', x: 33.33, y: 50, width: 33.34, height: 50 },
      { id: 'c6', x: 66.67, y: 50, width: 33.33, height: 50 },
    ],
  },
  {
    id: 'classic-6-2x3',
    name: '2x3 Grid',
    type: 'classic',
    photoCount: 6,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 50, height: 33.33 },
      { id: 'c2', x: 50, y: 0, width: 50, height: 33.33 },
      { id: 'c3', x: 0, y: 33.33, width: 50, height: 33.34 },
      { id: 'c4', x: 50, y: 33.33, width: 50, height: 33.34 },
      { id: 'c5', x: 0, y: 66.67, width: 50, height: 33.33 },
      { id: 'c6', x: 50, y: 66.67, width: 50, height: 33.33 },
    ],
  },
  {
    id: 'classic-6-1large-5small',
    name: '1 Large Top, 5 Bottom',
    type: 'classic',
    photoCount: 6,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 100, height: 60 },
      { id: 'c2', x: 0, y: 60, width: 20, height: 40 },
      { id: 'c3', x: 20, y: 60, width: 20, height: 40 },
      { id: 'c4', x: 40, y: 60, width: 20, height: 40 },
      { id: 'c5', x: 60, y: 60, width: 20, height: 40 },
      { id: 'c6', x: 80, y: 60, width: 20, height: 40 },
    ],
  },

  // --- 7 PHOTOS ---
  {
    id: 'classic-7-mosaic',
    name: '3 Top, 4 Bottom',
    type: 'classic',
    photoCount: 7,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 33.33, height: 50 },
      { id: 'c2', x: 33.33, y: 0, width: 33.34, height: 50 },
      { id: 'c3', x: 66.67, y: 0, width: 33.33, height: 50 },
      { id: 'c4', x: 0, y: 50, width: 25, height: 50 },
      { id: 'c5', x: 25, y: 50, width: 25, height: 50 },
      { id: 'c6', x: 50, y: 50, width: 25, height: 50 },
      { id: 'c7', x: 75, y: 50, width: 25, height: 50 },
    ],
  },

  // --- 8 PHOTOS ---
  {
    id: 'classic-8-grid',
    name: '4x2 Grid',
    type: 'classic',
    photoCount: 8,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 25, height: 50 },
      { id: 'c2', x: 25, y: 0, width: 25, height: 50 },
      { id: 'c3', x: 50, y: 0, width: 25, height: 50 },
      { id: 'c4', x: 75, y: 0, width: 25, height: 50 },
      { id: 'c5', x: 0, y: 50, width: 25, height: 50 },
      { id: 'c6', x: 25, y: 50, width: 25, height: 50 },
      { id: 'c7', x: 50, y: 50, width: 25, height: 50 },
      { id: 'c8', x: 75, y: 50, width: 25, height: 50 },
    ],
  },

  // --- 9 PHOTOS ---
  {
    id: 'classic-9-3x3',
    name: '3x3 Grid',
    type: 'classic',
    photoCount: 9,
    cells: [
      { id: 'c1', x: 0, y: 0, width: 33.33, height: 33.33 },
      { id: 'c2', x: 33.33, y: 0, width: 33.34, height: 33.33 },
      { id: 'c3', x: 66.67, y: 0, width: 33.33, height: 33.33 },
      { id: 'c4', x: 0, y: 33.33, width: 33.33, height: 33.34 },
      { id: 'c5', x: 33.33, y: 33.33, width: 33.34, height: 33.34 },
      { id: 'c6', x: 66.67, y: 33.33, width: 33.33, height: 33.34 },
      { id: 'c7', x: 0, y: 66.67, width: 33.33, height: 33.33 },
      { id: 'c8', x: 33.33, y: 66.67, width: 33.34, height: 33.33 },
      { id: 'c9', x: 66.67, y: 66.67, width: 33.33, height: 33.33 },
    ],
  },
  {
    id: 'classic-9-center-large',
    name: '1 Center Large + 8 Surrounding',
    type: 'classic',
    photoCount: 9,
    cells: [
      { id: 'c1', x: 25, y: 25, width: 50, height: 50 },
      { id: 'c2', x: 0, y: 0, width: 25, height: 25 },
      { id: 'c3', x: 25, y: 0, width: 50, height: 25 },
      { id: 'c4', x: 75, y: 0, width: 25, height: 25 },
      { id: 'c5', x: 0, y: 25, width: 25, height: 50 },
      { id: 'c6', x: 75, y: 25, width: 25, height: 50 },
      { id: 'c7', x: 0, y: 75, width: 25, height: 25 },
      { id: 'c8', x: 25, y: 75, width: 50, height: 25 },
      { id: 'c9', x: 75, y: 75, width: 25, height: 25 },
    ],
  },
];
