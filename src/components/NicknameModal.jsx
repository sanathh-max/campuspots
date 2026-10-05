import React, { useState } from 'react';
import { User, Sparkles } from 'lucide-react';

export function NicknameModal({ isOpen, initialNickname, isFirstVisit, onSave, onClose }) {
  const [name, setName] = useState(initialNickname || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a campus handle or nickname.');
      return;
    }
    onSave(name.trim());
  };

  return (
    <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-slideUp space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-2xl mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {isFirstVisit ? 'Welcome to CampusSpots!' : 'Choose Your Nickname'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No password or account required! Pick a campus handle for your pins & reviews.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="e.g. Aarav_EE or CoffeeLover"
              maxLength={25}
              autoFocus
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

          <div className="flex gap-2">
            {!isFirstVisit && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-sky-500/30 transition"
            >
              Save Nickname
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
