export type LocationCategory =
  | "study"
  | "food"
  | "events"
  | "hidden"
  | "housing"
  | "recreation";

export type CampusLocation = {
  id: string;
  name: string;
  category: LocationCategory;
  description: string;
  submittedBy: string;
  rating: number;
  votes: number;
  x: number;
  y: number;
};

export const CATEGORIES: { id: LocationCategory | "all"; label: string }[] = [
  { id: "all", label: "All spots" },
  { id: "study", label: "Study spots" },
  { id: "food", label: "Food" },
  { id: "events", label: "Events" },
  { id: "hidden", label: "Hidden gems" },
  { id: "housing", label: "Housing" },
  { id: "recreation", label: "Recreation" },
];

export const CATEGORY_STYLES: Record<
  LocationCategory,
  { label: string; pin: string; badge: string }
> = {
  study: {
    label: "Study spots",
    pin: "bg-sky-500",
    badge: "bg-sky-100 text-sky-800",
  },
  food: {
    label: "Food",
    pin: "bg-amber-500",
    badge: "bg-amber-100 text-amber-900",
  },
  events: {
    label: "Events",
    pin: "bg-violet-500",
    badge: "bg-violet-100 text-violet-800",
  },
  hidden: {
    label: "Hidden gems",
    pin: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-800",
  },
  housing: {
    label: "Housing",
    pin: "bg-rose-500",
    badge: "bg-rose-100 text-rose-800",
  },
  recreation: {
    label: "Recreation",
    pin: "bg-lime-600",
    badge: "bg-lime-100 text-lime-800",
  },
};
