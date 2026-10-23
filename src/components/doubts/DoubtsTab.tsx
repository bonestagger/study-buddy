'use client';

import React, { useState, useEffect } from 'react';
import { SUBJECTS, getSubject } from '@/lib/subjects';

interface AnswerItem {
  id: string;
  content: string;
  isAccepted: boolean;
  createdAt: string;
  user: {
    name: string;
    division: string;
  };
}

interface QuestionItem {
  id: string;
  title: string;
  subject: string;
  isSolved: boolean;
  upvotes: number;
  createdAt: string;
  user: {
    name: string;
    division: string;
  };
  answers: AnswerItem[];
}

interface DoubtsTabProps {
  questions: QuestionItem[];
  onUpvote: (questionId: string) => void;
  onPostDoubt: (subject: string, title: string) => void;
  onPostAnswer: (questionId: string, answerText: string) => void;
}

export default function DoubtsTab({
  questions,
  onUpvote,
  onPostDoubt,
  onPostAnswer,
}: DoubtsTabProps) {
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [activeReplyQuestion, setActiveReplyQuestion] = useState<QuestionItem | null>(null);
  const [sub, setSub] = useState('MATH');
  const [doubtText, setDoubtText] = useState('');
  const [answerText, setAnswerText] = useState('');

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAskModalOpen) setIsAskModalOpen(false);
        if (activeReplyQuestion) setActiveReplyQuestion(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAskModalOpen, activeReplyQuestion]);

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;
    onPostDoubt(sub, doubtText);
    setDoubtText('');
    setIsAskModalOpen(false);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim() || !activeReplyQuestion) return;
    onPostAnswer(activeReplyQuestion.id, answerText);
    setAnswerText('');
    setActiveReplyQuestion(null);
  };

  return (
    <section
      className={`flex-1 overflow-y-auto pb-24 md:pb-8 px-4 sm:px-6 lg:px-8 pt-4 space-y-4 animate-fade-in ${
        isAskModalOpen || activeReplyQuestion ? 'relative z-40' : ''
      }`}
    >
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>💬 Class Doubts & Discussions</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Stuck on a problem? Ask here or help classmates for <strong className="text-blue-600 dark:text-blue-400 font-bold">+25 XP</strong>!
          </p>
        </div>
        <button
          onClick={() => setIsAskModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95 self-start sm:self-auto"
        >
          <span>+ Detailed Question</span>
        </button>
      </div>

      {/* Responsive Grid: Stream on Left, Quick Ask Form on Right for Desktop PC */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Left Column: Doubts Feed */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">
              Recent Questions ({questions.length}):
            </span>
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40">
              <span className="text-4xl block mb-2">💬</span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No open doubts yet</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                Got a homework question? Post it using the form or the "+ Detailed Question" button!
              </p>
            </div>
          ) : (
            questions.map((q) => {
              const subInfo = getSubject(q.subject);
              const acceptedAnswer = q.answers.find((a) => a.isAccepted) || q.answers[0];

              return (
                <article
                  key={q.id}
                  className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${subInfo.bgBadge}`}>
                      <span>{subInfo.icon}</span> <span>{subInfo.fullName}</span>
                    </span>
                    {q.isSolved ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                        ✅ Solved
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
                        ⏳ Waiting
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">{q.title}</h3>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 mt-1 block">
                      Asked by <strong className="text-slate-700 dark:text-zinc-300">{q.user.name}</strong> ({q.user.division})
                    </span>
                  </div>

                  {/* Accepted Answer Box */}
                  {acceptedAnswer && (
                    <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                          <span>✓</span> Solution by {acceptedAnswer.user.name} ({acceptedAnswer.user.division})
                        </span>
                        <span className="text-emerald-600/70 dark:text-emerald-400/60 text-[10px] font-medium">Classmate Solution</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-mono pl-1 leading-relaxed whitespace-pre-line">
                        {acceptedAnswer.content}
                      </p>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs">
                    <button
                      onClick={() => onUpvote(q.id)}
                      className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 font-semibold flex items-center gap-1.5 transition active:scale-95"
                      title="Upvote: I have this doubt too!"
                    >
                      <span>▲</span>
                      <span>{q.upvotes} {q.upvotes === 1 ? 'upvote' : 'upvotes'}</span>
                    </button>

                    <button
                      onClick={() => setActiveReplyQuestion(q)}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-xs active:scale-95 flex items-center gap-1.5"
                    >
                      <span>💬</span> Answer ({q.answers.length})
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Right Column (PC Sidebar / Sticky Box) */}
        <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-20">
          {/* Quick Ask a Doubt Card */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>❓ Quick Ask</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500 dark:text-zinc-400">Subject:</span>
                <select
                  value={sub}
                  onChange={(e) => setSub(e.target.value)}
                  className="bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 text-xs font-semibold border border-slate-300 dark:border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <form onSubmit={handleAskSubmit} className="space-y-2.5">
              <textarea
                rows={3}
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
                placeholder="Type your homework doubt or exercise problem..."
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-100 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!doubtText.trim()}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Ask Classmates</span>
                <span>🚀</span>
              </button>
            </form>
          </div>

          {/* XP Tip Box */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/50 space-y-1.5 text-xs">
            <span className="font-bold text-blue-900 dark:text-blue-200 block">💡 Earn Extra Class Rank</span>
            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[11px]">
              Writing step-by-step solutions to your classmates' doubts earns you <strong>+25 XP</strong> and levels up your rank badge!
            </p>
          </div>
        </div>
      </div>

      {/* Answer Modal (Responsive bottom-sheet on mobile, centered on desktop) */}
      {activeReplyQuestion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl p-5 border border-slate-200 dark:border-zinc-800 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>💬 Help Solve Classmate's Doubt</span>
              </h3>
              <button
                onClick={() => setActiveReplyQuestion(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800"
              >
                ✕ Cancel (Esc)
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700">
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 block font-medium">Question:</span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {activeReplyQuestion.title}
              </p>
            </div>

            <form onSubmit={handleReplySubmit} className="space-y-3.5">
              <textarea
                rows={4}
                required
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Write your explanation or step-by-step formula solution..."
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-100 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />

              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                🌟 You will earn <strong className="font-bold">+25 XP</strong> for providing this answer!
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition active:scale-95"
              >
                Post Answer (+25 XP) ✨
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Detailed Ask Doubt Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl p-5 border border-slate-200 dark:border-zinc-800 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>❓ Ask a Question</span>
              </h3>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800"
              >
                ✕ Cancel (Esc)
              </button>
            </div>

            <form onSubmit={handleAskSubmit} className="space-y-3.5">
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
                  Your Question / Problem *
                </label>
                <textarea
                  rows={4}
                  required
                  value={doubtText}
                  onChange={(e) => setDoubtText(e.target.value)}
                  placeholder="e.g. How do we find the valency of Phosphate ion in Chemistry Chapter 5?"
                  className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-100 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition active:scale-95"
              >
                Post Doubt to Classmates 🚀
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
