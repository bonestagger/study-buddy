'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import BottomNav, { TabType } from '@/components/layout/BottomNav';
import SubjectGrid from '@/components/home/SubjectGrid';
import HomeworkAlertCard from '@/components/home/HomeworkAlertCard';
import WorksheetCard from '@/components/home/WorksheetCard';
import ShareModal from '@/components/share/ShareModal';
import PdfViewerModal from '@/components/pdf/PdfViewerModal';
import RequestsTab from '@/components/requests/RequestsTab';
import DoubtsTab from '@/components/doubts/DoubtsTab';
import MyDeskTab from '@/components/profile/MyDeskTab';
import SettingsSheet from '@/components/settings/SettingsSheet';
import NotificationsDrawer from '@/components/notifications/NotificationsDrawer';
import LoginGate from '@/components/auth/LoginGate';
import OnboardingModal from '@/components/auth/OnboardingModal';
import { calculateRank } from '@/lib/ranks';
import { getSubject } from '@/lib/subjects';

export default function Home() {
  // User & Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: 'student-1',
    name: 'Aarav Patel',
    email: 'aarav.patel@gmail.com',
    division: '8-B',
    rollNumber: '14',
    motto: 'Prepping for Math UT2 📚',
    xp: 380,
    rankTitle: 'Silver',
    palette: 'palette-retro',
    themeMode: 'light',
    pfpType: 'emoji',
    pfpValue: '🦉',
  });

  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeSubject, setActiveSubject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data states
  const [notes, setNotes] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // Modals
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [activePdfNote, setActivePdfNote] = useState<any | null>(null);

  // Toast system
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimeout, setToastTimeout] = useState<NodeJS.Timeout | null>(null);

  

  const showToast = (msg: string) => {
    if (toastTimeout) clearTimeout(toastTimeout);
    setToastMessage(msg);
    const to = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
    setToastTimeout(to);
  };

  // Load Initial Data
  const loadUserData = async (email: string) => {
    try {
      const res = await fetch(`/api/user/settings?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
        if (data.bookmarks) {
          setBookmarks(data.bookmarks);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadRequests = async () => {
    try {
      const res = await fetch('/api/requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadDoubts = async () => {
    try {
      const res = await fetch('/api/qna');
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadNotifications = async (email: string) => {
    try {
      const res = await fetch(`/api/notifications?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadUserData(currentUser.email);
    loadNotes();
    loadRequests();
    loadDoubts();
    loadNotifications(currentUser.email);
  }, []);

  // Demo Login Handler
  const handleDemoLogin = async (name: string, email: string) => {
    await loadUserData(email);
    setIsLoggedIn(true);
    setIsOnboardingOpen(false);
    showToast(`Welcome ${name}! 🎉`);
  };

  const handleOnboardingComplete = async (division: string, rollNumber: string) => {
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          division,
          rollNumber,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCurrentUser(updated);
        setIsOnboardingOpen(false);
        setIsLoggedIn(true);
        showToast(`Welcome ${updated.name} (${division})! 🎉`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Give Kudos
  const handleKudos = async (noteId: string) => {
    try {
      const res = await fetch(`/api/notes/${noteId}/kudo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: currentUser.email }),
      });
      if (res.ok) {
        const data = await res.json();
        setNotes((prev) =>
          prev.map((n) =>
            n.id === noteId
              ? {
                  ...n,
                  kudosCount: data.kudosCount,
                  kudos: data.active
                    ? [...(n.kudos || []), { userId: currentUser.id }]
                    : (n.kudos || []).filter((k: any) => k.userId !== currentUser.id),
                }
              : n
          )
        );
        if (data.active) {
          showToast('❤️ Liked worksheet! (+10 XP to classmate author)');
        } else {
          showToast('🤍 Removed like from worksheet');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Bookmark
  const handleBookmark = async (noteId: string) => {
    try {
      const res = await fetch(`/api/notes/${noteId}/bookmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: currentUser.email }),
      });
      if (res.ok) {
        const data = await res.json();
        await loadUserData(currentUser.email);
        loadNotes();
        showToast(data.bookmarked ? '🔖 Saved for Exam Prep!' : 'Removed from bookmarks');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fulfill Note Request
  const handleFulfillRequest = async (requestId: string, studentName: string) => {
    try {
      const res = await fetch(`/api/requests/${requestId}/fulfill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: currentUser.email }),
      });
      if (res.ok) {
        const data = await res.json();
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, isFulfilled: true } : r))
        );
        setCurrentUser((prev) => ({
          ...prev,
          xp: data.newTotalXP,
          rankTitle: calculateRank(data.newTotalXP).title,
        }));
        showToast(`🎉 +75 XP! Sent notes to ${studentName}!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create Request
  const handleCreateRequest = async (sub: string, title: string, desc: string) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: sub,
          title,
          description: desc,
          userEmail: currentUser.email,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setRequests((prev) => [created, ...prev]);
        showToast(`Request for "${title}" posted!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Upvote Question
  const handleUpvoteDoubt = async (questionId: string) => {
    try {
      const res = await fetch(`/api/qna/${questionId}/upvote`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions((prev) =>
          prev.map((q) => (q.id === questionId ? { ...q, upvotes: data.upvotes } : q))
        );
        showToast('▲ Marked doubt as helpful!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Post Doubt
  const handlePostDoubt = async (sub: string, title: string, noteId?: string) => {
    try {
      const res = await fetch('/api/qna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: sub,
          title,
          userEmail: currentUser.email,
          noteId,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setQuestions((prev) => [created, ...prev]);
        showToast('Doubt posted to Class Doubts board! 💬');
        setActiveTab('qna');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Post Answer
  const handlePostAnswer = async (questionId: string, answerText: string) => {
    try {
      const res = await fetch(`/api/qna/${questionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: answerText,
          userEmail: currentUser.email,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  isSolved: true,
                  answers: [data.answer, ...q.answers],
                }
              : q
          )
        );
        setCurrentUser((prev) => ({
          ...prev,
          xp: data.newTotalXP,
          rankTitle: calculateRank(data.newTotalXP).title,
        }));
        showToast('🎉 +25 XP! Solution posted to classmate doubt!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Settings
  const handleSaveSettings = async (newSettings: any) => {
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          ...newSettings,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCurrentUser(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Mark notifications read
  const handleMarkNotificationsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: currentUser.email }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered Notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchesSub = activeSubject === 'ALL' || n.subject === activeSubject;
      const matchesQuery =
        !searchQuery ||
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSub && matchesQuery;
    });
  }, [notes, activeSubject, searchQuery]);

  const homeworkDueNote = useMemo(() => {
    return notes.find((n) => n.isHomework || n.type === 'HW') || null;
  }, [notes]);

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      className={`min-h-screen w-full flex justify-center bg-slate-100 dark:bg-zinc-950 ${
        currentUser.themeMode === 'dark' ? 'dark' : ''
      }`}
    >
      <div
        className={`${currentUser.palette} ${
          currentUser.themeMode === 'dark' ? 'app-dark mode-dark' : 'app-light mode-light'
        } theme-screen relative w-full max-w-2xl min-h-screen shadow-md flex flex-col transition-colors duration-200 border-x border-slate-200 dark:border-zinc-800 bg-[#f8fafd] dark:bg-[#121212]`}
      >
        {/* Strict Login Gate */}
        {!isLoggedIn ? (
          <LoginGate onDemoLogin={handleDemoLogin} />
        ) : (
          <>
            {/* Top Header */}
            <AppHeader
                user={currentUser}
                unreadCount={unreadNotifs}
                onOpenNotifications={() => setIsNotifOpen(true)}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />

              {/* Main Content Areas */}
              {activeTab === 'home' && (
                <main className="flex-1 overflow-y-auto pb-24 px-3.5 pt-3 space-y-3.5 animate-fade-in">
                  {/* Search Bar */}
                  <div className="relative">
                    <svg
                      className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search chapter or topic (e.g. Factorisation, Valency)..."
                      className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-slate-100 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-xs font-medium"
                    />
                  </div>

                  {/* Single-Line Homework Due Reminder Card */}
                  <HomeworkAlertCard
                    homeworkNote={homeworkDueNote}
                    onOpenPdf={(note) => setActivePdfNote(note)}
                  />

                  {/* 4 Large Subject Buttons */}
                  <SubjectGrid
                    activeSubject={activeSubject}
                    onSelectSubject={(sub) => {
                      setActiveSubject(sub);
                      const label = sub === 'ALL' ? 'All Subjects' : getSubject(sub).fullName;
                      showToast(`Showing: ${label}`);
                    }}
                    totalCount={notes.length}
                  />

                  {/* Notes Feed */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between px-0.5">
                      <span className="text-[11px] font-extrabold theme-text-muted uppercase tracking-wider">
                        {activeSubject === 'ALL'
                          ? 'Recent Worksheets'
                          : `${getSubject(activeSubject).fullName} Worksheets`}
                      </span>
                      <span className="text-[10px] theme-text-muted">
                        {filteredNotes.length} available
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {filteredNotes.map((note) => (
                        <WorksheetCard
                          key={note.id}
                          note={note}
                          currentUserId={currentUser.id}
                          onOpenPdf={(n) => setActivePdfNote(n)}
                          onKudos={handleKudos}
                          onBookmark={handleBookmark}
                        />
                      ))}
                    </div>
                  </div>
                </main>
              )}

              {activeTab === 'requests' && (
                <RequestsTab
                  requests={requests}
                  onFulfill={handleFulfillRequest}
                  onCreateRequest={handleCreateRequest}
                />
              )}

              {activeTab === 'upload' && (
                <div className="flex-1 flex flex-col justify-center items-center p-6 text-center">
                  <div className="w-16 h-16 rounded-3xl accent-btn flex items-center justify-center text-3xl mb-3 shadow-lg">
                    🚀
                  </div>
                  <h3 className="text-base font-bold theme-text-main">Ready to Share Notes?</h3>
                  <p className="text-xs theme-text-muted mt-1 max-w-[240px] mb-4">
                    Earn +50 XP and help your ICSE Grade 8 classmates prepare for exams!
                  </p>
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="accent-btn px-6 py-3 rounded-2xl font-bold text-xs shadow-lg active:scale-95 transition"
                  >
                    Open 3-Step Share Flow 📸
                  </button>
                </div>
              )}

              {activeTab === 'qna' && (
                <DoubtsTab
                  questions={questions}
                  onUpvote={handleUpvoteDoubt}
                  onPostDoubt={handlePostDoubt}
                  onPostAnswer={handlePostAnswer}
                />
              )}

              {activeTab === 'profile' && (
                <MyDeskTab
                  user={currentUser}
                  bookmarks={bookmarks}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                  onOpenPdf={(note) => setActivePdfNote(note)}
                />
              )}

              {/* Bottom Navigation */}
              <BottomNav
                activeTab={activeTab}
                onTabChange={(tab) => {
                  if (tab === 'upload') {
                    setIsShareModalOpen(true);
                  } else {
                    setActiveTab(tab);
                  }
                }}
              />
            </>
          )}

          {/* Interactive Modals */}
          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            onSuccess={() => {
              loadNotes();
              loadUserData(currentUser.email);
            }}
            showToast={showToast}
            userEmail={currentUser.email}
          />

          <PdfViewerModal
            isOpen={!!activePdfNote}
            note={activePdfNote}
            onClose={() => setActivePdfNote(null)}
            onPostDoubt={(doubtText, noteId) => {
              handlePostDoubt(activePdfNote?.subject || 'MATH', doubtText, noteId);
            }}
            showToast={showToast}
          />

          <SettingsSheet
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            user={currentUser}
            onSaveSettings={handleSaveSettings}
            onSignOut={() => {
              setIsLoggedIn(false);
              setIsSettingsOpen(false);
              showToast('Signed out successfully.');
            }}
            showToast={showToast}
          />

          <NotificationsDrawer
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
            notifications={notifications}
            onMarkRead={handleMarkNotificationsRead}
          />

          <OnboardingModal
            isOpen={isOnboardingOpen}
            userName={currentUser.name}
            onComplete={handleOnboardingComplete}
          />

          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="fixed top-5 inset-x-4 max-w-md mx-auto z-50 bg-blue-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between animate-fade-in">
              <span>{toastMessage}</span>
              <button
                onClick={() => setToastMessage(null)}
                className="text-white/80 hover:text-white font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
  );
}
