import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { BookOpen, Utensils, Zap, Star, Flame, MapPin } from 'lucide-react';
import { CATEGORIES } from '../config/campus';

function createCustomIcon(category, isTrending, isSelected) {
  const cat = CATEGORIES[category] || CATEGORIES.study;
  const color = cat.color;

  let iconSvg = '';
  if (category === 'study') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
  } else if (category === 'food') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 2 4 4-12 12-4-4Z"/><path d="m5 15-3 3 1 1 3-3"/></svg>`;
  } else {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  }

  const trendingBadgeHtml = isTrending
    ? `<div style="position: absolute; top: -6px; right: -6px; background-color: #f97316; color: white; width: 16px; height: 16px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🔥</div>`
    : '';

  const activeRing = isSelected
    ? `box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.4), 0 8px 16px rgba(0,0,0,0.3); transform: scale(1.2);`
    : `box-shadow: 0 4px 10px rgba(0,0,0,0.25);`;

  const html = `
    <div class="custom-pin-marker" style="position: relative; width: 36px; height: 36px;">
      ${trendingBadgeHtml}
      <div style="background-color: ${color}; width: 36px; height: 36px; border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 2px solid white; ${activeRing} transition: all 0.2s ease-in-out;">
        ${iconSvg}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                {pin.category}
              </span>
              {pin.isTrending && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <Flame className="w-3 h-3 text-amber-600 inline" /> Trending
                </span>
              )}
            </div>

            <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
              {pin.title}
            </h3>

            {pin.place && (
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-sky-500 shrink-0" />
                <span className="truncate">{pin.place}</span>
              </p>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
            {pin.description}
          </p>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-1 font-semibold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
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
