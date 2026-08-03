/**
 * Movie API Service
 * Aggregates movie & show data from OMDb, TVMaze, and iTunes APIs
 * Includes full support for Indian blockbusters (RRR, KGF, Pushpa, Jawan, Kalki 2898 AD, 3 Idiots, Dangal, Pathaan, etc.)
 */

import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export default API;

const DEFAULT_OMDB_KEYS = ['trilogy', 'ebda3398', 'b9759d57'];

// Common search query expansions & alternate spellings (especially for Indian movies)
const QUERY_EXPANSIONS = {
  'kgf': ['K.G.F', 'KGF'],
  'kgf 1': ['K.G.F: Chapter 1'],
  'kgf 2': ['K.G.F: Chapter 2'],
  'baahubali': ['Bahubali', 'Baahubali'],
  'bahubali': ['Bahubali', 'Baahubali'],
  'ddlj': ['Dilwale Dulhania Le Jayenge'],
  'salar': ['Salaar'],
  'salaar': ['Salaar'],
  'bramastra': ['Brahmastra'],
  'brahmastra': ['Brahmastra'],
  'kalki': ['Kalki 2898 AD'],
  'stree': ['Stree', 'Stree 2'],
  'stree 2': ['Stree 2: Sarkate Ka Aatank', 'Stree 2'],
  'pathan': ['Pathaan'],
  'rrr': ['RRR'],
  'pushpa': ['Pushpa', 'Pushpa: The Rise'],
  'jawan': ['Jawan']
};

const stripHtml = (html) => {
  if (!html) return 'No description available.';
  return html.replace(/<[^>]*>?/gm, '').trim();
};

const DEFAULT_BACKDROPS = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80'
];


export async function fetchPopularMovies() {
  const initialQueries = ['RRR', 'K.G.F', 'Pushpa', 'Jawan', 'Kalki 2898 AD', 'Stree 2', '3 Idiots', 'Dangal', 'Spider-Man', 'Inception'];
  
  try {
    const results = await Promise.all(
      initialQueries.map(q => searchOmdb(q))
    );

    const merged = results.flat();
    const tvShows = await fetchTvMazePopular();
    return deduplicateMovies([...merged, ...tvShows]);
  } catch (err) {
    console.warn('Initial fetch error, falling back to TVMaze:', err);
    return fetchTvMazePopular();
  }
}

async function fetchTvMazePopular() {
  try {
    const res = await fetch('https://api.tvmaze.com/shows?page=0');
    if (!res.ok) throw new Error('Failed to fetch TVMaze');
    const data = await res.json();
    return data.slice(0, 15).map((item, idx) => normalizeTvMazeShow(item, idx));
  } catch (err) {
    console.warn('TVMaze popular fetch error:', err);
    return [];
  }
}

/*
 * @param {string} query 
 * @param {string} customOmdbKey 
 */
export async function searchMovies(query, customOmdbKey = '') {
  if (!query || query.trim() === '') {
    return fetchPopularMovies();
  }

  const rawQuery = query.trim();
  const lowerQuery = rawQuery.toLowerCase();

  // Determine terms to search (including expansions)
  let termsToSearch = [rawQuery];
  if (QUERY_EXPANSIONS[lowerQuery]) {
    termsToSearch = [...QUERY_EXPANSIONS[lowerQuery], rawQuery];
  }

  const omdbPromises = termsToSearch.map(t => searchOmdb(t, customOmdbKey));

  const cleanQuery = encodeURIComponent(rawQuery);
  const [omdbResultsGroup, tvmazeRes, itunesRes] = await Promise.allSettled([
    Promise.all(omdbPromises),
    fetch(`https://api.tvmaze.com/search/shows?q=${cleanQuery}`),
    fetch(`https://itunes.apple.com/search?term=${cleanQuery}&limit=15`)
  ]);

  let allResults = [];

  if (omdbResultsGroup.status === 'fulfilled' && omdbResultsGroup.value) {
    const flattened = omdbResultsGroup.value.flat();
    allResults.push(...flattened);
  }

  if (tvmazeRes.status === 'fulfilled' && tvmazeRes.value.ok) {
    try {
      const tvData = await tvmazeRes.value.json();
      const tvMovies = tvData.map(entry => normalizeTvMazeShow(entry.show));
      allResults.push(...tvMovies);
    } catch (e) {
      console.warn('Error parsing TVMaze results:', e);
    }
  }

  if (itunesRes.status === 'fulfilled' && itunesRes.value.ok) {
    try {
      const itunesData = await itunesRes.value.json();
      if (itunesData.results) {
        const itunesMovies = itunesData.results.map(item => normalizeITunesMovie(item));
        allResults.push(...itunesMovies);
      }
    } catch (e) {
      console.warn('Error parsing iTunes results:', e);
    }
  }

  return deduplicateMovies(allResults);
}

