import React from 'react';
import { CATEGORIES } from '../config/campus';
import { BookOpen, Utensils, Zap } from 'lucide-react';

export function CategoryLegend() {
  const iconMap = {
    study: <BookOpen className="w-3 h-3 text-white" aria-hidden="true" />,
    food: <Utensils className="w-3 h-3 text-white" aria-hidden="true" />,
    shortcut: <Zap className="w-3 h-3 text-white" aria-hidden="true" />
  };

  return (
    <div
      role="region"
      aria-label="Map category legend"
      className="absolute bottom-6 left-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800 text-xs flex items-center gap-3.5"
    >
      {Object.values(CATEGORIES).map(cat => (
        <div key={cat.id} className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
          {/* Category Icon Badge matching the filter buttons (Resolves Issue #4) */}
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
            style={{ backgroundColor: cat.color }}
            aria-hidden="true"
          >
            {iconMap[cat.id]}
          </span>
          <span className="font-semibold text-xs">{cat.label}</span>
        </div>
      ))}
    </div>
  );
}
