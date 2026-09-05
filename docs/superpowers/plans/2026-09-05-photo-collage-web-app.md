# Photo Collage Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 100% client-side, responsive photo collage web application reverse-engineered from the iOS app in `IMG_9833.MP4`, supporting dozens of Classic and Stylish layouts, cell pan/zoom/swap, custom sliders, typography editor with kerning & highlight boxes, IndexedDB auto-save & project history, and 4K canvas export.

**Architecture:** Hybrid CSS/SVG rendering for ultra-smooth 60fps interaction on mobile/desktop with SVG polygon `clip-path` for stylish diagonal cuts, combined with an Offscreen Canvas 2D engine for crystal-clear high-resolution (2K/4K) exports. State is managed reactively and synced to IndexedDB for auto-save recovery and project history without any backend server.

**Tech Stack:** Next.js 14/15 (App Router), React, TypeScript, Tailwind CSS, Lucide React, `idb` (IndexedDB wrapper), HTML5 Canvas 2D Context API.

**Spec:** `docs/superpowers/specs/2026-09-05-photo-collage-web-app-design.md`

## Global Constraints
- Must be 100% client-side (no external backend/server upload required).
- No paywall restrictions; all features completely unlocked.
- Mobile layout must closely replicate the look, feel, colors, and controls of the iOS video recording (`IMG_9833.MP4`).
- Accent colors: iOS vibrant pink/magenta (`#ff2b6d` / `#e11d48`) with sleek light/dark UI.
- All layouts (Classic & Stylish) must scale proportionally and preserve aspect ratios.
- Support both mobile touch gestures (touch pan, pinch-to-zoom) and desktop mouse/trackpad gestures.

---

### Task 1: Scaffolding Project & Dependencies

**Files:**
- Create: Next.js project structure in current directory
- Modify: `package.json`, `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`

**Interfaces:**
- Produces: Working Next.js development server with Tailwind CSS, Lucide icons, and `idb` installed.

- [ ] **Step 1: Initialize Git and Scaffold Next.js App**
  Run git init and scaffold Next.js App Router with TypeScript and Tailwind CSS:
  ```bash
  git init
  npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
  ```

- [ ] **Step 2: Install Supporting Dependencies**
  Install `lucide-react`, `idb`, and `canvas-confetti` (for export celebration):
  ```bash
  npm install lucide-react idb canvas-confetti
  npm install --save-dev @types/canvas-confetti
  ```

- [ ] **Step 3: Setup Custom Theme & Variables in `globals.css`**
  Configure iOS-inspired styling, pink accent tokens, touch-action utility, and hide scrollbar utilities.

- [ ] **Step 4: Verify App Builds & Runs**
  Run `npm run build` to ensure clean initial build without errors.

- [ ] **Step 5: Commit Scaffolding**
  ```bash
  git add .
  git commit -m "chore: scaffold nextjs app with tailwind and core dependencies"
  ```

---

### Task 2: Core Types, Layout Catalog & State Management

**Files:**
- Create: `src/types/collage.ts`
- Create: `src/config/layoutsClassic.ts`
- Create: `src/config/layoutsStylish.ts`
- Create: `src/config/fonts.ts`
- Create: `src/context/CollageContext.tsx`

**Interfaces:**
- Produces:
  - `CollageLayout`: `{ id: string; name: string; type: 'classic' | 'stylish'; photoCount: number; cells: CellLayout[]; previewSvg: string; }`
  - `CellLayout`: `{ id: string; x: number; y: number; width: number; height: number; clipPath?: string; }`
  - `CollageState`: Selected photos, active layout, sliders (aspectRatio, margins, radius, shadow), active tab, text elements, stickers.
  - `useCollage()` React hook providing actions: `selectPhotos`, `setLayout`, `updateSlider`, `updatePhotoTransform`, `addText`, `undo`.

- [ ] **Step 1: Define TypeScript Types in `src/types/collage.ts`**
  Define types for photo items, cell transforms, layout definitions, text overlay items, and background configuration.

- [ ] **Step 2: Implement Classic Layouts Catalog in `src/config/layoutsClassic.ts`**
  Implement 30+ classic grid templates (1 to 9+ photos, horizontal/vertical splits, 2x2, 3x3, filmstrip, asymmetrical).

