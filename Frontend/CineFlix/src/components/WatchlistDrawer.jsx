import React from 'react';
import { X, Bookmark, Trash2, Star, Film } from 'lucide-react';

export function WatchlistDrawer({ 
  isOpen, 
  onClose, 
  watchlist, 
  onRemove, 
  onClearAll, 
  onSelectMovie 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end animate-fadeIn" onClick={onClose}>
      <div 
        className="w-full max-w-md h-full bg-slate-900 border-l border-white/10 flex flex-col shadow-2xl animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">My Watchlist</h3>
            <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-xs font-extrabold">
              {watchlist.length}
            </span>
          </div>

          <button className="text-slate-400 hover:text-white transition-colors cursor-pointer" onClick={onClose} title="Close Watchlist">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {watchlist.length === 0 ? (
            <div className="text-center py-16 px-4 text-slate-500">
              <Film className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <p className="text-base font-bold text-slate-300 mb-1">Your Watchlist is Empty</p>
              <p className="text-xs text-slate-400">
                Click the bookmark icon on any movie card to save movies for later viewing!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {watchlist.map((movie) => (
                <div key={movie.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-white/10 hover:border-cyan-400/30 transition-all">
                  <img 
                    src={movie.poster || movie.backdrop} 
                    alt={movie.title} 
                    className="w-12 h-16 object-cover rounded-lg cursor-pointer"
                    onClick={() => {
                      onSelectMovie(movie);
                      onClose();
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 
                      className="text-sm font-bold text-white truncate cursor-pointer hover:text-cyan-400 transition-colors" 
                      onClick={() => {
                        onSelectMovie(movie);
                        onClose();
                      }}
                    >
                      {movie.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1 font-semibold text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" /> {movie.rating}
                      </span>
                      <span>•</span>
                      <span>{movie.year}</span>
                    </div>
                  </div>

                  <button
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    onClick={() => onRemove(movie.id)}
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {watchlist.length > 0 && (
          <div className="p-5 border-t border-white/10">
            <button 
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-semibold hover:bg-rose-500/20 transition-all cursor-pointer"
              onClick={onClearAll}
            >
              <Trash2 className="w-4 h-4" /> Clear All Watchlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
