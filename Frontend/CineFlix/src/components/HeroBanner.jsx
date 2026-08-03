import React from 'react';
import { Star, Info, Bookmark, Sparkles, Check } from 'lucide-react';

export function HeroBanner({ movie, onSelectMovie, onToggleWatchlist, isBookmarked }) {
  if (!movie) return null;

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-8 border border-white/10 flex items-end shadow-2xl shadow-cyan-950/20">
      {/* Background Media */}
      <div className="absolute inset-0">
        {movie.backdrop || movie.poster ? (
          <img 
            src={movie.backdrop || movie.poster} 
            alt={movie.title} 
            className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.05]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
      </div>

      {/* Hero Content Box */}
      <div className="relative z-10 p-6 sm:p-8 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-3 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" /> Featured Recommendation
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-2 drop-shadow-md">
          {movie.title}
        </h1>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-2.5 text-sm text-slate-300 mb-3">
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-4 h-4 fill-amber-400" /> {movie.rating} / 10
          </span>
          <span className="text-slate-600">•</span>
          <span className="font-semibold text-slate-200">{movie.year}</span>
          <span className="text-slate-600">•</span>
          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs font-semibold">{movie.type}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">{movie.genres?.slice(0, 3).join(', ')}</span>
        </div>

        {/* Summary */}
        <p className="text-sm text-slate-300 mb-5 line-clamp-2 leading-relaxed">
          {movie.summary}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            onClick={() => onSelectMovie(movie)}
          >
            <Info className="w-4 h-4" /> View Details
          </button>

          <button 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border backdrop-blur-md transition-all duration-200 cursor-pointer ${
              isBookmarked 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                : 'bg-white/10 border-white/15 text-white hover:bg-white/15'
            }`}
            onClick={() => onToggleWatchlist(movie)}
          >
            {isBookmarked ? (
              <>
                <Check className="w-4 h-4" /> In Watchlist
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" /> Add to Watchlist
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
