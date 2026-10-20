'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    deferredPrompt?: any;
  }
}

export default function ServiceWorkerRegister() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if app is already running standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Register Service Worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[PWA] Service Worker registered:', reg.scope);
          })
          .catch((err) => {
            console.warn('[PWA] Service Worker registration failed:', err);
          });
      });
    }

    // Capture beforeinstallprompt for 1-tap install
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setCanInstall(true);
      window.dispatchEvent(new CustomEvent('pwa-can-install'));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      window.deferredPrompt = null;
      setIsInstalled(true);
      setCanInstall(false);
      console.log('[PWA] App successfully installed to Home Screen');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!window.deferredPrompt) {
      alert('To install on iOS / iPad: tap Share ⎋ and choose "Add to Home Screen" ➕');
      return;
    }
    const promptEvent = window.deferredPrompt;
    promptEvent.prompt();
    const result = await promptEvent.userChoice;
    if (result.outcome === 'accepted') {
      console.log('[PWA] User accepted installation prompt');
      setCanInstall(false);
    }
    window.deferredPrompt = null;
  };

  if (!canInstall || isInstalled || isDismissed) {
    return null;
  }

  return (
    <div
      role="banner"
      aria-label="Install App Banner"
      className="fixed bottom-20 left-3 right-3 max-w-md mx-auto z-40 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 p-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-fade-in"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-xl flex-shrink-0">
          📱
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
            Install ICSE Grade 8 Hub
          </p>
          <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate">
            Add to your home screen for fast offline study
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 bg-neutral-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-[11px] rounded-xl shadow-xs active:scale-95 transition"
        >
          Install
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 text-xs rounded-lg"
          title="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
