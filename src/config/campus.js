// India Map Configuration & Quick Jump Presets

export const INDIA_MAP_CONFIG = {
  name: 'India Campus & Spot Map',
  center: [22.5, 79.0],
  defaultZoom: 5,
  minZoom: 4,
  maxZoom: 19,
  bounds: [
    [6.0, 68.0],  // South West
    [37.5, 97.5]  // North East
  ]
};

export const QUICK_JUMP_CITIES = [
  { id: 'all_india', name: '🇮🇳 All India', center: [22.5, 79.0], zoom: 5 },
  { id: 'mumbai', name: 'Mumbai (IITB)', center: [19.0760, 72.8777], zoom: 14 },
  { id: 'bengaluru', name: 'Bengaluru (IISc)', center: [13.0182, 77.5670], zoom: 14 },
  { id: 'delhi', name: 'Delhi NCR (DU/IITD)', center: [28.5450, 77.1926], zoom: 14 },
  { id: 'hyderabad', name: 'Hyderabad (IIITH)', center: [17.4455, 78.3489], zoom: 14 },
  { id: 'pune', name: 'Pune (COEP/Sppu)', center: [18.5293, 73.8567], zoom: 14 },
  { id: 'chennai', name: 'Chennai (IITM)', center: [12.9915, 80.2337], zoom: 14 },
  { id: 'kolkata', name: 'Kolkata (JU/CU)', center: [22.5697, 88.3697], zoom: 14 }
];

export const CATEGORIES = {
  study: {
    id: 'study',
    label: 'Study Spot',
    color: '#3b82f6',
    bgLight: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
    chipClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200',
    markerColor: '#3b82f6',
    iconName: 'BookOpen',
    fields: [
      { key: 'noiseLevel', label: 'Noise Level', type: 'select', options: ['silent', 'quiet', 'moderate', 'loud'], default: 'quiet' },
      { key: 'hasPowerOutlets', label: 'Power Outlets Available', type: 'boolean', default: true },
      { key: 'hasWifi', label: 'Campus Wi-Fi Signal', type: 'boolean', default: true },
      { key: 'openHours', label: 'Operating Hours', type: 'text', placeholder: 'e.g., 24/7 or 8 AM - 11 PM', default: '24/7' }
    ]
  },
  food: {
    id: 'food',
    label: 'Food Joint',
    color: '#ef4444',
    bgLight: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800',
    chipClass: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200',
    markerColor: '#ef4444',
    iconName: 'Utensils',
    fields: [
      { key: 'priceRange', label: 'Price Range', type: 'select', options: ['Rs', 'Rs Rs', 'Rs Rs Rs'], default: 'Rs' },
      { key: 'dietaryOptions', label: 'Food Options', type: 'select', options: ['veg', 'non-veg', 'both'], default: 'both' },
      { key: 'mustTry', label: 'Must-Try Item', type: 'text', placeholder: 'e.g., Cold Coffee & Maggi or Cheese Dosa', default: '' }
    ]
  },
  shortcut: {
    id: 'shortcut',
    label: 'Shortcut',
    color: '#10b981',
    bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    chipClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
    markerColor: '#10b981',
    iconName: 'Zap',
    fields: [
      { key: 'timeSaved', label: 'Time Saved (mins)', type: 'number', default: 5 },
      { key: 'isAccessible', label: 'Wheelchair / Bike Accessible', type: 'boolean', default: true },
      { key: 'bestTime', label: 'Best Time of Day', type: 'select', options: ['Anytime', 'Daytime Only', 'Nighttime Only', 'Rush Hours'], default: 'Anytime' },
      { key: 'caution', label: 'Caution Notes', type: 'text', placeholder: 'e.g., Slippery after rain / ID check at gate', default: '' }
    ]
  }
};
