// BGCA Sandbox — Executive Dashboard.
// Single screen, three stacked sections, no charting library.

import { Link } from 'react-router-dom';
import { Printer, Unlock } from 'lucide-react';
import {
  CADENCE_LABELS,
  REGIONAL_MOMENTUM,
  REGIONAL_POSITIVE_PCT,
  REGION_NAME,
  SITES,
} from '../data/mockData';
import {
  SITES_NEEDING_ATTENTION,
  bandFor,
  useBgcaStore,
  useClosureStats,
} from '../store/bgcaStore';
import type { Cadence, PlayCard } from '../types';
import { KpiCard, SandboxNote, ScoreBar, SectionCard, StatusBadge } from './shared/ui';
import { BAND_META, STATUS_META } from './shared/constants';

const CADENCES: Cadence[] = ['fall', 'midyear', 'spring'];

export default function ExecutiveDashboard() {
  const { cadence, setCadence, selectedSiteId, selectSite, playCards } = useBgcaStore();
  const closure = useClosureStats();

  const selectedSite = SITES.find((s) => s.id === selectedSiteId)!;
  const siteCards = playCards.filter((c) => c.siteId === selectedSiteId);
  const openCards = siteCards.filter((c) => c.status !== 'closed');
  const attention = SITES_NEEDING_ATTENTION;

  return (
    <div className="space-y-5">
      {/* Region + cadence header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-brand border border-navy/10 bg-white px-5 py-4 shadow-brand print:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-warm-gray">Region</p>
          <p className="text-h4 font-medium text-navy">{REGION_NAME}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-warm-gray">
            Pulse cadence
          </p>
          <div className="mt-1 flex gap-1">
            {CADENCES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCadence(c)}
                className={`rounded px-3 py-1.5 text-small font-medium transition-colors ${
                  cadence === c
                    ? 'bg-navy text-white'
                    : 'text-warm-gray hover:bg-light-gray hover:text-navy'
                }`}
              >
                {CADENCE_LABELS[c]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 1 — regional health */}
      <div className="grid gap-4 sm:grid-cols-3 print:hidden">
        <KpiCard
          label="Regional Momentum Index"
          value={`${REGIONAL_MOMENTUM.toFixed(1)} / 4.0`}
          caption={`🟢 ${REGIONAL_POSITIVE_PCT}% Positive`}
        />
        <KpiCard
          label="Action Closure Rate"
          value={`${closure.pct}%`}
          caption={`🟢 ${closure.resolved}/${closure.total} Resolved`}
        />
        <KpiCard
          label="Sites Needing Attention"
          value={`${attention.length} of ${SITES.length} Sites`}
          tone="danger"
          caption={
            attention.length
              ? `🔴 ${attention.map((s) => `${s.name} · ${s.ageBand}`).join(', ')}`
              : '🟢 All sites in range'
          }
        />
      </div>

      {/* SECTION 2 — site status list */}
      <div className="print:hidden">
        <SectionCard title="Site Status" step="2">
          <p className="mb-4 text-small text-warm-gray">
            Select a site to load its Action &amp; Unblocking Engine below.
          </p>
          <ul className="space-y-1">
            {SITES.map((site) => {
              const band = bandFor(site.momentum);
              const meta = BAND_META[band];
              const active = site.id === selectedSiteId;
              const openCount = playCards.filter(
                (c) => c.siteId === site.id && c.status !== 'closed'
              ).length;

              return (
                <li key={site.id}>
                  <button
                    type="button"
                    onClick={() => selectSite(site.id)}
                    aria-pressed={active}
                    className={`flex w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-brand border px-4 py-3 text-left transition-all ${
                      active
                        ? 'border-navy bg-navy/5 ring-1 ring-navy/20'
                        : 'border-transparent hover:border-navy/15 hover:bg-light-gray'
                    }`}
                  >
                    <span aria-hidden className="text-body">
                      {meta.dot}
                    </span>
                    <span className="min-w-[13rem] flex-1 text-body font-medium text-navy">
                      {site.name}
                      <span className="ml-2 text-small font-normal text-warm-gray">
                        {site.ageBand}
                      </span>
                    </span>
                    <span className="w-32 shrink-0">
                      <ScoreBar score={site.momentum} band={band} />
                    </span>
                    <span className="w-16 shrink-0 text-right text-body font-semibold text-navy">
                      {site.momentum.toFixed(1)}
                    </span>
                    <span className={`w-32 shrink-0 text-small font-medium ${meta.text}`}>
                      {meta.label}
                    </span>
                    <span className="w-28 shrink-0 text-right text-small text-warm-gray">
                      {openCount} open {openCount === 1 ? 'card' : 'cards'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>

      {/* SECTION 3 — action & unblocking engine */}
      <SectionCard
        step="3"
        title={`Action & Unblocking Engine — ${selectedSite.name} (${selectedSite.ageBand})`}
      >
        <div className="mb-4 flex justify-end print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded border border-navy/20 px-3 py-1.5 text-small font-medium text-warm-gray transition-colors hover:border-navy/40 hover:text-navy"
          >
            <Printer className="h-4 w-4" />
            Print Weekly CQI Huddle Agenda
          </button>
        </div>

        <div className="hidden print:mb-4 print:block">
          <h1 className="text-h3 font-semibold text-navy">Weekly CQI Huddle Agenda</h1>
          <p className="text-small text-warm-gray">
            {selectedSite.name} · {selectedSite.ageBand} · {REGION_NAME} ·{' '}
            {CADENCE_LABELS[cadence]}
          </p>
        </div>

        {openCards.length === 0 ? (
          <p className="py-8 text-center text-body text-warm-gray">
            No open Play Cards at {selectedSite.name}.{' '}
            <Link className="text-sage underline print:hidden" to="/bgca/pulse">
              Run a low pulse rating
            </Link>{' '}
            to open one.
          </p>
        ) : (
          <div className="space-y-6">
            {openCards.map((card) => (
              <EngineCard key={card.id} card={card} />
            ))}
          </div>
        )}
      </SectionCard>

      <SandboxNote>
        <strong className="text-navy">The accountability rule:</strong> the CEO can unblock, and the
        Unit Director can confirm a play ran — but neither can close a card. Only a youth pulse
        moves it to Verified / Closed, which is what stops a problem from quietly reappearing next
        cadence.
      </SandboxNote>
    </div>
  );
}

function EngineCard({ card }: { card: PlayCard }) {
  const approveUnblocker = useBgcaStore((s) => s.approveUnblocker);

  return (
    <article className="rounded-brand border border-navy/10 print:break-inside-avoid">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-navy/10 bg-light-gray px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={card.status} />
          {card.origin === 'live' && (
            <span className="rounded bg-sage/15 px-2 py-0.5 text-xs font-semibold text-sage">
              New this session
            </span>
          )}
        </div>
        <span className="text-small text-warm-gray">
          Play #{card.play.number} · {card.play.framework}
        </span>
      </header>

      <div className="divide-y divide-navy/10">
        {/* 1. flagged friction */}
        <div className="px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-danger">
            📍 Flagged youth friction
          </p>
          <p className="mt-1 text-body font-medium text-navy">
            {card.domainLabel} — score {card.score.toFixed(1)} / 4.0 🔴
          </p>
          <p className="mt-1 font-secondary text-body text-warm-gray">“{card.youthFeedback}”</p>
          <p className="mt-1 text-small text-warm-gray">Location: {card.location}</p>
        </div>

        {/* 2. assigned reset play */}
        <div className="px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-sage">
            ⚡ Assigned Reset Play
          </p>
          <p className="mt-1 text-body font-medium text-navy">
            Play #{card.play.number}: {card.play.title}
          </p>
          <p className="mt-1 text-small text-navy">
            <strong>Target action:</strong> {card.play.targetAction}
          </p>
        </div>

        {/* 3. bottleneck */}
        <div className="px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-warning">
            🚧 What is holding staff back?
          </p>
          {card.barrier ? (
            <>
              <p className="mt-1 text-body text-navy">🔴 {card.barrier}</p>
              {card.staffNote && (
                <p className="mt-1 text-small italic text-warm-gray">
                  Staff note: “{card.staffNote}”
                </p>
              )}
            </>
          ) : (
            <p className="mt-1 text-small text-warm-gray">
              Nothing logged. The site has not reported a bottleneck for this play.
            </p>
          )}
        </div>

        {/* 4. executive unblocker */}
        <div className="px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy">
            🛠️ Executive unblocker
          </p>
          <p className="mt-1 text-small text-navy">
            <strong>Recommended action:</strong> {card.executiveLever}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-small text-warm-gray">Status:</span>
            <StatusBadge status={card.status} />
          </div>

          {card.status === 'blocked' && (
            <button
              type="button"
              onClick={() => approveUnblocker(card.id)}
              className="mt-3 inline-flex items-center gap-2 rounded-brand bg-sage px-5 py-2.5 text-small font-semibold text-white transition-colors hover:bg-sage/90 print:hidden"
            >
              <Unlock className="h-4 w-4" />
              Approve: {card.executiveLever}
            </button>
          )}

          {card.status === 'executed' && (
            <p className="mt-2 text-small text-warm-gray">
              Staff ran the play. Waiting on the next youth pulse to verify — the CEO cannot close
              this.
            </p>
          )}
        </div>

        {/* history */}
        <div className="px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-warm-gray">
            Card history
          </p>
          <ol className="mt-2 space-y-1">
            {card.history.map((h, i) => (
              <li key={i} className="flex gap-3 text-small text-warm-gray">
                <span className="w-14 shrink-0 tabular-nums">{h.at}</span>
                <span className="text-navy">{h.label}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-small text-warm-gray print:hidden">
            {STATUS_META[card.status].blurb}
          </p>
        </div>
      </div>
    </article>
  );
}
