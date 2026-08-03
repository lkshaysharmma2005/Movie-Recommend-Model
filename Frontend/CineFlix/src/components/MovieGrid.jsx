import React from 'react';
import { MovieCard } from './MovieCard';
import { SkeletonGrid } from './SkeletonCard';
import { SearchX, Sparkles, RefreshCw } from 'lucide-react';

const QUICK_SUGGESTIONS = ['RRR', 'K.G.F', 'Pushpa', 'Jawan', 'Kalki 2898 AD', 'Stree 2', '3 Idiots', 'Dangal', 'Inception', 'Spider-Man'];

export function MovieGrid({ 
  movies, 
  isLoading, 
  onSelectMovie, 
  onToggleWatchlist, 
  isInWatchlist,
  searchQuery,
  onApplySuggestion,
  onResetFilters
}) {
  if (isLoading) {
    return <SkeletonGrid count={12} />;
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-900/40 border border-dashed border-white/10 rounded-3xl max-w-xl mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8 text-cyan-400" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">No movies found</h3>
        <p className="text-sm text-slate-400 mb-6">
          {searchQuery 
            ? `We couldn't find any movies or TV shows matching "${searchQuery}".`
            : 'No movies match the currently selected filter parameters.'}
        </p>

        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Try searching for one of these popular Indian & Global titles:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {QUICK_SUGGESTIONS.map((title) => (
              <button
                key={title}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-500/15 hover:border-cyan-500/30 transition-all cursor-pointer"
                onClick={() => onApplySuggestion(title)}
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        {onResetFilters && (
          <button 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-semibold hover:bg-white/10 transition-all cursor-pointer"
            onClick={onResetFilters}
          >
            <RefreshCw className="w-4 h-4" /> Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onSelectMovie={onSelectMovie}
          onToggleWatchlist={onToggleWatchlist}
          isBookmarked={isInWatchlist(movie.id)}
        />
      ))}
    </div>
  );
}