async function searchOmdb(query, userKey = '') {
  const keysToTry = userKey ? [userKey, ...DEFAULT_OMDB_KEYS] : DEFAULT_OMDB_KEYS;

  for (const key of keysToTry) {
    try {
      const res = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${key}`);
      if (!res.ok) continue;
      const data = await res.json();

      if (data.Response === 'True' && data.Search) {
        return data.Search.map((item, idx) => normalizeOmdbMovie(item, idx));
      }
    } catch (err) {
      console.warn(`OMDb key ${key} failed:`, err);
    }
  }
  return [];
}

function normalizeOmdbMovie(item, idx = 0) {
  const hasPoster = item.Poster && item.Poster !== 'N/A';
  const poster = hasPoster ? item.Poster : null;
  const backdrop = hasPoster ? item.Poster : DEFAULT_BACKDROPS[idx % DEFAULT_BACKDROPS.length];

  const titleLower = item.Title.toLowerCase();
  let genres = ['Action', 'Drama'];

  if (
    titleLower.includes('rrr') || 
    titleLower.includes('kgf') || 
    titleLower.includes('pushpa') || 
    titleLower.includes('jawan') || 
    titleLower.includes('pathaan') || 
    titleLower.includes('bahubali') || 
    titleLower.includes('kalki') ||
    titleLower.includes('salar') ||
    titleLower.includes('salaar') ||
    titleLower.includes('spider') ||
    titleLower.includes('avengers')
  ) {
    genres = ['Action', 'Sci-Fi', 'Thriller'];
  } else if (titleLower.includes('stree') || titleLower.includes('horror') || titleLower.includes('conjuring')) {
    genres = ['Horror', 'Comedy'];
  } else if (titleLower.includes('3 idiots') || titleLower.includes('comedy') || titleLower.includes('dangal')) {
    genres = ['Comedy', 'Drama'];
  }

  return {
    id: `omdb-${item.imdbID}`,
    title: item.Title,
    poster: poster,
    backdrop: backdrop,
    rating: parseFloat((8.2 + ((item.imdbID?.charCodeAt(3) || 5) % 15) / 10).toFixed(1)),
    year: item.Year,
    genres: genres,
    summary: `${item.Title} is a hit ${item.Year} ${item.Type === 'series' ? 'series' : 'feature film'}. Click to view full details or watch trailer on YouTube.`,
    type: item.Type === 'series' ? 'TV Show' : 'Movie',
    runtime: item.Type === 'series' ? '45 min' : '150 min',
    language: 'Hindi / Indian Languages',
    officialSite: `https://www.imdb.com/title/${item.imdbID}/`
  };
}

function normalizeTvMazeShow(show, index = 0) {
  const backdrop = show.image?.original || DEFAULT_BACKDROPS[index % DEFAULT_BACKDROPS.length];
  const poster = show.image?.medium || show.image?.original || null;
  const rating = show.rating?.average ? show.rating.average.toFixed(1) : (7.2 + (show.id % 25) / 10).toFixed(1);
  const year = show.premiered ? show.premiered.split('-')[0] : 'N/A';
  const genres = show.genres && show.genres.length > 0 ? show.genres : ['Entertainment'];

  return {
    id: `tvmaze-${show.id}`,
    title: show.name,
    poster: poster,
    backdrop: backdrop,
    rating: parseFloat(rating),
    year: year,
    genres: genres,
    summary: stripHtml(show.summary),
    type: show.type === 'Scripted' || show.type === 'Documentary' ? 'TV Show' : 'Movie',
    runtime: show.averageRuntime ? `${show.averageRuntime} min` : '60 min',
    language: show.language || 'English',
    officialSite: show.officialSite || show.url || `https://www.tvmaze.com/shows/${show.id}`
  };
}

function normalizeITunesMovie(item) {
  const poster = item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : null;
  const year = item.releaseDate ? item.releaseDate.split('-')[0] : 'N/A';
  const rating = (6.8 + (item.trackId % 30) / 10).toFixed(1);

  return {
    id: `itunes-${item.trackId || item.collectionId}`,
    title: item.trackName || item.collectionName || 'Untitled Movie',
    poster: poster,
    backdrop: poster,
    rating: parseFloat(rating),
    year: year,
    genres: item.primaryGenreName ? [item.primaryGenreName] : ['Movie'],
    summary: item.longDescription || item.shortDescription || 'No description provided.',
    type: item.kind === 'tv-episode' || item.wrapperType === 'collection' ? 'TV Show' : 'Movie',
    runtime: item.trackTimeMillis ? `${Math.round(item.trackTimeMillis / 60000)} min` : '120 min',
    language: 'English',
    officialSite: item.trackViewUrl || 'https://itunes.apple.com'
  };
}

function deduplicateMovies(list) {
  const seen = new Set();
  return list.filter(movie => {
    if (!movie.title) return false;
    const cleanTitle = movie.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seen.has(cleanTitle)) return false;
    seen.add(cleanTitle);
    return true;
  });
}













// ===========================
// FASTAPI ML RECOMMENDATIONS
// ===========================

export async function getRecommendations(movieTitle) {
  try {
    const response = await API.post("/recommend", {
      movie: movieTitle,
    });

    return response.data;
  } catch (error) {
    console.error("Recommendation API Error:", error);

    return {
      success: false,
      recommendations: [],
      message: "Failed to fetch recommendations",
    };
  }
}