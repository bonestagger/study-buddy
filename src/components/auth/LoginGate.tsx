'use client';

import React from 'react';
import { signIn } from 'next-auth/react';

interface LoginGateProps {
  onDemoLogin: (name: string, email: string) => void;
}

export default function LoginGate({ onDemoLogin }: LoginGateProps) {
  const handleGoogleLogin = () => {
    // If Google OAuth configured, call next-auth signIn('google')
    // Otherwise falls back to instant demo login
    signIn('google', { callbackUrl: '/' }).catch(() => {
      onDemoLogin('Aarav Patel', 'aarav.patel@gmail.com');
    });
  };

  return (
    <section className="absolute inset-0 z-40 theme-screen flex flex-col justify-between p-6 overflow-y-auto animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center text-center my-auto">
        <div className="w-20 h-20 rounded-3xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 flex items-center justify-center shadow-md mb-5">
          <span className="text-4xl">📚</span>
        </div>

        <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 rounded-full text-xs font-semibold tracking-wider uppercase mb-2 shadow-2xs">
          ICSE Grade 8
        </span>

        <h2 className="text-2xl font-extrabold theme-text-main mb-1.5">ClassNotes Hub</h2>
        <p className="text-xs theme-text-muted max-w-[260px] leading-relaxed mb-6">
          The easiest place to find homework worksheets, share notes & solve doubts with classmates.
        </p>

        <div className="w-full max-w-[280px] space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold py-3.5 px-4 rounded-2xl shadow-sm border border-slate-200 transition touch-target active:scale-98 text-xs"
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

          <div className="pt-2 border-t theme-border space-y-1.5">
            <span className="text-[10px] theme-text-muted block text-center">Quick Switch:</span>
            <button
              onClick={() => onDemoLogin('Aarav Patel', 'aarav.patel@gmail.com')}
              className="w-full text-xs accent-text hover:underline py-1 transition font-bold block"
            >
              ⚡ Enter as Aarav Patel (8-B)
            </button>
            <button
              onClick={() => onDemoLogin('Priya Sharma', 'priya.s@student.school.edu')}
              className="w-full text-xs theme-text-main hover:underline py-1 transition font-bold block"
            >
              ⚡ Enter as Priya Sharma (8-B)
            </button>
            <button
              onClick={() => onDemoLogin('Rohan Kumar', 'rohan.k@student.school.edu')}
              className="w-full text-xs theme-text-main hover:underline py-1 transition font-bold block"
            >
              ⚡ Enter as Rohan Kumar (8-A)
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] theme-text-muted pt-3 border-t theme-border flex items-center justify-center gap-1.5">
        <span>🔒</span>
        <span>Only for registered ICSE Grade 8 students. Safe & private.</span>
      </div>
    </section>
  );
}
