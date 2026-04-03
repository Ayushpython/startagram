import React, { useMemo, useState } from 'react';

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M9 17a3 3 0 0 0 6 0" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
    </svg>
  );
}

export default function Navbar({ isDark, onToggleDarkMode, onOpenCreatePost, currentUser }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [search, setSearch] = useState('');

  const initials = useMemo(() => {
    return currentUser.name
      .split(' ')
      .map((item) => item[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [currentUser.name]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:gap-5">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600" />
          <span className="hidden text-lg font-semibold tracking-tight sm:inline">PulseHub</span>
        </div>

        <div className="hidden flex-1 sm:block">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search creators, posts, and topics"
            className="w-full rounded-xl border-slate-300 bg-slate-100/80 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <button
          onClick={onOpenCreatePost}
          className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Create
        </button>

        <button
          onClick={onToggleDarkMode}
          className="rounded-xl border border-slate-300 p-2 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900"
          aria-label="Toggle dark mode"
        >
          <MoonIcon />
          <span className="sr-only">{isDark ? 'Disable dark mode' : 'Enable dark mode'}</span>
        </button>

        <button
          className="relative rounded-xl border border-slate-300 p-2 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900"
          aria-label="Notifications"
        >
          <BellIcon />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-rose-500" />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl border border-slate-300 px-2 py-1.5 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900"
          >
            <img src={currentUser.avatar} alt={currentUser.name} className="h-8 w-8 rounded-full object-cover" />
            <span className="hidden text-sm font-medium sm:inline">{currentUser.username}</span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-2 flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-700">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold dark:bg-slate-700">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">@{currentUser.username}</p>
                </div>
              </div>
              <button className="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800">
                Account settings
              </button>
              <button className="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
