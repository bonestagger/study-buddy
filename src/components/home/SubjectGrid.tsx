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
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Choose Subject:</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 transition"
            title="Toggle between horizontal scroll and full 11-subject grid"
          >
            {isExpanded ? 'Collapse ▴' : 'View All 11 ▾'}
          </button>
        </div>

        <button
          onClick={() => onSelectSubject('ALL')}
          className={`text-xs font-bold transition ${
            activeSubject === 'ALL'
              ? 'text-blue-600 dark:text-blue-400 underline font-extrabold'
              : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          Show All ({totalCount})
        </button>
      </div>

      {isExpanded ? (
        /* Full Expanded 11-Subject Grid */
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-center select-none animate-fade-in">
          {SUBJECTS.map((sub) => {
            const isActive = activeSubject === sub.id;
            return (
              <button
                key={sub.id}
                data-sub={sub.id}
                onClick={() => onSelectSubject(sub.id)}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center border transition active:scale-95 ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-sm'
                    : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800/60 shadow-2xs'
                }`}
              >
                <span className="text-2xl mb-1">{sub.icon}</span>
                <span className={`text-[10px] font-bold truncate max-w-full ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                  {sub.label}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        /* Sleek Horizontal Swipeable Cards Row */
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth snap-x select-none">
          {SUBJECTS.map((sub) => {
            const isActive = activeSubject === sub.id;
            return (
              <button
                key={sub.id}
                data-sub={sub.id}
                onClick={() => onSelectSubject(sub.id)}
                className={`min-w-[76px] p-2.5 rounded-2xl flex flex-col items-center justify-center border transition active:scale-95 flex-shrink-0 snap-start ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-sm'
                    : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800/60 shadow-2xs'
                }`}
              >
                <span className="text-2xl mb-1">{sub.icon}</span>
                <span className={`text-[10px] font-bold truncate max-w-full ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
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
