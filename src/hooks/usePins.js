import { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '../lib/db';
import { calculateDistance } from '../lib/utils';

export function usePins(userLocation = null, mapCenter = null, mapBounds = null, filterByBounds = false) {
  const [pins, setPins] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [loading, setLoading] = useState(true);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('top_rated'); // 'top_rated' | 'newest' | 'nearest'

  // Fetch all pins and ratings
  const refreshPins = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedPins = await db.getPins();
      setPins(fetchedPins);
      setUserVotes(db.getUserVotes());
      
      const reviews = await db.getReviews();
      setAllReviews(reviews);
    } catch (err) {
      console.error('Failed to load pins:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPins();
  }, [refreshPins]);

  // Map of pin ID to average rating and total reviews count
  const pinRatingsMap = useMemo(() => {
    const map = {};
    allReviews.forEach(rev => {
      if (!map[rev.pinId]) {
        map[rev.pinId] = { total: 0, count: 0 };
      }
      map[rev.pinId].total += Number(rev.rating);
      map[rev.pinId].count += 1;
    });

    const result = {};
    Object.keys(map).forEach(pinId => {
      result[pinId] = {
        avgRating: map[pinId].count > 0 ? (map[pinId].total / map[pinId].count) : 0,
        reviewCount: map[pinId].count
      };
    });
    return result;
  }, [allReviews]);

  // Compute pins with distance, rating, net score, and trending badge
  const processedPins = useMemo(() => {
    // Reference location for "Nearest" sorting: user GPS first, fallback to current map center
    const refLat = userLocation?.lat || mapCenter?.lat;
    const refLng = userLocation?.lng || mapCenter?.lng;

    return pins.map(pin => {
      const ratingInfo = pinRatingsMap[pin.id] || { avgRating: 0, reviewCount: 0 };
      const netVotes = (pin.votes?.up || 0) - (pin.votes?.down || 0);

      let distanceKm = null;
      if (refLat && refLng) {
        distanceKm = calculateDistance(refLat, refLng, pin.lat, pin.lng);
      }

      const isTrending = (pin.votes?.up >= 20) || (netVotes >= 15);

      return {
        ...pin,
        avgRating: ratingInfo.avgRating,
        reviewCount: ratingInfo.reviewCount,
        netVotes,
        distanceKm,
        isTrending,
        userVote: userVotes[pin.id] || null
      };
    });
  }, [pins, pinRatingsMap, userLocation, mapCenter, userVotes]);

  // Filtered and sorted pins
  const filteredPins = useMemo(() => {
    return processedPins.filter(pin => {
      // Category filter
      if (selectedCategory !== 'all' && pin.category !== selectedCategory) {
        return false;
      }

      // Map Viewport Bounds Filter ("Search this area")
      if (filterByBounds && mapBounds) {
        const { southWest, northEast } = mapBounds;
        if (
          pin.lat < southWest.lat ||
          pin.lat > northEast.lat ||
          pin.lng < southWest.lng ||
          pin.lng > northEast.lng
        ) {
          return false;
        }
      }

      // Search query filter (matches title, place/college, description, creator, must-try)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = pin.title.toLowerCase().includes(q);
        const placeMatch = (pin.place || '').toLowerCase().includes(q);
        const descMatch = pin.description.toLowerCase().includes(q);
        const creatorMatch = pin.createdBy.toLowerCase().includes(q);
        const mustTryMatch = pin.categoryFields?.mustTry?.toLowerCase().includes(q);
        if (!titleMatch && !placeMatch && !descMatch && !creatorMatch && !mustTryMatch) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'top_rated') {
        if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
        return b.netVotes - a.netVotes;
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'nearest') {
        if (a.distanceKm === null && b.distanceKm === null) return 0;
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      }
      return 0;
    });
  }, [processedPins, selectedCategory, searchQuery, sortBy, filterByBounds, mapBounds]);

  const handleVote = async (pinId, voteType) => {
    const result = await db.votePin(pinId, voteType);
    if (result) {
      setUserVotes(prev => {
        const next = { ...prev };
        if (result.userVote) {
          next[pinId] = result.userVote;
        } else {
          delete next[pinId];
        }
        return next;
      });
      setPins(prev => prev.map(p => (p.id === pinId ? result.pin : p)));
    }
  };

  const handleReport = async (pinId) => {
    const res = await db.reportPin(pinId);
    if (res && res.isHidden) {
      setPins(prev => prev.filter(p => p.id !== pinId));
    }
    return res;
  };

  const handleAddPin = async (pinData) => {
    const newPin = await db.savePin(pinData);
    setPins(prev => [newPin, ...prev]);
    setUserVotes(prev => ({ ...prev, [newPin.id]: 'up' }));
    return newPin;
  };

  return {
    pins: filteredPins,
    allPins: processedPins,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    handleVote,
    handleReport,
    handleAddPin,
    refreshPins
  };
}
