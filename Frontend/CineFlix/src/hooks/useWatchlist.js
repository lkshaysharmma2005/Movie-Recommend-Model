import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cineverse_watchlist_v1';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load watchlist from localStorage', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.error('Failed to save watchlist to localStorage', e);
    }
  }, [watchlist]);

  const toggleWatchlist = (movie) => {
    setWatchlist((prev) => {
      const exists = prev.some((item) => item.id === movie.id);
      if (exists) {
        return prev.filter((item) => item.id !== movie.id);
      } else {
        return [movie, ...prev];
      }
    });
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some((item) => item.id === movieId);
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== movieId));
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  return {
    watchlist,
    toggleWatchlist,
    isInWatchlist,
    removeFromWatchlist,
    clearWatchlist,
  };
}
