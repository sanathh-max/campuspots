# 🎓 CampusSpots - Crowdsourced Interactive Campus Map

CampusSpots is a mobile-first crowdsourced interactive campus map web app built with React, Vite, Tailwind CSS, and Leaflet (OpenStreetMap). Students can pin, review, upvote, and explore hidden study spots, food joints, and time-saving shortcuts across campus.

---

## 🚀 Quick Setup & Run

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Local Development

```bash
# 1. Clone or navigate to the repository
cd Crowd_campus

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open your browser at `http://localhost:3000` to interact with CampusSpots!

---

## ✨ Features

- 🗺️ **Interactive Campus Map**: Built with Leaflet + OpenStreetMap tiles with custom SVG category markers, marker clustering, campus panning boundary restriction, and browser geolocation.
- 📍 **Three Spot Categories**:
  - 📖 **Study Spot**: Noise level, power outlet availability, campus Wi-Fi signal, operating hours.
  - 🍔 **Food Joint**: Price range (`Rs` / `Rs Rs` / `Rs Rs Rs`), dietary options (`veg`/`non-veg`/`both`), must-try items.
  - ⚡ **Shortcut**: Time saved (mins), accessibility, best time of day, caution notes, plus **polyline path drawing** for exact walking routes!
- 📸 **Photo Upload**: Supports uploading spot photos with automatic client-side JPEG image compression to keep base64 storage light.
- ⭐ **Ratings & Reviews**: 1-5 star ratings with student reviews, author nicknames, relative timestamps, and 1-review-per-user enforcement.
- 🔥 **Upvote/Downvote & Trending Badges**: Community voting system with automatic "Trending" badges for high-ranking spots.
- 🔍 **Search & Filters**: Real-time search by spot title, description, or must-try item; category filter chips; sorting by Top Rated, Newest, or Nearest (via GPS).
- 🚩 **Community Moderation (Report System)**: Flag invalid pins or abusive reviews. Items are automatically hidden from the map after 3 community flags.
- 🌓 **Dark Mode**: Smooth dark theme toggle with dark map tile filters.
- 👤 **Zero-Login Nicknames**: Quick nickname registration saved in `localStorage`.

---

## 🗄️ Architecture & Swapping in Supabase / Firebase

All data layer interactions flow through a clean abstraction interface located in [`src/lib/db.js`](file:///c:/Users/SANATH/OneDrive/Desktop/Projects/Crowd_campus/src/lib/db.js).

Currently, `src/lib/db.js` uses `localStorage` for v1. To swap in **Supabase**:

### Step 1: Create Supabase Tables
Run the following SQL in your Supabase Query Editor:

```sql
create table pins (
  id text primary key,
  title text not null,
  category text not null,
  lat float8 not null,
  lng float8 not null,
  path jsonb,
  description text,
  photo text,
  category_fields jsonb,
  created_by text,
  created_at timestamp default now(),
  votes jsonb default '{"up": 1, "down": 0}',
  reports int default 0
);

create table reviews (
  id text primary key,
  pin_id text references pins(id) on delete cascade,
  rating int not null,
  text text,
  author text,
  author_id text,
  created_at timestamp default now(),
  reports int default 0
);
```

### Step 2: Swap the `db` Implementation
In [`src/lib/db.js`](file:///c:/Users/SANATH/OneDrive/Desktop/Projects/Crowd_campus/src/lib/db.js), initialize the Supabase client:

```js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

export const db = {
  async getPins() {
    const { data } = await supabase.from('pins').select('*').lt('reports', 3);
    return data || [];
  },
  async savePin(pinData) {
    const { data } = await supabase.from('pins').insert([pinData]).select();
    return data[0];
  },
  // Implement remaining methods: saveReview, votePin, reportPin, etc.
};
```

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Lucide Icons
- **Mapping**: Leaflet + React-Leaflet + Leaflet MarkerCluster
- **State & Storage**: Custom Hooks (`usePins`, `useReviews`, `useUser`) + `localStorage`
