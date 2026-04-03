import React from 'react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/home', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/marketplace', label: 'Market' },
  { to: '/messages', label: 'Messages' },
  { to: '/profile', label: 'Profile' },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/90 px-2 py-2 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'rounded-lg px-2 py-2 text-center text-xs font-medium transition',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
