'use client';

import React, { useState } from 'react';
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
      className={`flex-1 overflow-y-auto pb-24 px-3.5 pt-3 space-y-3.5 animate-fade-in ${
        isModalOpen ? 'relative z-40' : ''
      }`}
    >
      {/* Top Banner */}
      <div className="p-3.5 rounded-2xl theme-card border border-slate-200 dark:border-zinc-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold theme-text-main flex items-center gap-1.5">
              <span>🙋‍♂️ Missed a Class?</span>
            </h2>
            <p className="text-[10px] theme-text-muted">Ask classmates for notes or worksheets!</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-2 accent-btn rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1 transition active:scale-95"
          >
            <span>+</span> Ask for Notes
          </button>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 text-[10px] theme-text-main font-medium flex items-center gap-1.5">
          <span>🎁</span> Classmates earn <strong className="underline">+75 XP</strong> for sending missing sheets!
        </div>
      </div>

      {/* Active Requests List */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-bold theme-text-muted uppercase tracking-wider block px-1">
          Active Requests ({requests.length}):
        </span>

        <div className="space-y-2.5">
          {requests.map((req) => (
            <div key={req.id} className="theme-card border border-slate-200 dark:border-zinc-800 rounded-2xl p-3.5 space-y-2 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition">
              <div className="flex items-center justify-between">
                {req.isFulfilled ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-neutral-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center gap-1">
                    <span>✓</span> Fulfilled
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 flex items-center gap-1">
                    <span>⏳</span> Waiting for Notes
                  </span>
                )}
                <span className="text-[10px] theme-text-muted">Active</span>
              </div>

              <div>
                <h4 className="text-xs font-bold theme-text-main flex items-center gap-1">
                  <span>{getSubject(req.subject).icon}</span>
                  <span>{req.title}</span>
                </h4>
                {req.description && (
                  <p className="text-[11px] theme-text-muted mt-1 bg-slate-500/5 p-2 rounded-xl border theme-border leading-relaxed">
                    "{req.description}"
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t theme-border text-[10px]">
                <span className="theme-text-muted">
                  Asked by <strong className="theme-text-main font-semibold">{req.user.name} ({req.user.division})</strong>
                </span>

                {req.isFulfilled ? (
                  <span className="text-emerald-500 font-extrabold">✓ Sent Notes! (+75 XP)</span>
                ) : (
                  <button
                    onClick={() => onFulfill(req.id, req.user.name, req.title)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-[10px] transition shadow active:scale-95 flex items-center gap-1.5"
                  >
                    <span>📎 Send Notes</span>
                    <span className="bg-emerald-700 px-1 py-0.2 rounded text-[9px]">+75 XP</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
          <div className="theme-card rounded-t-3xl p-4 pb-10 border-t space-y-3.5 max-h-[85%] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b theme-border">
              <h3 className="text-xs font-extrabold theme-text-main flex items-center gap-1.5">
                <span>🙋‍♂️ Ask Class for Missing Notes</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold theme-text-main mb-1">Which subject?</label>
                <select
                  value={sub}
                  onChange={(e) => setSub(e.target.value)}
                  className="w-full theme-input border rounded-xl p-2.5 font-bold focus:outline-none"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold theme-text-main mb-1">
                  What worksheet or chapter notes do you need?
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hindi Vyakaran: Sandhi practice questions"
                  required
                  className="w-full theme-input border rounded-xl p-2.5 font-medium focus:outline-none placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block font-bold theme-text-main mb-1">Additional details (Optional):</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={2}
                  placeholder="e.g. Was absent on Tuesday due to fever"
                  className="w-full theme-input border rounded-xl p-2.5 font-medium focus:outline-none placeholder-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 accent-btn font-extrabold rounded-xl shadow-md transition active:scale-98"
              >
                Send Request to Classmates 🚀
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
