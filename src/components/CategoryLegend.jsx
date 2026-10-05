import React from 'react';
import { CATEGORIES } from '../config/campus';
import { BookOpen, Utensils, Zap } from 'lucide-react';

export function CategoryLegend() {
  const iconMap = {
    BookOpen: <BookOpen className="w-3.5 h-3.5 text-blue-500" />,
    Utensils: <Utensils className="w-3.5 h-3.5 text-red-500" />,
    Zap: <Zap className="w-3.5 h-3.5 text-emerald-500" />
  };

  return (
    <div className="absolute bottom-6 left-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800 text-xs flex items-center gap-3">
      {Object.values(CATEGORIES).map(cat => (
        <div key={cat.id} className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
          <span>{cat.label}</span>
        </div>
      ))}
    </div>
  );
}
