"use client";

import React from 'react';
import { X, Undo2, Settings } from 'lucide-react';
import { useCollage } from '@/context/CollageContext';

interface TopNavbarProps {
  onClose: () => void;
  onOpenSettings: () => void;
  onSave: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onClose,
  onOpenSettings,
  onSave,
}) => {
  const { undo, canUndo } = useCollage();

  return (
    <header className="px-4 py-3 bg-white border-b border-neutral-100 flex items-center justify-between shrink-0 select-none z-30">
      {/* Left: Close ✕ and Undo ↶ (Video 00:49) */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          title="Back to Photos"
        >
          <X className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            canUndo
              ? 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
              : 'text-neutral-300 cursor-not-allowed'
          }`}
          title="Undo Last Action"
        >
          <Undo2 className="w-5 h-5" />
        </button>
      </div>

      {/* Right: Settings ⚙️ and Pink Save Button (Video 00:49) */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSettings}
          className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          title="Settings & My Projects"
        >
          <Settings className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onSave}
          className="px-5 py-1.5 rounded-full bg-[#ff2b6d] hover:bg-[#e0245e] active:scale-95 text-white text-xs font-bold shadow-sm shadow-pink-500/25 transition-all"
        >
          Save
        </button>
      </div>
    </header>
  );
};
