import React from "react";
import Link from "next/link";
import { Container } from "../common/Container";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-50 py-12 text-sm text-stone-600">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-base">
              <span>🇨🇦</span>
              <span>Canada Mosque Near Me</span>
            </div>
            <p className="mt-3 max-w-md text-xs sm:text-sm text-stone-500 leading-relaxed">
              Dedicated Canadian Muslim community utility providing verified mosque locations,
              astronomical prayer calculations across all Canadian timezones, and authentic
              mosque congregation schedules.
            </p>
            <p className="mt-3 text-xs text-stone-400">
              Serving mosque communities across Canada, with coverage expanding as verified data becomes available.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Provinces & Cities
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/provinces" className="hover:text-emerald-800 transition">
                  All Canadian Provinces
                </Link>
              </li>
              <li>
                <Link href="/cities/toronto" className="hover:text-emerald-800 transition">
                  Toronto Mosques
                </Link>
              </li>
              <li>
                <Link href="/cities/montreal" className="hover:text-emerald-800 transition">
                  Montreal Mosques
                </Link>
              </li>
              <li>
                <Link href="/cities/calgary" className="hover:text-emerald-800 transition">
                  Calgary Mosques
                </Link>
              </li>
              <li>
                <Link href="/cities/edmonton" className="hover:text-emerald-800 transition">
                  Edmonton Mosques
                </Link>
              </li>
              <li>
                <Link href="/cities/vancouver" className="hover:text-emerald-800 transition">
                  Vancouver Mosques
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Discovery & Utility
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/mosque-near-me" className="hover:text-emerald-800 transition font-medium text-emerald-800">
                  Mosque Near Me (GPS)
                </Link>
              </li>
              <li>
                <Link href="/mosques" className="hover:text-emerald-800 transition">
                  Browse All Mosques
                </Link>
              </li>
              <li>
                <Link href="/prayer-times" className="hover:text-emerald-800 transition">
                  Daily Prayer Times
                </Link>
              </li>
              <li>
                <Link href="/jummah" className="hover:text-emerald-800 transition">
                  Jummah Schedules
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Integrity & Standards
            </h4>
            <p className="mt-3 text-xs text-stone-500 leading-relaxed">
              We never fabricate Iqamah times or confound physical building opening hours
              with prayer times. Missing data is acknowledged transparently.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Canada Mosque Near Me. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-stone-400">Data Standard: ISNA / Canada-wide</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
