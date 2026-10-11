import React, { useState, useEffect } from 'react';
import {
  X, MapPin, Upload, BookOpen, Utensils, Zap,
  CheckCircle2, Plus, Trash2, Loader2, Building
} from 'lucide-react';
import { compressImage } from '../lib/utils';

export function AddPinModal({
  isOpen,
  onClose,
  initialLocation,
  isPolylineMode,
  polylinePoints,
  onStartPickLocation,
  onAddPolylinePoint,
  onClearPolylinePoints,
  onSavePin,
  onShowToast
}) {
  const [category, setCategory] = useState('study');
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Category specific fields
  const [studyFields, setStudyFields] = useState({
    noiseLevel: 'quiet',
    hasPowerOutlets: true,
    hasWifi: true,
    openHours: '24/7'
  });

  const [foodFields, setFoodFields] = useState({
    priceRange: 'Rs',
    dietaryOptions: 'both',
    mustTry: ''
  });

  const [shortcutFields, setShortcutFields] = useState({
    timeSaved: 5,
    isAccessible: true,
    bestTime: 'Anytime',
    caution: ''
  });

  const [errors, setErrors] = useState({});

  // Reverse geocode lat/lng to get place name automatically
  useEffect(() => {
    if (initialLocation?.lat && initialLocation?.lng && !place) {
      setIsReverseGeocoding(true);
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${initialLocation.lat}&lon=${initialLocation.lng}`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'CampusSpots-India-App/1.0'
          }
        }
      )
        .then(res => res.json())
        .then(data => {
          if (data && data.address) {
            const addr = data.address;
            const placeName =
              addr.amenity ||
              addr.building ||
              addr.university ||
              addr.suburb ||
              addr.neighbourhood ||
              addr.city_district ||
              addr.city ||
              addr.town ||
              data.display_name.split(',')[0];
            const city = addr.city || fontState(addr);
            const fullPlaceStr = city ? `${placeName}, ${city}` : placeName;
            setPlace(fullPlaceStr);
          }
        })
        .catch(() => {})
        .finally(() => setIsReverseGeocoding(false));
    }
  }, [initialLocation]);

  function fontState(addr) {
    return addr.state_district || addr.state || '';
  }

  if (!isOpen) return null;

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast({ type: 'error', message: 'Please select a valid image file.' });
      return;
    }

    setIsCompressing(true);
    try {
      const base64 = await compressImage(file, 800, 600, 0.7);
      setPhoto(base64);
      onShowToast({ type: 'success', message: 'Photo compressed & attached!' });
    } catch (err) {
      onShowToast({ type: 'error', message: 'Failed to process image.' });
    } finally {
      setIsCompressing(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Spot title is required';
    if (!place.trim()) newErrors.place = 'Place / College / City name is required';
    if (!description.trim()) newErrors.description = 'Please add a short description';

    if (!initialLocation || !initialLocation.lat) {
      newErrors.location = 'Please select a location on the map';
    }

    if (category === 'shortcut' && isPolylineMode && polylinePoints.length < 2) {
      newErrors.polyline = 'Please tap at least 2 points on the map to draw the shortcut path';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    let categoryFields = {};
    if (category === 'study') categoryFields = studyFields;
    if (category === 'food') categoryFields = foodFields;
    if (category === 'shortcut') categoryFields = shortcutFields;

    const pinData = {
      title,
      place,
      category,
      lat: initialLocation.lat,
      lng: initialLocation.lng,
      path: (category === 'shortcut' && polylinePoints.length >= 2) ? polylinePoints : null,
      description,
      photo: photo || null,
      categoryFields
    };

    try {
      await onSavePin(pinData);
      onShowToast({ type: 'success', message: 'Spot pinned to India map!' });
      onClose();
    } catch (err) {
      onShowToast({ type: 'error', message: 'Failed to add pin.' });
    }
  };

  return (
    <div className="fixed inset-0 z-[900] bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Add Spot in India
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Share a study desk, eatery, or shortcut anywhere in India
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Location Coordinates Banner */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-500" /> Map Location Coordinates
              </span>

              <button
                type="button"
                onClick={onStartPickLocation}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
              >
                {initialLocation?.lat ? 'Change Location on Map' : 'Tap Map to Pick'}
              </button>
            </div>

            {initialLocation?.lat ? (
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                Lat: {initialLocation.lat.toFixed(5)}, Lng: {initialLocation.lng.toFixed(5)}
              </p>
            ) : (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                ⚠️ Location not set. Click 'Change Location' or tap on the map.
              </p>
            )}

            {errors.location && (
              <p className="text-xs text-rose-500 font-semibold">{errors.location}</p>
            )}

            {category === 'shortcut' && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Shortcut Polyline Path ({polylinePoints.length} points)
                  </span>
                  {polylinePoints.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearPolylinePoints}
                      className="text-rose-500 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Trash2 className="w-3 h-3" /> Clear line
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Tap 2+ points on the map to draw walking route.
                </p>

                {errors.polyline && (
                  <p className="text-xs text-rose-500 font-semibold">{errors.polyline}</p>
                )}
              </div>
            )}
          </div>

          {/* Category Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCategory('study')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition flex flex-col items-center gap-1 ${
                  category === 'study'
                    ? 'bg-blue-500 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Study Spot
              </button>

              <button
                type="button"
                onClick={() => setCategory('food')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition flex flex-col items-center gap-1 ${
                  category === 'food'
                    ? 'bg-red-500 text-white border-red-600 shadow-md shadow-red-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <Utensils className="w-4 h-4" />
                Food Joint
              </button>

              <button
                type="button"
                onClick={() => setCategory('shortcut')}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition flex flex-col items-center gap-1 ${
                  category === 'shortcut'
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <Zap className="w-4 h-4" />
                Shortcut
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Spot Name / Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Central Library Silent Zone or Third Wave Coffee"
              maxLength={60}
              className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* Place / College / City Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Place / College / City *
              </label>
              {isReverseGeocoding && (
                <span className="text-xs text-sky-500 font-semibold flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Detecting place...
                </span>
              )}
            </div>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="e.g. IIT Bombay, Powai, Mumbai or Koramangala, Bengaluru"
                maxLength={70}
                className="w-full text-xs pl-9 pr-3 py-3 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            {errors.place && <p className="text-xs text-rose-500 mt-1">{errors.place}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              maxLength={250}
              placeholder="Describe what makes this spot special, seating capacity, vibe..."
              className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
          </div>

          {/* Category Specific Details */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {category.toUpperCase()} SPECIFIC DETAILS
            </h4>

            {category === 'study' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Noise Level</label>
                  <select
                    value={studyFields.noiseLevel}
                    onChange={(e) => setStudyFields({ ...studyFields, noiseLevel: e.target.value })}
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-xl border-slate-200 dark:border-slate-700"
                  >
                    <option value="silent">Silent (Strict silence)</option>
                    <option value="quiet">Quiet (Whispers allowed)</option>
                    <option value="moderate">Moderate (Group discussion)</option>
                    <option value="loud">Loud (Open lounge / outdoor)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Power Outlets Available</span>
                  <input
                    type="checkbox"
                    checked={studyFields.hasPowerOutlets}
                    onChange={(e) => setStudyFields({ ...studyFields, hasPowerOutlets: e.target.checked })}
                    className="w-4 h-4 accent-sky-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Campus / Public Wi-Fi</span>
                  <input
                    type="checkbox"
                    checked={studyFields.hasWifi}
                    onChange={(e) => setStudyFields({ ...studyFields, hasWifi: e.target.checked })}
                    className="w-4 h-4 accent-sky-600 rounded"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Open Hours</label>
                  <input
                    type="text"
                    value={studyFields.openHours}
                    onChange={(e) => setStudyFields({ ...studyFields, openHours: e.target.value })}
                    placeholder="e.g. 24/7 or 8 AM - 11 PM"
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-xl border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
            )}

            {category === 'food' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Price Range</label>
                  <select
                    value={foodFields.priceRange}
                    onChange={(e) => setFoodFields({ ...foodFields, priceRange: e.target.value })}
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-xl border-slate-200 dark:border-slate-700"
                  >
                    <option value="Rs">Rs (Under ₹100 / Budget)</option>
                    <option value="Rs Rs">Rs Rs (₹100 - ₹300 / Moderate)</option>
                    <option value="Rs Rs Rs">Rs Rs Rs (₹300+ / Premium)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Food Options</label>
                  <select
                    value={foodFields.dietaryOptions}
                    onChange={(e) => setFoodFields({ ...foodFields, dietaryOptions: e.target.value })}
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-xl border-slate-200 dark:border-slate-700"
                  >
                    <option value="veg">Pure Veg</option>
                    <option value="non-veg">Non-Veg</option>
                    <option value="both">Both Veg & Non-Veg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Must-Try Item</label>
                  <input
                    type="text"
                    value={foodFields.mustTry}
                    onChange={(e) => setFoodFields({ ...foodFields, mustTry: e.target.value })}
                    placeholder="e.g. Cheese Butter Maggi or Filter Coffee"
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-xl border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
            )}

            {category === 'shortcut' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Time Saved (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={shortcutFields.timeSaved}
                    onChange={(e) => setShortcutFields({ ...shortcutFields, timeSaved: Number(e.target.value) })}
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-xl border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Wheelchair / Bike Accessible</span>
                  <input
                    type="checkbox"
                    checked={shortcutFields.isAccessible}
                    onChange={(e) => setShortcutFields({ ...shortcutFields, isAccessible: e.target.checked })}
                    className="w-4 h-4 accent-sky-600 rounded"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Best Time of Day</label>
                  <select
                    value={shortcutFields.bestTime}
                    onChange={(e) => setShortcutFields({ ...shortcutFields, bestTime: e.target.value })}
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-xl border-slate-200 dark:border-slate-700"
                  >
                    <option value="Anytime">Anytime</option>
                    <option value="Daytime Only">Daytime Only</option>
                    <option value="Nighttime Only">Nighttime Only</option>
                    <option value="Rush Hours">Rush Hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Caution Notes</label>
                  <input
                    type="text"
                    value={shortcutFields.caution}
                    onChange={(e) => setShortcutFields({ ...shortcutFields, caution: e.target.value })}
                    placeholder="e.g. Slippery after rain / dark at night"
                    className="w-full p-2 bg-white dark:bg-slate-900 border rounded-xl border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Photo Uploader */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Add Photo (Optional)
            </label>

            {photo ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                <img src={photo} alt="Spot preview" className="w-full h-36 object-cover" />
                <button
                  type="button"
                  onClick={() => setPhoto('')}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-full hover:bg-rose-600 transition"
                  title="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-sky-500 dark:hover:border-sky-400 transition bg-slate-50 dark:bg-slate-800/40">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {isCompressing ? 'Compressing image...' : 'Upload spot photo'}
                </span>
                <span className="text-xs text-slate-400 mt-0.5">
                  JPEG, PNG (Auto compressed)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isCompressing}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-sky-500/25 transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Pin Spot to Map
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
