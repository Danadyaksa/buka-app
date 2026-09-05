"use client";

import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { useCollage } from '@/context/CollageContext';
import { loadActiveDraft, clearActiveDraft } from '@/lib/storage';
import { CollageProject } from '@/types/collage';

interface DraftRecoveryBannerProps {
  onRestore: () => void;
}

export const DraftRecoveryBanner: React.FC<DraftRecoveryBannerProps> = ({ onRestore }) => {
  const { loadProject } = useCollage();
  const [draft, setDraft] = useState<CollageProject | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkDraft = async () => {
      try {
        const savedDraft = await loadActiveDraft();
        if (savedDraft && savedDraft.photos && savedDraft.photos.length > 0) {
          setDraft(savedDraft);
        }
      } catch (err) {
        console.error('Error loading draft:', err);
      }
    };
    checkDraft();
  }, []);

  if (!draft || dismissed) return null;

  const handleResume = () => {
    loadProject(draft);
    onRestore();
    setDismissed(true);
  };

  const handleDismiss = async () => {
    await clearActiveDraft();
    setDismissed(true);
  };

  return (
    <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm animate-in slide-in-from-top-full duration-300 z-40">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-yellow-200 shrink-0" />
        <span className="font-medium">
          Draf editan terakhir ditemukan ({draft.photos.length} foto). Ingin melanjutkan?
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleResume}
          className="px-3 py-1 rounded-full bg-white text-[#ff2b6d] font-bold text-xs hover:bg-neutral-100 flex items-center gap-1 shadow-xs transition-all active:scale-95"
        >
          <span>Lanjutkan</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 text-white/80 hover:text-white rounded-full transition-colors"
          title="Abaikan draf"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
