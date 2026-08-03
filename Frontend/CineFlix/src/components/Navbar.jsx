import React from 'react';
import { Film, Bookmark, Settings } from 'lucide-react';

export function Navbar({ watchlistCount, onOpenWatchlist, onOpenSettings }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <Film className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              CINE<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">FLIX</span>
            </span>
            <span className="block text-xs font-medium text-slate-400">Movie & Show Finder</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Watchlist Trigger */}
          <button 
            className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/40 text-slate-100 text-sm font-semibold transition-all duration-200 cursor-pointer"
            onClick={onOpenWatchlist}
            title="View Saved Watchlist"
          >
            <Bookmark className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Watchlist</span>
            {watchlistCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-xs font-extrabold animate-bounce">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Settings Trigger */}
          <button 
            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-white transition-all cursor-pointer"
            onClick={onOpenSettings}
            title="API Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
