import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { HeroBanner } from "./components/HeroBanner";
import { SearchBar } from "./components/SearchBar";
import { FilterBar } from "./components/FilterBar";
import { MovieGrid } from "./components/MovieGrid";
import { MovieModal } from "./components/MovieModal";
import { WatchlistDrawer } from "./components/WatchlistDrawer";
import { SettingsModal } from "./components/SettingsModal";
import { useDebounce } from "./hooks/useDebounce";
import { useWatchlist } from "./hooks/useWatchlist";
import { fetchPopularMovies, searchMovies } from "./services/movieApi";
import { getRecommendations } from "./services/movieApi";

export function App() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 350);

  const [rawMovies, setRawMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [mediaType, setMediaType] = useState("All");

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // const [omdbKey, setOmdbKey] = useState(() => localStorage.getItem('cineverse_omdb_key') || '');

  const {
    watchlist,
    toggleWatchlist,
    isInWatchlist,
    removeFromWatchlist,
    clearWatchlist,
  } = useWatchlist();

  useEffect(() => {
    let isSubscribed = true;

    async function loadData() {
      setIsLoading(true);
      setFetchError(null);
      try {

        let results;
        if (!debouncedSearch || debouncedSearch.trim() === "") {
          results = await fetchPopularMovies();
        } else {
          const recommendationResult =
            await getRecommendations(debouncedSearch);

          if (recommendationResult.success) {
            results = recommendationResult.recommendations;
          } else {
            results = [];
          }
        }

        if (isSubscribed) {
          setRawMovies(results || []);
        }
      } catch (err) {
        if (isSubscribed) {
          console.error("Error fetching movies:", err);
          setFetchError(
            "Failed to fetch movies. Please check your internet connection.",
          );
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, [debouncedSearch]);

  // Handle saving OMDb Key
  // const handleSaveOmdbKey = (key) => {
  //   setOmdbKey(key);
  //   localStorage.setItem('cineverse_omdb_key', key);
  // };

  // Filter & Sort movies in memory
  const processedMovies = useMemo(() => {
    let list = [...rawMovies];

    if (selectedGenre !== "All") {
      list = list.filter((m) =>
        m.genres?.some((g) =>
          g.toLowerCase().includes(selectedGenre.toLowerCase()),
        ),
      );
    }

    if (mediaType !== "All") {
      list = list.filter((m) => m.type === mediaType);
    }

    list.sort((a, b) => {
      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === "year-desc") {
        return (parseInt(b.year) || 0) - (parseInt(a.year) || 0);
      }
      if (sortBy === "year-asc") {
        return (parseInt(a.year) || 0) - (parseInt(b.year) || 0);
      }
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return 0;
    });

    return list;
  }, [rawMovies, selectedGenre, mediaType, sortBy]);

  const featuredMovie = useMemo(() => {
    if (processedMovies.length > 0) {
      return processedMovies[0];
    }
    return rawMovies[0] || null;
  }, [processedMovies, rawMovies]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Navigation Header */}
      <Navbar
        watchlistCount={watchlist.length}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
        {/* Featured Hero Banner */}
        {!searchInput && featuredMovie && !isLoading && (
          <HeroBanner
            movie={featuredMovie}
            onSelectMovie={(m) => setSelectedMovie(m)}
            onToggleWatchlist={toggleWatchlist}
            isBookmarked={isInWatchlist(featuredMovie.id)}
          />
        )}

        {/* Real-time Search Bar */}
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          onClear={() => setSearchInput("")}
          isLoading={isLoading}
          totalResults={processedMovies.length}
        />

        {/* Filter Controls */}
        <FilterBar
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
          sortBy={sortBy}
          onSortChange={setSortBy}
          mediaType={mediaType}
          onMediaTypeChange={setMediaType}
        />

        {/* Fetch Error Banner */}
        {fetchError && (
          <div className="p-4 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center justify-between">
            <p>{fetchError}</p>
            <button
              className="px-3 py-1 rounded-lg bg-white/10 text-white font-semibold text-xs hover:bg-white/20"
              onClick={() => setSearchInput(searchInput)}
            >
              Retry
            </button>
          </div>
        )}

        {/* Movie Cards Grid */}
        <MovieGrid
          movies={processedMovies}
          isLoading={isLoading}
          onSelectMovie={(m) => setSelectedMovie(m)}
          onToggleWatchlist={toggleWatchlist}
          isInWatchlist={isInWatchlist}
          searchQuery={searchInput}
          onApplySuggestion={(title) => setSearchInput(title)}
          onResetFilters={() => {
            setSelectedGenre("All");
            setMediaType("All");
            setSortBy("rating");
            setSearchInput("");
          }}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500 bg-slate-950/80">
        <p>
          © 2026 CineFlix Web Application • Built with React & Tailwind CSS v4
        </p>
      </footer>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onToggleWatchlist={toggleWatchlist}
          isBookmarked={isInWatchlist(selectedMovie.id)}
        />
      )}

      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlist}
        onRemove={removeFromWatchlist}
        onClearAll={clearWatchlist}
        onSelectMovie={(m) => setSelectedMovie(m)}
      />

      {/* <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        omdbKey={omdbKey}
        onSaveOmdbKey={handleSaveOmdbKey}
      /> */}
    </div>
  );
}

export default App;