- [ ] **Step 3: Implement Stylish Layouts Catalog in `src/config/layoutsStylish.ts`**
  Implement stylish polygon clip-path layouts matching the video (Diagonal slices, Chevron/Envelope, Origami triangles, Isometric 3D Cube, Parallelogram bands, Octagram cutout).

- [ ] **Step 4: Implement Font Config in `src/config/fonts.ts`**
  Configure Google Fonts links and definitions matching the fonts seen in the video (Typewriter, Bold Display, Sans, Serif, Cursive).

- [ ] **Step 5: Implement `CollageContext.tsx` with Undo Stack**
  Provide state management with `history` stack for the `↶` Undo action in the top bar.

- [ ] **Step 6: Commit Core Types and Config**
  ```bash
  git add src/types src/config src/context
  git commit -m "feat: add collage data types, classic & stylish layouts, and state context"
  ```

---

### Task 3: IndexedDB Database Service (Auto-Save & Project History)

**Files:**
- Create: `src/lib/storage.ts`
- Create: `tests/storage.test.ts` (or validation script)

**Interfaces:**
- Produces:
  - `saveDraft(state: SerializedCollageState): Promise<void>`
  - `loadDraft(): Promise<SerializedCollageState | null>`
  - `clearDraft(): Promise<void>`
  - `saveProject(project: CollageProject): Promise<string>`
  - `getAllProjects(): Promise<CollageProjectSummary[]>`
  - `getProjectById(id: string): Promise<CollageProject | null>`
  - `deleteProject(id: string): Promise<void>`

- [ ] **Step 1: Implement `src/lib/storage.ts` using `idb`**
  Create database `college-gen-db` with object stores: `drafts` and `projects`.
  Store images as Blobs / Base64 to ensure offline persistence.

- [ ] **Step 2: Implement Auto-Save debounce hook**
  Auto-save current editor state after 800ms of inactivity.

- [ ] **Step 3: Commit Storage Service**
  ```bash
  git add src/lib/storage.ts
  git commit -m "feat: implement indexeddb auto-save and project history storage"
  ```

---

### Task 4: Media Picker Screen & Expandable Layout Drawer

