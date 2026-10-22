'use client';

import React from 'react';
import { getSubject } from '@/lib/subjects';

interface WorksheetCardProps {
  note: {
    id: string;
    title: string;
    subject: string;
    type: string;
    isHomework: boolean;
    dueDay?: string;
    pageCount: number;
    kudosCount: number;
    fileUrl?: string;
    user: {
      name: string;
      division: string;
    };
    kudos?: Array<{ userId: string }>;
    bookmarks?: Array<{ userId: string }>;
  };
  currentUserId?: string;
  onOpenPdf: (note: any) => void;
  onKudos: (noteId: string) => void;
  onBookmark?: (noteId: string) => void;
}

export default function WorksheetCard({
  note,
  currentUserId,
  onOpenPdf,
  onKudos,
  onBookmark,
}: WorksheetCardProps) {
  const subInfo = getSubject(note.subject);

  const getTypeBadge = () => {
    if (note.isHomework || note.type === 'HW') {
      return {
        label: '⏰ Due Tomorrow',
        bg: 'bg-amber-100 text-amber-900 border border-amber-300/80 font-bold dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800',
      };
    }
    if (note.type === 'SOLVED') {
      return {
        label: '✅ Solved Notes',
        bg: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
      };
    }
    return {
      label: '📝 Practice Set',
      bg: 'bg-blue-50 text-blue-800 border border-blue-200/80 font-semibold dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    };
  };

  const typeBadge = getTypeBadge();
  const hasKudoed = currentUserId && note.kudos?.some((k) => k.userId === currentUserId);
  const isBookmarked = currentUserId && note.bookmarks?.some((b) => b.userId === currentUserId);

  return (
    <article
      onClick={() => onOpenPdf(note)}
      className="border border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 p-4 transition-all cursor-pointer group shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-md"
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1.5 ${subInfo.bgBadge}`}>
          <span>{subInfo.icon}</span> <span>{subInfo.fullName}</span>
        </span>
        <span className={`text-[10px] px-2.5 py-0.5 rounded-full ${typeBadge.bg}`}>
          {typeBadge.label}
        </span>
      </div>

      {/* Google Classroom Main Item Block */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-base font-semibold text-slate-700 dark:text-zinc-300 flex-shrink-0 mt-0.5 border border-slate-200 dark:border-zinc-700">
          📄
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:underline transition leading-snug">
            {note.title}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 truncate">
            Shared by {note.user.name} ({note.user.division}) • {note.pageCount} {note.pageCount === 1 ? 'page' : 'pages'}
          </p>
        </div>
      </div>

      {/* Google Classroom Attachment Chip */}
      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 flex items-center justify-between text-xs group-hover:border-slate-300 dark:group-hover:border-zinc-600 transition">
        <div className="flex items-center gap-2.5 truncate">
          <span className="text-lg flex-shrink-0">📑</span>
          <div className="truncate">
            <span className="font-semibold text-slate-800 dark:text-zinc-200 block truncate">
              {note.title}.pdf
            </span>
            <span className="text-[10px] text-slate-500 dark:text-zinc-400">
              {note.pageCount} {note.pageCount === 1 ? 'page' : 'pages'} • PDF Worksheet
            </span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 shadow-2xs">
          View ↗
        </span>
      </div>

      {/* Card Actions Footer */}
      <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onKudos(note.id);
            }}
            title="Like this worksheet"
            className={`text-[11px] px-3 py-1 rounded-full font-bold flex items-center gap-1.5 border transition active:scale-95 ${
              hasKudoed
                ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                : 'bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border-slate-200 dark:bg-zinc-800/70 dark:text-zinc-300 dark:border-zinc-700'
            }`}
          >
            <span>❤️</span> <span>{note.kudosCount} {note.kudosCount === 1 ? 'like' : 'likes'}</span>
          </button>

          {onBookmark && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(note.id);
              }}
              className={`p-1.5 px-2.5 rounded-full border transition active:scale-95 text-xs font-semibold ${
                isBookmarked
                  ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                  : 'bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border-slate-200 dark:bg-zinc-800/70 dark:text-zinc-400 dark:border-zinc-700'
              }`}
              title="Bookmark for Exam Prep"
            >
              <span>{isBookmarked ? '🔖 Saved' : '📑 Save'}</span>
            </button>
          )}
        </div>

        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition flex items-center gap-1">
          <span>Read Sheet</span> <span>→</span>
        </span>
      </div>
    </article>
  );
}
