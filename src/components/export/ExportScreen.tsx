"use client";

import React, { useState } from 'react';
import {
  ChevronLeft,
  Download,
  CheckCircle2,
  Loader2,
  Sparkles,
  FileImage,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCollage } from '@/context/CollageContext';
import { renderCollageToBlob } from '@/lib/canvasExporter';
import { saveProject, urlToBase64 } from '@/lib/storage';
import { CollageProject } from '@/types/collage';

interface ExportScreenProps {
  onBack: () => void;
}

type ResolutionTier = 1080 | 2048 | 3840;
type FormatType = 'image/png' | 'image/jpeg';

export const ExportScreen: React.FC<ExportScreenProps> = ({ onBack }) => {
  const collage = useCollage();
  const [resolution, setResolution] = useState<ResolutionTier>(2048);
  const [format, setFormat] = useState<FormatType>('image/png');
  const [isExporting, setIsExporting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Compute target dimensions for display
  const targetW =
    collage.canvasConfig.aspectRatio >= 1
      ? resolution
      : Math.round(resolution * collage.canvasConfig.aspectRatio);
  const targetH =
    collage.canvasConfig.aspectRatio >= 1
      ? Math.round(resolution / collage.canvasConfig.aspectRatio)
      : resolution;

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const blob = await renderCollageToBlob(
        {
          layout: collage.selectedLayout,
          customCells: collage.customCells || undefined,
          photos: collage.photos,
          cellAssignments: collage.cellAssignments,
          photoTransforms: collage.photoTransforms,
          canvasConfig: collage.canvasConfig,
          backgroundConfig: collage.backgroundConfig,
          textElements: collage.textElements,
          stickerElements: collage.stickerElements,
          frameConfig: collage.frameConfig,
        },
        resolution,
        format,
        format === 'image/jpeg' ? 0.95 : undefined
      );

      const ext = format === 'image/png' ? 'png' : 'jpg';
      const filename = `collage-${resolution}p-${Date.now()}.${ext}`;
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

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff2b6d', '#8b5cf6', '#3b82f6', '#f59e0b'],
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Export error:', err);
      alert('Gagal mengunduh gambar. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#f8f9fa] text-neutral-900 select-none overflow-hidden">
      {/* Top Bar with Back Button */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-neutral-200/70 bg-white shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-semibold text-neutral-700 hover:text-[#ff2b6d] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>

        <h1 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
          Simpan Kolase
        </h1>

        <div className="w-16" />
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6 overflow-y-auto max-w-md mx-auto w-full">
        {/* Success Alert */}
        {savedSuccess && (
          <div className="w-full flex items-center gap-2 px-4 py-3 bg-emerald-500 text-white rounded-2xl shadow-lg text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Kolase berhasil disimpan & dicatat ke Riwayat Proyek!</span>
          </div>
        )}

        {/* Big Pink Save Icon Hero */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#ff2b6d] to-[#ff6b95] text-white flex items-center justify-center shadow-xl shadow-pink-500/25">
            <Download className="w-11 h-11 stroke-[2.5]" />
          </div>
          <span className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider mt-1">
            Simpan Gambar
          </span>
          <span className="text-xs text-neutral-400 font-mono">
            {targetW} × {targetH} px
          </span>
        </div>

        {/* Resolution Options Card */}
        <div className="w-full bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs flex flex-col gap-2.5">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Pilihan Resolusi
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setResolution(1080)}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-0.5 border transition-all ${
                resolution === 1080
                  ? 'border-[#ff2b6d] bg-pink-50 text-[#ff2b6d] ring-1 ring-[#ff2b6d]'
                  : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <span>HD</span>
              <span className="text-[10px] font-normal opacity-70">1080p</span>
            </button>

            <button
              type="button"
              onClick={() => setResolution(2048)}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-0.5 border transition-all ${
                resolution === 2048
                  ? 'border-[#ff2b6d] bg-pink-50 text-[#ff2b6d] ring-1 ring-[#ff2b6d]'
                  : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <span>2K (Ultra)</span>
              <span className="text-[10px] font-normal opacity-70">2048p</span>
            </button>

            <button
              type="button"
              onClick={() => setResolution(3840)}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-0.5 border transition-all ${
                resolution === 3840
                  ? 'border-[#ff2b6d] bg-pink-50 text-[#ff2b6d] ring-1 ring-[#ff2b6d]'
                  : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <span>4K (Max)</span>
              <span className="text-[10px] font-normal opacity-70">3840p</span>
            </button>
          </div>
        </div>

        {/* Format Options Card */}
        <div className="w-full bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs flex flex-col gap-2.5">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Format File
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setFormat('image/png')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                format === 'image/png'
                  ? 'border-[#ff2b6d] bg-pink-50 text-[#ff2b6d] ring-1 ring-[#ff2b6d]'
                  : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <FileImage className="w-4 h-4" />
              <span>PNG (Kualitas Terbaik)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat('image/jpeg')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                format === 'image/jpeg'
                  ? 'border-[#ff2b6d] bg-pink-50 text-[#ff2b6d] ring-1 ring-[#ff2b6d]'
                  : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <FileImage className="w-4 h-4" />
              <span>JPEG (Ukuran Kecil)</span>
            </button>
          </div>
        </div>

        {/* Download Action Button */}
        <button
          type="button"
          disabled={isExporting}
          onClick={handleDownload}
          className="w-full py-4 rounded-2xl bg-[#ff2b6d] hover:bg-[#e0245e] active:scale-[0.98] text-white font-extrabold text-sm shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sedang Merender {resolution}p...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5 stroke-[2.5]" />
              <span>Download Gambar Sekarang</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
