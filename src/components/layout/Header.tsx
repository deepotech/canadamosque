import React from "react";
import Link from "next/link";
import { Container } from "../common/Container";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold tracking-tight text-emerald-900 transition hover:opacity-90"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-800 text-white font-serif text-lg shadow-sm">
                🕌
              </span>
              <span className="text-base sm:text-lg">
                Canada Mosque Near Me
              </span>
            </Link>
          </div>

          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600"
          >
            <Link
              href="/mosques"
              className="hover:text-emerald-800 transition"
            >
              Find Mosques
            </Link>
            <Link
              href="/prayer-times"
              className="hover:text-emerald-800 transition"
            >
              Prayer Times
            </Link>
            <Link
              href="/jummah"
              className="hover:text-emerald-800 transition"
            >
              Jummah Times
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/mosques"
              className="rounded-lg bg-emerald-800 px-3.5 py-2 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 transition"
            >
              Explore Mosques
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
