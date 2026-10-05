import type { CampusLocation } from "@/types/location";
import { CATEGORY_STYLES } from "@/types/location";

type LocationCardProps = {
  location: CampusLocation;
  selected?: boolean;
  onSelect?: (id: string) => void;
};

export default function LocationCard({ location, selected, onSelect }: LocationCardProps) {
  const style = CATEGORY_STYLES[location.category];

  return (
    <button
      type="button"
      onClick={() => onSelect?.(location.id)}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-moss bg-moss/8 shadow-md"
          : "border-ink/10 bg-white/70 hover:border-moss/40 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg leading-tight text-ink">{location.name}</h3>
          <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${style.badge}`}>
            {style.label}
          </span>
        </div>
        <div className="shrink-0 rounded-xl bg-paper px-2.5 py-1 text-right">
          <p className="text-sm font-semibold text-ink">{location.rating.toFixed(1)}</p>
          <p className="text-[11px] text-ink/50">{location.votes} votes</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink/70">{location.description}</p>
      <p className="mt-3 text-xs text-ink/45">Pinned by {location.submittedBy}</p>
    </button>
  );
}
