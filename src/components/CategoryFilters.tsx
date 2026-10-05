import { CATEGORIES, type LocationCategory } from "@/types/location";

type CategoryFiltersProps = {
  value: LocationCategory | "all";
  onChange: (value: LocationCategory | "all") => void;
};

export default function CategoryFilters({ value, onChange }: CategoryFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CATEGORIES.map((category) => {
        const active = value === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm transition ${
              active ? "bg-ink text-paper" : "bg-white/80 text-ink/70 ring-1 ring-ink/10 hover:text-ink"
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
