"use client";

import React, { useState, useRef } from 'react';
import { Settings, Plus, Check } from 'lucide-react';
import { useCollage } from '@/context/CollageContext';
import { SAMPLE_PHOTOS, SamplePhoto } from '@/config/samplePhotos';
import { LayoutDrawer } from '@/components/picker/LayoutDrawer';
import { PhotoItem } from '@/types/collage';

interface MediaPickerProps {
  onProceedToEditor: () => void;
  onOpenSettings: () => void;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  onProceedToEditor,
  onOpenSettings,
}) => {
  const { photos, setPhotos } = useCollage();
  const [activeTab, setActiveTab] = useState<'recents' | 'favorites'>('recents');
  const [localPhotos, setLocalPhotos] = useState<PhotoItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredSamples = SAMPLE_PHOTOS.filter((p) => p.category === activeTab);

  // Handle uploaded images from user's device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: PhotoItem[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newItems.push({
        id: 'upload-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        name: file.name,
        url,
        width: 800,
        height: 800,
      });
    });

    setLocalPhotos((prev) => [...newItems, ...prev]);
    // Also auto-select the newly uploaded photos
    setPhotos([...photos, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isSelected = (id: string) => photos.some((p) => p.id === id);

  const toggleSelectPhoto = (item: PhotoItem) => {
    if (isSelected(item.id)) {
      setPhotos(photos.filter((p) => p.id !== item.id));
    } else {
      setPhotos([...photos, item]);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-white text-neutral-900 select-none overflow-hidden">
      {/* Top Header */}
      <header className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between shrink-0 bg-white">
        <div className="w-8" />
        <h1 className="text-lg font-bold text-neutral-900 tracking-tight">Select your media</h1>
        <button
          type="button"
          onClick={onOpenSettings}
          className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-100"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-neutral-700" />
        </button>
      </header>

      {/* Recents / Favorites Tabs */}
      <div className="flex items-center justify-center gap-12 py-2.5 border-b border-neutral-100 shrink-0 text-xs font-bold tracking-wider text-neutral-400">
        <button
          type="button"
          onClick={() => setActiveTab('recents')}
          className={`uppercase transition-colors ${
            activeTab === 'recents' ? 'text-black' : 'hover:text-neutral-600'
          }`}
        >
          RECENTS
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('favorites')}
          className={`uppercase transition-colors ${
            activeTab === 'favorites' ? 'text-black' : 'hover:text-neutral-600'
          }`}
        >
          FAVORITES
        </button>
      </div>

      {/* Media Grid: Upload Button + Photos */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5">
          {/* Device Upload Button Tile */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 hover:border-[#ff2b6d] hover:bg-pink-50/20 transition-all flex flex-col items-center justify-center gap-1.5 text-neutral-500 hover:text-[#ff2b6d]"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">Upload</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* User Uploaded Photos */}
          {localPhotos.map((photo) => {
            const selected = isSelected(photo.id);
            return (
              <div
                key={photo.id}
                onClick={() => toggleSelectPhoto(photo)}
                className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-neutral-100 transition-all duration-150 ${
                  selected ? 'ring-3 ring-[#ff2b6d] scale-[0.98]' : 'hover:opacity-95'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover pointer-events-none"
                  loading="lazy"
                />
                {selected && (
                  <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-[#ff2b6d] text-white flex items-center justify-center shadow-md animate-in zoom-in-50 duration-150">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Built-in Sample Photos (Cats, Food, Scenery matching video) */}
          {filteredSamples.map((sample) => {
            const photoItem: PhotoItem = {
              id: sample.id,
              name: sample.name,
              url: sample.url,
              width: 800,
              height: 800,
            };
            const selected = isSelected(sample.id);

            return (
              <div
                key={sample.id}
                onClick={() => toggleSelectPhoto(photoItem)}
                className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-neutral-100 transition-all duration-150 ${
                  selected ? 'ring-3 ring-[#ff2b6d] scale-[0.98]' : 'hover:opacity-95'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-full h-full object-cover pointer-events-none"
                  loading="lazy"
                />
                {selected && (
                  <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-[#ff2b6d] text-white flex items-center justify-center shadow-md animate-in zoom-in-50 duration-150">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Expandable Bottom Drawer with CLASSIC & STYLISH Layouts */}
      <LayoutDrawer onNext={onProceedToEditor} />
    </div>
  );
};
