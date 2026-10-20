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
      className="p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-sm flex items-center justify-between cursor-pointer transition"
    >
      <div className="flex items-center gap-2.5 truncate">
        <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 flex items-center justify-center text-sm font-semibold flex-shrink-0 border border-slate-200/80 dark:border-zinc-700/60">
          ⏰
        </span>
        <div className="truncate">
          <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100 block leading-tight flex items-center gap-1.5">
            <span>Homework Due Tomorrow!</span>
            <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-neutral-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold">DUE</span>
          </span>
          <span className="text-[10px] text-slate-500 dark:text-zinc-400 truncate block mt-0.5">
            {homeworkNote.title} • {homeworkNote.dueTime || '8:00 AM'}
          </span>
        </div>
      </div>
      <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-neutral-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs flex-shrink-0 ml-2 group-hover:scale-105 transition">
        Open →
      </span>
    </div>
  );
}
