import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] max-w-sm w-[90%] bg-slate-900/95 dark:bg-slate-800/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/50 flex items-center justify-between gap-3 animate-slideUp">
      <div className="flex items-center gap-3">
        {icons[toast.type] || icons.info}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition text-slate-400 hover:text-white"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
