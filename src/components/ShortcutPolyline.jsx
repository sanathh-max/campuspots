import React from 'react';
import { Polyline, CircleMarker } from 'react-leaflet';

export function ShortcutPolyline({ path, isSelected, onClick }) {
  if (!path || !Array.isArray(path) || path.length < 2) return null;

  const color = isSelected ? '#059669' : '#10b981';

  return (
    <>
      {/* Outer Glow Line */}
      <Polyline
        positions={path}
        pathOptions={{
          color: color,
          weight: isSelected ? 8 : 6,
          opacity: isSelected ? 0.9 : 0.7,
          lineCap: 'round',
          lineJoin: 'round',
          className: 'animated-polyline'
        }}
        eventHandlers={{
          click: onClick
        }}
      />

      {/* Start Point Dot */}
      <CircleMarker
        center={path[0]}
        radius={5}
        pathOptions={{
          fillColor: '#10b981',
          fillOpacity: 1,
          color: '#ffffff',
          weight: 2
        }}
      />

      {/* End Point Dot */}
      <CircleMarker
        center={path[path.length - 1]}
        radius={5}
        pathOptions={{
          fillColor: '#059669',
          fillOpacity: 1,
          color: '#ffffff',
          weight: 2
        }}
      />
    </>
  );
}
