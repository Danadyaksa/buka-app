import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { CollageProject } from '@/types/collage';

export interface StoredUserPhoto {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
  createdAt: number;
}

interface CollageDBSchema extends DBSchema {
  drafts: {
    key: string;
    value: CollageProject;
  };
  projects: {
    key: string;
    value: CollageProject;
    indexes: { 'by-updated': number };
  };
  user_photos: {
    key: string;
    value: StoredUserPhoto;
    indexes: { 'by-created': number };
  };
}

const DB_NAME = 'college-gen-db';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<CollageDBSchema>> | null = null;

function getDB() {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<CollageDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (!db.objectStoreNames.contains('drafts')) {
          db.createObjectStore('drafts');
        }
        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
          projectStore.createIndex('by-updated', 'updatedAt');
        }
        if (!db.objectStoreNames.contains('user_photos')) {
          const photoStore = db.createObjectStore('user_photos', { keyPath: 'id' });
          photoStore.createIndex('by-created', 'createdAt');
        }
      },
    });
  }
  return dbPromise;
}

/** Convert blob URL / fetch URL to persistent Base64 string */
export async function urlToBase64(url: string): Promise<string> {
  if (url.startsWith('data:')) return url;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

/** Save active draft for automatic crash recovery */
export async function saveActiveDraft(project: CollageProject): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('drafts', project, 'active-draft');
}

/** Load saved active draft */
export async function loadActiveDraft(): Promise<CollageProject | null> {
  const db = await getDB();
  if (!db) return null;
  const draft = await db.get('drafts', 'active-draft');
  return draft || null;
}

/** Clear active draft when user finishes or explicitly resets */
export async function clearActiveDraft(): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete('drafts', 'active-draft');
}

/** Save or update a project to permanent history */
export async function saveProject(project: CollageProject): Promise<string> {
  const db = await getDB();
  if (!db) return project.id;
  const toSave: CollageProject = {
    ...project,
    updatedAt: Date.now(),
  };
  await db.put('projects', toSave);
  return toSave.id;
}

/** Get all saved projects sorted by newest first */
export async function getAllProjects(): Promise<CollageProject[]> {
  const db = await getDB();
  if (!db) return [];
  const projects = await db.getAllFromIndex('projects', 'by-updated');
  return projects.reverse();
}

/** Get project by ID */
export async function getProjectById(id: string): Promise<CollageProject | null> {
  const db = await getDB();
  if (!db) return null;
  const project = await db.get('projects', id);
  return project || null;
}

/** Delete a project */
export async function deleteProject(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete('projects', id);
}

/** Export project as JSON string for backup / transfer */
export function exportProjectToJson(project: CollageProject): string {
  return JSON.stringify(project, null, 2);
}

/** Parse imported project JSON */
export function importProjectFromJson(jsonString: string): CollageProject {
  const parsed = JSON.parse(jsonString) as CollageProject;
  if (!parsed.id || !parsed.layoutId || !Array.isArray(parsed.photos)) {
    throw new Error('Invalid project file format');
  }
  return {
    ...parsed,
    id: 'proj-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    updatedAt: Date.now(),
  };
}

/** Save user uploaded photo permanently */
export async function saveUploadedPhoto(photo: {
  id: string;
  name: string;
  dataUrl: string;
  width?: number;
  height?: number;
}): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put('user_photos', {
    id: photo.id,
    name: photo.name,
    dataUrl: photo.dataUrl,
    width: photo.width || 800,
    height: photo.height || 800,
    createdAt: Date.now(),
  });
}

/** Get all user uploaded photos permanently */
export async function getUploadedPhotos(): Promise<
  Array<{ id: string; name: string; url: string; width: number; height: number }>
> {
  const db = await getDB();
  if (!db) return [];
  const items = await db.getAllFromIndex('user_photos', 'by-created');
  return items.reverse().map((item) => ({
    id: item.id,
    name: item.name,
    url: item.dataUrl,
    width: item.width,
    height: item.height,
  }));
}

/** Delete uploaded photo */
export async function deleteUploadedPhoto(id: string): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.delete('user_photos', id);
}
