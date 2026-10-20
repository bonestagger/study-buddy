'use client';

import React, { useState } from 'react';

interface OnboardingModalProps {
  isOpen: boolean;
  userName: string;
  onComplete: (division: string, rollNumber: string) => void;
}

export default function OnboardingModal({
  isOpen,
  userName,
  onComplete,
}: OnboardingModalProps) {
  const [division, setDivision] = useState('8-B');
  const [roll, setRoll] = useState('14');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(division, roll || '1');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
      <div className="theme-card rounded-t-3xl p-5 border-t space-y-4">
        <div className="text-center">
          <span className="text-3xl block mb-1">👋</span>
          <h3 className="text-base font-extrabold theme-text-main">
            Welcome, <span>{userName}</span>!
          </h3>
          <p className="text-xs theme-text-muted mt-0.5">Which section are you in?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold theme-text-main mb-1.5">
              Pick Your Section / Division
            </label>
            <div className="grid grid-cols-5 gap-2">
              {['8-A', '8-B', '8-C', '8-D', '8-E'].map((div) => (
                <button
                  key={div}
                  type="button"
                  onClick={() => setDivision(div)}
                  className={`p-2.5 rounded-xl border font-bold text-center transition active:scale-95 ${
                    division === div ? 'accent-btn' : 'theme-subtle theme-text-muted'
                  }`}
                >
                  {div}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold theme-text-main mb-1">Roll Number (Optional)</label>
            <input
              type="number"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              placeholder="e.g. 14"
              className="w-full theme-input border rounded-xl p-3 font-semibold focus:outline-none text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 accent-btn rounded-xl font-bold text-xs shadow-md transition active:scale-98"
          >
            Let's Go! Enter Class Hub 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
