"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  FolderOpen,
  Plus,
  Check,
  Trash2,
  Clock,
  LayoutGrid,
  ArrowRight,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import { useCollage } from '@/context/CollageContext';
import { LayoutDrawer } from '@/components/picker/LayoutDrawer';
import { PhotoItem, CollageProject } from '@/types/collage';
import { getAllProjects, deleteProject } from '@/lib/storage';

interface MediaPickerProps {
  onProceedToEditor: () => void;
  onOpenSettings: () => void;
}

type MediaPickerTab = 'uploads' | 'projects';

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

  const [activeTab, setActiveTab] = useState<MediaPickerTab>('uploads');
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

  // Handle uploaded images from user's device with direct Base64 persistence
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const readPromises = fileList.map((file) => {
      return new Promise<PhotoItem>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            id: 'upload-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8),
            name: file.name,
            url: reader.result as string,
            width: 800,
            height: 800,
          });
        };
        reader.onerror = () => {
          // Fallback to object URL if reader fails
          resolve({
            id: 'upload-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8),
            name: file.name,
            url: URL.createObjectURL(file),
            width: 800,
            height: 800,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    const newItems = await Promise.all(readPromises);
    addUploadedPhotos(newItems);
    // Also auto-select newly uploaded photos
    setPhotos([...photos, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
      {/* Top Header: Buka app */}
      <header className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-[#ff2b6d]">
            <LayoutGrid className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h1 className="text-base font-extrabold text-neutral-900 tracking-tight">BuKa - Buat Kolase</h1>
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

      {/* 2 Clean Navigation Tabs: FOTO SAYA | PROYEK SAYA */}
      <div className="flex items-center justify-around border-b border-neutral-100 shrink-0 text-xs font-bold tracking-wider text-neutral-400 bg-neutral-50/50">
        <button
          type="button"
          onClick={() => setActiveTab('uploads')}
          className={`py-3 px-6 uppercase transition-all relative flex items-center gap-1.5 ${
            activeTab === 'uploads' ? 'text-[#ff2b6d] font-extrabold' : 'hover:text-neutral-700'
          }`}
        >
          <span>FOTO SAYA</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-200/80 text-neutral-700 font-bold">
            {uploadedPhotos.length}
          </span>
          {activeTab === 'uploads' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff2b6d]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`py-3 px-6 uppercase transition-all relative flex items-center gap-1.5 ${
            activeTab === 'projects' ? 'text-[#ff2b6d] font-extrabold' : 'hover:text-neutral-700'
          }`}
        >
          <span>PROYEK SAYA</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-200/80 text-neutral-700 font-bold">
            {projects.length}
          </span>
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

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {/* --- TAB 1: FOTO SAYA (Pure User Uploads, Saved Permanently in IndexedDB) --- */}
        {activeTab === 'uploads' && (
          <div className="flex flex-col gap-3">
            {uploadedPhotos.length === 0 ? (
              /* Empty state when user has not uploaded any photos yet */
              <div className="py-14 flex flex-col items-center justify-center text-center gap-4 px-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-3xl bg-pink-50 border-2 border-dashed border-[#ff2b6d]/40 flex items-center justify-center text-[#ff2b6d] cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-sm"
                >
                  <Upload className="w-9 h-9" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-bold text-neutral-800">Belum Ada Foto</h3>
                  <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                    Upload foto dari galeri atau kamera HP Anda. Semua foto yang Anda upload akan <b>tersimpan aman selamanya</b> di sini.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2.5 rounded-full bg-[#ff2b6d] hover:bg-[#e0245e] active:scale-95 text-white text-xs font-bold shadow-md shadow-pink-500/25 flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Upload Foto Sekarang</span>
                </button>
              </div>
            ) : (
              /* Grid of user uploaded photos */
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1">
                  <span>Foto tersimpan permanen di perangkat Anda</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#ff2b6d] font-bold hover:underline"
                  >
                    + Tambah Foto
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {/* Big Upload Tile as First Item */}
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

                        {/* Delete photo from permanent storage button */}
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
          </div>
        )}

        {/* --- TAB 2: PROYEK SAYA (Saved Collages) --- */}
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
                    Upload beberapa foto di tab &quot;Foto Saya&quot; untuk mulai membuat kolase pertama Anda!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('uploads')}
                  className="mt-2 px-5 py-2 rounded-full bg-[#ff2b6d] text-white text-xs font-bold shadow-sm"
                >
                  Upload Foto Sekarang
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
                      {/* Thumbnail Grid */}
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

      {/* Expandable Bottom Drawer with CLASSIC & STYLISH Layouts (Visible on Uploads Tab) */}
      {activeTab === 'uploads' && (
        <LayoutDrawer onNext={onProceedToEditor} />
      )}
    </div>
  );
};
