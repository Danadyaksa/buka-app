"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CollageProvider, useCollage } from '@/context/CollageContext';
import { MediaPicker } from '@/components/picker/MediaPicker';
import { TopNavbar } from '@/components/ui/TopNavbar';
import { CollageCanvas } from '@/components/editor/CollageCanvas';
import { CellToolbar } from '@/components/editor/CellToolbar';
import { BottomToolbar } from '@/components/ui/BottomToolbar';
import { CollagePanel } from '@/components/panels/CollagePanel';
import { BackgroundPanel } from '@/components/panels/BackgroundPanel';
import { FramePanel } from '@/components/panels/FramePanel';
import { TextEditorModal } from '@/components/panels/TextEditorModal';
import { ExportScreen } from '@/components/export/ExportScreen';
import { ProjectsModal } from '@/components/projects/ProjectsModal';
import { saveProject, urlToBase64 } from '@/lib/storage';
import { TextOverlayItem, CollageProject } from '@/types/collage';

function MainApp() {
  const collage = useCollage();
  const [view, setView] = useState<'picker' | 'editor' | 'export'>('picker');
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [editingTextItem, setEditingTextItem] = useState<TextOverlayItem | null>(null);

  // Auto-save project to IndexedDB with 1s debounce
  const currentProjectIdRef = useRef<string | null>(null);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (view === 'editor' && collage.photos.length > 0) {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);

      autoSaveTimer.current = setTimeout(async () => {
        try {
          const convertedPhotos = await Promise.all(
            collage.photos.map(async (p) => ({
              id: p.id,
              name: p.name,
              dataUrl: await urlToBase64(p.url),
            }))
          );

          if (!currentProjectIdRef.current) {
            currentProjectIdRef.current = 'proj-' + Date.now();
          }

          const projectData: CollageProject = {
            id: currentProjectIdRef.current,
            title: `Kolase ${collage.photos.length} Foto`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            photos: convertedPhotos,
            cellAssignments: collage.cellAssignments,
            photoTransforms: collage.photoTransforms,
            layoutId: collage.selectedLayout.id,
            canvasConfig: collage.canvasConfig,
            backgroundConfig: collage.backgroundConfig,
            textElements: collage.textElements,
            stickerElements: collage.stickerElements,
            frameConfig: collage.frameConfig,
          };

          await saveProject(projectData);
        } catch (err) {
          console.error('Auto-save project error:', err);
        }
      }, 1000);
    }

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [
    view,
    collage.photos,
    collage.cellAssignments,
    collage.photoTransforms,
    collage.selectedLayout.id,
    collage.canvasConfig,
    collage.backgroundConfig,
    collage.textElements,
    collage.stickerElements,
    collage.frameConfig,
  ]);

  return (
    <div className="min-h-screen bg-neutral-900 flex justify-center">
      {/* Outer App Shell Container: Max width 640px for smartphone aspect or centered responsive frame */}
      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl min-h-screen bg-white shadow-2xl flex flex-col relative overflow-hidden">
        {/* --- VIEW 1: MEDIA PICKER --- */}
        {view === 'picker' && (
          <MediaPicker
            onProceedToEditor={() => setView('editor')}
            onOpenSettings={() => setShowProjectsModal(true)}
          />
        )}

        {/* --- VIEW 2: COLLAGE EDITOR --- */}
        {view === 'editor' && (
          <div className="flex flex-col h-screen max-h-screen bg-[#f0f2f5] overflow-hidden">
            {/* Top Navbar */}
            <TopNavbar
              onClose={() => setView('picker')}
              onOpenSettings={() => setShowProjectsModal(true)}
              onSave={() => setView('export')}
            />

            {/* Canvas Area (Middle) */}
            <div className="flex-1 min-h-0 w-full relative overflow-hidden flex flex-col items-center justify-center">
              <CollageCanvas
                onEditText={(item) => {
                  setEditingTextItem(item);
                  setShowTextModal(true);
                }}
              />
              <CellToolbar />
            </div>

            {/* Active Tool Sub-Panel */}
            <div className="shrink-0 bg-white">
              {collage.activeTab === 'collage' && <CollagePanel />}
              {collage.activeTab === 'background' && <BackgroundPanel />}
              {collage.activeTab === 'frame' && <FramePanel />}
            </div>

            {/* Bottom Navigation Toolbar */}
            <BottomToolbar
              onOpenTextModal={() => {
                setEditingTextItem(null);
                setShowTextModal(true);
              }}
            />
          </div>
        )}

        {/* --- VIEW 3: EXPORT & SHARE SCREEN --- */}
        {view === 'export' && (
          <ExportScreen onBack={() => setView('editor')} />
        )}

        {/* --- MODAL: TEXT EDITOR --- */}
        {showTextModal && (
          <TextEditorModal
            initialItem={editingTextItem}
            onSave={(itemData) => {
              if (editingTextItem) {
                collage.updateTextElement(editingTextItem.id, itemData);
              } else {
                collage.addTextElement(itemData);
              }
              setShowTextModal(false);
              setEditingTextItem(null);
            }}
            onClose={() => {
              setShowTextModal(false);
              setEditingTextItem(null);
            }}
          />
        )}

        {/* --- MODAL: KARYA SAYA (PROJECT HISTORY) --- */}
        <ProjectsModal
          isOpen={showProjectsModal}
          onClose={() => setShowProjectsModal(false)}
          onOpenEditor={() => setView('editor')}
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <CollageProvider>
      <MainApp />
    </CollageProvider>
  );
}
