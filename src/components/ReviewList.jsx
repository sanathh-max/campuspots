import React, { useState } from 'react';
import { Star, Flag, MessageSquarePlus, User, CheckCircle2 } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';
import { formatRelativeDate } from '../lib/utils';

export function ReviewList({ pinId, nickname, onPromptNickname, onShowToast }) {
  const { reviews, loading, userHasReviewed, addReview, reportReview } = useReviews(pinId);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!nickname) {
      onPromptNickname();
      return;
    }

    if (!text.trim()) {
      setErrorMessage('Please write a short review before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview(rating, text);
      setText('');
      setRating(5);
      onShowToast({ type: 'success', message: 'Review posted successfully!' });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = async (reviewId) => {
    try {
      const res = await reportReview(reviewId);
      if (res.status === 'already_reported') {
        onShowToast({ type: 'info', message: 'You have already reported this review.' });
      } else {
        onShowToast({
          type: 'success',
          message: res.isHidden ? 'Review hidden due to multiple reports.' : 'Review reported.'
        });
      }
    } catch (err) {
      onShowToast({ type: 'error', message: 'Failed to report review.' });
    }
  };

  return (
    <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <span>Student Reviews</span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {reviews.length}
          </span>
        </h3>
      </div>

      {/* Review Submission Form */}
      {userHasReviewed ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-3.5 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>You have already reviewed this spot. Thank you for contributing!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Leave your review
            </span>
            <div className="flex items-center gap-1 text-slate-500 text-xs">
              <User className="w-3.5 h-3.5" />
              <span>Posting as: <strong className="text-slate-800 dark:text-slate-200">{nickname || 'Anonymous'}</strong></span>
            </div>
          </div>

          {/* Interactive Star Rating */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= (hoverRating || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              {hoverRating || rating} / 5
            </span>
          </div>

          {/* Review Text */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={300}
            rows={2}
            placeholder="Share details about noise, crowds, wifi speed, or best items..."
            className="w-full text-xs p-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />

          {errorMessage && (
            <p className="text-xs text-rose-500 font-medium">{errorMessage}</p>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400">
              {text.length}/300 chars
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isSubmitting ? 'Posting...' : 'Post Review'}</span>
            </button>
          </div>
        </form>
      )}

      {/* List of Reviews */}
      {loading ? (
        <div className="text-center py-6 text-xs text-slate-400 animate-pulse">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-1">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            No reviews yet
          </p>
          <p className="text-xs text-slate-400">
            Be the first student to review this spot!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 space-y-1.5 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-sky-500/10 dark:bg-sky-400/20 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs font-bold">
                    {rev.author.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {rev.author}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {formatRelativeDate(rev.createdAt)}
                  </span>
                  <button
                    onClick={() => handleReport(rev.id)}
                    className="btn-icon w-6 h-6 text-slate-400 hover:text-rose-500 p-1"
                    title="Report review"
                    aria-label="Report review"
                  >
                    <Flag className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= rev.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {rev.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
