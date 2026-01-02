'use client';

import { Note } from '@/types';
import { cn } from '@/lib/utils';
import { Pin } from 'lucide-react';
import { motion } from 'framer-motion';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

import { getNoteColor } from '@/lib/note-colors';

export function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={cn(
        'relative rounded-xl p-5 mb-6 border transition-all shadow-sm hover:shadow-xl cursor-pointer break-inside-avoid group overflow-hidden',
        getNoteColor(note.color)
      )}
    >
      {note.pinned && (
        <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/5 text-zinc-600">
          <Pin className="w-3.5 h-3.5 fill-current" />
        </div>
      )}
      {note.title && (
        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-2.5 leading-snug tracking-tight pr-6">
          {note.title}
        </h3>
      )}
      <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap line-clamp-[10] leading-relaxed">
        {note.textPreview || (
          <span className="italic text-zinc-400 dark:text-zinc-500 opacity-70">Empty note</span>
        )}
      </p>
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-black/5">
          {note.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-black/5 rounded-md text-[10px] font-medium text-zinc-600 uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.01] transition-colors pointer-events-none" />
    </motion.div>
  );
}
