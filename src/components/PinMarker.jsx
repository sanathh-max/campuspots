import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Star, Flame, MapPin } from 'lucide-react';
import { CATEGORIES } from '../config/campus';

function createCustomIcon(category, isTrending, isSelected) {
  const cat = CATEGORIES[category] || CATEGORIES.study;
  const color = cat.color;

  let iconSvg = '';
  if (category === 'study') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
  } else if (category === 'food') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 2 4 4-12 12-4-4Z"/><path d="m5 15-3 3 1 1 3-3"/></svg>`;
  } else {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  }

  /* Resolves Issue #6: High-detail SVG Flame vector icon replacing low-detail emoji */
  const trendingBadgeHtml = isTrending
    ? `<div style="position: absolute; top: -5px; right: -5px; background-color: #ea580c; color: white; width: 18px; height: 18px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.25); z-index: 10;" title="Trending Spot" aria-label="Trending spot">
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
        </svg>
      </div>`
    : '';

  /* Resolves Issues #7 & #8:
     - Issue #7: Pin tip anchor with elevated body lifts marker above underlying city labels.
     - Issue #8: Standardized 36px circular geometry matching circular cluster markers.
     - Translucent 90% opacity with backdrop blur softens contrast so map labels stay readable.
  */
  const activeRing = isSelected
    ? `box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.5), 0 4px 12px rgba(0,0,0,0.25); transform: scale(1.15);`
    : `box-shadow: 0 2px 6px rgba(0,0,0,0.2);`;

  const html = `
    <div class="custom-pin-marker" style="position: relative; width: 36px; height: 42px; display: flex; flex-direction: column; align-items: center;">
      ${trendingBadgeHtml}
      <div style="background-color: ${color}ee; backdrop-filter: blur(2px); width: 36px; height: 36px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(255,255,255,0.95); ${activeRing} transition: all 0.2s ease-in-out;">
        ${iconSvg}
      </div>
      <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid ${color}ee; margin-top: -1px;"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: '',
    iconSize: [36, 42],
    iconAnchor: [18, 42],
    popupAnchor: [0, -42]
  });
}

export function PinMarker({ pin, isSelected, onClick }) {
  const icon = createCustomIcon(pin.category, pin.isTrending, isSelected);

  return (
    <Marker
      position={[pin.lat, pin.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onClick(pin)
      }}
    >
      <Popup>
        <div className="p-3 max-w-xs space-y-2">
          {pin.photo && (
            <img
              src={pin.photo}
              alt={pin.title}
              className="w-full h-24 object-cover rounded-lg shadow-inner"
            />
          )}

          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                {pin.category}
              </span>
              {pin.isTrending && (
                <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600 inline" aria-hidden="true" /> Trending
                </span>
              )}
            </div>

            <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
              {pin.title}
            </h3>

            {pin.place && (
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" aria-hidden="true" />
                <span className="truncate">{pin.place}</span>
              </p>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
            {pin.description}
          </p>

          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-1 font-semibold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
              <span>{pin.avgRating ? pin.avgRating.toFixed(1) : 'New'}</span>
              <span className="text-slate-400 font-normal">({pin.reviewCount})</span>
            </div>

            <button
              onClick={() => onClick(pin)}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
            >
              View details &rarr;
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
