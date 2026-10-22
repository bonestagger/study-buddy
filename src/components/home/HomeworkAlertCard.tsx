'use client';

import React from 'react';

interface HomeworkAlertCardProps {
  homeworkNote: {
    id: string;
    title: string;
    subject: string;
    dueDay?: string;
    dueTime?: string;
    fileUrl?: string;
  } | null;
  onOpenPdf: (note: any) => void;
}

export default function HomeworkAlertCard({
  homeworkNote,
  onOpenPdf,
}: HomeworkAlertCardProps) {
  if (!homeworkNote) return null;

  return (
    <div
      onClick={() => onOpenPdf(homeworkNote)}
      className="p-3.5 rounded-2xl border border-amber-200/80 dark:border-amber-800/50 bg-gradient-to-r from-amber-50/90 via-orange-50/80 to-amber-50/60 dark:from-amber-950/40 dark:via-zinc-900 dark:to-orange-950/30 shadow-xs hover:shadow-sm flex items-center justify-between cursor-pointer transition group"
    >
      <div className="flex items-center gap-3 truncate">
        <span className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 flex items-center justify-center text-base flex-shrink-0 border border-amber-200/60 dark:border-amber-700/50 shadow-2xs">
          ⏰
        </span>
        <div className="truncate">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 leading-tight">
            <span>Homework Due Tomorrow!</span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-extrabold tracking-wide uppercase shadow-2xs">
              DUE
            </span>
          </span>
          <span className="text-[11px] text-slate-600 dark:text-zinc-400 truncate block mt-0.5">
            {homeworkNote.title} • {homeworkNote.dueTime || '8:00 AM'}
          </span>
        </div>
      </div>
      <button
        type="button"
        className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-xs flex-shrink-0 ml-2 group-hover:scale-105 transition"
      >
        Open →
      </button>
    </div>
  );
}
