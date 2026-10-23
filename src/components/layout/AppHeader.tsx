'use client';

import React from 'react';
import { TabType } from './BottomNav';

interface AppHeaderProps {
  user: {
    name: string;
    division: string;
    motto: string;
    pfpType: string;
    pfpValue: string;
  };
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
  onOpenShare?: () => void;
}

export default function AppHeader({
  user,
  unreadCount,
  onOpenNotifications,
  onOpenSettings,
  activeTab = 'home',
  onTabChange,
  onOpenShare,
}: AppHeaderProps) {
  const navTabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'requests', label: 'Requests', icon: '📋' },
    { id: 'qna', label: 'Doubts', icon: '💬' },
    { id: 'profile', label: 'My Desk', icon: '👤' },
  ];

  return (
    <header className="px-4 sm:px-6 py-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between z-20 transition-colors sticky top-0">
      {/* Brand & User Identity */}
      <div
        className="flex items-center space-x-3 cursor-pointer active:opacity-80 transition"
        onClick={onOpenSettings}
        title="Tap to change avatar & settings"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border border-blue-200 dark:border-zinc-700 bg-blue-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 flex items-center justify-center text-xl shadow-xs flex-shrink-0">
          {user.pfpType === 'image' && user.pfpValue ? (
            <img src={user.pfpValue} alt="User Avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{user.pfpValue || '🦉'}</span>
          )}
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 leading-none">
            <span className="truncate max-w-[120px] sm:max-w-[180px]">{user.name || 'Student'}</span>
            <span className="px-2 py-0.5 bg-blue-50 dark:bg-zinc-800 text-blue-700 dark:text-blue-300 text-[10px] rounded-full font-bold border border-blue-200/80 dark:border-zinc-700 flex-shrink-0">
              {user.division || '8-B'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 truncate max-w-[150px] sm:max-w-[220px]">
            🎯 {user.motto || 'Prepping for UT2 📚'}
          </p>
        </div>
      </div>

      {/* Desktop Navigation Links (Hidden on Mobile) */}
      <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800/80 p-1 rounded-2xl border border-slate-200/80 dark:border-zinc-700/80">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                isActive
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Action Buttons & Desktop Share Note Button */}
      <div className="flex items-center space-x-2">
        {onOpenShare && (
          <button
            onClick={onOpenShare}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition"
            title="Share new notes with class"
          >
            <span>+</span>
            <span>Share Note</span>
          </button>
        )}

        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-full border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 active:scale-95 transition"
          title="Alerts"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 active:scale-95 transition"
          title="App Settings"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
