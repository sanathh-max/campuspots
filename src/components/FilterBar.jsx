import React from 'react';
import { Search, X, SlidersHorizontal, BookOpen, Utensils, Zap, Target } from 'lucide-react';

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  filterByBounds,
  onToggleFilterByBounds,
  pinCount,
  userLocation
}) {
  return (
    /* Resolves Issue #3: Expanded vertical spacing and padding (py-3, space-y-3) to eliminate cramped layout */
    <div className="bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 px-4 py-3 shadow-sm z-20 space-y-3">
      {/* Row 1: Primary Spot Search Bar, "Search this area" Button, and Sort Dropdown */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Spot Content Search Input (Resolves Issue #5: clearly marked as spot/reviews search) */}
        <div className="relative flex-1 min-w-[220px]">
          <label htmlFor="spot-search-input" className="sr-only">
            Search campus spots by title, tags, or description
          </label>
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <input
            id="spot-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search spot name, place, must-try items..."
            aria-label="Search spots, food joints, or shortcuts"
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl border border-slate-200/80 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-900 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              aria-label="Clear spot search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* "Search this area" Viewport Filter (Resolves Issue #1: Standardized secondary button style) */}
        <button
          onClick={onToggleFilterByBounds}
          className={`btn-secondary ${
            filterByBounds
              ? 'bg-sky-600! hover:bg-sky-700! text-white! border-sky-600! shadow-sm'
              : ''
          }`}
          title="Limit results to current visible map area"
          aria-pressed={filterByBounds}
        >
          <Target className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Search this area</span>
        </button>

        {/* Sort Selector */}
        <div className="relative flex items-center shrink-0">
          <label htmlFor="sort-spots-select" className="sr-only">Sort campus spots</label>
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" aria-hidden="true" />
          <select
            id="sort-spots-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="pl-8 pr-3 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer transition"
          >
            <option value="top_rated">Top Rated</option>
            <option value="newest">Newest First</option>
            <option value="nearest">
              Nearest {userLocation ? '(GPS)' : '(Map Center)'}
            </option>
          </select>
        </div>
      </div>

      {/* Row 2: Standardized Category Filter Chips (Resolves Issue #1) */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-0.5 no-scrollbar text-xs">
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onCategoryChange('all')}
            className={`btn-chip ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
            aria-pressed={selectedCategory === 'all'}
          >
            All Spots
          </button>

          <button
            onClick={() => onCategoryChange('study')}
            className={`btn-chip ${
              selectedCategory === 'study'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/30'
                : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900 hover:bg-blue-100'
            }`}
            aria-pressed={selectedCategory === 'study'}
          >
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Study Spots</span>
          </button>

          <button
            onClick={() => onCategoryChange('food')}
            className={`btn-chip ${
              selectedCategory === 'food'
                ? 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-500/30'
                : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-900 hover:bg-red-100'
            }`}
            aria-pressed={selectedCategory === 'food'}
          >
            <Utensils className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Food Joints</span>
          </button>

          <button
            onClick={() => onCategoryChange('shortcut')}
            className={`btn-chip ${
              selectedCategory === 'shortcut'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/30'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100'
            }`}
            aria-pressed={selectedCategory === 'shortcut'}
          >
            <Zap className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Shortcuts</span>
          </button>
        </div>

        {/* Spot Count Indicator */}
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 shrink-0">
          {pinCount} {pinCount === 1 ? 'spot' : 'spots'}
        </span>
      </div>
    </div>
  );
}
