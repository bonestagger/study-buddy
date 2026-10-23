'use client';

import React from 'react';

export type TabType = 'home' | 'requests' | 'upload' | 'qna' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-slate-200 dark:border-zinc-800 flex items-center justify-around py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] z-30 select-none transition-colors shadow-lg">
      {/* 1. Home */}
      <button
        data-testid="nav-home"
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-0.5 active:scale-95 transition ${
          activeTab === 'home'
            ? 'text-blue-600 dark:text-blue-400 font-bold'
            : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-medium'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span className="text-[10px]">Home</span>
      </button>

      {/* 2. Requests Board */}
      <button
        data-testid="nav-requests"
        onClick={() => onTabChange('requests')}
        className={`flex flex-col items-center gap-0.5 active:scale-95 transition ${
          activeTab === 'requests'
            ? 'text-blue-600 dark:text-blue-400 font-bold'
            : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-medium'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        <span className="text-[10px]">Requests</span>
      </button>

      {/* 3. Share Note (Mobile Center Button) */}
      <button
        data-testid="nav-upload"
        onClick={() => onTabChange('upload')}
        className="flex flex-col items-center gap-0.5 -mt-5 active:scale-95 transition"
      >
        <div className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-95 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span className={`text-[10px] font-bold ${activeTab === 'upload' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-zinc-400'}`}>
          Share
        </span>
      </button>

      {/* 4. Doubts / Q&A */}
      <button
        data-testid="nav-qna"
        onClick={() => onTabChange('qna')}
        className={`flex flex-col items-center gap-0.5 active:scale-95 transition ${
          activeTab === 'qna'
            ? 'text-blue-600 dark:text-blue-400 font-bold'
            : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-medium'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span className="text-[10px]">Doubts</span>
      </button>

      {/* 5. My Desk */}
      <button
        data-testid="nav-profile"
        onClick={() => onTabChange('profile')}
        className={`flex flex-col items-center gap-0.5 active:scale-95 transition ${
          activeTab === 'profile'
            ? 'text-blue-600 dark:text-blue-400 font-bold'
            : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-medium'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span className="text-[10px]">My Desk</span>
      </button>
    </nav>
  );
}
