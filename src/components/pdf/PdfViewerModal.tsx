'use client';

import React, { useState, useEffect } from 'react';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: {
    id: string;
    title: string;
    subject: string;
    fileUrl?: string;
  } | null;
  onPostDoubt?: (doubtText: string, noteId: string) => void;
  showToast: (msg: string) => void;
}

interface SheetContent {
  title: string;
  subject: string;
  series: string;
  chapter: string;
  page: string;
  sections: Array<{
    heading: string;
    content: string;
  }>;
  footer: string;
}

export default function PdfViewerModal({
  isOpen,
  onClose,
  note,
  onPostDoubt,
  showToast,
}: PdfViewerModalProps) {
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1.0);
  const [doubtText, setDoubtText] = useState<string>('');
  const [sheetData, setSheetData] = useState<SheetContent | null>(null);

  useEffect(() => {
    if (isOpen && note) {
      setRotation(0);
      setZoom(1.0);
      setDoubtText('');

      // Fetch or determine sheet content
      const url = note.fileUrl || '/sheets/math-factorisation.json';
      fetch(url)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Not found');
        })
        .then((data) => setSheetData(data))
        .catch(() => {
          // Fallback dummy content
          setSheetData({
            title: note.title,
            subject: note.subject,
            series: `ICSE Grade 8 ${note.subject} Series`,
            chapter: note.title,
            page: '1 of 2',
            sections: [
              {
                heading: 'Classroom Notes & Exercises:',
                content: `Important revision points and practice questions for ${note.title}. Make sure to solve all parts in your school homework register.`,
              },
              {
                heading: 'Worked Problem Example:',
                content: 'Step 1: Write down given values.\nStep 2: Apply formula / identity.\nStep 3: Simplify and box final answer.',
              },
            ],
            footer: 'Page 1 of 2 • ClassNotes ICSE Grade 8',
          });
        });
    }
  }, [isOpen, note]);

  if (!isOpen || !note) return null;

  const handleRotate = () => {
    const nextRot = (rotation + 90) % 360;
    setRotation(nextRot);
    showToast(`Turned worksheet to ${nextRot}° 🔄`);
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(0.6, Math.min(2.0, Number((prev + delta).toFixed(1)))));
  };

  const handleSave = () => {
    showToast('📥 Worksheet saved to your phone for offline study!');
  };

  const handleDoubtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;
    if (onPostDoubt) {
      onPostDoubt(doubtText, note.id);
    }
    showToast(`Doubt posted: "${doubtText}" 💬`);
    setDoubtText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-fade-in">
      {/* Top Toolbar */}
      <div className="px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs z-30">
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-slate-200 hover:text-white font-extrabold py-1 px-2 rounded-lg bg-slate-800 active:scale-95 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>

        <div className="text-center">
          <h4 className="text-xs font-extrabold text-white truncate max-w-[170px]">
            {note.title}
          </h4>
          <span className="text-[9px] text-slate-400 font-medium">
            {sheetData?.page || 'Page 1 of 2'}
          </span>
        </div>

        <button
          onClick={handleSave}
          className="p-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold flex items-center gap-1 text-[11px] shadow active:scale-95 transition"
          title="Save PDF to phone"
        >
          <span>📥</span> <span>Save</span>
        </button>
      </div>

      {/* Floating Kids Tools (Turn & Zoom) */}
      <div className="absolute top-14 right-3.5 z-40 flex flex-col space-y-2">
        <button
          onClick={handleRotate}
          className="w-9 h-9 rounded-2xl bg-slate-800/95 hover:bg-slate-700 text-amber-300 border border-slate-700 shadow-xl flex items-center justify-center active:scale-90 transition font-bold"
          title="Turn / Rotate 90 degrees"
        >
          <span className="text-base">🔄</span>
        </button>
        <button
          onClick={() => handleZoom(0.1)}
          className="w-9 h-9 rounded-2xl bg-slate-800/95 hover:bg-slate-700 text-white border border-slate-700 shadow-xl flex items-center justify-center font-extrabold text-sm active:scale-90 transition"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => handleZoom(-0.1)}
          className="w-9 h-9 rounded-2xl bg-slate-800/95 hover:bg-slate-700 text-white border border-slate-700 shadow-xl flex items-center justify-center font-extrabold text-sm active:scale-90 transition"
          title="Zoom out"
        >
          -
        </button>
      </div>

      {/* PDF Sheet Viewer Container */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-900/60">
        <div
          id="pdfSheet"
          style={{
            transform: `rotate(${rotation}deg) scale(${zoom})`,
            transition: 'transform 0.3s ease',
          }}
          className="w-full max-w-[340px] aspect-[1/1.414] bg-white text-slate-900 shadow-2xl rounded-xl p-4 text-[10px] select-none origin-center flex flex-col justify-between"
        >
          {sheetData ? (
            <div>
              <div className="border-b pb-2 mb-3 text-center">
                <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-sans font-bold">
                  {sheetData.series}
                </span>
                <strong className="text-xs text-slate-900 font-sans block mt-0.5">
                  {sheetData.chapter}
                </strong>
              </div>

              <div className="space-y-2.5 text-slate-800 font-sans">
                {sheetData.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="font-bold text-slate-900">{sec.heading}</p>
                    <p className="pl-2 text-slate-700 font-mono bg-slate-50 border border-slate-200 p-1.5 rounded whitespace-pre-line text-[9px] leading-relaxed">
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              Loading Worksheet...
            </div>
          )}

          <div className="text-[8px] text-slate-400 text-center border-t pt-1 font-sans font-medium">
            {sheetData?.footer || 'ClassNotes ICSE Grade 8'}
          </div>
        </div>
      </div>

      {/* Bottom Quick Doubt Box */}
      <form onSubmit={handleDoubtSubmit} className="bg-slate-900 border-t border-slate-800 p-2.5 z-30">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={doubtText}
            onChange={(e) => setDoubtText(e.target.value)}
            placeholder="Ask a doubt about this worksheet..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!doubtText.trim()}
            className="px-3.5 py-2 accent-btn rounded-xl text-xs font-bold shadow active:scale-95 transition whitespace-nowrap flex items-center gap-1.5 disabled:opacity-50"
          >
            <span>Send</span>
            <span>🚀</span>
          </button>
        </div>
      </form>
    </div>
  );
}
