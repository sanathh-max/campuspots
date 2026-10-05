import type { CampusLocation } from "@/types/location";
import { CATEGORY_STYLES } from "@/types/location";

type PlaceholderMapProps = {
  locations: CampusLocation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function PlaceholderMap({ locations, selectedId, onSelect }: PlaceholderMapProps) {
  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-3xl border border-ink/10 bg-[#dfe8d4]">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(47,93,80,0.08) 1px, transparent 1px),
            linear-gradient(rgba(47,93,80,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute left-[12%] top-[18%] h-24 w-40 rounded-[2rem] bg-[#c8d7b8]" />
      <div className="absolute right-[10%] top-[12%] h-32 w-28 rounded-3xl bg-[#b7c9c0]" />
      <div className="absolute bottom-[16%] left-[20%] h-20 w-[46%] rounded-full bg-[#c9ddd8]" />
      <div className="absolute left-[8%] top-[40%] h-[38%] w-4 rounded-full bg-[#9eb7a8]" />
      <p className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-ink/70">
        Placeholder campus map
      </p>

      {locations.map((location) => {
        const active = selectedId === location.id;
        return (
          <button
            key={location.id}
            type="button"
            onClick={() => onSelect(location.id)}
            style={{ left: `${location.x}%`, top: `${location.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            aria-label={location.name}
          >
            <span
              className={`block h-4 w-4 rounded-full ring-2 ring-white shadow ${CATEGORY_STYLES[location.category].pin} ${
                active ? "scale-150" : "hover:scale-125"
              } transition`}
            />
            {active ? (
              <span className="absolute left-1/2 top-5 z-10 w-max -translate-x-1/2 rounded-lg bg-ink px-2 py-1 text-xs text-paper">
                {location.name}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
