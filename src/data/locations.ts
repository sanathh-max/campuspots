import type { CampusLocation } from "@/types/location";

export const INITIAL_LOCATIONS: CampusLocation[] = [
  {
    id: "quad-oak",
    name: "The Quiet Oak",
    category: "study",
    description:
      "Shaded bench behind the library annex. Reliable wifi, almost no foot traffic after 4pm.",
    submittedBy: "Maya K.",
    rating: 4.8,
    votes: 126,
    x: 38,
    y: 42,
  },
  {
    id: "night-cart",
    name: "Midnight Samosa Cart",
    category: "food",
    description:
      "Shows up near the east gate after 9:30. Cash only, worth the walk.",
    submittedBy: "Arjun P.",
    rating: 4.9,
    votes: 214,
    x: 72,
    y: 58,
  },
  {
    id: "roof-jam",
    name: "Science Block Rooftop",
    category: "events",
    description:
      "Open-mic Fridays when security looks the other way. Bring a jacket.",
    submittedBy: "Leah S.",
    rating: 4.6,
    votes: 89,
    x: 54,
    y: 22,
  },
  {
    id: "secret-courtyard",
    name: "Courtyard Between C and D",
    category: "hidden",
    description:
      "A locked-looking gate that isn't. Best sunset light on campus.",
    submittedBy: "Diego R.",
    rating: 4.7,
    votes: 73,
    x: 24,
    y: 68,
  },
  {
    id: "north-hall",
    name: "North Hall Co-op",
    category: "housing",
    description:
      "Quiet wing, kitchen that actually gets cleaned. Waitlist moves faster in spring.",
    submittedBy: "Priya N.",
    rating: 4.3,
    votes: 51,
    x: 18,
    y: 28,
  },
  {
    id: "river-loop",
    name: "River Loop Trail",
    category: "recreation",
    description:
      "2.1 km path behind the sports complex. Lit until 11, rarely crowded.",
    submittedBy: "Sam T.",
    rating: 4.5,
    votes: 162,
    x: 82,
    y: 34,
  },
];
