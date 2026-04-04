import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center min-h-[calc(100vh-80px)] justify-center">
      
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-white/10 bg-white/5 backdrop-blur-md mb-8">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        <span className="font-mono text-xs uppercase tracking-widest text-gray-300">Live on Vercel & Railway</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black uppercase tracking-tighter leading-[0.9] mb-8 max-w-5xl">
        <span className="text-white">Buy, sell, and co-build</span><br />
        <span className="text-gray-600">startup blueprints.</span>
      </h1>
      
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
        Access complete validated startup plans with problem statements, market research, features, and monetization strategies. 
        <span className="text-white hidden sm:inline"> Save time. Build faster.</span>
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-5 mb-24 w-full sm:w-auto">
        {user ? (
          <Link to="/marketplace" className="px-8 py-5 bg-primary hover:bg-white text-black font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-3">
            Browse Blueprints 
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        ) : (
          <>
            <Link to="/register" className="px-10 py-5 bg-primary hover:bg-white text-black font-bold uppercase tracking-widest transition-colors shadow-glow flex items-center justify-center gap-3">
              Get Started
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
            <Link to="/login" className="px-10 py-5 border border-white/10 hover:border-white text-white font-bold uppercase tracking-widest transition-colors flex items-center justify-center">
              Login
            </Link>
          </>
        )}
      </div>

      {/* Stats Divider / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 text-left border-t border-white/10 pt-16 w-full opacity-80">
        <div className="border-l-2 border-primary pl-6">
          <div className="text-4xl font-black text-white mb-2">2,400+</div>
          <div className="font-mono text-sm uppercase tracking-widest text-gray-500">Blueprints</div>
        </div>
        <div className="border-l-2 border-primary pl-6">
          <div className="text-4xl font-black text-white mb-2">1,200+</div>
          <div className="font-mono text-sm uppercase tracking-widest text-gray-500">Active Users</div>
        </div>
        <div className="border-l-2 border-primary pl-6">
          <div className="text-4xl font-black text-white mb-2">$500k+</div>
          <div className="font-mono text-sm uppercase tracking-widest text-gray-500">Dev Payouts</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
