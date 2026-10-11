import React from 'react';
import { MapPin, Moon, Sun, User, Compass } from 'lucide-react';
import { QUICK_JUMP_CITIES } from '../config/campus';
import { PlaceSearch } from './PlaceSearch';

export function Header({
  onQuickJump,
  onSelectGeocodedPlace,
  isDarkMode,
  onToggleDarkMode,
  nickname,
  onOpenNicknameModal
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="bg-sky-600 dark:bg-sky-500 text-white p-2 rounded-xl shadow-md shadow-sky-500/20 flex items-center justify-center">
          <MapPin className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent leading-none">
            CampusSpots India
          </h1>
          {/* Resolves Issue #2: Increased body copy from 10px to legible 12px (text-xs) */}
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Crowdsourced Campus Map
          </p>
        </div>
      </div>

      {/* Nominatim Geocoding Location Navigator (Resolves Issue #5) */}
      <div className="order-3 sm:order-2 w-full sm:w-auto flex-1 max-w-sm">
        <PlaceSearch onSelectPlace={onSelectGeocodedPlace} />
      </div>

      {/* Quick Jump & User Controls (Resolves Issue #1: Unified button system) */}
      <div className="order-2 sm:order-3 flex items-center gap-2 ml-auto shrink-0">
        {/* Quick Jump Dropdown */}
        <div className="relative flex items-center">
          <Compass className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" aria-hidden="true" />
          <select
            aria-label="Quick jump to Indian city or campus"
            onChange={(e) => {
              const city = QUICK_JUMP_CITIES.find(c => c.id === e.target.value);
              if (city) onQuickJump(city);
            }}
            className="pl-8 pr-3 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer transition"
          >
            {QUICK_JUMP_CITIES.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dark Mode Toggle - Standardized btn-icon */}
        <button
          onClick={onToggleDarkMode}
          className="btn-icon"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Nickname Avatar Button - Standardized btn-secondary */}
        <button
          onClick={onOpenNicknameModal}
          className="btn-secondary"
          title="Edit Nickname"
          aria-label="Edit student nickname"
        >
          <div className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {nickname ? nickname.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
          </div>
          <span className="hidden md:inline max-w-[80px] truncate text-xs">
            {nickname || 'Anonymous'}
          </span>
        </button>
      </div>
    </header>
  );
}
