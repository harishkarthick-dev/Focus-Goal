'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { AnimatePresence, motion } from 'framer-motion';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Note } from '@/types';
import { useNoteStore } from '@/store/note.store';
import { Pin, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note;
}

import { getNoteColor, noteColors } from '@/lib/note-colors';

export function NoteEditor({ isOpen, onClose, note }: NoteEditorProps) {
  const addNote = useNoteStore(state => state.addNote);
  const updateNote = useNoteStore(state => state.updateNote);
  const deleteNote = useNoteStore(state => state.deleteNote);

  const [title, setTitle] = useState(note?.title || '');
  const [color, setColor] = useState(note?.color || 'white');
  const [pinned, setPinned] = useState(note?.pinned || false);

  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'Take a note...' })],
    immediatelyRender: false,
    content: note?.content || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-zinc dark:prose-invert focus:outline-none min-h-[150px] max-w-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400',
      },
    },
  });

  useEffect(() => {
    if (isOpen && editor) {
      setTimeout(() => {
        if (note) {
          setTitle(note.title);
          setColor(note.color);
          setPinned(note.pinned);
          editor.commands.setContent(note.content || '');
        } else {
          setTitle('');
          setColor('white');
          setPinned(false);
          editor.commands.clearContent();

          document.getElementById('note-title-input')?.focus();
        }
      }, 50);
    }
  }, [isOpen, note, editor]);

  const handleSave = () => {
    if (!editor) return;
    const content = editor.getJSON();
    const textPreview = editor.getText().slice(0, 200);
    const isEmpty = !title.trim() && !editor.getText().trim();

    if (isEmpty) {
      if (note) {
        deleteNote(note.id);
      }

      onClose();
      return;
    }

    if (note) {
      updateNote(note.id, { title, content, textPreview, color, pinned });
    } else {
      addNote(title, content, color, textPreview);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
          onClick={handleSave}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.3 }}
            className={cn(
              'w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]',
              getNoteColor(color)
            )}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-5 pb-2 shrink-0">
              <input
                id="note-title-input"
                className="w-full bg-transparent text-xl font-semibold placeholder:text-zinc-400 outline-none text-zinc-900 dark:text-zinc-100"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <button
                onClick={() => setPinned(!pinned)}
                className={cn(
                  'p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors',
                  pinned
                    ? 'text-zinc-900 dark:text-zinc-100 fill-current'
                    : 'text-zinc-400 dark:text-zinc-500'
                )}
              >
                <Pin className="w-5 h-5" />
              </button>
            </div>
            <div className="px-5 py-2 overflow-y-auto min-h-[150px] scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
              <EditorContent editor={editor} />
            </div>
            <div className="flex items-center justify-between p-3 px-5 border-t border-black/5 dark:border-white/5 shrink-0 bg-black/[0.02] dark:bg-white/[0.02]">
              <div className="flex items-center gap-1.5">
                {noteColors.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-95 relative overflow-hidden',
                      color === c
                        ? 'border-zinc-900 dark:border-zinc-100 shadow-md transform scale-105'
                        : 'border-transparent hover:shadow-sm',
                      getNoteColor(c)
                    )}
                    title={c.charAt(0).toUpperCase() + c.slice(1)}
                  ></button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {note && (
                  <button
                    onClick={() => {
                      deleteNote(note.id);
                      onClose();
                    }}
                    className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete note"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className="px-5 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-sm transition-all active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
