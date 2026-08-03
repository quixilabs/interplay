// BGCA Sandbox — small presentational primitives.
// Intentionally no charting library: badges, bars and type only.

import React from 'react';
import type { HealthBand, PlayCardStatus } from '../../types';
import { BAND_META, STATUS_META } from './constants';

export function StatusBadge({ status }: { status: PlayCardStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.className}`}
    >
      <span aria-hidden>{meta.dot}</span>
      {meta.label}
    </span>
  );
}

export function ScoreBar({ score, band }: { score: number; band: HealthBand }) {
  const pct = Math.max(0, Math.min(100, (score / 4) * 100));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-light-gray" role="presentation">
      <div className={`h-full rounded-full ${BAND_META[band].bar}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function KpiCard({
  label,
  value,
  caption,
  tone = 'success',
}: {
  label: string;
  value: string;
  caption: React.ReactNode;
  tone?: 'success' | 'warning' | 'danger';
}) {
  const toneText =
    tone === 'success' ? 'text-success' : tone === 'warning' ? 'text-warning' : 'text-danger';
  return (
    <div className="rounded-brand border border-navy/10 bg-white p-5 shadow-brand">
      <p className="text-xs font-semibold uppercase tracking-wide text-warm-gray">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-navy">{value}</p>
      <p className={`mt-1 text-small font-medium ${toneText}`}>{caption}</p>
    </div>
  );
}

export function SectionCard({
  title,
  step,
  children,
  className = '',
}: {
  title: string;
  step?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-brand border border-navy/10 bg-white shadow-brand ${className}`}
    >
      <header className="flex items-center gap-3 border-b border-navy/10 px-5 py-3">
        {step && (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
            {step}
          </span>
        )}
        <h2 className="text-h4 font-medium text-navy">{title}</h2>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function SandboxNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-brand border border-dashed border-sage/50 bg-sage/5 px-4 py-3 text-small text-warm-gray print:hidden">
      {children}
    </p>
  );
}
