'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

interface LoginGateProps {
  onDemoLogin: (name: string, email: string) => void;
}

export default function LoginGate({ onDemoLogin }: LoginGateProps) {
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;
    onDemoLogin(customName.trim(), customEmail.trim());
  };

  return (
    <section className="min-h-screen w-full flex flex-col justify-between p-6 overflow-y-auto animate-fade-in bg-[#f8fafd] dark:bg-[#121212]">
      <div className="flex-1 flex flex-col items-center justify-center text-center my-auto max-w-sm mx-auto w-full">
        <div className="w-20 h-20 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 flex items-center justify-center shadow-md mb-5">
          <span className="text-4xl">📚</span>
        </div>

        <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 rounded-full text-xs font-bold tracking-wider uppercase mb-2">
          ICSE Grade 8 Hub
        </span>

        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-1.5">Study Buddy</h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-[280px] leading-relaxed mb-6">
          Find worksheets, share study notes & clear doubts with your Grade 8 classmates.
        </p>

        <div className="w-full space-y-3">
          {/* Primary: Sign in with Google */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-100 font-bold py-3.5 px-4 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-700 transition touch-target active:scale-98 text-xs"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google Account</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 py-1">
            <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-800" />
            <span className="text-[10px] text-slate-400 font-semibold uppercase">or student name</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-zinc-800" />
          </div>

          {!isCustomMode ? (
            <button
              onClick={() => setIsCustomMode(true)}
              className="w-full text-xs font-semibold py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
            >
              ✍️ Enter with Student Name & Email
            </button>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-2 text-left animate-fade-in">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-400 mb-0.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Mishra"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-zinc-400 mb-0.5">
                  Your Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ananya@student.school.edu"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition active:scale-98"
              >
                Enter ClassNotes Hub 🚀
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="text-center text-[11px] text-slate-400 dark:text-zinc-500 pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-center gap-1.5">
        <span>🔒</span>
        <span>Peer study hub for ICSE Grade 8 classmates. Safe & private.</span>
      </div>
    </section>
  );
}
