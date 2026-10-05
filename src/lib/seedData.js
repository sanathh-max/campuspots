// 12 Realistic Seed Pins Spread Across Major Indian Cities & Campuses

export const INITIAL_PINS = [
  // --- MUMBAI ---
  {
    id: 'pin_in_1',
    title: 'Central Library Silent Zone',
    place: 'IIT Bombay, Powai, Mumbai',
    category: 'study',
    lat: 19.0762,
    lng: 72.8770,
    description: 'Ultra quiet study cubicles with individual desk lamps and high-speed Wi-Fi. Ideal for exam prep.',
    photo: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
    categoryFields: {
      noiseLevel: 'silent',
      hasPowerOutlets: true,
      hasWifi: true,
      openHours: '8:00 AM - 11:00 PM'
    },
    createdBy: 'Aarav_IITB',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    votes: { up: 28, down: 1 },
    reports: 0
  },
  {
    id: 'pin_in_2',
    title: 'Candies Garden Cafe',
    place: 'Bandra West, Mumbai',
    category: 'food',
    lat: 19.0620,
    lng: 72.8290,
    description: 'Portuguese villa style multi-level cafe. Portuguese rolls, cold coffee, and outdoor terrace seating.',
    photo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    categoryFields: {
      priceRange: 'Rs Rs',
      dietaryOptions: 'both',
      mustTry: 'Chicken Mutton Roll & Cold Coffee'
    },
    createdBy: 'Riya_Bandra',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    votes: { up: 35, down: 0 },
    reports: 0
  },

  // --- BENGALURU ---
  {
    id: 'pin_in_3',
    title: 'J.R.D. Tata Memorial Library Veranda',
    place: 'IISc Campus, Bengaluru',
    category: 'study',
    lat: 13.0185,
    lng: 77.5675,
    description: 'Surrounded by lush rain trees. Quiet open-air study spots with power outlets and green campus breeze.',
    photo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
    categoryFields: {
      noiseLevel: 'quiet',
      hasPowerOutlets: true,
      hasWifi: true,
      openHours: '24/7'
    },
    createdBy: 'Nitin_IISc',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    votes: { up: 42, down: 2 },
    reports: 0
  },
  {
    id: 'pin_in_4',
    title: 'Third Wave Coffee Hub',
    place: 'Koramangala 4th Block, Bengaluru',
    category: 'food',
    lat: 12.9345,
    lng: 77.6242,
    description: 'Favorite study cafe for techies and founders. Fast Wi-Fi, pour-over coffee, and avocado toast.',
    photo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    categoryFields: {
      priceRange: 'Rs Rs Rs',
      dietaryOptions: 'both',
      mustTry: 'Sea Salt Mocha & Hummus Bagel'
    },
    createdBy: 'Siddharth_Tech',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    votes: { up: 21, down: 1 },
    reports: 0
  },

  // --- DELHI NCR ---
  {
    id: 'pin_in_5',
    title: 'IITD Central Lawn Alcove',
    place: 'IIT Delhi, Hauz Khas, New Delhi',
    category: 'study',
    lat: 28.5455,
    lng: 77.1925,
    description: 'Shaded courtyard near Main Building. Great place for laptop work or reading research papers between classes.',
    photo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    categoryFields: {
      noiseLevel: 'quiet',
      hasPowerOutlets: true,
      hasWifi: true,
      openHours: '7:30 AM - 10:00 PM'
    },
    createdBy: 'Pooja_DU',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    votes: { up: 19, down: 0 },
    reports: 0
  },
  {
    id: 'pin_in_6',
    title: "Wenger's Bakery & Deli",
    place: 'Connaught Place (CP), New Delhi',
    category: 'food',
    lat: 28.6328,
    lng: 77.2195,
    description: 'Iconic CP bakery serving fresh patties, pastry slices, and shami kebabs since 1926.',
    photo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    categoryFields: {
      priceRange: 'Rs',
      dietaryOptions: 'both',
      mustTry: 'Mutton Patty & Chocolate Fudge Cake'
    },
    createdBy: 'Kabir_CP',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    votes: { up: 50, down: 1 },
    reports: 0
  },

  // --- HYDERABAD ---
  {
    id: 'pin_in_7',
    title: 'Gachibowli Tech Corridor Shortcut',
    place: 'IIIT Hyderabad, Gachibowli',
    category: 'shortcut',
    lat: 17.4455,
    lng: 78.3489,
    path: [
      [17.4468, 78.3475],
      [17.4458, 78.3486],
      [17.4449, 78.3498]
    ],
    description: 'Bypasses the traffic signal at Gachibowli circle. Saves 10 minutes walking from IIITH hostels to DLF Cybercity.',
    photo: 'https://images.unsplash.com/photo-1477959858617-67f30ac4fe78?auto=format&fit=crop&w=600&q=80',
    categoryFields: {
      timeSaved: 10,
      isAccessible: true,
      bestTime: 'Rush Hours',
      caution: 'Watch for two-wheelers taking the shortcut link'
    },
    createdBy: 'Vikram_HYD',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    votes: { up: 33, down: 0 },
    reports: 0
  },
  {
    id: 'pin_in_8',
    title: 'Famous Ice Cream Centre',
    place: 'Mozamjahi Market, Hyderabad',
    category: 'food',
    lat: 17.3820,
    lng: 78.4735,
    description: 'Handcrafted seasonal fruit ice creams served inside original heritage stone market buildings.',
    photo: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80',
    categoryFields: {
      priceRange: 'Rs',
      dietaryOptions: 'veg',
      mustTry: 'Mango & Custard Apple Ice Cream'
    },
    createdBy: 'Ananya_Biryani',
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    votes: { up: 29, down: 1 },
    reports: 0
  },

  // --- PUNE ---
  {
    id: 'pin_in_9',
    title: 'COEP Riverside Boat Club Lawn',
    place: 'COEP Tech University, Pune',
    category: 'study',
    lat: 18.5293,
    lng: 73.8567,
    description: 'Peaceful Mula riverfront lawn. Great breeze and wooden benches for self-study and reading.',
    photo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    categoryFields: {
      noiseLevel: 'quiet',
      hasPowerOutlets: false,
      hasWifi: true,
      openHours: '6:00 AM - 9:00 PM'
    },
    createdBy: 'Tanvi_Pune',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    votes: { up: 16, down: 0 },
    reports: 0
  },

  // --- CHENNAI ---
  {
    id: 'pin_in_10',
    title: 'IIT Madras Deer Park Trail',
    place: 'IIT Madras, Guindy, Chennai',
    category: 'shortcut',
    lat: 12.9915,
    lng: 80.2337,
    path: [
      [12.9928, 80.2325],
      [12.9918, 80.2334],
      [12.9908, 80.2345]
    ],
    description: 'Forest path shortcut connecting Gajendra Circle to Hostel Zone. Shaded by dense green canopy.',
    photo: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    categoryFields: {
      timeSaved: 7,
      isAccessible: true,
      bestTime: 'Daytime Only',
      caution: 'Watch out for monkeys and spotted deer on path'
    },
    createdBy: 'Karthik_IITM',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    votes: { up: 27, down: 0 },
    reports: 0
  },

  // --- KOLKATA ---
  {
    id: 'pin_in_11',
    title: 'Indian Coffee House',
    place: 'College Street, Kolkata',
    category: 'food',
    lat: 22.5742,
    lng: 88.3638,
    description: 'Historic meeting hub for intellectuals, students, and writers opposite Presidency University. High ceiling nostalgia.',
    photo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    categoryFields: {
      priceRange: 'Rs',
      dietaryOptions: 'both',
      mustTry: 'Mutton Cutlet & Hot Filter Coffee'
    },
    createdBy: 'Sourav_Cal',
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    votes: { up: 44, down: 1 },
    reports: 0
  },

  // --- AHMEDABAD ---
  {
    id: 'pin_in_12',
    title: 'Louis Kahn Plaza Canopy Walk',
    place: 'IIM Ahmedabad, Gujarat',
    category: 'shortcut',
    lat: 23.0335,
    lng: 72.5320,
    path: [
      [23.0342, 72.5312],
      [23.0335, 72.5320],
      [23.0328, 72.5328]
    ],
    description: 'Red brick archway corridor connecting New Campus dorms directly to the Old Campus academic block.',
    photo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    categoryFields: {
      timeSaved: 6,
      isAccessible: true,
      bestTime: 'Anytime',
      caution: 'Archway reverberates sound; quiet zone'
    },
    createdBy: 'Mehul_IIMA',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    votes: { up: 38, down: 0 },
    reports: 0
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev_in_1',
    pinId: 'pin_in_1',
    rating: 5,
    text: 'Best place on campus for serious studying. Outlets at every desk work great!',
    author: 'Dev_EE',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    reports: 0
  },
  {
    id: 'rev_in_2',
    pinId: 'pin_in_4',
    rating: 5,
    text: 'Top coffee and blazing fast Wi-Fi! Handled 3 hours of remote coding effortlessly.',
    author: 'Sneha_BLR',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    reports: 0
  },
  {
    id: 'rev_in_3',
    pinId: 'pin_in_6',
    rating: 5,
    text: 'The mutton patty + cold coffee is nostalgic perfection.',
    author: 'Rahul_DU',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    reports: 0
  }
];
