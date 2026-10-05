// Storage & Data Abstraction Layer (localStorage implementation)

import { INITIAL_PINS, INITIAL_REVIEWS } from './seedData';
import { generateId } from './utils';

const STORAGE_KEYS = {
  PINS: 'campus_spots_pins_india_v3',
  REVIEWS: 'campus_spots_reviews_india_v3',
  USER_NICKNAME: 'campus_spots_user_nickname',
  USER_ID: 'campus_spots_user_id',
  VOTES: 'campus_spots_user_votes',
  REPORTS: 'campus_spots_user_reports'
};

function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

export function initDatabase() {
  const existingPins = localStorage.getItem(STORAGE_KEYS.PINS);
  if (!existingPins) {
    saveToStorage(STORAGE_KEYS.PINS, INITIAL_PINS);
  }

  const existingReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS);
  if (!existingReviews) {
    saveToStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  if (!localStorage.getItem(STORAGE_KEYS.USER_ID)) {
    saveToStorage(STORAGE_KEYS.USER_ID, generateId('user'));
  }
}

initDatabase();

export const db = {
  getUserId() {
    let id = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (!id) {
      id = generateId('user');
      localStorage.setItem(STORAGE_KEYS.USER_ID, id);
    }
    return id;
  },

  getUserNickname() {
    return localStorage.getItem(STORAGE_KEYS.USER_NICKNAME) || '';
  },

  setUserNickname(nickname) {
    const trimmed = nickname ? nickname.trim() : '';
    localStorage.setItem(STORAGE_KEYS.USER_NICKNAME, trimmed);
    return trimmed;
  },

  getUserVotes() {
    return loadFromStorage(STORAGE_KEYS.VOTES, {});
  },

  getUserReports() {
    return loadFromStorage(STORAGE_KEYS.REPORTS, { pins: [], reviews: [] });
  },

  async getPins() {
    const pins = loadFromStorage(STORAGE_KEYS.PINS, INITIAL_PINS);
    return pins.filter(p => (p.reports || 0) < 3);
  },

  async getPinById(id) {
    const pins = await this.getPins();
    return pins.find(p => p.id === id) || null;
  },

  async savePin(pinData) {
    const pins = loadFromStorage(STORAGE_KEYS.PINS, []);
    const userId = this.getUserId();
    const nickname = this.getUserNickname() || 'Anonymous Student';

    const newPin = {
      id: generateId('pin'),
      title: pinData.title.trim(),
      place: (pinData.place || '').trim() || 'India Spot',
      category: pinData.category,
      lat: Number(pinData.lat),
      lng: Number(pinData.lng),
      path: pinData.path || null,
      description: pinData.description.trim(),
      photo: pinData.photo || null,
      categoryFields: pinData.categoryFields || {},
      createdBy: nickname,
      createdById: userId,
      createdAt: new Date().toISOString(),
      votes: { up: 1, down: 0 },
      reports: 0
    };

    pins.unshift(newPin);
    saveToStorage(STORAGE_KEYS.PINS, pins);

    const votes = this.getUserVotes();
    votes[newPin.id] = 'up';
    saveToStorage(STORAGE_KEYS.VOTES, votes);

    return newPin;
  },

  async votePin(pinId, voteType) {
    const pins = loadFromStorage(STORAGE_KEYS.PINS, []);
    const votes = this.getUserVotes();
    const currentVote = votes[pinId];

    const pinIndex = pins.findIndex(p => p.id === pinId);
    if (pinIndex === -1) return null;

    const pin = pins[pinIndex];
    if (!pin.votes) pin.votes = { up: 0, down: 0 };

    if (currentVote === voteType) {
      pin.votes[voteType] = Math.max(0, pin.votes[voteType] - 1);
      delete votes[pinId];
    } else {
      if (currentVote) {
        pin.votes[currentVote] = Math.max(0, pin.votes[currentVote] - 1);
      }
      pin.votes[voteType] = (pin.votes[voteType] || 0) + 1;
      votes[pinId] = voteType;
    }

    pins[pinIndex] = pin;
    saveToStorage(STORAGE_KEYS.PINS, pins);
    saveToStorage(STORAGE_KEYS.VOTES, votes);

    return { pin, userVote: votes[pinId] || null };
  },

  async reportPin(pinId) {
    const pins = loadFromStorage(STORAGE_KEYS.PINS, []);
    const reports = this.getUserReports();

    if (reports.pins.includes(pinId)) {
      return { status: 'already_reported' };
    }

    const pinIndex = pins.findIndex(p => p.id === pinId);
    if (pinIndex === -1) return null;

    pins[pinIndex].reports = (pins[pinIndex].reports || 0) + 1;
    reports.pins.push(pinId);

    saveToStorage(STORAGE_KEYS.PINS, pins);
    saveToStorage(STORAGE_KEYS.REPORTS, reports);

    return {
      status: 'success',
      reportsCount: pins[pinIndex].reports,
      isHidden: pins[pinIndex].reports >= 3
    };
  },

  async getReviews(pinId) {
    const reviews = loadFromStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    return reviews
      .filter(r => r.pinId === pinId && (r.reports || 0) < 3)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async saveReview(reviewData) {
    const reviews = loadFromStorage(STORAGE_KEYS.REVIEWS, []);
    const userId = this.getUserId();
    const nickname = this.getUserNickname() || 'Anonymous Student';

    const existing = reviews.find(r => r.pinId === reviewData.pinId && r.authorId === userId);
    if (existing) {
      throw new Error('You have already submitted a review for this spot.');
    }

    const newReview = {
      id: generateId('rev'),
      pinId: reviewData.pinId,
      rating: Number(reviewData.rating),
      text: reviewData.text.trim(),
      author: nickname,
      authorId: userId,
      createdAt: new Date().toISOString(),
      reports: 0
    };

    reviews.unshift(newReview);
    saveToStorage(STORAGE_KEYS.REVIEWS, reviews);

    return newReview;
  },

  async reportReview(reviewId) {
    const reviews = loadFromStorage(STORAGE_KEYS.REVIEWS, []);
    const reports = this.getUserReports();

    if (reports.reviews.includes(reviewId)) {
      return { status: 'already_reported' };
    }

    const index = reviews.findIndex(r => r.id === reviewId);
    if (index === -1) return null;

    reviews[index].reports = (reviews[index].reports || 0) + 1;
    reports.reviews.push(reviewId);

    saveToStorage(STORAGE_KEYS.REVIEWS, reviews);
    saveToStorage(STORAGE_KEYS.REPORTS, reports);

    return {
      status: 'success',
      reportsCount: reviews[index].reports,
      isHidden: reviews[index].reports >= 3
    };
  },

  resetDefaults() {
    saveToStorage(STORAGE_KEYS.PINS, INITIAL_PINS);
    saveToStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.VOTES);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
  }
};
