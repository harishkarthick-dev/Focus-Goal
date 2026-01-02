'use client';

import { useState } from 'react';
import { useNoteStore } from '@/store/note.store';
import { NoteCard } from '@/components/note/NoteCard';

import dynamic from 'next/dynamic';

const NoteEditor = dynamic(
  () => import('@/components/note/NoteEditor').then(mod => mod.NoteEditor),
  {
    ssr: false,
    loading: () => null,
  }
);
import { motion } from 'framer-motion';
import { Plus, StickyNote } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Note } from '@/types';
import { EmptyState } from '@/components/ui/empty-state';

export default function NotesPage() {
  const { notes, isLoading } = useNoteStore();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);

  const pinnedNotes = Object.values(notes).filter(n => !n.isDeleted && n.pinned);
  const otherNotes = Object.values(notes).filter(n => !n.isDeleted && !n.pinned);

  const openNew = () => {
    setEditingNote(undefined);
    setIsEditorOpen(true);
  };

  const openNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="pr-20 md:pr-0">
        <PageHeader
          title="Notes"
          subtitle="Ideas, lists, and daily thoughts."
          icon={StickyNote}
          iconColor="text-yellow-500"
        />
      </div>
      <motion.div
        layout
        whileHover={{ scale: 1.01, boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)' }}
        whileTap={{ scale: 0.99 }}
        onClick={openNew}
        className="max-w-xl mx-auto mb-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-zinc-200/60 p-4 flex items-center justify-between cursor-text text-zinc-500 transition-all"
      >
        <span className="font-medium text-zinc-400">Take a note...</span>
        <div className="p-1 rounded-full bg-zinc-50 border border-zinc-100">
          <Plus className="w-5 h-5 text-zinc-400" />
        </div>
      </motion.div>

      <div className="space-y-8">
        {pinnedNotes.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 pl-1">
              Pinned
            </h2>
            <div className="columns-2 md:columns-3 gap-4">
              {pinnedNotes.map(note => (
                <NoteCard key={note.id} note={note} onClick={() => openNote(note)} />
              ))}
            </div>
          </section>
        )}

        {otherNotes.length > 0 && (
          <section>
            {pinnedNotes.length > 0 && (
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 pl-1">
                Others
              </h2>
            )}
            <div className="columns-2 md:columns-3 gap-4">
              {otherNotes.map(note => (
                <NoteCard key={note.id} note={note} onClick={() => openNote(note)} />
              ))}
            </div>
          </section>
        )}

        {Object.keys(notes).length === 0 && !isLoading && (
          <EmptyState
            icon={StickyNote}
            title="Your thought canvas"
            description="Notes, ideas, and lists live here. Tap the bar above to start."
          />
        )}
      </div>

      <NoteEditor isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} note={editingNote} />
    </div>
  );
}
