import React from 'react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/messages', label: 'Messages' },
  { to: '/profile', label: 'Profile' },
];

export default function Sidebar() {
  return (
    <aside className="hidden h-fit rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 lg:block">
      <nav className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'block rounded-xl px-4 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
