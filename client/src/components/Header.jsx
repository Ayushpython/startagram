import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'HOME', path: '/home' },
    { name: 'MARKETPLACE', path: '/marketplace' },
  ];
  if (user) navLinks.push({ name: 'MY BLUEPRINTS', path: '/my-blueprints' }, { name: 'WALLET', path: '/wallet' });

  return (
    <header className="fixed w-full top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/home" className="font-mono text-xl font-bold uppercase tracking-wider text-white hover:text-primary transition-colors flex items-center gap-2">
          STARTAGRAM <span className="text-primary">/</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`font-mono text-sm tracking-widest uppercase transition-colors ${
                location.pathname === link.path ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Auth / Profile Actions */}
        <div className="flex items-center gap-4 border-l border-white/10 pl-6">
          {user ? (
            <>
              <span className="font-mono text-sm text-gray-300 hidden sm:block">
                [{user.username}]
              </span>
              <button 
                className="px-5 py-2 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-gray-300 hover:text-red-400 text-sm font-semibold uppercase tracking-wider transition-all"
                onClick={logout}
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-mono text-sm uppercase text-gray-400 hover:text-white transition-colors px-4">
                LOGIN
              </Link>
              <Link to="/register" className="px-5 py-2.5 bg-primary text-black hover:bg-white text-sm font-bold uppercase tracking-wider transition-colors duration-300">
                REGISTER
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
