"use client";

import React from 'react';
import {
  LayoutGrid,
  Paintbrush,
  Smile,
  Square,
  Type,
} from 'lucide-react';
import { useCollage } from '@/context/CollageContext';
import { ActiveToolTab } from '@/types/collage';

interface BottomToolbarProps {
  onOpenTextModal: () => void;
}

export const BottomToolbar: React.FC<BottomToolbarProps> = ({ onOpenTextModal }) => {
  const { activeTab, setActiveTab } = useCollage();

  const handleTabClick = (tab: ActiveToolTab) => {
    if (tab === 'text') {
      onOpenTextModal();
    } else {
      setActiveTab(activeTab === tab ? null : tab);
    }
  };

  const tabs = [
    { id: 'collage' as ActiveToolTab, label: 'Collage', icon: LayoutGrid },
    { id: 'background' as ActiveToolTab, label: 'Background', icon: Paintbrush },
    { id: 'frame' as ActiveToolTab, label: 'Frame', icon: Square },
    { id: 'text' as ActiveToolTab, label: 'Text', icon: Type },
  ];

  return (
    <nav className="w-full bg-white border-t border-neutral-200/90 px-2 py-2 flex items-center justify-around shrink-0 select-none z-30 shadow-md">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;

        return (
          <button
            key={t.id}
            type="button"
            onClick={() => handleTabClick(t.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-150 ${
              isActive
                ? 'text-[#ff2b6d] font-bold'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-pink-50' : ''}`}>
              <Icon className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-[11px] font-medium tracking-tight">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
