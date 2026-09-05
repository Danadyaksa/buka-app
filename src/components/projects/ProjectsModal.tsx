"use client";

import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  FolderOpen,
  Trash2,
  Download,
  Upload,
  Clock,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { useCollage } from '@/context/CollageContext';
import {
  getAllProjects,
  deleteProject,
  exportProjectToJson,
  importProjectFromJson,
  saveProject,
} from '@/lib/storage';
import { CollageProject } from '@/types/collage';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEditor: () => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  onOpenEditor,
}) => {
  const { loadProject } = useCollage();
  const [projects, setProjects] = useState<CollageProject[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const list = await getAllProjects();
      setProjects(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Open & Continue editing
  const handleOpenProject = (project: CollageProject) => {
    loadProject(project);
    onClose();
    onOpenEditor();
  };

  // Delete project
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Export JSON backup
  const handleExportJson = (project: CollageProject, e: React.MouseEvent) => {
    e.stopPropagation();
    const json = exportProjectToJson(project);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const imported = importProjectFromJson(text);
      await saveProject(imported);
      await fetchProjects();
      alert('Project successfully imported!');
    } catch (err) {
      alert('Failed to import project file. Invalid format.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ff2b6d]" />
            <h2 className="text-base font-bold text-neutral-900">Karya Saya (Riwayat Proyek)</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center gap-1.5 transition-colors"
              title="Import Project JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportJson}
            />

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-12 text-center text-neutral-400 text-sm">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center gap-3 text-neutral-400">
              <FolderOpen className="w-12 h-12 text-neutral-300 stroke-[1.5]" />
              <p className="text-sm font-medium text-neutral-600">Belum ada kolase yang disimpan.</p>
              <p className="text-xs text-neutral-400 max-w-xs">
                Setiap kali Anda menekan tombol Save, proyek akan otomatis tersimpan di sini secara privat tanpa server!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => handleOpenProject(proj)}
                  className="p-4 rounded-2xl border border-neutral-200 hover:border-[#ff2b6d] bg-white hover:bg-pink-50/20 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <h3 className="text-sm font-bold text-neutral-900 group-hover:text-[#ff2b6d] transition-colors">
                        {proj.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(proj.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-600">
                      {proj.photos.length} Photos
                    </span>
                  </div>

                  {/* Thumbnail snippet */}
                  <div className="flex gap-1.5 overflow-hidden h-14 rounded-lg bg-neutral-100 p-1">
                    {proj.photos.slice(0, 4).map((p, idx) => (
                      <div key={idx} className="flex-1 rounded overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.dataUrl}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-neutral-100 text-xs">
                    <span className="text-[#ff2b6d] font-bold flex items-center gap-1">
                      Buka & Edit ›
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleExportJson(proj, e)}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700"
                        title="Backup / Export JSON"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(proj.id, e)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
