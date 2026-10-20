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
    <section className="flex-1 overflow-y-auto pb-24 px-3.5 pt-3 space-y-3.5 animate-fade-in">
      {/* Student Identity Card */}
      <div className="theme-card border border-slate-200 dark:border-zinc-800 rounded-2xl p-3.5 space-y-2.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="relative cursor-pointer active:scale-95 transition"
              onClick={onOpenSettings}
              title="Tap to change avatar & settings"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 flex items-center justify-center text-2xl shadow-xs">
                {user.pfpType === 'image' && user.pfpValue ? (
                  <img src={user.pfpValue} alt="PFP" className="w-full h-full object-cover" />
                ) : (
                  <span>{user.pfpValue || '🦉'}</span>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 text-sm bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-full px-0.5 shadow-xs">
                {currentRank.icon}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold theme-text-main">{user.name}</h3>
              <p className="text-[11px] theme-text-muted">
                Grade 8 • Division {user.division} (Roll #{user.rollNumber || '1'})
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 text-[10px] font-semibold rounded-full border border-slate-200 dark:border-zinc-700">
                  {currentRank.icon} {currentRank.title} Rank
                </span>
                <span className="text-[10px] accent-text font-bold font-mono">
                  {user.xp} XP
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-full border border-slate-200 dark:border-zinc-700 theme-subtle theme-text-muted hover:text-white transition active:scale-95"
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

        <div className="p-2.5 rounded-xl theme-subtle border border-slate-200/80 dark:border-zinc-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <span>🎯</span>
            <span className="theme-text-main font-medium text-[11px] truncate">
              "{user.motto}"
            </span>
          </div>
          <button
            onClick={onOpenSettings}
            className="accent-text font-semibold text-[10px] hover:underline whitespace-nowrap ml-2"
          >
            Edit
          </button>
        </div>
      </div>

      {/* 🏆 CLASS RANK & XP (Roadmap removed for minimalism) */}
      <div className="theme-card border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold theme-text-main flex items-center gap-1.5">
            <span>🏆 Class Rank</span>
          </span>
          <span className="text-[11px] font-mono accent-text font-bold">
            {user.xp} / {currentRank.max} XP
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 overflow-hidden">
          <div
            className="h-full bg-neutral-900 dark:bg-zinc-100 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] theme-text-muted">
          <span>
            Next: <strong className="theme-text-main font-bold">{nextRank.icon} {nextRank.title} Rank</strong>
          </span>
          <span className="accent-text font-bold">
            {xpNeeded} XP to reach {nextRank.title}!
          </span>
        </div>

        {/* XP Rewards Cheatsheet */}
        <div className="grid grid-cols-4 gap-1.5 pt-1 text-center text-[9px]">
          <div className="theme-subtle p-2 rounded-xl border border-slate-200/80 dark:border-zinc-700/60">
            <span className="block font-bold theme-text-main">+50 XP</span>
            <span className="text-neutral-500 dark:text-neutral-400">Upload</span>
          </div>
          <div className="theme-subtle p-2 rounded-xl border border-slate-200/80 dark:border-zinc-700/60">
            <span className="block font-bold theme-text-main">+75 XP</span>
            <span className="text-neutral-500 dark:text-neutral-400">Send Notes</span>
          </div>
          <div className="theme-subtle p-2 rounded-xl border border-slate-200/80 dark:border-zinc-700/60">
            <span className="block font-bold accent-text">+25 XP</span>
            <span className="text-neutral-500 dark:text-neutral-400">Answer Q</span>
          </div>
          <div className="theme-subtle p-2 rounded-xl border border-slate-200/80 dark:border-zinc-700/60">
            <span className="block font-bold theme-text-main">+10 XP</span>
            <span className="text-neutral-500 dark:text-neutral-400">Likes</span>
          </div>
        </div>
      </div>

      {/* 🔖 SAVED FOR EXAM REVISION */}
      <div className="theme-card border border-slate-200 dark:border-zinc-800 rounded-2xl p-3.5 space-y-2 shadow-xs">
        <div className="flex items-center justify-between pb-1.5 border-b theme-border text-xs">
          <h4 className="font-extrabold theme-text-main flex items-center gap-1.5">
            <span>🔖 Saved for Exam Prep</span>
          </h4>
          <span className="text-[10px] accent-text font-bold">
            {bookmarks.length} sheets bookmarked
          </span>
        </div>

        <div className="space-y-2">
          {bookmarks.length === 0 ? (
            <p className="text-center text-xs theme-text-muted py-3">
              No sheets saved yet. Tap the bookmark icon on any worksheet to save it for exams!
            </p>
          ) : (
            bookmarks.map((b) => (
              <div
                key={b.id}
                onClick={() => onOpenPdf(b.note)}
                className="p-2.5 rounded-xl theme-subtle border flex items-center justify-between cursor-pointer hover:border-indigo-500/40 transition active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">
                    {b.note.subject === 'MATH'
                      ? '📐'
                      : b.note.subject === 'CHEM'
                      ? '🧪'
                      : b.note.subject === 'HINDI'
                      ? '📖'
                      : '🏛️'}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold theme-text-main">{b.note.title}</h5>
                    <p className="text-[10px] theme-text-muted">
                      {b.note.subject} • Shared by {b.note.user.name}
                    </p>
                  </div>
                </div>
                <span className="accent-text font-extrabold text-xs">Open →</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
