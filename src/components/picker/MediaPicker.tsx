"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  FolderOpen,
  Plus,
  Check,
  Trash2,
  Clock,
  Sparkles,
  ArrowRight,
  Image as ImageIcon,
} from 'lucide-react';
import { useCollage } from '@/context/CollageContext';
import { SAMPLE_PHOTOS } from '@/config/samplePhotos';
import { LayoutDrawer } from '@/components/picker/LayoutDrawer';
import { PhotoItem, CollageProject } from '@/types/collage';
import { getAllProjects, deleteProject } from '@/lib/storage';

interface MediaPickerProps {
  onProceedToEditor: () => void;
  onOpenSettings: () => void;
}

type MediaPickerTab = 'sample' | 'uploads' | 'projects';

export const MediaPicker: React.FC<MediaPickerProps> = ({
  onProceedToEditor,
  onOpenSettings,
}) => {
  const {
    photos,
    setPhotos,
    uploadedPhotos,
    addUploadedPhotos,
    deleteUploadedPhotoById,
    loadProject,
  } = useCollage();

  const [activeTab, setActiveTab] = useState<MediaPickerTab>('sample');
  const [projects, setProjects] = useState<CollageProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch saved projects
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const list = await getAllProjects();
      setProjects(list);
    } catch (e) {
      console.error('Failed to load projects:', e);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeTab]);

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

    addUploadedPhotos(newItems);
    // Also auto-select newly uploaded photos
    setPhotos([...photos, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    // Switch to uploads tab so user sees their photos
    setActiveTab('uploads');
  };

  const isSelected = (id: string) => photos.some((p) => p.id === id);

  const toggleSelectPhoto = (item: PhotoItem) => {
    if (isSelected(item.id)) {
      setPhotos(photos.filter((p) => p.id !== item.id));
    } else {
      setPhotos([...photos, item]);
    }
  };

  const handleOpenSavedProject = (proj: CollageProject) => {
    loadProject(proj);
    onProceedToEditor();
  };

  const handleDeleteSavedProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Hapus proyek ini dari riwayat?')) {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-white text-neutral-900 select-none overflow-hidden">
      {/* Top Header */}
      <header className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-[#ff2b6d]">
            <Sparkles className="w-4 h-4" />
          </div>
          <h1 className="text-base font-bold text-neutral-900 tracking-tight">Buka Collage</h1>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center gap-1.5 transition-colors"
          title="Riwayat Karya Saya"
        >
          <FolderOpen className="w-4 h-4 text-[#ff2b6d]" />
          <span>Karya Saya ({projects.length})</span>
        </button>
      </header>

      {/* 3 Main Navigation Tabs: SAMPEL | UPLOAD SAYA | PROYEK SAYA */}
      <div className="flex items-center justify-around border-b border-neutral-100 shrink-0 text-xs font-bold tracking-wider text-neutral-400 bg-neutral-50/50">
        <button
          type="button"
          onClick={() => setActiveTab('sample')}
          className={`py-3 px-4 uppercase transition-all relative ${
            activeTab === 'sample' ? 'text-[#ff2b6d] font-extrabold' : 'hover:text-neutral-700'
          }`}
        >
          FOTO SAMPEL
          {activeTab === 'sample' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff2b6d]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('uploads')}
          className={`py-3 px-4 uppercase transition-all relative ${
            activeTab === 'uploads' ? 'text-[#ff2b6d] font-extrabold' : 'hover:text-neutral-700'
          }`}
        >
          UPLOAD SAYA ({uploadedPhotos.length})
          {activeTab === 'uploads' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff2b6d]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`py-3 px-4 uppercase transition-all relative ${
            activeTab === 'projects' ? 'text-[#ff2b6d] font-extrabold' : 'hover:text-neutral-700'
          }`}
        >
          PROYEK SAYA ({projects.length})
          {activeTab === 'projects' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff2b6d]" />
          )}
        </button>
      </div>

      {/* Hidden File Input for Device Upload */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Media Grid / Project List Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {/* --- TAB 1: FOTO SAMPEL --- */}
        {activeTab === 'sample' && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
            {/* Quick Upload Tile inside Sample view too */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 hover:border-[#ff2b6d] hover:bg-pink-50/20 transition-all flex flex-col items-center justify-center gap-1.5 text-neutral-500 hover:text-[#ff2b6d]"
            >
              <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">+ Upload Foto</span>
            </button>

            {SAMPLE_PHOTOS.map((sample) => {
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
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-neutral-100 transition-all duration-150 shadow-xs ${
                    selected ? 'ring-3 ring-[#ff2b6d] scale-[0.98]' : 'hover:opacity-90'
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
        )}

        {/* --- TAB 2: UPLOAD SAYA (Permanent User Photos) --- */}
        {activeTab === 'uploads' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
              <span>Foto yang Anda upload tersimpan otomatis di perangkat ini</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#ff2b6d] font-bold hover:underline"
              >
                + Tambah Foto
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
              {/* Upload Button Tile */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-pink-300 bg-pink-50/30 hover:border-[#ff2b6d] hover:bg-pink-50/50 transition-all flex flex-col items-center justify-center gap-1.5 text-[#ff2b6d]"
              >
                <div className="w-8 h-8 rounded-full bg-[#ff2b6d] text-white flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Upload Foto</span>
              </button>

              {uploadedPhotos.map((photo) => {
                const selected = isSelected(photo.id);
                return (
                  <div
                    key={photo.id}
                    onClick={() => toggleSelectPhoto(photo)}
                    className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-neutral-100 transition-all duration-150 shadow-xs ${
                      selected ? 'ring-3 ring-[#ff2b6d] scale-[0.98]' : 'hover:opacity-90'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover pointer-events-none"
                    />

                    {/* Delete Photo from permanent storage */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Hapus foto ini dari galeri upload?')) {
                          deleteUploadedPhotoById(photo.id);
                        }
                      }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-80 hover:opacity-100 hover:bg-red-500 transition-all"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

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
        )}

        {/* --- TAB 3: PROYEK SAYA (Saved Previous Collages) --- */}
        {activeTab === 'projects' && (
          <div className="flex flex-col gap-3">
            {projects.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center gap-3 text-neutral-400">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <FolderOpen className="w-8 h-8" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-neutral-700">Belum Ada Proyek Tersimpan</p>
                  <p className="text-xs text-neutral-400 max-w-xs">
                    Pilih beberapa foto di tab &quot;Foto Sampel&quot; atau &quot;Upload Saya&quot; untuk mulai membuat kolase!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('sample')}
                  className="mt-2 px-5 py-2 rounded-full bg-[#ff2b6d] text-white text-xs font-bold shadow-sm"
                >
                  Pilih Foto Sekarang
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {projects.map((proj) => {
                  const firstPhoto = proj.photos[0]?.dataUrl;
                  const dateStr = new Date(proj.updatedAt || proj.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <div
                      key={proj.id}
                      onClick={() => handleOpenSavedProject(proj)}
                      className="p-3 bg-neutral-50 hover:bg-pink-50/40 border border-neutral-200/80 hover:border-[#ff2b6d] rounded-2xl cursor-pointer transition-all duration-150 flex flex-col gap-3 group shadow-xs"
                    >
                      {/* Thumbnail Grid of Project Photos */}
                      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-neutral-200 relative flex items-center justify-center">
                        {firstPhoto ? (
                          <div className="w-full h-full grid grid-cols-2 gap-0.5">
                            {proj.photos.slice(0, 4).map((p, i) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                key={i}
                                src={p.dataUrl}
                                alt="preview"
                                className="w-full h-full object-cover"
                              />
                            ))}
                          </div>
                        ) : (
                          <ImageIcon className="w-8 h-8 text-neutral-400" />
                        )}
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold">
                          {proj.photos.length} Foto
                        </span>
                      </div>

                      {/* Info & Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-neutral-900 group-hover:text-[#ff2b6d] transition-colors line-clamp-1">
                            {proj.title}
                          </span>
                          <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {dateStr}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleDeleteSavedProject(proj.id, e)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Hapus Proyek"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="w-7 h-7 rounded-full bg-[#ff2b6d] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expandable Bottom Drawer with CLASSIC & STYLISH Layouts (Visible on Sample & Uploads) */}
      {activeTab !== 'projects' && (
        <LayoutDrawer onNext={onProceedToEditor} />
      )}
    </div>
  );
};
