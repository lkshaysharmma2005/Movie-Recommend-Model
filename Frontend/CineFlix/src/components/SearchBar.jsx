import React from 'react';
import { Search, X, Loader2, Film } from 'lucide-react';

export function SearchBar({ value, onChange, onClear, isLoading, totalResults }) {
  return (
    <div className="mb-6">
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-5 w-5 h-5 text-cyan-400 pointer-events-none" />

          <input
            type="text"
            className="w-full pl-14 pr-14 py-4 text-base sm:text-lg bg-slate-900/80 border border-white/10 rounded-2xl text-white placeholder-slate-500 backdrop-blur-xl outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/15 transition-all duration-300 shadow-xl"
            placeholder="Type any movie or show name (e.g. Inception, Batman, Stranger Things)..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
          />

          {isLoading ? (
            <Loader2 className="absolute right-5 w-5 h-5 text-cyan-400 animate-spin" />
          ) : value ? (
            <button 
              className="absolute right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-rose-500 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              onClick={onClear}
              title="Clear search query"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block absolute right-5 px-2.5 py-1 text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 rounded-md">
              Live API Search
            </kbd>
          )}
        </div>
      </div>

      {/* Query status line */}
      <div className="mt-2.5 px-2">
        {value ? (
          <p className="text-sm text-slate-400">
            Showing results for <span className="font-bold text-cyan-400">"{value}"</span>
            {totalResults !== undefined && (
              <span className="text-slate-500"> ({totalResults} found)</span>
            )}
          </p>
        ) : (
          <p className="text-sm text-slate-400 flex items-center gap-1.5">
            <Film className="w-4 h-4 text-slate-500" /> Discovering movies & shows across global databases
          </p>
        )}
      </div>
    </div>
  );
}
