"use client";

import React, { useState } from 'react';
import {
  ChevronLeft,
  Download,
  Share2,
  CheckCircle2,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCollage } from '@/context/CollageContext';
import { renderCollageToBlob } from '@/lib/canvasExporter';
import { saveProject, urlToBase64 } from '@/lib/storage';
import { CollageProject } from '@/types/collage';

interface ExportScreenProps {
  onBack: () => void;
}

export const ExportScreen: React.FC<ExportScreenProps> = ({ onBack }) => {
  const collage = useCollage();
  const [isExporting, setIsExporting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Trigger high-res rendering and direct download
  const handleSave = async () => {
    setIsExporting(true);
    try {
      const blob = await renderCollageToBlob({
        layout: collage.selectedLayout,
        photos: collage.photos,
        cellAssignments: collage.cellAssignments,
        photoTransforms: collage.photoTransforms,
        canvasConfig: collage.canvasConfig,
        backgroundConfig: collage.backgroundConfig,
        textElements: collage.textElements,
        stickerElements: collage.stickerElements,
        frameConfig: collage.frameConfig,
      });

      // Trigger direct file download
      const filename = `collage-${Date.now()}.png`;
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      // Save to IndexedDB Project History
      const convertedPhotos = await Promise.all(
        collage.photos.map(async (p) => ({
          id: p.id,
          name: p.name,
          dataUrl: await urlToBase64(p.url),
        }))
      );

      const project: CollageProject = {
        id: 'proj-' + Date.now(),
        title: `Collage ${new Date().toLocaleDateString()}`,
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

      await saveProject(project);

      // Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff2b6d', '#8b5cf6', '#3b82f6', '#f59e0b'],
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export collage. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Trigger Native Web Share API
  const handleShare = async () => {
    setIsExporting(true);
    try {
      const blob = await renderCollageToBlob({
        layout: collage.selectedLayout,
        photos: collage.photos,
        cellAssignments: collage.cellAssignments,
        photoTransforms: collage.photoTransforms,
        canvasConfig: collage.canvasConfig,
        backgroundConfig: collage.backgroundConfig,
        textElements: collage.textElements,
        stickerElements: collage.stickerElements,
        frameConfig: collage.frameConfig,
      });

      const file = new File([blob], `collage-${Date.now()}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My Photo Collage',
          text: 'Created with College Gen Photo Collage App',
          files: [file],
        });
      } else {
        // Fallback: download
        handleSave();
      }
    } catch (err) {
      console.error('Share error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#f8f9fa] text-neutral-900 select-none overflow-hidden">
      {/* Top Bar with Back Button (Video 02:57) */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-neutral-200/70 bg-white">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-semibold text-neutral-700 hover:text-[#ff2b6d] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h1 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Save & Share</h1>

        <div className="w-12" />
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 overflow-y-auto">
        {/* Success toast alert */}
        {savedSuccess && (
          <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-full shadow-lg text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Saved in high resolution & added to Project History!</span>
          </div>
        )}

        {/* Action Circles (Video 02:57) */}
        <div className="flex items-center gap-10">
          {/* 1. SAVE BUTTON (Large Pink Circle) */}
          <div className="flex flex-col items-center gap-2.5">
            <button
              type="button"
              disabled={isExporting}
              onClick={handleSave}
              className="w-20 h-20 rounded-full bg-[#ff2b6d] text-white flex items-center justify-center shadow-xl shadow-pink-500/30 hover:bg-[#e0245e] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
              title="Save Image"
            >
              {isExporting ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <Download className="w-8 h-8 stroke-[2.5]" />
              )}
            </button>
            <span className="text-xs font-bold text-neutral-800 tracking-wider uppercase">Save</span>
          </div>

          {/* 2. SHARE BUTTON (Large Dark Purple Circle) */}
          <div className="flex flex-col items-center gap-2.5">
            <button
              type="button"
              disabled={isExporting}
              onClick={handleShare}
              className="w-20 h-20 rounded-full bg-[#4a47a3] text-white flex items-center justify-center shadow-xl shadow-indigo-900/20 hover:bg-[#3d3a8e] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
              title="Share Collage"
            >
              {isExporting ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <Share2 className="w-8 h-8 stroke-[2.5]" />
              )}
            </button>
            <span className="text-xs font-bold text-neutral-800 tracking-wider uppercase">Share</span>
          </div>
        </div>

        {/* Social Media Presets Row (Video 02:57) */}
        <div className="w-full max-w-sm pt-6 border-t border-neutral-200/80 flex flex-col gap-4">
          <div className="text-[11px] font-bold text-neutral-400 text-center uppercase tracking-wider">
            Quick Social Export
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            {/* Instagram Story */}
            <button
              type="button"
              onClick={handleShare}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-neutral-700">Story</span>
            </button>

            {/* Instagram Post */}
            <button
              type="button"
              onClick={handleShare}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 fill-none stroke-current stroke-[2]" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-neutral-700">Post</span>
            </button>

            {/* Facebook Post */}
            <button
              type="button"
              onClick={handleShare}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[#1877f2] text-white flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </div>
              <span className="text-[11px] font-medium text-neutral-700">Facebook</span>
            </button>

            {/* WhatsApp / Message */}
            <button
              type="button"
              onClick={handleShare}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-md">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-neutral-700">Message</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
