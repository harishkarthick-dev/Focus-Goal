import { create } from 'zustand';
import { Note } from '@/types';
import { dbPromise } from '@/lib/offline/db';
import { performLocalAction, performLocalDelete } from '@/lib/offline/actions';
import { v4 as uuidv4 } from 'uuid';
import { useUserStore } from './user.store';

interface NoteState {
  notes: Record<string, Note>;
  isLoading: boolean;

  loadNotes: () => Promise<void>;
  addNote: (
    title: string,
    content: Record<string, unknown>,
    color?: string,
    textPreview?: string
  ) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  pinNote: (id: string) => Promise<void>;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: {},
  isLoading: true,

  loadNotes: async () => {
    set({ isLoading: true });
    try {
      const db = await dbPromise;
      if (!db) return;
      const allNotes = await db.getAll('notes');
      const noteMap: Record<string, Note> = {};
      allNotes.forEach((n: Note) => {
        noteMap[n.id] = n;
      });
      set({ notes: noteMap, isLoading: false });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },

  addNote: async (title, content, color = 'yellow', textPreview = '') => {
    const { currentUser } = useUserStore.getState();
    const userId = currentUser?.id || 'guest';

    const newNote: Note = {
      id: uuidv4(),
      userId,
      title,
      content,
      textPreview,
      color,
      isChecklist: false,
      pinned: false,
      archived: false,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
    };

    set(state => ({ notes: { ...state.notes, [newNote.id]: newNote } }));
    await performLocalAction('notes', newNote, 'CREATE', 'NOTE');
  },

  updateNote: async (id, updates) => {
    const current = get().notes[id];
    if (!current) return;
    const updated = { ...current, ...updates, updatedAt: Date.now() };

    set(state => ({ notes: { ...state.notes, [id]: updated } }));
    await performLocalAction('notes', updated, 'UPDATE', 'NOTE');
  },

  deleteNote: async id => {
    set(state => {
      const n = { ...state.notes };
      delete n[id];
      return { notes: n };
    });
    await performLocalDelete('notes', id, 'NOTE');
  },

  pinNote: async id => {
    const note = get().notes[id];
    if (note) {
      await get().updateNote(id, { pinned: !note.pinned });
    }
  },
}));
