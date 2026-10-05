import { useState, useEffect, useCallback } from 'react';
import { db } from '../lib/db';

export function useReviews(pinId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!pinId) return;
    setLoading(true);
    try {
      const list = await db.getReviews(pinId);
      setReviews(list);
      const userId = db.getUserId();
      setUserHasReviewed(list.some(r => r.authorId === userId));
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [pinId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addReview = async (rating, text) => {
    if (!pinId) return;
    const newReview = await db.saveReview({ pinId, rating, text });
    setReviews(prev => [newReview, ...prev]);
    setUserHasReviewed(true);
    return newReview;
  };

  const reportReview = async (reviewId) => {
    const res = await db.reportReview(reviewId);
    if (res && res.isHidden) {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    }
    return res;
  };

  return {
    reviews,
    loading,
    userHasReviewed,
    addReview,
    reportReview,
    refreshReviews: fetchReviews
  };
}
