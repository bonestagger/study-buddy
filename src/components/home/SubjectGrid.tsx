'use client';

import React, { useState } from 'react';
import { SUBJECTS } from '@/lib/subjects';

interface SubjectGridProps {
  activeSubject: string;
  onSelectSubject: (subject: string) => void;
  totalCount: number;
}

export default function SubjectGrid({
  activeSubject,
  onSelectSubject,
  totalCount,
}: SubjectGridProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-extrabold theme-text-main">Choose Subject:</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[9px] font-bold px-1.5 py-0.5 rounded-md theme-subtle border text-slate-400 hover:theme-text-main transition"
            title="Toggle between horizontal scroll and full 11-subject grid"
          >
            {isExpanded ? 'Collapse ▴' : 'View All 11 ▾'}
          </button>
        </div>

        <button
          onClick={() => onSelectSubject('ALL')}
          className={`text-[10px] font-bold hover:underline transition ${
            activeSubject === 'ALL' ? 'accent-text underline font-extrabold' : 'theme-text-muted'
          }`}
        >
          Show All ({totalCount})
        </button>
      </div>

      {isExpanded ? (
        /* Full Expanded 11-Subject Grid */
        <div className="grid grid-cols-4 gap-1.5 text-center select-none animate-fade-in">
          {SUBJECTS.map((sub) => {
            const isActive = activeSubject === sub.id;
            return (
              <button
                key={sub.id}
                data-sub={sub.id}
                onClick={() => onSelectSubject(sub.id)}
                className={`p-2 rounded-2xl flex flex-col items-center justify-center border transition active:scale-95 ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-neutral-900 dark:border-zinc-100 font-bold shadow-xs'
                    : 'bg-white dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 shadow-2xs'
                }`}
              >
                <span className="text-xl mb-0.5">{sub.icon}</span>
                <span className={`text-[10px] font-bold truncate max-w-full ${isActive ? 'text-inherit' : 'theme-text-main'}`}>
                  {sub.label}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        /* Sleek Horizontal Swipeable Cards Row */
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar scroll-smooth snap-x select-none">
          {SUBJECTS.map((sub) => {
            const isActive = activeSubject === sub.id;
            return (
              <button
                key={sub.id}
                data-sub={sub.id}
                onClick={() => onSelectSubject(sub.id)}
                className={`min-w-[70px] p-2 rounded-2xl flex flex-col items-center justify-center border transition active:scale-95 flex-shrink-0 snap-start ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-neutral-900 dark:border-zinc-100 font-bold shadow-xs'
                    : 'bg-white dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 shadow-2xs'
                }`}
              >
                <span className="text-xl mb-0.5">{sub.icon}</span>
                <span className={`text-[10px] font-bold truncate max-w-full ${isActive ? 'text-inherit' : 'theme-text-main'}`}>
                  {sub.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
