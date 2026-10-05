"use client";

import { useState } from "react";
import type { CampusLocation, LocationCategory } from "@/types/location";
import { CATEGORIES } from "@/types/location";

type AddLocationModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (location: CampusLocation) => void;
};

const categoryOptions = CATEGORIES.filter((item) => item.id !== "all") as {
  id: LocationCategory;
  label: string;
}[];

export default function AddLocationModal({ open, onClose, onAdd }: AddLocationModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<LocationCategory>("study");
  const [description, setDescription] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");

  if (!open) return null;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      category,
      description: description.trim(),
      submittedBy: submittedBy.trim() || "Anonymous",
      rating: 5,
      votes: 1,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 55,
    });
    setName("");
    setDescription("");
    setSubmittedBy("");
    setCategory("study");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink/40 p-0 sm:place-items-center sm:p-6">
      <button type="button" className="absolute inset-0" aria-label="Close dialog" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-lg rounded-t-3xl bg-paper p-6 shadow-2xl sm:rounded-3xl"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl text-ink">Add a location</h2>
            <p className="mt-1 text-sm text-ink/60">Saved in this browser session only — no backend yet.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full px-2 text-xl text-ink/50 hover:text-ink">
            ×
          </button>
        </div>

        <label className="mb-3 block text-sm font-medium">
          Name
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 outline-none focus:border-moss"
            placeholder="Late-night reading nook"
          />
        </label>

        <label className="mb-3 block text-sm font-medium">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as LocationCategory)}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 outline-none focus:border-moss"
          >
            {categoryOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="mb-3 block text-sm font-medium">
          Why it belongs on the map
          <textarea
            required
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 outline-none focus:border-moss"
            placeholder="When to go, what to expect, any tips."
          />
        </label>

        <label className="mb-5 block text-sm font-medium">
          Your name
          <input
            value={submittedBy}
            onChange={(event) => setSubmittedBy(event.target.value)}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-white px-3 py-2 outline-none focus:border-moss"
            placeholder="Optional"
          />
        </label>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm text-ink/70">
            Cancel
          </button>
          <button type="submit" className="rounded-full bg-clay px-5 py-2 text-sm font-semibold text-white">
            Pin to map
          </button>
        </div>
      </form>
    </div>
  );
}
