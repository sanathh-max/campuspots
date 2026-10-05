import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap, Marker, CircleMarker, Polyline } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { Locate, Navigation } from 'lucide-react';
import { PinMarker } from './PinMarker';
import { ShortcutPolyline } from './ShortcutPolyline';
import { CategoryLegend } from './CategoryLegend';
import { INDIA_MAP_CONFIG } from '../config/campus';

// Map event listener for clicks, bounds changes, and movement
function MapEventsController({ onMapClick, onBoundsChange, onCenterChange }) {
  const map = useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
    moveend() {
      if (onBoundsChange) {
        const bounds = map.getBounds();
        onBoundsChange({
          southWest: bounds.getSouthWest(),
          northEast: bounds.getNorthEast()
        });
      }
      if (onCenterChange) {
        const center = map.getCenter();
        onCenterChange({ lat: center.lat, lng: center.lng });
      }
    }
  });

  useEffect(() => {
    // Initial bounds & center callback
    if (onBoundsChange) {
      const bounds = map.getBounds();
      onBoundsChange({
        southWest: bounds.getSouthWest(),
        northEast: bounds.getNorthEast()
      });
    }
    if (onCenterChange) {
      const center = map.getCenter();
      onCenterChange({ lat: center.lat, lng: center.lng });
    }
  }, [map]);

  return null;
}

// Controller component to smoothly fly/pan map to target center or zoom
function MapViewController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || map.getZoom(), {
        duration: 1.2
      });
    }
  }, [center, zoom, map]);

  return null;
}

export function MapView({
  pins,
  selectedPin,
  onSelectPin,
  userLocation,
  onLocateUser,
  isPickingLocation,
  pendingLocation,
  isPolylineMode,
  polylinePoints,
  onMapClick,
  onBoundsChange,
  onCenterChange,
  mapTargetCenter,
  mapTargetZoom
}) {
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={INDIA_MAP_CONFIG.center}
        zoom={INDIA_MAP_CONFIG.defaultZoom}
        minZoom={INDIA_MAP_CONFIG.minZoom}
        maxZoom={INDIA_MAP_CONFIG.maxZoom}
        maxBounds={INDIA_MAP_CONFIG.bounds}
        maxBoundsViscosity={0.5}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxNativeZoom={19}
          maxZoom={19}
        />

        {/* Dynamic View Controller */}
        <MapViewController center={mapTargetCenter} zoom={mapTargetZoom} />

        {/* Map Events Listener */}
        <MapEventsController
          onMapClick={onMapClick}
          onBoundsChange={onBoundsChange}
          onCenterChange={onCenterChange}
        />

        {/* Render Shortcut Polylines */}
        {pins
          .filter(p => p.category === 'shortcut' && p.path && p.path.length >= 2)
          .map(pin => (
            <ShortcutPolyline
              key={`polyline_${pin.id}`}
              path={pin.path}
              isSelected={selectedPin?.id === pin.id}
              onClick={() => onSelectPin(pin)}
            />
          ))}

        {/* Marker Clustering Group across India */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          disableClusteringAtZoom={15}
        >
          {pins.map(pin => (
            <PinMarker
              key={pin.id}
              pin={pin}
              isSelected={selectedPin?.id === pin.id}
              onClick={onSelectPin}
            />
          ))}
        </MarkerClusterGroup>

        {/* Pending New Pin Location Marker */}
        {pendingLocation && (
          <Marker
            position={[pendingLocation.lat, pendingLocation.lng]}
            icon={L.divIcon({
              className: '',
              html: `
                <div class="animate-bounce" style="width: 32px; height: 32px; background-color: #0284c7; border: 3px solid white; border-radius: 9999px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(2,132,199,0.5);">
                  <div style="width: 10px; height: 10px; background-color: white; border-radius: 9999px;"></div>
                </div>
              `,
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            })}
          />
        )}

        {/* Active Polyline Path Preview when drawing a shortcut */}
        {isPolylineMode && polylinePoints.length >= 2 && (
          <Polyline
            positions={polylinePoints}
            pathOptions={{
              color: '#10b981',
              weight: 4,
              dashArray: '6, 6'
            }}
          />
        )}

        {/* User Current GPS Geolocation Marker */}
        {userLocation && (
          <>
            <CircleMarker
              center={[userLocation.lat, userLocation.lng]}
              radius={8}
              pathOptions={{
                fillColor: '#0284c7',
                fillOpacity: 1,
                color: '#ffffff',
                weight: 3
              }}
            />
            <CircleMarker
              center={[userLocation.lat, userLocation.lng]}
              radius={24}
              pathOptions={{
                fillColor: '#38bdf8',
                fillOpacity: 0.2,
                color: '#0284c7',
                weight: 1
              }}
            />
          </>
        )}
      </MapContainer>

      {/* Map Category Legend */}
      <CategoryLegend />

      {/* Floating "Locate Me" Button */}
      <button
        onClick={onLocateUser}
        className="absolute top-20 right-4 z-20 p-3 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800 transition transform hover:scale-105 active:scale-95"
        title="Locate me on map"
        aria-label="Locate me on map"
      >
        <Locate className="w-5 h-5" />
      </button>

      {/* Floating Mode Helper Banner when picking location */}
      {(isPickingLocation || isPolylineMode) && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-sky-600 text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-slideUp">
          <Navigation className="w-4 h-4 animate-spin" />
          <span>
            {isPolylineMode
              ? `Drawing shortcut: Tap map to add points (${polylinePoints.length} added)`
              : 'Tap anywhere on the map to place your pin'}
          </span>
        </div>
      )}
    </div>
  );
}
