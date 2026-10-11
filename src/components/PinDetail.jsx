import React from 'react';
import {
  X, ThumbsUp, ThumbsDown, Star, Flag, Clock, Wifi, Zap,
  Volume2, ShieldAlert, CheckCircle2, XCircle, Share2, Flame, MapPin, Navigation
} from 'lucide-react';
import { CATEGORIES } from '../config/campus';
import { ReviewList } from './ReviewList';
import { formatRelativeDate, formatDistance } from '../lib/utils';

export function PinDetail({
  pin,
  onClose,
  onVote,
  onReport,
  nickname,
  onPromptNickname,
  onShowToast,
  onNavigateTo
}) {
  if (!pin) return null;

  const categoryConfig = CATEGORIES[pin.category] || CATEGORIES.study;

  const handleVote = (voteType) => {
    onVote(pin.id, voteType);
  };

  const handleReportPin = async () => {
    if (window.confirm('Report this pin for inaccurate info or spam?')) {
      const res = await onReport(pin.id);
      if (res && res.status === 'already_reported') {
        onShowToast({ type: 'info', message: 'You have already reported this pin.' });
      } else {
        onShowToast({
          type: 'success',
          message: res?.isHidden ? 'Pin hidden due to community reports.' : 'Pin reported.'
        });
        if (res?.isHidden) onClose();
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pin.title,
        text: `Check out ${pin.title} (${pin.place}) on CampusSpots India!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      onShowToast({ type: 'success', message: 'Link copied to clipboard!' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-end md:justify-start md:items-end">
      {/* Semi-transparent backdrop for mobile dismiss */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto md:bg-transparent"
      />

      {/* Main Drawer Container */}
      <div className="pointer-events-auto relative w-full md:w-[420px] max-h-[85vh] md:max-h-screen md:h-full bg-white dark:bg-slate-900 shadow-2xl rounded-t-3xl md:rounded-none md:border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-slideUp md:animate-fadeIn transition-all">
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 md:hidden" />

        {/* Top Control Bar */}
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${categoryConfig.bgLight}`}
            >
              {categoryConfig.label}
            </span>

            {pin.isTrending && (
              <span className="bg-amber-500 text-white text-xs font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Flame className="w-3.5 h-3.5" aria-hidden="true" /> Trending
              </span>
            )}
          </div>

          {/* Standardized btn-icon hierarchy (Resolves Issue #1) */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="btn-icon"
              title="Share Spot"
              aria-label="Share Spot"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleReportPin}
              className="btn-icon hover:text-rose-500! dark:hover:text-rose-400!"
              title="Report Pin"
              aria-label="Report Pin"
            >
              <Flag className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="btn-icon"
              title="Close panel"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 overflow-y-auto space-y-5 flex-1">
          {/* Photo */}
          {pin.photo && (
            <div className="relative rounded-2xl overflow-hidden shadow-md group">
              <img
                src={pin.photo}
                alt={pin.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
          )}

          {/* Title & Place Info */}
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {pin.title}
            </h2>

            {pin.place && (
              <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{pin.place}</span>
              </p>
            )}

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              <span>Pinned by <strong className="text-slate-700 dark:text-slate-300">{pin.createdBy}</strong></span>
              <span>•</span>
              <span>{formatRelativeDate(pin.createdAt)}</span>
              {pin.distanceKm !== null && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-sky-600 dark:text-sky-400 font-semibold">
                    <Navigation className="w-3 h-3" aria-hidden="true" />
                    {formatDistance(pin.distanceKm)} away
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Upvote / Downvote & Star Rating Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" aria-hidden="true" />
                <span className="text-base font-extrabold">
                  {pin.avgRating ? pin.avgRating.toFixed(1) : 'New'}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                ({pin.reviewCount} {pin.reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* Voting Controls */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-inner border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleVote('up')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  pin.userVote === 'up'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{pin.votes?.up || 0}</span>
              </button>

              <button
                onClick={() => handleVote('down')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  pin.userVote === 'down'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{pin.votes?.down || 0}</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Description
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {pin.description}
            </p>
          </div>

          {/* Category Specific Fields - Upgraded font sizes (Resolves Issue #2) */}
          {pin.categoryFields && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Key Spot Details
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Study Spot Fields */}
                {pin.category === 'study' && (
                  <>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-xs">Noise Level</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize flex items-center gap-1 mt-0.5">
                        <Volume2 className="w-3.5 h-3.5 text-sky-500" aria-hidden="true" />
                        {pin.categoryFields.noiseLevel || 'N/A'}
                      </span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-xs">Power Outlets</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                        {pin.categoryFields.hasPowerOutlets ? (
                          <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" /> Available</>
                        ) : (
                          <><XCircle className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" /> None</>
                        )}
                      </span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-xs">Wi-Fi Signal</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                        <Wifi className="w-3.5 h-3.5 text-sky-500" aria-hidden="true" />
                        {pin.categoryFields.hasWifi ? 'Campus Wi-Fi' : 'No Signal'}
                      </span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-xs">Open Hours</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                        {pin.categoryFields.openHours || '24/7'}
                      </span>
                    </div>
                  </>
                )}

                {/* Food Joint Fields */}
                {pin.category === 'food' && (
                  <>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-xs">Price Range</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {pin.categoryFields.priceRange || 'Rs'}
                      </span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-xs">Dietary Options</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize mt-0.5">
                        {pin.categoryFields.dietaryOptions || 'both'}
                      </span>
                    </div>

                    {pin.categoryFields.mustTry && (
                      <div className="col-span-2 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-900/50">
                        <span className="text-amber-700 dark:text-amber-400 block text-xs font-bold">
                          Must-Try Item ⭐
                        </span>
                        <span className="font-semibold text-amber-900 dark:text-amber-200">
                          {pin.categoryFields.mustTry}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Shortcut Fields */}
                {pin.category === 'shortcut' && (
                  <>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-xs">Time Saved</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                        <Zap className="w-3.5 h-3.5 fill-emerald-500" aria-hidden="true" />
                        ~{pin.categoryFields.timeSaved || 5} mins saved
                      </span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 block text-xs">Accessibility</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {pin.categoryFields.isAccessible ? 'Wheelchair & Bike Friendly' : 'Stairs / Rough Ground'}
                      </span>
                    </div>

                    {pin.categoryFields.caution && (
                      <div className="col-span-2 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-xl border border-rose-200/60 dark:border-rose-900/50">
                        <span className="text-rose-700 dark:text-rose-400 block text-xs font-bold flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" /> Caution Notes
                        </span>
                        <span className="font-medium text-rose-900 dark:text-rose-200 text-xs">
                          {pin.categoryFields.caution}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Polyline indicator */}
          {pin.path && pin.path.length > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-900 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-medium">
              <span>Path map line drawn with {pin.path.length} waypoints</span>
              <button
                onClick={() => onNavigateTo(pin.lat, pin.lng, 17)}
                className="text-sky-600 dark:text-sky-400 font-bold hover:underline"
              >
                Center on Map
              </button>
            </div>
          )}

          {/* Review List Component */}
          <ReviewList
            pinId={pin.id}
            nickname={nickname}
            onPromptNickname={onPromptNickname}
            onShowToast={onShowToast}
          />
        </div>
      </div>
    </div>
  );
}
