import React, { useState } from 'react';
import { Star, Bookmark, Info, Film } from 'lucide-react';

export function MovieCard({ movie, onSelectMovie, onToggleWatchlist, isBookmarked }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative bg-slate-900/70 border border-white/10 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/15 cursor-pointer">
      {/* Poster Image Wrapper */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950" onClick={() => onSelectMovie(movie)}>
        {!imageError && movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-slate-900 to-slate-950">
            <Film className="w-10 h-10 text-slate-600 mb-2" />
            <span className="text-xs font-bold text-slate-300 line-clamp-2">{movie.title}</span>
            <span className="text-[10px] text-slate-500 mt-1">{movie.year}</span>
          </div>
        )}

        {/* Top Rating Badge */}
        <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-xs font-bold text-slate-100 flex items-center gap-1 z-10">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{movie.rating}</span>
        </div>

        {/* Media Type Badge */}
        <div className="absolute bottom-2.5 left-2.5 bg-purple-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow z-10">
          {movie.type}
        </div>

        {/* Bookmark Toggle Button */}
        <button
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 z-20 cursor-pointer ${
            isBookmarked 
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' 
              : 'bg-slate-950/75 border-white/10 text-slate-400 hover:bg-cyan-400 hover:text-slate-950 hover:scale-110'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(movie);
          }}
          title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-cyan-400' : ''}`} />
        </button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30">
            <Info className="w-4 h-4" /> Quick View
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-3.5 flex flex-col gap-1.5" onClick={() => onSelectMovie(movie)}>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-bold text-white truncate" title={movie.title}>{movie.title}</h3>
          <span className="text-xs font-medium text-slate-400 shrink-0">{movie.year}</span>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {movie.genres && movie.genres.slice(0, 2).map((g, idx) => (
            <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
