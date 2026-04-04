import React from 'react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/home', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/messages', label: 'Messages' },
  { to: '/my-blueprints', label: 'My Blueprints' },
  { to: '/profile', label: 'Profile' },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:block h-fit p-4 glass-card border border-white/10 sticky top-28 bg-[#0a0a0a]">
      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'block px-4 py-3 text-sm font-mono tracking-widest uppercase transition-all duration-300 border-l-2',
                isActive
                  ? 'border-primary bg-white/5 text-primary'
                  : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-white',
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
