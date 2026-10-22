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

  return (
    <section
      className={`flex-1 overflow-y-auto pb-24 px-3.5 pt-3 space-y-3.5 animate-fade-in ${
        isAskModalOpen || activeReplyQuestion ? 'relative z-40' : ''
      }`}
    >
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <span>💬 Class Doubts</span>
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
            Ask anything! Help solve doubts for <strong className="text-blue-600 dark:text-blue-400 font-bold">+25 XP</strong>.
          </p>
        </div>
        <button
          onClick={() => setIsAskModalOpen(true)}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 transition active:scale-95"
        >
          <span>+ Detailed</span>
        </button>
      </div>

      {/* Prominent Inline "Ask a Doubt" Area with Send Button */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <span>❓ Quick Ask a Doubt</span>
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500 dark:text-zinc-400">Subject:</span>
            <select
              value={sub}
              onChange={(e) => setSub(e.target.value)}
              className="bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-slate-100 text-xs font-semibold border border-slate-300 dark:border-zinc-700 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="flex-1 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!doubtText.trim()}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <span>Send</span>
            <span>🚀</span>
          </button>
        </form>
      </div>

      {/* Doubts List */}
      <div className="space-y-3">
        {questions.map((q) => {
          const subInfo = getSubject(q.subject);
          const acceptedAnswer = q.answers.find((a) => a.isAccepted) || q.answers[0];

          return (
            <article key={q.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3 shadow-xs hover:border-slate-300 dark:hover:border-zinc-700 transition">
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
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">{q.title}</h3>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 block">
                  Asked by {q.user.name} ({q.user.division})
                </span>
              </div>

              {/* Accepted Answer Box */}
              {acceptedAnswer && (
                <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <span>✓</span> Solution by {acceptedAnswer.user.name} ({acceptedAnswer.user.division})
                    </span>
                    <span className="text-emerald-600/70 dark:text-emerald-400/60 text-[10px] font-medium">Classmate Solution</span>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-mono pl-1 leading-relaxed whitespace-pre-line">
                    {acceptedAnswer.content}
                  </p>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-zinc-800 text-xs">
                <button
                  onClick={() => onUpvote(q.id)}
                  className="px-3 py-1 rounded-full border border-slate-200 dark:border-zinc-700 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 font-semibold flex items-center gap-1.5 transition active:scale-95"
                  title="Upvote: I have this doubt too!"
                >
                  <span>▲</span>
                  <span>{q.upvotes} {q.upvotes === 1 ? 'upvote' : 'upvotes'}</span>
                </button>

                <button
                  onClick={() => setActiveReplyQuestion(q)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-xs active:scale-95 flex items-center gap-1"
                >
                  <span>💬</span> Answer ({q.answers.length})
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Answer Modal */}
      {activeReplyQuestion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-fade-in">
          <div className="w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl p-5 border border-slate-200 dark:border-zinc-800 space-y-3.5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>💬 Help Solve Classmate's Doubt</span>
              </h3>
              <button
                onClick={() => setActiveReplyQuestion(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700">
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">Doubt:</span>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {activeReplyQuestion.title}
              </p>
            </div>

            <form onSubmit={handleReplySubmit} className="space-y-3">
              <textarea
                rows={3}
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
          <div className="w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl p-5 border border-slate-200 dark:border-zinc-800 space-y-3.5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>❓ Ask a Question</span>
              </h3>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-bold"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleAskSubmit} className="space-y-3">
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
                  rows={3}
                  required
                  value={doubtText}
                  onChange={(e) => setDoubtText(e.target.value)}
                  placeholder="e.g. How do we find the valency of Phosphate ion in Chemistry Chapter 5?"
                  className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-100 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
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
