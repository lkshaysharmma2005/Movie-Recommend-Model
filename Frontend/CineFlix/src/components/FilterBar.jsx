import React from 'react';
import { ArrowUpDown, Layers } from 'lucide-react';

const GENRES = [
  'All',
  'Action',
  'Comedy',
  'Drama',
  'Sci-Fi',
  'Thriller',
  'Animation',
  'Horror',
  'Romance',
  'Documentary'
];

export function FilterBar({ 
  selectedGenre, 
  onSelectGenre, 
  sortBy, 
  onSortChange, 
  mediaType, 
  onMediaTypeChange 
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-7 p-3.5 rounded-xl bg-slate-900/50 border border-white/10 backdrop-blur-md">
      {/* Genre Pills Slider */}
      <div className="flex items-center gap-3 overflow-x-auto flex-1 pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
          <Layers className="w-4 h-4 text-cyan-400" /> Genre:
        </span>
        <div className="flex gap-2">
          {GENRES.map((genre) => (
            <button
              key={genre}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => onSelectGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Control Selectors */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Media Type Filter */}
        <select 
          value={mediaType} 
          onChange={(e) => onMediaTypeChange(e.target.value)}
          className="bg-slate-950 border border-white/10 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg outline-none cursor-pointer focus:border-cyan-400"
        >
          <option value="All">All Types</option>
          <option value="Movie">Movies Only</option>
          <option value="TV Show">TV Shows Only</option>
        </select>

        {/* Sort Select */}
        <div className="relative flex items-center">
          <ArrowUpDown className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <select 
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-slate-950 border border-white/10 text-slate-200 text-xs font-semibold pl-8 pr-3 py-2 rounded-lg outline-none cursor-pointer focus:border-cyan-400"
          >
            <option value="rating">Top Rated</option>
            <option value="year-desc">Newest First</option>
            <option value="year-asc">Oldest First</option>
            <option value="title">Title (A - Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
