'use client';

import React, { useState } from 'react';

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email?: string;
    division: string;
    rollNumber: string;
    motto: string;
    pfpType: string;
    pfpValue: string;
    palette: string;
    themeMode: string;
  };
  onSaveSettings: (newSettings: {
    division: string;
    rollNumber: string;
    motto: string;
    pfpType: string;
    pfpValue: string;
    palette: string;
    themeMode: string;
  }) => void;
  onSignOut: () => void;
  showToast: (msg: string) => void;
}

export default function SettingsSheet({
  isOpen,
  onClose,
  user,
  onSaveSettings,
  onSignOut,
  showToast,
}: SettingsSheetProps) {
  const [division, setDivision] = useState(user.division || '8-B');
  const [rollNumber, setRollNumber] = useState(user.rollNumber || '14');
  const [motto, setMotto] = useState(user.motto || 'Prepping for Math UT2 📚');
  const [pfpType, setPfpType] = useState(user.pfpType || 'emoji');
  const [pfpValue, setPfpValue] = useState(user.pfpValue || '🦉');
  const [palette] = useState(user.palette || 'palette-retro');
  const [themeMode, setThemeMode] = useState(user.themeMode || 'light');

  if (!isOpen) return null;

  const handleMascotSelect = (emoji: string) => {
    setPfpType('emoji');
    setPfpValue(emoji);
    showToast(`Avatar mascot selected: ${emoji}`);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target?.result as string;
      setPfpType('image');
      setPfpValue(base64);
      showToast('Photo uploaded as PFP! 📸');
    };
    reader.readAsDataURL(file);
  };

  const toggleReadingMode = () => {
    const nextMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
    showToast(`Switched to ${nextMode === 'dark' ? 'Dark' : 'Light'} Mode`);
  };

  const handleSave = () => {
    onSaveSettings({
      division,
      rollNumber,
      motto,
      pfpType,
      pfpValue,
      palette,
      themeMode,
    });
    showToast('Settings saved successfully! ✨');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl p-5 border border-slate-200 dark:border-zinc-800 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>⚙️ Profile & Settings</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 transition"
          >
            ✕ Close
          </button>
        </div>

        {/* Section 1: PFP & Mascots */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 space-y-3">
          <span className="block font-bold text-slate-800 dark:text-slate-200 text-xs">📸 Profile Picture</span>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-50 dark:bg-zinc-800 border-2 border-blue-500 flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
              {pfpType === 'image' && pfpValue ? (
                <img src={pfpValue} alt="PFP Preview" className="w-full h-full object-cover" />
              ) : (
                <span>{pfpValue || '🦉'}</span>
              )}
            </div>

            <div className="space-y-1 flex-1">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs active:scale-95 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-slate-500 dark:text-zinc-400">Take photo or choose from gallery</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80 dark:border-zinc-700/60">
            <span className="block text-[10px] text-slate-500 dark:text-zinc-400 mb-1.5">Or choose a mascot:</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['🦉', '🚀', '⚡', '🦊', '🧪', '🤖', '🎓', '📚'].map((mascot) => (
                <button
                  key={mascot}
                  type="button"
                  onClick={() => handleMascotSelect(mascot)}
                  className={`w-9 h-9 rounded-full bg-white dark:bg-zinc-800 border flex items-center justify-center text-lg hover:scale-110 flex-shrink-0 active:scale-90 transition ${
                    pfpType === 'emoji' && pfpValue === mascot ? 'ring-2 ring-blue-500 border-blue-500 scale-105' : 'border-slate-200 dark:border-zinc-700'
                  }`}
                >
                  {mascot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Display Theme */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                🎨 Display Theme
              </span>
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5">
                Google Classroom clean aesthetic with bright accents
              </p>
            </div>

            <button
              type="button"
              data-testid="toggle-reading-mode"
              onClick={toggleReadingMode}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-900 dark:text-zinc-100 font-bold text-xs flex items-center gap-2 shadow-xs active:scale-95 transition"
            >
              <span>{themeMode === 'dark' ? '🌙' : '☀️'}</span>
              <span>{themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>
        </div>

        {/* Section 3: Study Status */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 space-y-1.5">
          <span className="block font-bold text-slate-800 dark:text-slate-200 text-xs">🎯 My Study Status</span>
          <input
            type="text"
            value={motto}
            onChange={(e) => setMotto(e.target.value)}
            className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-100 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Section 4: Section / Division Details */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 space-y-2">
          <span className="block font-bold text-slate-800 dark:text-slate-200 text-xs">🎓 My Division & Roll</span>
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div>
              <label className="block text-[10px] text-slate-500 dark:text-zinc-400 mb-1">Section</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="8-A">Section 8-A</option>
                <option value="8-B">Section 8-B</option>
                <option value="8-C">Section 8-C</option>
                <option value="8-D">Section 8-D</option>
                <option value="8-E">Section 8-E</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 dark:text-zinc-400 mb-1">Roll No.</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-md transition active:scale-98"
        >
          Save Changes ✨
        </button>

        <button
          onClick={onSignOut}
          className="w-full text-center text-xs text-rose-500 hover:text-rose-600 font-bold py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 transition active:scale-98"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