**Files:**
- Create: `src/components/picker/MediaPicker.tsx`
- Create: `src/components/picker/LayoutDrawer.tsx`
- Create: `src/components/picker/PhotoThumbnail.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Produces:
  - Header: "Select your media" with Settings gear and `RECENTS`/`FAVORITES` tabs.
  - Multi-select photo grid with pink checkmark badges `✓`.
  - Expandable bottom sheet with `CLASSIC` and `STYLISH` layout selector.
  - Footer: "X Photos Selected" and vibrant pink "Next >" button to proceed to editor.

- [ ] **Step 1: Build `MediaPicker.tsx` with File Upload & Sample Photos**
  Allow user to select files from device or choose from default high-res demo photos (like the cats in the video) for instant testing.

- [ ] **Step 2: Build `LayoutDrawer.tsx` with Classic & Stylish Tabs**
  Implement expandable bottom sheet with SVG preview cards of layouts.

- [ ] **Step 3: Connect MediaPicker to `CollageContext` & Navigation**
  Clicking "Next >" transitions smoothly to the Editor workspace.

- [ ] **Step 4: Commit MediaPicker Components**
  ```bash
  git add src/components/picker src/app/page.tsx
  git commit -m "feat: implement media picker and expandable layout drawer"
  ```

---

### Task 5: Interactive Collage Canvas & Photo Cell Manipulation

**Files:**
- Create: `src/components/editor/CollageCanvas.tsx`
- Create: `src/components/editor/PhotoCell.tsx`
- Create: `src/components/panels/CollagePanel.tsx`
- Create: `src/components/ui/CustomSlider.tsx`

**Interfaces:**
- Produces:
  - Responsive canvas container with aspect ratio presets (`1:1`, `4:5`, `9:16`, `4:3`, `16:9`) and continuous slider.
  - PhotoCell supporting:
    - 1-finger touch / mouse drag for pan.
    - 2-finger pinch / scroll wheel for zoom with clamped boundaries.
    - Drag & drop between cells to swap photos.
  - Sliders for Outer Margin (0-40px), Inner Margin (0-30px), Corner Radius (0-40px), and Shadow (0-30px).

- [ ] **Step 1: Implement `CustomSlider.tsx`**
  Build custom pink-themed slider with real-time numeric readouts matching the iOS app in the video.

- [ ] **Step 2: Implement `PhotoCell.tsx` with Gesture Handling**
  Support smooth hardware-accelerated pan and zoom with boundaries check. Support drop target for photo swap.

- [ ] **Step 3: Implement `CollageCanvas.tsx`**
  Render grid cells with dynamic margins, corner radius, SVG `clip-path` masks for Stylish layouts, and drop shadows.

- [ ] **Step 4: Implement `CollagePanel.tsx`**
  Controls for Aspect Ratio, Outer Margin, Inner Margin, Corner Radius, and Shadow with confirm checkmark `✓`.

- [ ] **Step 5: Commit Interactive Canvas & Photo Cells**
  ```bash
  git add src/components/editor src/components/panels src/components/ui
  git commit -m "feat: implement interactive collage canvas with pan, zoom, swap, and sliders"
  ```

---

### Task 6: Floating Cell Toolbar & Photo Filters

**Files:**
- Create: `src/components/editor/CellToolbar.tsx`
- Create: `src/components/editor/FilterPicker.tsx`
- Modify: `src/components/editor/CollageCanvas.tsx`

**Interfaces:**
- Produces:
  - Floating bar below canvas when cell is tapped:
    1. Replace (opens file picker)
    2. Filter (B&W, Warm, Vintage, Sepia, Vivid, Contrast)
    3. Flip Horizontal (mirror)
    4. Rotate 90° clockwise
    5. Delete (empty cell)

- [ ] **Step 1: Build `CellToolbar.tsx` matching the video (00:54)**
  Display the 5 icons cleanly underneath the active cell.

- [ ] **Step 2: Implement Actions in `CollageContext`**
  Wire Replace, Filter toggle, Flip Horizontal (`transform: scaleX(-1)`), Rotate 90° (`rotate + 90`), and Delete.

- [ ] **Step 3: Commit Cell Toolbar**
  ```bash
  git add src/components/editor
  git commit -m "feat: implement floating cell toolbar with replace, filter, flip, rotate, and delete"
  ```

---

### Task 7: Text Editor Modal & Typography Overlay

**Files:**
- Create: `src/components/editor/TextOverlay.tsx`
- Create: `src/components/panels/TextEditorModal.tsx`
- Create: `src/components/panels/FontPicker.tsx`
- Create: `src/components/panels/TextColorPicker.tsx`

**Interfaces:**
- Produces:
  - Full modal text editor matching video (01:46 - 02:49):
    - Sub-modes: Keyboard typing, Font list (`Aa`), Kerning slider (`🎚️`), Color & highlight style (`A`).
    - Kerning slider adjusting `letter-spacing` dynamically.
    - Highlight styles: None, Solid pill/box highlight, Pattern highlight.
  - On-canvas draggable, resizable, rotatable text item with bounding box controls.

- [ ] **Step 1: Implement `TextEditorModal.tsx`**
  Create modal with Cancel (`✕`) and Save (`✓`) header, and bottom sub-mode tabs.

- [ ] **Step 2: Implement Font Family Picker & Letter Spacing Slider**
  Provide Google Fonts (American Typewriter style, Display, Sans, Serif, Cursive) and real-time kerning slider.

- [ ] **Step 3: Implement Text Background Highlight Styles**
  Add pill box with rounded corners and color/pattern options.

- [ ] **Step 4: Implement `TextOverlay.tsx` for Canvas Interaction**
  Render text overlay with drag to move, pinch/handle to resize & rotate, double click to edit.

- [ ] **Step 5: Commit Text Editor & Overlay**
  ```bash
  git add src/components/editor src/components/panels
  git commit -m "feat: implement text editor modal with font picker, kerning slider, and canvas overlay"
  ```

---

### Task 8: Background, Frame, and Sticker Panels

**Files:**
- Create: `src/components/panels/BackgroundPanel.tsx`
- Create: `src/components/panels/FramePanel.tsx`
- Create: `src/components/panels/StickerPanel.tsx`
- Create: `src/components/editor/StickerOverlay.tsx`

**Interfaces:**
- Produces:
  - Background options: solid colors, modern gradients, textures/patterns, and blurred photo backdrop.
  - Frame options: Polaroid frame, filmstrip, vintage border, clean minimalist mat.
  - Sticker options: aesthetic stickers, pins, tape, emojis draggable on canvas.

- [ ] **Step 1: Implement `BackgroundPanel.tsx`**
  Color swatches, gradient picker, patterns, and blur background toggle.

- [ ] **Step 2: Implement `FramePanel.tsx` & Canvas Frame Rendering**
  Decorative borders and polaroid framing.

- [ ] **Step 3: Implement `StickerPanel.tsx` & `StickerOverlay.tsx`**
  Aesthetic stickers with draggable, resizable, and rotatable controls.

- [ ] **Step 4: Commit Background, Frame, and Sticker Panels**
  ```bash
  git add src/components/panels src/components/editor
  git commit -m "feat: implement background panel, frame borders, and sticker overlays"
  ```

---

### Task 9: 4K Offscreen Canvas Exporter & Save/Share Screen

**Files:**
- Create: `src/lib/canvasExporter.ts`
- Create: `src/components/export/ExportScreen.tsx`
- Create: `src/components/export/ShareModal.tsx`

**Interfaces:**
- Produces:
  - `renderCollageToBlob(state: CollageState, options: ExportOptions): Promise<Blob>`
  - Save/Share Screen matching video (02:57):
    - `< Back` button
    - Large Pink "Save" button (direct high-res download)
    - Large Purple "Share" button (Web Share API)
    - Preset shortcuts for Instagram Story (9:16), Post (1:1), Facebook, WhatsApp.

- [ ] **Step 1: Implement `canvasExporter.ts`**
  Build high-res render pipeline (2048x2048 / 4K):
  - Draw background (color / gradient / pattern / blur image)
  - Draw each cell with clipping paths (supports rects and SVG polygon shapes for Stylish layouts)
  - Draw inner/outer margins, corner radii, and drop shadows
  - Draw text overlays with fonts, letter-spacing, and background highlight boxes
  - Draw stickers and frames
  - Export to crisp PNG/JPEG blob

- [ ] **Step 2: Implement `ExportScreen.tsx`**
  Match the exact UI from the video with large circular Save/Share buttons and social shortcuts. Trigger confetti on successful save.

- [ ] **Step 3: Connect Web Share API & Direct File Download**
  Support downloading to camera roll/downloads and native sharing on mobile.

- [ ] **Step 4: Commit Exporter & Share Screen**
  ```bash
  git add src/lib/canvasExporter.ts src/components/export
  git commit -m "feat: implement 4K canvas exporter and export/share screen"
  ```

---

### Task 10: "Karya Saya" (Project History Gallery) & Auto-Save Recovery

**Files:**
- Create: `src/components/projects/ProjectsModal.tsx`
- Create: `src/components/projects/DraftRecoveryBanner.tsx`
- Modify: `src/components/ui/TopNavbar.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Produces:
  - Draft recovery banner when uncompleted work is detected on app load.
  - "Karya Saya" (My Projects) modal showing cards of previously saved collages with thumbnails, date, and actions (Open, Duplicate, Delete, Export Backup JSON).

