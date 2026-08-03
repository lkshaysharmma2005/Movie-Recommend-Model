import React, { useEffect } from 'react';
import { X, Star, Bookmark, ExternalLink, Play, Globe, Clock, Film, Check } from 'lucide-react';

export function MovieModal({ movie, onClose, onToggleWatchlist, isBookmarked }) {
  useEffect(() => {
    if (!movie) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [movie, onClose]);

  if (!movie) return null;

  const youtubeTrailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' official trailer ' + movie.year)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn" onClick={onClose}>
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-white/10 rounded-3xl overflow-y-auto shadow-2xl shadow-cyan-950/40 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-950/80 border border-white/10 text-slate-300 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          onClick={onClose} 
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Backdrop Header */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden">
          {movie.backdrop || movie.poster ? (
            <img src={movie.backdrop || movie.poster} alt={movie.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-6 -mt-16 relative z-10">
          {/* Left Poster */}
          <div className="flex flex-col gap-4">
            {movie.poster ? (
              <img src={movie.poster} alt={movie.title} className="w-full aspect-[2/3] object-cover rounded-2xl border border-white/10 shadow-xl" />
            ) : (
              <div className="w-full aspect-[2/3] bg-slate-800 rounded-2xl border border-white/10 flex items-center justify-center">
                <Film className="w-12 h-12 text-slate-600" />
              </div>
            )}

            <button
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                isBookmarked 
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' 
                  : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25'
              }`}
              onClick={() => onToggleWatchlist(movie)}
            >
              {isBookmarked ? (
                <>
                  <Check className="w-4 h-4" /> In Watchlist
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" /> Add Watchlist
                </>
              )}
            </button>
          </div>

          {/* Right Info */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-400 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {movie.rating} / 10
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
                {movie.type}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold">
                {movie.year}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
              {movie.title}
            </h2>

            <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-400 mb-4">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" /> Runtime: <strong className="text-slate-200">{movie.runtime || 'N/A'}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-400" /> Language: <strong className="text-slate-200">{movie.language || 'English'}</strong>
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {movie.genres?.map((g, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-md bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-semibold">
                  {g}
                </span>
              ))}
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Synopsis</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {movie.summary}
              </p>
            </div>

            {/* Action Links */}
            <div className="flex flex-wrap gap-3 mt-auto">
              <a
                href={youtubeTrailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white font-semibold text-xs hover:bg-white/15 transition-all"
              >
                <Play className="w-4 h-4 fill-cyan-400 text-cyan-400" /> Watch Trailer
              </a>

              {movie.officialSite && (
                <a
                  href={movie.officialSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-slate-300 font-semibold text-xs hover:text-white transition-all"
                >
                  <Globe className="w-4 h-4" /> Official Page <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
