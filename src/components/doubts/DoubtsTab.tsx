'use client';

import React, { useState } from 'react';
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

  const getSubLabel = (s: string) => {
    const info = getSubject(s);
    return `${info.icon} ${info.fullName}`;
  };

  return (
    <section
      className={`flex-1 overflow-y-auto pb-24 px-3.5 pt-3 space-y-3.5 animate-fade-in ${
        isAskModalOpen || activeReplyQuestion ? 'relative z-40' : ''
      }`}
    >
      {/* Top Banner */}
      <div className="p-3.5 rounded-2xl theme-card border flex items-center justify-between shadow-sm">
        <div>
          <h2 className="text-sm font-extrabold theme-text-main flex items-center gap-1.5">
            <span>💬 Class Doubts</span>
          </h2>
          <p className="text-[10px] theme-text-muted">
            Ask anything! Solve doubts for <strong className="accent-text">+25 XP</strong>.
          </p>
        </div>
        <button
          onClick={() => setIsAskModalOpen(true)}
          className="px-2.5 py-1.5 accent-btn rounded-xl text-[11px] font-bold shadow-md flex items-center gap-1 transition active:scale-95"
        >
          <span>+ Detailed</span>
        </button>
      </div>

      {/* Prominent Inline "Ask a Doubt" Area with Send Button */}
      <div className="theme-card border border-slate-200 dark:border-zinc-800 rounded-2xl p-3.5 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold theme-text-main flex items-center gap-1.5">
            <span>❓ Ask a Doubt</span>
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] theme-text-muted">Subject:</span>
            <select
              value={sub}
              onChange={(e) => setSub(e.target.value)}
              className="theme-input text-[10px] font-medium border border-slate-200 dark:border-zinc-700 rounded-lg px-2 py-0.5 focus:outline-none"
            >
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleAskSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={doubtText}
            onChange={(e) => setDoubtText(e.target.value)}
            placeholder="Type your homework doubt here..."
            className="flex-1 theme-input border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!doubtText.trim()}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs flex items-center gap-1.5 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <span>Send</span>
            <span>🚀</span>
          </button>
        </form>
      </div>

      {/* Doubts List */}
      <div className="space-y-3">
        {questions.map((q) => {
          const acceptedAnswer = q.answers.find((a) => a.isAccepted) || q.answers[0];

          return (
            <article key={q.id} className="theme-card border border-slate-200 dark:border-zinc-800 rounded-2xl p-3.5 space-y-2.5 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition">
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                  {getSubLabel(q.subject)}
                </span>
                {q.isSolved ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-neutral-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                    ✅ Solved
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                    ⏳ Waiting for Answer
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xs font-bold theme-text-main leading-snug">{q.title}</h3>
                <span className="text-[10px] theme-text-muted mt-0.5 block">
                  Asked by {q.user.name} ({q.user.division})
                </span>
              </div>

              {/* Accepted Answer Box */}
              {acceptedAnswer && (
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/25 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-emerald-500 flex items-center gap-1">
                      <span>✓</span> Solution by {acceptedAnswer.user.name} ({acceptedAnswer.user.division})
                    </span>
                    <span className="text-slate-400">Classmate Solution</span>
                  </div>
                  <p className="text-[11px] theme-text-main font-mono pl-1 leading-relaxed whitespace-pre-line">
                    {acceptedAnswer.content}
                  </p>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t theme-border text-[11px]">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpvote(q.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl theme-subtle text-slate-400 hover:text-white font-extrabold text-xs active:scale-95 transition"
                  >
                    <span>▲</span> <span>Helpful ({q.upvotes})</span>
                  </button>
                  <span className="text-slate-400 text-xs">{q.answers.length} answers</span>
                </div>

                <button
                  onClick={() => setActiveReplyQuestion(q)}
                  className="accent-text font-extrabold text-xs hover:underline active:scale-95 transition"
                >
                  Answer (+25 XP)
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Ask Doubt Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
          <div className="theme-card rounded-t-3xl p-4 pb-10 border-t space-y-3.5 max-h-[85%] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b theme-border">
              <h3 className="text-xs font-extrabold theme-text-main flex items-center gap-1.5">
                <span>❓ Ask a Homework Doubt</span>
              </h3>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleAskSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold theme-text-main mb-1">Subject</label>
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
                <label className="block font-bold theme-text-main mb-1">Type your question or doubt:</label>
                <textarea
                  value={doubtText}
                  onChange={(e) => setDoubtText(e.target.value)}
                  rows={3}
                  placeholder="e.g. In Ex 7.2 Question 4, how do we find the middle term?"
                  required
                  className="w-full theme-input border rounded-xl p-2.5 font-medium focus:outline-none placeholder-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={!doubtText.trim()}
                className="w-full py-3.5 accent-btn font-extrabold rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Send Doubt</span>
                <span>🚀</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Answer Modal */}
      {activeReplyQuestion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
          <div className="theme-card rounded-t-3xl p-4 pb-10 border-t space-y-3.5 max-h-[85%] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b theme-border">
              <h3 className="text-xs font-extrabold theme-text-main flex items-center gap-1.5">
                <span>💡 Answer Classmate Doubt (+25 XP)</span>
              </h3>
              <button
                onClick={() => setActiveReplyQuestion(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            <div className="p-2.5 rounded-xl theme-subtle border">
              <span className="text-[10px] theme-text-muted block">Question:</span>
              <p className="text-xs font-bold theme-text-main">{activeReplyQuestion.title}</p>
            </div>

            <form onSubmit={handleReplySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold theme-text-main mb-1">Your Explanation / Solution:</label>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  rows={4}
                  placeholder="Write step-by-step steps or formulas to help your classmate..."
                  required
                  className="w-full theme-input border rounded-xl p-2.5 font-mono focus:outline-none placeholder-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={!answerText.trim()}
                className="w-full py-3.5 accent-btn font-extrabold rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Send Solution (+25 XP)</span>
                <span>🚀</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