- [ ] **Step 1: Implement `DraftRecoveryBanner.tsx`**
  Detect draft on initial load and prompt user to restore or start fresh.

- [ ] **Step 2: Implement `ProjectsModal.tsx`**
  Grid of saved projects from IndexedDB with preview thumbnails and action buttons.

- [ ] **Step 3: Connect Navbar Settings to Project Gallery**
  Add "Karya Saya / Proyek Tersimpan" entry in Settings / Top Bar.

- [ ] **Step 4: Commit Project History & Auto-Save Recovery**
  ```bash
  git add src/components/projects src/components/ui src/app/page.tsx
  git commit -m "feat: implement project history gallery and draft recovery banner"
  ```

---

### Task 11: Polish, Responsive Testing & Final Verification

**Files:**
- Modify: `src/app/globals.css`, layout, and components for pixel-perfect iOS styling

- [ ] **Step 1: Test Mobile Viewport (375px - 430px)**
  Verify bottom tabs, bottom sheets, sliders, and gestures feel native on mobile screens.

- [ ] **Step 2: Test Desktop / Laptop Viewport (1024px+)**
  Verify centered canvas with adaptive toolbars and responsive layout.

- [ ] **Step 3: Test Classic and Stylish Layouts**
  Verify both standard grids and diagonal/polygon cuts render and export seamlessly.

- [ ] **Step 4: Verify Full Production Build**
  Run `npm run build` and ensure zero TypeScript or Lint errors.

- [ ] **Step 5: Commit Final Polish**
  ```bash
  git add .
  git commit -m "feat: complete photo collage web app with responsive design and polish"
  ```
