"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AddLocationModal from "@/components/AddLocationModal";
import CategoryFilters from "@/components/CategoryFilters";
import LocationCard from "@/components/LocationCard";
import PlaceholderMap from "@/components/PlaceholderMap";
import { INITIAL_LOCATIONS } from "@/data/locations";
import type { CampusLocation, LocationCategory } from "@/types/location";

export default function MapExperience() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [locations, setLocations] = useState<CampusLocation[]>(INITIAL_LOCATIONS);
  const [category, setCategory] = useState<LocationCategory | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(INITIAL_LOCATIONS[0]?.id ?? null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("add") === "1") {
      setModalOpen(true);
    }
  }, [searchParams]);

  const filtered = useMemo(
    () => (category === "all" ? locations : locations.filter((item) => item.category === category)),
    [category, locations],
  );

  function closeModal() {
    setModalOpen(false);
    if (searchParams.get("add") === "1") {
      router.replace("/map");
    }
  }

  function handleAdd(location: CampusLocation) {
    setLocations((current) => [location, ...current]);
    setSelectedId(location.id);
    setCategory("all");
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4.25rem)] max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="flex min-h-[50vh] flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl text-ink">Campus map</h1>
            <p className="text-sm text-ink/60">{filtered.length} spots from students</p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-clay/90"
          >
            Add location
          </button>
        </div>
        <CategoryFilters value={category} onChange={setCategory} />
        <div className="min-h-[360px] flex-1">
          <PlaceholderMap locations={filtered} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </section>

      <aside className="flex flex-col gap-3 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/20 p-6 text-sm text-ink/60">
            No spots in this category yet. Be the first to pin one.
          </p>
        ) : (
          filtered.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              selected={selectedId === location.id}
              onSelect={setSelectedId}
            />
          ))
        )}
      </aside>

      <AddLocationModal open={modalOpen} onClose={closeModal} onAdd={handleAdd} />
    </div>
  );
}
