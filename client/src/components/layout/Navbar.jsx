import React, { useMemo, useState } from 'react';

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
      <path d="M9 17a3 3 0 0 0 6 0" />
    </svg>
  );
}

export default function Navbar({ onOpenCreatePost, currentUser }) {
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
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-primary shadow-glow flex items-center justify-center">
             <span className="font-mono text-black font-black text-xs">SB</span>
          </div>
          <span className="hidden text-xl font-black tracking-widest uppercase text-white sm:inline">SideBuilds /</span>
        </div>

        <div className="hidden flex-1 sm:block max-w-xl mx-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blueprints, users, or concepts [CTRL K]"
            className="w-full border border-white/20 bg-black/50 px-4 py-2.5 text-sm font-mono text-white placeholder-gray-600 focus:border-primary focus:bg-black focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenCreatePost}
            className="border border-primary bg-primary/10 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-black hover:shadow-glow transition-all duration-300"
          >
            Create
          </button>

          <button
            className="relative border border-white/20 p-2 text-gray-400 hover:border-white/50 hover:text-white transition-colors bg-black"
            aria-label="Notifications"
          >
            <BellIcon />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 bg-primary shadow-glow" />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-3 border border-white/20 pl-2 pr-4 py-1 hover:border-white/50 transition-colors bg-black"
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="h-8 w-8 object-cover border border-white/10" />
              <span className="hidden text-xs font-mono uppercase tracking-widest text-gray-300 sm:inline">{currentUser.username}</span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 border border-white/20 bg-[#0a0a0a] p-2 shadow-2xl">
                <div className="mb-2 flex items-center gap-3 border-b border-white/10 pb-3 p-2">
                  <div className="flex h-10 w-10 items-center justify-center bg-white/10 text-xs font-mono text-primary">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-wider">{currentUser.name}</p>
                    <p className="text-xs font-mono text-gray-500">@{currentUser.username}</p>
                  </div>
                </div>
                <button className="w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-widest text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                  Settings /
                </button>
                <button className="w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-widest text-primary hover:bg-primary/10 hover:text-primary transition-colors">
                  Logout /
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
