import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { CollageProject } from '@/types/collage';

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
}

const DB_NAME = 'college-gen-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<CollageDBSchema>> | null = null;

function getDB() {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<CollageDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('drafts')) {
          db.createObjectStore('drafts');
        }
        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
          projectStore.createIndex('by-updated', 'updatedAt');
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
