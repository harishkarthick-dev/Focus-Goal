import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNoteStore } from '@/store/note.store';

vi.mock('uuid', () => ({
  v4: () => 'test-note-uuid',
}));

describe('useNoteStore', () => {
  beforeEach(() => {
    useNoteStore.setState({ notes: {}, isLoading: false });
  });

  describe('initial state', () => {
    it('should have empty notes object', () => {
      const { notes } = useNoteStore.getState();
      expect(notes).toEqual({});
    });

    it('should have isLoading as false after reset', () => {
      const { isLoading } = useNoteStore.getState();
      expect(isLoading).toBe(false);
    });
  });

  describe('loadNotes', () => {
    it('should set isLoading to true when called', async () => {
      const { loadNotes } = useNoteStore.getState();

      const loadPromise = loadNotes();

      expect(useNoteStore.getState().isLoading).toBe(true);

      await loadPromise;
    });

    it('should set isLoading to false after loading', async () => {
      const { loadNotes } = useNoteStore.getState();

      await loadNotes();

      expect(useNoteStore.getState().isLoading).toBe(false);
    });
  });

  describe('addNote', () => {
    it('should add a note to the store', async () => {
      const { addNote } = useNoteStore.getState();

      await addNote('Test Note', { type: 'doc', content: [] }, 'yellow', 'Preview text');

      const { notes } = useNoteStore.getState();
      const noteValues = Object.values(notes);

      expect(noteValues).toHaveLength(1);
      expect(noteValues[0].title).toBe('Test Note');
      expect(noteValues[0].color).toBe('yellow');
      expect(noteValues[0].textPreview).toBe('Preview text');
    });

    it('should use default color if not provided', async () => {
      const { addNote } = useNoteStore.getState();

      await addNote('Test Note', { type: 'doc', content: [] });

      const { notes } = useNoteStore.getState();
      const noteValues = Object.values(notes);

      expect(noteValues[0].color).toBe('yellow');
    });

    it('should use default empty textPreview if not provided', async () => {
      const { addNote } = useNoteStore.getState();

      await addNote('Test Note', { type: 'doc', content: [] });

      const { notes } = useNoteStore.getState();
      const noteValues = Object.values(notes);

      expect(noteValues[0].textPreview).toBe('');
    });

    it('should set isDeleted to false', async () => {
      const { addNote } = useNoteStore.getState();

      await addNote('Test Note', { type: 'doc', content: [] });

      const { notes } = useNoteStore.getState();
      const noteValues = Object.values(notes);

      expect(noteValues[0].isDeleted).toBe(false);
    });

    it('should set pinned to false', async () => {
      const { addNote } = useNoteStore.getState();

      await addNote('Test Note', { type: 'doc', content: [] });

      const { notes } = useNoteStore.getState();
      const noteValues = Object.values(notes);

      expect(noteValues[0].pinned).toBe(false);
    });

    it('should set archived to false', async () => {
      const { addNote } = useNoteStore.getState();

      await addNote('Test Note', { type: 'doc', content: [] });

      const { notes } = useNoteStore.getState();
      const noteValues = Object.values(notes);

      expect(noteValues[0].archived).toBe(false);
    });

    it('should have timestamps', async () => {
      const beforeTime = Date.now();
      const { addNote } = useNoteStore.getState();

      await addNote('Test Note', { type: 'doc', content: [] });

      const afterTime = Date.now();
      const { notes } = useNoteStore.getState();
      const noteValues = Object.values(notes);

      expect(noteValues[0].createdAt).toBeGreaterThanOrEqual(beforeTime);
      expect(noteValues[0].createdAt).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('updateNote', () => {
    it('should update an existing note', async () => {
      useNoteStore.setState({
        notes: {
          'note-1': {
            id: 'note-1',
            userId: 'guest',
            title: 'Original Title',
            content: { type: 'doc', content: [] },
            color: 'white',
            isChecklist: false,
            pinned: false,
            archived: false,
            tags: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isDeleted: false,
          },
        },
      });

      const { updateNote } = useNoteStore.getState();
      await updateNote('note-1', { title: 'Updated Title', color: 'blue' });

      const { notes } = useNoteStore.getState();
      expect(notes['note-1'].title).toBe('Updated Title');
      expect(notes['note-1'].color).toBe('blue');
    });

    it('should not update non-existent note', async () => {
      const { updateNote } = useNoteStore.getState();
      await updateNote('non-existent', { title: 'New Title' });

      const { notes } = useNoteStore.getState();
      expect(Object.keys(notes)).toHaveLength(0);
    });

    it('should update the updatedAt timestamp', async () => {
      const originalTime = Date.now() - 10000;
      useNoteStore.setState({
        notes: {
          'note-1': {
            id: 'note-1',
            userId: 'guest',
            title: 'Original Title',
            content: { type: 'doc', content: [] },
            color: 'white',
            isChecklist: false,
            pinned: false,
            archived: false,
            tags: [],
            createdAt: originalTime,
            updatedAt: originalTime,
            isDeleted: false,
          },
        },
      });

      const beforeUpdate = Date.now();
      const { updateNote } = useNoteStore.getState();
      await updateNote('note-1', { title: 'Updated' });

      const { notes } = useNoteStore.getState();
      expect(notes['note-1'].updatedAt).toBeGreaterThanOrEqual(beforeUpdate);
    });
  });

  describe('deleteNote', () => {
    it('should delete a note from the store', async () => {
      useNoteStore.setState({
        notes: {
          'note-1': {
            id: 'note-1',
            userId: 'guest',
            title: 'Test Note',
            content: { type: 'doc', content: [] },
            color: 'white',
            isChecklist: false,
            pinned: false,
            archived: false,
            tags: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isDeleted: false,
          },
        },
      });

      const { deleteNote } = useNoteStore.getState();
      await deleteNote('note-1');

      const { notes } = useNoteStore.getState();
      expect(Object.keys(notes)).toHaveLength(0);
    });

    it('should only delete specified note', async () => {
      useNoteStore.setState({
        notes: {
          'note-1': {
            id: 'note-1',
            userId: 'guest',
            title: 'Note 1',
            content: { type: 'doc', content: [] },
            color: 'white',
            isChecklist: false,
            pinned: false,
            archived: false,
            tags: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isDeleted: false,
          },
          'note-2': {
            id: 'note-2',
            userId: 'guest',
            title: 'Note 2',
            content: { type: 'doc', content: [] },
            color: 'blue',
            isChecklist: false,
            pinned: false,
            archived: false,
            tags: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isDeleted: false,
          },
        },
      });

      const { deleteNote } = useNoteStore.getState();
      await deleteNote('note-1');

      const { notes } = useNoteStore.getState();
      expect(Object.keys(notes)).toHaveLength(1);
      expect(notes['note-2']).toBeDefined();
      expect(notes['note-1']).toBeUndefined();
    });
  });

  describe('pinNote', () => {
    it('should toggle pin status to true', async () => {
      useNoteStore.setState({
        notes: {
          'note-1': {
            id: 'note-1',
            userId: 'guest',
            title: 'Test Note',
            content: { type: 'doc', content: [] },
            color: 'white',
            isChecklist: false,
            pinned: false,
            archived: false,
            tags: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isDeleted: false,
          },
        },
      });

      const { pinNote } = useNoteStore.getState();
      await pinNote('note-1');

      const { notes } = useNoteStore.getState();
      expect(notes['note-1'].pinned).toBe(true);
    });

    it('should toggle pin status to false if already pinned', async () => {
      useNoteStore.setState({
        notes: {
          'note-1': {
            id: 'note-1',
            userId: 'guest',
            title: 'Test Note',
            content: { type: 'doc', content: [] },
            color: 'white',
            isChecklist: false,
            pinned: true,
            archived: false,
            tags: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isDeleted: false,
          },
        },
      });

      const { pinNote } = useNoteStore.getState();
      await pinNote('note-1');

      const { notes } = useNoteStore.getState();
      expect(notes['note-1'].pinned).toBe(false);
    });

    it('should not throw on non-existent note', async () => {
      const { pinNote } = useNoteStore.getState();
      await expect(pinNote('non-existent')).resolves.not.toThrow();
    });
  });
});
