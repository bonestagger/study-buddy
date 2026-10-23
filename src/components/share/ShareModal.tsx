'use client';

import React, { useState, useEffect } from 'react';
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

  // Close on Escape key for desktop PC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
          isHomework: type === 'HW',
          pageCount: photoCount || 2,
          fileUrl:
            subject === 'MATH'
              ? '/sheets/math-factorisation.json'
              : subject === 'CHEM'
              ? '/sheets/chem-valency.json'
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full sm:max-w-lg bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl p-5 border border-slate-200 dark:border-zinc-800 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>🚀 Share Notes with Class</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Help your Section 8-B classmates study and earn XP!</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 rounded-full font-mono font-bold text-xs">
              +50 XP
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800"
            >
              ✕ (Esc)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Step 1: Subject Selection */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 space-y-2">
            <span className="block font-bold text-slate-800 dark:text-slate-200 text-xs">1. Choose Subject:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[140px] overflow-y-auto pr-1">
              {SUBJECTS.map((sub) => {
                const isSelected = subject === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSubject(sub.id)}
                    className={`p-2 rounded-xl flex items-center gap-2 border text-left transition active:scale-95 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                        : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-lg">{sub.icon}</span>
                    <span className="truncate font-semibold text-[11px]">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Note Type */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 space-y-2">
            <span className="block font-bold text-slate-800 dark:text-slate-200 text-xs">2. What kind of note is this?</span>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { id: 'HW', label: '⏰ Homework', desc: 'Due Tomorrow' },
                { id: 'SOLVED', label: '✅ Solved Notes', desc: 'Answers/Steps' },
                { id: 'BLANK', label: '📝 Worksheet', desc: 'Practice Sheet' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id as any)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition active:scale-95 ${
                    type === t.id
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                      : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border-slate-200 dark:border-zinc-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold text-[11px]">{t.label}</span>
                  <span className="text-[9px] opacity-80">{t.desc}</span>
                </button>
              ))}
            </div>

            {type === 'HW' && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-zinc-700 animate-fade-in">
                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-zinc-400 mb-1">Due Day</label>
                  <select
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-100 rounded-xl p-2 text-xs font-semibold"
                  >
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Monday">Monday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-zinc-400 mb-1">Due Time</label>
                  <select
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-100 rounded-xl p-2 text-xs font-semibold"
                  >
                    <option value="8:00 AM (Morning)">8:00 AM (Morning)</option>
                    <option value="11:30 AM (Recess)">11:30 AM (Recess)</option>
                    <option value="1:30 PM (Period 6)">1:30 PM (Period 6)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Title & Photos */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 space-y-2.5">
            <span className="block font-bold text-slate-800 dark:text-slate-200 text-xs">3. Chapter & Attachments:</span>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 4 Factorisation Exercise 4B complete notes"
              className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-100 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center gap-2 pt-1">
              <label className="flex-1 cursor-pointer py-2.5 px-3 rounded-xl border border-dashed border-blue-400 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-center font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition">
                <span>📁</span>
                <span>{photoCount > 0 ? `${photoCount} Pages Selected` : 'Attach Photos / PDF'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={simulateSnap}
                className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-bold hover:bg-slate-100 transition"
                title="Quick 3-Page Camera Snap"
              >
                📸 Snap
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-md transition active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? 'Sharing with Class...' : 'Post Worksheet & Earn +50 XP 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}
