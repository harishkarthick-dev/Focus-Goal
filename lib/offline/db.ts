import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Task, Goal, Note, SyncOperation } from '@/types';

interface TaskyDB extends DBSchema {
  tasks: {
    key: string;
    value: Task;
    indexes: { 'by-list': string; 'by-date': number };
  };
  goals: {
    key: string;
    value: Goal;
  };
  notes: {
    key: string;
    value: Note;
  };
  syncQueue: {
    key: string;
    value: SyncOperation;
    indexes: { 'by-timestamp': number };
  };
  settings: {
    key: string;
    value: unknown;
  };
}

const DB_NAME = 'tasky-db';
const DB_VERSION = 1;

export async function initDB(): Promise<IDBPDatabase<TaskyDB>> {
  return openDB<TaskyDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('tasks')) {
        const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
        taskStore.createIndex('by-list', 'listId');
        taskStore.createIndex('by-date', 'dueDate');
      }

      if (!db.objectStoreNames.contains('goals')) {
        db.createObjectStore('goals', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('syncQueue')) {
        const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
        syncStore.createIndex('by-timestamp', 'timestamp');
      }

      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
    },
  });
}

export const dbPromise =
  typeof window !== 'undefined'
    ? initDB()
    : Promise.resolve(null as unknown as IDBPDatabase<TaskyDB>);
