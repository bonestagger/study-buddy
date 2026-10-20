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
  const [palette, setPalette] = useState(user.palette || 'palette-retro');
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

  const handlePaletteSelect = (pal: string, name: string) => {
    setPalette(pal);
    showToast(`Applied ${name}! ✨`);
  };

  const toggleReadingMode = () => {
    const nextMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
    showToast(`Switched to ${nextMode === 'dark' ? 'Retro Terminal (Dark)' : 'Retro Paper (Light)'} Mode`);
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
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
      <div className="theme-card rounded-t-3xl p-4 border-t space-y-4 max-h-[92%] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b theme-border">
          <h3 className="text-xs font-extrabold theme-text-main flex items-center gap-1.5">
            <span>⚙️ My App Settings</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-bold px-2 py-0.5 rounded-lg theme-subtle"
          >
            ✕ Done
          </button>
        </div>

        {/* Section 1: PFP & Mascots */}
        <div className="p-3 rounded-2xl theme-subtle border theme-border space-y-2.5">
          <span className="block font-bold theme-text-main text-xs">📸 My Profile Picture</span>

          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-full overflow-hidden accent-btn flex items-center justify-center text-white text-2xl ring-2 ring-indigo-500/50 shadow flex-shrink-0" style={{ width: 52, height: 52 }}>
              {pfpType === 'image' && pfpValue ? (
                <img src={pfpValue} alt="PFP Preview" className="w-full h-full object-cover" />
              ) : (
                <span>{pfpValue || '🦉'}</span>
              )}
            </div>

            <div className="space-y-1 flex-1">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 accent-btn text-xs font-bold rounded-xl shadow active:scale-95 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Upload My Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[9px] theme-text-muted">Take photo with camera or choose from gallery</p>
            </div>
          </div>

          <div className="pt-2 border-t theme-border">
            <span className="block text-[10px] theme-text-muted mb-1.5">Or choose a mascot:</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['🦉', '🚀', '⚡', '🦊', '🧪', '🤖'].map((mascot) => (
                <button
                  key={mascot}
                  type="button"
                  onClick={() => handleMascotSelect(mascot)}
                  className={`w-9 h-9 rounded-full theme-card border flex items-center justify-center text-lg hover:scale-110 flex-shrink-0 active:scale-90 transition ${
                    pfpType === 'emoji' && pfpValue === mascot ? 'ring-2 ring-indigo-500 scale-105' : ''
                  }`}
                >
                  {mascot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Simple Retro Black & White Theme */}
        <div className="p-3.5 rounded-2xl theme-subtle border border-slate-200 dark:border-zinc-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="block font-bold theme-text-main text-xs flex items-center gap-1.5">
              <span>📼 Theme: Retro Black & White</span>
            </span>
            <span className="text-[9px] px-2.5 py-0.5 rounded-full font-bold bg-neutral-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
              Active Theme
            </span>
          </div>

          <p className="text-[10px] theme-text-muted leading-relaxed">
            Minimalist, high-contrast monochrome design engineered for zero eye strain and maximum study focus.
          </p>

          {/* Retro Monochrome Palette Swatches */}
          <div className="p-2.5 rounded-xl border border-slate-200/80 dark:border-zinc-700/60 bg-white dark:bg-zinc-800/80 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded border border-slate-300 dark:border-zinc-600 bg-white inline-block shadow-xs" title="Paper White #F8F9FA" />
              <span className="w-6 h-6 rounded border border-slate-300 dark:border-zinc-600 bg-neutral-900 inline-block shadow-xs" title="Jet Ink #202124" />
              <span className="w-6 h-6 rounded border border-slate-300 dark:border-zinc-600 bg-slate-500 inline-block shadow-xs" title="Charcoal #5F6368" />
              <span className="w-6 h-6 rounded border border-slate-300 dark:border-zinc-600 bg-slate-100 inline-block shadow-xs" title="Canvas #F1F3F4" />
            </div>
            <span className="text-[10px] font-mono font-bold theme-text-main">
              B&W RETRO
            </span>
          </div>

          {/* Reading Mode Switcher */}
          <div className="flex items-center justify-between pt-2 border-t theme-border text-xs">
            <span className="theme-text-main font-semibold">Display Mode</span>
            <button
              type="button"
              data-testid="toggle-reading-mode"
              onClick={toggleReadingMode}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 theme-text-main font-semibold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition"
            >
              <span>{themeMode === 'dark' ? '🌙' : '☀️'}</span>
              <span>{themeMode === 'dark' ? 'Retro Terminal (Dark)' : 'Retro Paper (Light)'}</span>
            </button>
          </div>
        </div>

        {/* Section 3: Study Status */}
        <div className="p-3 rounded-2xl theme-subtle border theme-border space-y-1.5">
          <span className="block font-bold theme-text-main text-xs">🎯 My Study Status</span>
          <input
            type="text"
            value={motto}
            onChange={(e) => setMotto(e.target.value)}
            className="w-full theme-input border rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
          />
        </div>

        {/* Section 4: Section / Division Details */}
        <div className="p-3 rounded-2xl theme-subtle border theme-border space-y-2">
          <span className="block font-bold theme-text-main text-xs">🎓 My Division</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] theme-text-muted mb-0.5">Section</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full theme-input border rounded-xl p-2.5 font-bold"
              >
                <option value="8-A">Section 8-A</option>
                <option value="8-B">Section 8-B</option>
                <option value="8-C">Section 8-C</option>
                <option value="8-D">Section 8-D</option>
                <option value="8-E">Section 8-E</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] theme-text-muted mb-0.5">Roll No.</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full theme-input border rounded-xl p-2.5 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Section 5: PWA Mobile App Installation */}
        <div className="p-3 rounded-2xl theme-subtle border theme-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="block font-bold theme-text-main text-xs flex items-center gap-1.5">
              <span>📱</span> Mobile App (PWA)
            </span>
            <span className="text-[10px] text-emerald-500 font-bold">Offline Ready</span>
          </div>
          <p className="text-[10px] theme-text-muted leading-relaxed">
            Install this hub to your phone or tablet home screen for a full-screen study experience and offline worksheet access.
          </p>
          <button
            type="button"
            data-testid="pwa-install-btn"
            onClick={() => {
              if (window.deferredPrompt) {
                window.deferredPrompt.prompt();
              } else {
                showToast('📱 Browser menu (⋮ or Share) ➔ "Add to Home Screen"');
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 theme-text-main font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition"
          >
            <span>📲</span> Install to Home Screen
          </button>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3.5 accent-btn font-extrabold rounded-2xl text-xs shadow-md transition active:scale-98"
        >
          Save Changes ✨
        </button>

        <button
          onClick={onSignOut}
          className="w-full text-center text-xs text-rose-500 font-bold py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 transition active:scale-98"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
