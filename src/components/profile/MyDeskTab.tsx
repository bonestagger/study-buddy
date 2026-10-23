'use client';

import React from 'react';
import { calculateRank, getNextRank } from '@/lib/ranks';

interface MyDeskTabProps {
  user: {
    id: string;
    name: string;
    division: string;
    rollNumber: string;
    motto: string;
    xp: number;
    rankTitle: string;
    pfpType: string;
    pfpValue: string;
  };
  bookmarks: Array<{
    id: string;
    note: {
      id: string;
      title: string;
      subject: string;
      fileUrl?: string;
      user: {
        name: string;
        division: string;
      };
    };
  }>;
  onOpenSettings: () => void;
  onOpenPdf: (note: any) => void;
}

export default function MyDeskTab({
  user,
  bookmarks,
  onOpenSettings,
  onOpenPdf,
}: MyDeskTabProps) {
  const currentRank = calculateRank(user.xp);
  const nextRank = getNextRank(currentRank);

  const xpInTier = user.xp - currentRank.min;
  const tierRange = currentRank.max - currentRank.min || 1;
  const progressPct = Math.min(100, Math.max(0, Math.round((xpInTier / tierRange) * 100)));
  const xpNeeded = Math.max(0, currentRank.max - user.xp + 1);

  return (
    <section className="flex-1 overflow-y-auto pb-24 md:pb-8 px-4 sm:px-6 lg:px-8 pt-4 space-y-4 animate-fade-in">
      {/* Responsive 2-Column Grid on Desktop PC */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Left Column: Profile & XP Stats */}
        <div className="lg:col-span-1 space-y-4">
          {/* Student Identity Card */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div
                  className="relative cursor-pointer active:scale-95 transition"
                  onClick={onOpenSettings}
                  title="Tap to change avatar & settings"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-200 dark:border-zinc-700 bg-blue-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 flex items-center justify-center text-2xl shadow-xs">
                    {user.pfpType === 'image' && user.pfpValue ? (
                      <img src={user.pfpValue} alt="PFP" className="w-full h-full object-cover" />
                    ) : (
                      <span>{user.pfpValue || '🦉'}</span>
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 text-sm bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-full px-1 shadow-xs">
                    {currentRank.icon}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{user.name || 'Student'}</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Grade 8 • Division {user.division || '8-B'} (Roll #{user.rollNumber || '1'})
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-full border border-blue-200/80 dark:border-blue-800/60">
                      {currentRank.icon} {currentRank.title} Rank
                    </span>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold font-mono">
                      {user.xp} XP
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenSettings}
                className="p-2.5 rounded-full border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition active:scale-95"
                title="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <span>🎯</span>
                <span className="text-slate-800 dark:text-zinc-200 font-medium text-xs truncate">
                  "{user.motto}"
                </span>
              </div>
              <button
                onClick={onOpenSettings}
                className="text-blue-600 dark:text-blue-400 font-bold text-xs hover:underline whitespace-nowrap ml-2"
              >
                Edit
              </button>
            </div>
          </div>

          {/* 🏆 CLASS RANK & XP */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>🏆 Class Rank</span>
              </span>
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">
                {user.xp} / {currentRank.max} XP
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
              <span>
                Next: <strong className="text-slate-800 dark:text-slate-200 font-bold">{nextRank.icon} {nextRank.title}</strong>
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {xpNeeded} XP to level up!
              </span>
            </div>

            {/* XP Rewards Cheatsheet */}
            <div className="grid grid-cols-4 gap-2 pt-1 text-center text-[10px]">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60">
                <span className="block font-bold text-slate-800 dark:text-slate-200">+50 XP</span>
                <span className="text-slate-500 dark:text-zinc-400">Upload</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60">
                <span className="block font-bold text-slate-800 dark:text-slate-200">+75 XP</span>
                <span className="text-slate-500 dark:text-zinc-400">Send Notes</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60">
                <span className="block font-bold text-blue-600 dark:text-blue-400">+25 XP</span>
                <span className="text-slate-500 dark:text-zinc-400">Answer</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60">
                <span className="block font-bold text-slate-800 dark:text-slate-200">+10 XP</span>
                <span className="text-slate-500 dark:text-zinc-400">Likes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bookmarked Worksheets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <span>🔖 Saved for Exam Prep</span>
              </h4>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">
                {bookmarks.length} sheets bookmarked
              </span>
            </div>

            {bookmarks.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800">
                <span className="text-3xl block mb-2">📑</span>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
                  No sheets saved yet. Tap the bookmark icon on any worksheet in the Home feed to save it for revision!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bookmarks.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => onOpenPdf(b.note)}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 flex items-center justify-between cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xs transition active:scale-98"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="text-2xl flex-shrink-0">
                        {b.note.subject === 'MATH'
                          ? '📐'
                          : b.note.subject === 'CHEM'
                          ? '🧪'
                          : b.note.subject === 'HINDI'
                          ? '📖'
                          : '🏛️'}
                      </span>
                      <div className="truncate">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{b.note.title}</h5>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                          {b.note.subject} • Shared by {b.note.user.name}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2">Open →</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
