// BGCA Sandbox — shared shell with surface switcher and a demo reset.

import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import { useBgcaStore } from '../store/bgcaStore';

const SURFACES = [
  { to: '/bgca', label: 'Overview', end: true },
  { to: '/bgca/pulse', label: 'Youth Pulse Kiosk', end: false },
  { to: '/bgca/survey', label: 'Cadence Survey', end: false },
  { to: '/bgca/director', label: 'Unit Director', end: false },
  { to: '/bgca/dashboard', label: 'Executive Dashboard', end: false },
];

export default function BgcaLayout({ children }: { children: React.ReactNode }) {
  const resetSandbox = useBgcaStore((s) => s.resetSandbox);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-light-gray font-primary">
      <header className="border-b border-navy/10 bg-white print:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
          <Link to="/bgca" className="flex items-baseline gap-2">
            <span className="text-h4 font-semibold text-navy">Interplay</span>
            <span className="rounded bg-sage/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-sage">
              BGCA Sandbox
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-1">
            {SURFACES.map((s) => (
              <NavLink
                key={s.to}
                to={s.to}
                end={s.end}
                className={({ isActive }) =>
                  `rounded px-3 py-1.5 text-small font-medium transition-colors ${
                    isActive
                      ? 'bg-navy text-white'
                      : 'text-warm-gray hover:bg-light-gray hover:text-navy'
                  }`
                }
              >
                {s.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={resetSandbox}
            className="ml-auto inline-flex items-center gap-1.5 rounded border border-navy/15 px-3 py-1.5 text-small font-medium text-warm-gray transition-colors hover:border-navy/40 hover:text-navy"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset demo
          </button>
        </div>
      </header>

      <div className="bg-navy/[0.03] px-4 py-2 text-center text-xs text-warm-gray print:hidden">
        Sandbox preview — every number below is sample data. Nothing is saved, and a refresh
        restores the starting state.
      </div>

      <main key={pathname} className="mx-auto max-w-6xl px-4 py-8 print:max-w-none print:px-0 print:py-0">
        {children}
      </main>
    </div>
  );
}
