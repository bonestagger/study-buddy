'use client';

import React, { useState, useEffect } from 'react';
import { SUBJECTS, getSubject } from '@/lib/subjects';

interface RequestItem {
  id: string;
  title: string;
  subject: string;
  description?: string | null;
  isFulfilled: boolean;
  createdAt: string;
  user: {
    name: string;
    division: string;
  };
}

interface RequestsTabProps {
  requests: RequestItem[];
  onFulfill: (requestId: string, studentName: string, title: string) => void;
  onCreateRequest: (subject: string, title: string, description: string) => void;
}

export default function RequestsTab({
  requests,
  onFulfill,
  onCreateRequest,
}: RequestsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sub, setSub] = useState('CHEM');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  // Close modal on Escape key for desktop PC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateRequest(sub, title, desc);
    setTitle('');
    setDesc('');
    setIsModalOpen(false);
  };

  return (
    <section
      className={`flex-1 overflow-y-auto pb-24 md:pb-8 px-4 sm:px-6 lg:px-8 pt-4 space-y-4 animate-fade-in ${
        isModalOpen ? 'relative z-40' : ''
      }`}
    >
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>🙋‍♂️ Missed a Class?</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Ask your Section 8-B classmates for missing notes, worksheets, or homework exercises!
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95 self-start sm:self-auto"
          >
            <span>+</span> Ask for Notes
          </button>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200 font-medium flex items-center gap-2">
          <span>🎁</span> Classmates earn <strong className="font-bold underline text-amber-700 dark:text-amber-300">+75 XP</strong> for sharing missing sheets!
        </div>
      </div>

      {/* Active Requests List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">
            Active Requests ({requests.length}):
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40">
            <span className="text-4xl block mb-2">📋</span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No active note requests</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
              Need notes for a lecture or exercise? Post a request to your classmates!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-3.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition"
            >
              + Post First Request
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((req) => {
              const subInfo = getSubject(req.subject);
              return (
                <div
                  key={req.id}
                  className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1.5 ${subInfo.bgBadge}`}>
                      <span>{subInfo.icon}</span> <span>{subInfo.fullName}</span>
                    </span>
                    {req.isFulfilled ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                        <span>✓</span> Fulfilled
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 flex items-center gap-1">
                        <span>⏳</span> Waiting
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{req.title}</span>
                    </h4>
                    {req.description && (
                      <p className="text-xs text-slate-600 dark:text-zinc-300 mt-1 bg-slate-50 dark:bg-zinc-800/50 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 leading-relaxed">
                        "{req.description}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-zinc-800 text-xs">
                    <span className="text-slate-500 dark:text-zinc-400">
                      Asked by <strong className="text-slate-800 dark:text-slate-200 font-semibold">{req.user.name} ({req.user.division})</strong>
                    </span>

                    {req.isFulfilled ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Sent Notes! (+75 XP)</span>
                    ) : (
                      <button
                        onClick={() => onFulfill(req.id, req.user.name, req.title)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-xs active:scale-95 flex items-center gap-1.5"
                      >
                        <span>📎 Send Notes</span>
                        <span className="bg-emerald-700/80 px-1 py-0.5 rounded text-[10px]">+75 XP</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Request Modal (Responsive bottom-sheet on mobile, centered on desktop) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl p-5 border border-slate-200 dark:border-zinc-800 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>🙋‍♂️ Ask Class for Missing Notes</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800"
              >
                ✕ Cancel (Esc)
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Subject
                </label>
                <select
                  value={sub}
                  onChange={(e) => setSub(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-100 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Topic or Worksheet Needed *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 4 Factorisation Exercise 4B solved"
                  className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-100 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Details / Which questions?
                </label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g. Missed Tuesday class. Need page 45 Q3 to Q8."
                  className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-100 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/50 text-[11px] text-blue-800 dark:text-blue-300 font-medium">
                📢 Your request will appear on the class board for all Section 8-B classmates!
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition active:scale-95"
              >
                Post Request to Classmates 🚀
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
