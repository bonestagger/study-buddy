'use client';

import React, { useState } from 'react';
import { SUBJECTS } from '@/lib/subjects';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (noteData: any) => void;
  showToast: (msg: string) => void;
  userEmail: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  onSuccess,
  showToast,
  userEmail,
}: ShareModalProps) {
  const [subject, setSubject] = useState<string>('MATH');
  const [type, setType] = useState<'HW' | 'BLANK' | 'SOLVED'>('HW');
  const [dueDay, setDueDay] = useState('Tomorrow');
  const [dueTime, setDueTime] = useState('8:00 AM (Morning)');
  const [title, setTitle] = useState('');
  const [photoCount, setPhotoCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPhotoCount(files.length);
      showToast(`${files.length} pages attached! 📸`);
    }
  };

  const simulateSnap = () => {
    setPhotoCount(3);
    showToast('3 notebook pages snapped & ready to merge! 📸');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter an exercise or chapter title!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subject,
          type,
          dueDay: type === 'HW' ? dueDay : null,
          dueTime: type === 'HW' ? dueTime : null,
          pageCount: photoCount || 2,
          fileUrl:
            subject === 'MATH'
              ? '/sheets/math-factorisation.json'
              : subject === 'CHEM'
              ? '/sheets/chem-valency.json'
              : subject === 'HINDI'
              ? '/sheets/hindi-sandhi.json'
              : '/sheets/hist-1857.json',
          userEmail,
        }),
      });

      if (!res.ok) throw new Error('Failed to share');

      const data = await res.json();
      onSuccess(data);
      showToast(`🎉 +50 XP! Shared "${title}" with class!`);
      setTitle('');
      setPhotoCount(0);
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Error uploading notes');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
      <div className="theme-card rounded-t-3xl p-4 border-t space-y-3.5 max-h-[92%] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b theme-border">
          <div>
            <h2 className="text-sm font-extrabold theme-text-main flex items-center gap-1.5">
              <span>🚀 Share Notes with Class</span>
            </h2>
            <p className="text-[10px] theme-text-muted">Takes only 10 seconds to help classmates!</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white rounded-full font-mono font-extrabold text-[10px]">
              +50 XP
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-0.5 rounded-lg theme-subtle"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Step 1: Big Friendly Subject Buttons */}
          <div className="theme-subtle p-3 rounded-2xl border theme-border space-y-1.5">
            <span className="block font-bold theme-text-main text-[11px]">1. Choose Subject (11 Subjects):</span>
            <div className="grid grid-cols-2 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
              {SUBJECTS.map((sub) => {
                const isSelected = subject === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSubject(sub.id)}
                    className={`p-2 rounded-xl border font-semibold text-left flex items-center gap-2 transition text-xs ${
                      isSelected
                        ? 'bg-neutral-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-neutral-900 dark:border-zinc-100 shadow-xs'
                        : 'bg-white dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700 theme-text-main hover:border-slate-300 dark:hover:border-zinc-600 shadow-2xs'
                    }`}
                  >
                    <span className="text-base">{sub.icon}</span>
                    <span className="truncate">{sub.fullName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Material Type */}
          <div className="theme-subtle p-3 rounded-2xl border theme-border space-y-2">
            <span className="block font-bold theme-text-main text-[11px]">2. What kind of material is this?</span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setType('HW')}
                className={`p-2 rounded-xl border text-center font-semibold transition ${
                  type === 'HW'
                    ? 'bg-neutral-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-neutral-900 dark:border-zinc-100 shadow-xs'
                    : 'bg-white dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700 theme-text-main shadow-2xs'
                }`}
              >
                <span className="block text-base">⏰</span>
                <span className="text-[10px]">Homework</span>
              </button>
              <button
                type="button"
                onClick={() => setType('BLANK')}
                className={`p-2 rounded-xl border text-center font-semibold transition ${
                  type === 'BLANK'
                    ? 'bg-neutral-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-neutral-900 dark:border-zinc-100 shadow-xs'
                    : 'bg-white dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700 theme-text-main shadow-2xs'
                }`}
              >
                <span className="block text-base">📝</span>
                <span className="text-[10px]">Practice</span>
              </button>
              <button
                type="button"
                onClick={() => setType('SOLVED')}
                className={`p-2 rounded-xl border text-center font-semibold transition ${
                  type === 'SOLVED'
                    ? 'bg-neutral-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-neutral-900 dark:border-zinc-100 shadow-xs'
                    : 'bg-white dark:bg-zinc-800/80 border-slate-200 dark:border-zinc-700 theme-text-main shadow-2xs'
                }`}
              >
                <span className="block text-base">✅</span>
                <span className="text-[10px]">Solved Notes</span>
              </button>
            </div>

            {/* Deadline Box (Only shown if Homework) */}
            {type === 'HW' && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-1.5 animate-fade-in">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-extrabold text-rose-500 flex items-center gap-1">
                    <span>🚨 Homework Deadline</span>
                  </span>
                  <span className="text-[9px] text-slate-400">Classmates get alerts</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    className="w-full theme-input border rounded-lg p-2 font-medium"
                  >
                    <option value="Tomorrow">Due Tomorrow</option>
                    <option value="Thursday">Due Thursday</option>
                    <option value="Friday">Due Friday</option>
                    <option value="Monday">Due Next Monday</option>
                  </select>
                  <select
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full theme-input border rounded-lg p-2 font-medium"
                  >
                    <option value="8:00 AM (Morning)">8:00 AM (Morning)</option>
                    <option value="12:00 PM (Lunch)">12:00 PM</option>
                    <option value="4:00 PM (Evening)">4:00 PM</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Title */}
          <div className="theme-subtle p-3 rounded-2xl border theme-border space-y-1">
            <span className="block font-bold theme-text-main text-[11px]">3. Chapter / Exercise Name:</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 7 Exercise 7.2"
              required
              className="w-full theme-input border rounded-xl p-2.5 placeholder-slate-400 focus:outline-none font-semibold text-xs"
            />
          </div>

          {/* Step 4: Big Camera / Photo Box */}
          <div className="theme-subtle p-3 rounded-2xl border theme-border space-y-2">
            <span className="block font-bold theme-text-main text-[11px]">4. Attach Notebook Photos or PDF:</span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={simulateSnap}
                className="border border-dashed border-slate-300 dark:border-zinc-700 hover:border-slate-400 dark:hover:border-zinc-600 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-3 text-center cursor-pointer transition active:scale-98"
              >
                <span className="text-2xl block mb-0.5">📸</span>
                <p className="font-bold theme-text-main text-xs">Snap Notebook</p>
                <p className="text-[9px] theme-text-muted mt-0.5">Auto-merges pages</p>
              </button>

              <label className="border border-dashed border-slate-300 dark:border-zinc-700 hover:border-slate-400 dark:hover:border-zinc-600 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl p-3 text-center cursor-pointer transition active:scale-98 flex flex-col items-center justify-center">
                <span className="text-2xl block mb-0.5">📂</span>
                <p className="font-bold theme-text-main text-xs">Browse Files</p>
                <p className="text-[9px] theme-text-muted mt-0.5">Upload PDF or images</p>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>
            </div>

            {photoCount > 0 && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-500 flex items-center gap-1">
                    <span>✓</span> {photoCount} pages selected
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Ready to merge</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] font-mono theme-text-muted">
                  <div className="p-1.5 rounded-lg theme-card border">Page 1 📄</div>
                  <div className="p-1.5 rounded-lg theme-card border">Page 2 📄</div>
                  <div className="p-1.5 rounded-lg theme-card border">Page 3 📄</div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full accent-btn font-extrabold py-3.5 rounded-2xl shadow-lg transition active:scale-98 flex items-center justify-center gap-2 text-xs"
          >
            <span>{isSubmitting ? 'Uploading...' : '🚀 Share with Classmates'}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px]">+50 XP</span>
          </button>
        </form>
      </div>
    </div>
  );
}
