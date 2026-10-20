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
  const subBadge = {
    label: subInfo.fullName,
    icon: subInfo.icon,
  };

  const getTypeBadge = () => {
    if (note.isHomework || note.type === 'HW') {
      return {
        label: '⏰ Due Tomorrow',
        bg: 'bg-neutral-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold',
      };
    }
    if (note.type === 'SOLVED') {
      return {
        label: '✅ Solved Notes',
        bg: 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 font-medium',
      };
    }
    return {
      label: '📝 Practice Set',
      bg: 'bg-slate-50 dark:bg-zinc-800/60 text-slate-600 dark:text-zinc-400 border border-slate-200/70 dark:border-zinc-700/50 font-medium',
    };
  };

  const typeBadge = getTypeBadge();
  const hasKudoed = currentUserId && note.kudos?.some((k) => k.userId === currentUserId);
  const isBookmarked = currentUserId && note.bookmarks?.some((b) => b.userId === currentUserId);

  return (
    <article
      onClick={() => onOpenPdf(note)}
      className="border border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/90 p-3.5 transition-all cursor-pointer group shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-md"
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="px-2.5 py-0.5 rounded-full font-semibold text-[10px] flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-700/60">
          <span>{subBadge.icon}</span> <span>{subBadge.label}</span>
        </span>
        <span className={`text-[9px] px-2.5 py-0.5 rounded-full ${typeBadge.bg}`}>
          {typeBadge.label}
        </span>
      </div>

      {/* Google Classroom Main Item Block */}
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-semibold text-slate-700 dark:text-zinc-300 flex-shrink-0 mt-0.5">
          📄
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:underline transition leading-snug">
            {note.title}
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5 truncate">
            Shared by {note.user.name} ({note.user.division}) • {note.pageCount} {note.pageCount === 1 ? 'page' : 'pages'}
          </p>
        </div>
      </div>

      {/* Google Classroom Attachment Chip */}
      <div className="mt-2.5 p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/70 dark:border-zinc-700/50 flex items-center justify-between text-[10px] group-hover:border-slate-300 dark:group-hover:border-zinc-600 transition">
        <div className="flex items-center gap-2 truncate">
          <span className="text-base flex-shrink-0">📑</span>
          <div className="truncate">
            <span className="font-semibold text-slate-800 dark:text-zinc-200 block truncate">
              {note.title}.pdf
            </span>
            <span className="text-[9px] text-slate-500 dark:text-zinc-400">
              {note.pageCount} {note.pageCount === 1 ? 'page' : 'pages'} • PDF Worksheet
            </span>
          </div>
        </div>
        <span className="text-[10px] font-medium text-slate-700 dark:text-zinc-300 flex-shrink-0 ml-2 px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-2xs">
          View ↗
        </span>
      </div>

      {/* Card Actions Footer */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onKudos(note.id);
            }}
            title="Like this worksheet"
            className={`text-[10px] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-zinc-700 transition active:scale-95 ${
              hasKudoed
                ? 'bg-neutral-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-slate-50 dark:bg-zinc-800/70 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700'
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
              className={`p-1 px-2 rounded-full border border-slate-200 dark:border-zinc-700 transition active:scale-95 text-[10px] ${
                isBookmarked
                  ? 'bg-neutral-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-slate-50 dark:bg-zinc-800/70 text-slate-600 dark:text-zinc-400'
              }`}
              title="Bookmark for Exam Prep"
            >
              <span>{isBookmarked ? '🔖' : '📑'}</span>
            </button>
          )}
        </div>

        <span className="text-[10px] font-semibold text-slate-700 dark:text-zinc-300 group-hover:translate-x-0.5 transition flex items-center gap-1">
          <span>Read Sheet</span> <span>→</span>
        </span>
      </div>
    </article>
  );
}
