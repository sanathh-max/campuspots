import React from 'react';
import { Search, X, SlidersHorizontal, BookOpen, Utensils, Zap, MapPin, Target } from 'lucide-react';

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
    <div className="bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 p-2.5 shadow-sm z-20 space-y-2">
      {/* Search Bar, Sort Selector, and "Search this area" Toggle */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Spot Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search spot name, place (e.g. Mumbai, DU, IISc)..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl border-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-900 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* "Search this area" Viewport Filter Toggle */}
        <button
          onClick={onToggleFilterByBounds}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 shrink-0 ${
            filterByBounds
              ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
          }`}
          title="Limit results to current visible map area"
        >
          <Target className="w-3.5 h-3.5" />
          <span>Search this area</span>
        </button>

        {/* Sort Selector */}
        <div className="relative flex items-center shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl border-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer transition"
          >
            <option value="top_rated">Top Rated</option>
            <option value="newest">Newest First</option>
            <option value="nearest">
              Nearest {userLocation ? '(GPS)' : '(Map Center)'}
            </option>
          </select>
        </div>
      </div>

      {/* Category Chips & Count */}
      <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-3 py-1 rounded-xl font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Spots
          </button>

          <button
            onClick={() => onCategoryChange('study')}
            className={`px-3 py-1 rounded-xl font-medium transition flex items-center gap-1 ${
              selectedCategory === 'study'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900 hover:bg-blue-100'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            Study Spots
          </button>

          <button
            onClick={() => onCategoryChange('food')}
            className={`px-3 py-1 rounded-xl font-medium transition flex items-center gap-1 ${
              selectedCategory === 'food'
                ? 'bg-red-600 text-white shadow-sm shadow-red-500/30'
                : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900 hover:bg-red-100'
            }`}
          >
            <Utensils className="w-3 h-3" />
            Food Joints
          </button>

          <button
            onClick={() => onCategoryChange('shortcut')}
            className={`px-3 py-1 rounded-xl font-medium transition flex items-center gap-1 ${
              selectedCategory === 'shortcut'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <Zap className="w-3 h-3" />
            Shortcuts
          </button>
        </div>

        {/* Spot Counter */}
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 shrink-0">
          {pinCount} {pinCount === 1 ? 'spot' : 'spots'}
        </span>
      </div>
    </div>
  );
}
