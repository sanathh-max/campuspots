import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MapView } from './components/MapView';
import { PinDetail } from './components/PinDetail';
import { AddPinModal } from './components/AddPinModal';
import { NicknameModal } from './components/NicknameModal';
import { Toast } from './components/Toast';
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { INDIA_MAP_CONFIG } from './config/campus';
import { useUser } from './hooks/useUser';
import { usePins } from './hooks/usePins';

export function App() {
  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // User Nickname Hook
  const {
    nickname,
    isModalOpen: isUserModalOpen,
    isFirstVisit,
    saveNickname,
    promptNicknameChange,
    closeModal: closeUserModal
  } = useUser();

  // Map Tracking States
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: INDIA_MAP_CONFIG.center[0], lng: INDIA_MAP_CONFIG.center[1] });
  const [mapBounds, setMapBounds] = useState(null);
  const [filterByBounds, setFilterByBounds] = useState(false);

  // Map Navigation Target
  const [mapTargetCenter, setMapTargetCenter] = useState(null);
  const [mapTargetZoom, setMapTargetZoom] = useState(null);

  // Pins & Filters Hook
  const {
    pins,
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
  } = usePins(userLocation, mapCenter, mapBounds, filterByBounds);

  // Selected Pin Drawer State
  const [selectedPin, setSelectedPin] = useState(null);

  // Add Pin Form & Location Picker State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);
  const [isPolylineMode, setIsPolylineMode] = useState(false);
  const [polylinePoints, setPolylinePoints] = useState([]);

  // Toast Notification State
  const [toast, setToast] = useState(null);
  const showToast = useCallback((toastData) => {
    setToast(toastData);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Quick Jump Presets (e.g. Mumbai, Bengaluru, Delhi, etc.)
  const handleQuickJump = (city) => {
    setMapTargetCenter(city.center);
    setMapTargetZoom(city.zoom);
    setSelectedPin(null);
    showToast({ type: 'info', message: `Flew to ${city.name}` });
  };

  // Nominatim Geocoded Place Selection
  const handleSelectGeocodedPlace = (lat, lon, displayName) => {
    const coords = [lat, lon];
    setMapTargetCenter(coords);
    setMapTargetZoom(15);
    setPendingLocation({ lat, lng: lon });
    setSelectedPin(null);
    showToast({
      type: 'success',
      message: `Centered on ${displayName.split(',')[0]}`
    });
  };

  // Geolocation Handler
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      showToast({ type: 'error', message: 'Geolocation is not supported by your browser.' });
      return;
    }

    showToast({ type: 'info', message: 'Locating your current position...' });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setMapTargetCenter([coords.lat, coords.lng]);
        setMapTargetZoom(16);
        showToast({ type: 'success', message: 'Located! Map centered on your position.' });
      },
      (err) => {
        showToast({ type: 'error', message: 'Unable to retrieve location. Check browser permissions.' });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Map Click Handler
  const handleMapClick = (latlng) => {
    if (isPolylineMode) {
      setPolylinePoints(prev => [...prev, [latlng.lat, latlng.lng]]);
      setPendingLocation(latlng);
    } else if (isPickingLocation) {
      setPendingLocation(latlng);
      setIsPickingLocation(false);
      setIsAddModalOpen(true);
      showToast({ type: 'success', message: 'Location selected! Complete the spot form.' });
    }
  };

  const handleOpenAddModal = () => {
    if (!nickname) {
      promptNicknameChange();
      return;
    }
    if (!pendingLocation) {
      setPendingLocation({ lat: mapCenter.lat, lng: mapCenter.lng });
    }
    setIsAddModalOpen(true);
  };

  const handleStartPickLocation = () => {
    setIsAddModalOpen(false);
    setIsPickingLocation(true);
  };

  const handleSavePinSubmit = async (pinData) => {
    const newPin = await handleAddPin(pinData);
    setPendingLocation(null);
    setPolylinePoints([]);
    setIsPolylineMode(false);
    setSelectedPin(newPin);
    setMapTargetCenter([newPin.lat, newPin.lng]);
    setMapTargetZoom(16);
    return newPin;
  };

  const handleNavigateTo = (lat, lng, zoom = 16) => {
    setMapTargetCenter([lat, lng]);
    setMapTargetZoom(zoom);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* App Header with Nominatim Place Search & Quick Jump */}
      <Header
        onQuickJump={handleQuickJump}
        onSelectGeocodedPlace={handleSelectGeocodedPlace}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        nickname={nickname}
        onOpenNicknameModal={promptNicknameChange}
      />

      {/* Filter Bar with Search, Category Chips, Sort, & "Search this area" Toggle */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        filterByBounds={filterByBounds}
        onToggleFilterByBounds={() => setFilterByBounds(prev => !prev)}
        pinCount={pins.length}
        userLocation={userLocation}
      />

      {/* Main Map Viewport */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-sky-500 animate-spin" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Loading India Map & Spots...
            </p>
          </div>
        ) : pins.length === 0 ? (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-center space-y-1 max-w-sm">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              {filterByBounds ? 'No spots found in this visible map area' : 'No spots found matching your search'}
            </p>
            {filterByBounds && (
              <button
                onClick={() => setFilterByBounds(false)}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline block mx-auto"
              >
                Disable "Search this area" filter
              </button>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline block mx-auto"
              >
                Clear search query
              </button>
            )}
          </div>
        ) : null}

        <MapView
          pins={pins}
          selectedPin={selectedPin}
          onSelectPin={(pin) => {
            setSelectedPin(pin);
            setMapTargetCenter([pin.lat, pin.lng]);
          }}
          userLocation={userLocation}
          onLocateUser={handleLocateUser}
          isPickingLocation={isPickingLocation}
          pendingLocation={pendingLocation}
          isPolylineMode={isPolylineMode}
          polylinePoints={polylinePoints}
          onMapClick={handleMapClick}
          onBoundsChange={setMapBounds}
          onCenterChange={setMapCenter}
          mapTargetCenter={mapTargetCenter}
          mapTargetZoom={mapTargetZoom}
        />

        {/* Floating Add Pin (+) Button (Resolves Issue #1: Standardized btn-fab) */}
        <button
          onClick={handleOpenAddModal}
          className="fixed bottom-6 right-6 z-40 btn-fab group"
          title="Add a Spot in India"
          aria-label="Add a Spot in India"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" aria-hidden="true" />
        </button>
      </main>

      {/* Pin Detail Drawer */}
      {selectedPin && (
        <PinDetail
          pin={selectedPin}
          onClose={() => setSelectedPin(null)}
          onVote={handleVote}
          onReport={handleReport}
          nickname={nickname}
          onPromptNickname={promptNicknameChange}
          onShowToast={showToast}
          onNavigateTo={handleNavigateTo}
        />
      )}

      {/* Add Pin Modal */}
      <AddPinModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialLocation={pendingLocation}
        isPolylineMode={isPolylineMode}
        polylinePoints={polylinePoints}
        onStartPickLocation={handleStartPickLocation}
        onAddPolylinePoint={(pt) => setPolylinePoints(prev => [...prev, pt])}
        onClearPolylinePoints={() => setPolylinePoints([])}
        onSavePin={handleSavePinSubmit}
        onShowToast={showToast}
      />

      {/* Nickname Registration Modal */}
      <NicknameModal
        isOpen={isUserModalOpen}
        initialNickname={nickname}
        isFirstVisit={isFirstVisit}
        onSave={saveNickname}
        onClose={closeUserModal}
      />

      {/* Toast Notification Banner */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
