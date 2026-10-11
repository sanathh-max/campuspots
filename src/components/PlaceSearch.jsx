import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';

export function PlaceSearch({ onSelectPlace }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Nominatim Geocoding API Request
  useEffect(() => {
    if (!query.trim() || query.length < 3) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=6&q=${encodeURIComponent(query)}`;
        const response = await fetch(url, {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'CampusSpots-India-App/1.0'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setResults(data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Nominatim search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    onSelectPlace(lat, lon, item.display_name);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full sm:w-72">
      {/* Distinct Location Input (Resolves Issue #5 by distinguishing Location vs Spot search) */}
      <div className="relative">
        <label htmlFor="city-geocoding-input" className="sr-only">
          Jump to Indian City or College
        </label>
        <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
        <input
          id="city-geocoding-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Jump to city or campus..."
          aria-label="Jump to city or campus location"
          className="w-full pl-8 pr-8 py-2 text-xs bg-sky-50/60 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl border border-sky-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-900 transition"
        />
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 text-sky-500 animate-spin absolute right-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
        ) : query ? (
          <button
            onClick={() => setQuery('')}
            aria-label="Clear location query"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-3 h-3" />
          </button>
        ) : null}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-[999] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {results.map((item) => (
            <button
              key={item.place_id}
              onClick={() => handleSelect(item)}
              className="w-full text-left p-2.5 hover:bg-sky-50 dark:hover:bg-slate-800 transition flex items-start gap-2 text-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate">
                  {item.name || item.display_name.split(',')[0]}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {item.display_name}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
