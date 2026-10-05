"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/map", label: "Campus map" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-moss text-sm font-semibold text-paper">
            CC
          </span>
          <span className="font-display text-xl tracking-tight text-ink">CrowdCampus</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition ${
                pathname === link.href ? "font-semibold text-moss" : "text-ink/70 hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/map?add=1"
            className="rounded-full bg-clay px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-clay/90"
          >
            Add location
          </Link>
        </nav>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-ink/10 md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="flex flex-col gap-1.5">
            <span className={`h-0.5 w-5 bg-ink transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-ink transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 bg-ink transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {open ? (
        <nav className="border-t border-ink/10 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 ${
                  pathname === link.href ? "bg-moss/10 font-semibold text-moss" : "text-ink/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/map?add=1"
              onClick={() => setOpen(false)}
              className="rounded-full bg-clay px-4 py-2 text-center text-sm font-semibold text-white"
            >
              Add location
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
