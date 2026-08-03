// BGCA Sandbox — Unit Director surface.
//
// The site-level counterpart to the CEO dashboard. This is where a barrier gets
// logged (which is what escalates a card to the CEO) and where execution is
// confirmed. Note that the Director can never close a card.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Lock } from 'lucide-react';
import { BARRIER_OPTIONS, SITES } from '../data/mockData';
import { useBgcaStore } from '../store/bgcaStore';
import type { PlayCard } from '../types';
import { SandboxNote, SectionCard, StatusBadge } from './shared/ui';
import { STATUS_META } from './shared/constants';

export default function UnitDirectorConsole() {
  const [siteId, setSiteId] = useState('goshen');
  const playCards = useBgcaStore((s) => s.playCards);
  const site = SITES.find((s) => s.id === siteId)!;
  const cards = playCards.filter((c) => c.siteId === siteId);
  const open = cards.filter((c) => c.status !== 'closed');
  const closed = cards.filter((c) => c.status === 'closed');

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h2 font-semibold text-navy">Unit Director Console</h1>
          <p className="mt-1 max-w-3xl text-body text-warm-gray">
            What the site lead sees. Their two jobs: say what is blocking a play, and confirm when
            it has been run.
          </p>
        </div>
        <label className="text-small text-warm-gray">
          <span className="mr-2">Site:</span>
          <select
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            className="rounded border border-navy/20 bg-white px-3 py-1.5 text-small text-navy"
          >
            {SITES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-brand border border-navy/10 bg-white px-5 py-4 shadow-brand">
        <p className="text-small text-warm-gray">
          <span className="font-semibold text-navy">{site.name}</span> · {site.ageBand} ·{' '}
          {open.length} open Play {open.length === 1 ? 'Card' : 'Cards'} · {closed.length} closed
          this cadence
        </p>
      </div>

      {open.length === 0 && (
        <div className="rounded-brand border border-dashed border-navy/20 bg-white px-6 py-12 text-center">
          <p className="text-h4 font-medium text-navy">No open Play Cards at this site.</p>
          <p className="mt-2 text-body text-warm-gray">
            Run a low pulse rating at{' '}
            <Link className="text-sage underline" to="/bgca/pulse">
              the kiosk
            </Link>{' '}
            to open one.
          </p>
        </div>
      )}

      {open.map((card) => (
        <DirectorCard key={card.id} card={card} />
      ))}

      <SandboxNote>
        <strong className="text-navy">The one thing a Director cannot do:</strong> close a card.
        Confirming the play ran moves it to <em>Executed</em> and it stays open until the next youth
        pulse verifies the score recovered.
      </SandboxNote>
    </div>
  );
}

function DirectorCard({ card }: { card: PlayCard }) {
  const logBarrier = useBgcaStore((s) => s.logBarrier);
  const markExecuted = useBgcaStore((s) => s.markExecuted);

  const [barrier, setBarrier] = useState(BARRIER_OPTIONS[0]);
  const [staffNote, setStaffNote] = useState('');
  const [execNote, setExecNote] = useState('');

  return (
    <SectionCard title={`${card.domainLabel} — score ${card.score.toFixed(1)} / 4.0`}>
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={card.status} />
        <span className="text-small text-warm-gray">{STATUS_META[card.status].blurb}</span>
      </div>

      <div className="mt-4 rounded-brand bg-light-gray p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-warm-gray">
          What youth said
        </p>
        <p className="mt-1 font-secondary text-body text-navy">“{card.youthFeedback}”</p>
        <p className="mt-1 text-small text-warm-gray">Location: {card.location}</p>
      </div>

      <div className="mt-4 rounded-brand border border-sage/30 bg-sage/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage">
          Assigned Reset Play
        </p>
        <p className="mt-1 text-body font-medium text-navy">
          Play #{card.play.number}: {card.play.title}
        </p>
        <p className="text-small text-warm-gray">{card.play.framework}</p>
        <p className="mt-2 text-small text-navy">
          <strong>Target action:</strong> {card.play.targetAction}
        </p>
      </div>

      {card.barrier && (
        <div className="mt-4 rounded-brand border border-warning/30 bg-warning/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-warning">
            Logged bottleneck
          </p>
          <p className="mt-1 text-body text-navy">{card.barrier}</p>
          {card.staffNote && (
            <p className="mt-1 text-small italic text-warm-gray">“{card.staffNote}”</p>
          )}
          {card.status === 'blocked' && (
            <p className="mt-2 text-small font-medium text-warning">
              Escalated — waiting on the CEO to clear this.
            </p>
          )}
        </div>
      )}

      {/* Action area */}
      <div className="mt-5 border-t border-navy/10 pt-5">
        {card.status === 'flagged' && (
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <p className="flex items-center gap-2 text-small font-semibold text-navy">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Something blocking this play?
              </p>
              <select
                value={barrier}
                onChange={(e) => setBarrier(e.target.value)}
                className="mt-2 w-full rounded border border-navy/20 px-3 py-2 text-small text-navy"
              >
                {BARRIER_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <textarea
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                rows={2}
                placeholder="Add detail for the CEO…"
                className="mt-2 w-full rounded border border-navy/20 px-3 py-2 text-small text-navy placeholder:text-warm-gray/60"
              />
              <button
                type="button"
                onClick={() => logBarrier(card.id, barrier, staffNote)}
                className="mt-2 w-full rounded-brand border-2 border-warning px-4 py-2 text-small font-semibold text-warning transition-colors hover:bg-warning/10"
              >
                Log bottleneck &amp; escalate
              </button>
            </div>

            <div>
              <p className="text-small font-semibold text-navy">Ran the play already?</p>
              <textarea
                value={execNote}
                onChange={(e) => setExecNote(e.target.value)}
                rows={2}
                placeholder="What happened when you ran it?"
                className="mt-2 w-full rounded border border-navy/20 px-3 py-2 text-small text-navy placeholder:text-warm-gray/60"
              />
              <button
                type="button"
                onClick={() => markExecuted(card.id, execNote || 'Ran as prescribed.')}
                className="mt-2 w-full rounded-brand bg-navy px-4 py-2 text-small font-semibold text-white transition-colors hover:bg-navy/90"
              >
                Confirm play ran 5 days
              </button>
            </div>
          </div>
        )}

        {card.status === 'blocked' && (
          <p className="flex items-center gap-2 text-small text-warm-gray">
            <Lock className="h-4 w-4" />
            Nothing more to do here until the CEO clears the bottleneck on the{' '}
            <Link className="text-sage underline" to="/bgca/dashboard">
              Executive Dashboard
            </Link>
            .
          </p>
        )}

        {card.status === 'unblocked' && (
          <div className="max-w-md">
            <p className="text-small font-semibold text-navy">
              Bottleneck cleared — you can run the play now.
            </p>
            <textarea
              value={execNote}
              onChange={(e) => setExecNote(e.target.value)}
              rows={2}
              placeholder="What happened when you ran it?"
              className="mt-2 w-full rounded border border-navy/20 px-3 py-2 text-small text-navy placeholder:text-warm-gray/60"
            />
            <button
              type="button"
              onClick={() => markExecuted(card.id, execNote || 'Ran as prescribed.')}
              className="mt-2 rounded-brand bg-navy px-5 py-2 text-small font-semibold text-white transition-colors hover:bg-navy/90"
            >
              Confirm play ran 5 days
            </button>
          </div>
        )}

        {card.status === 'executed' && (
          <div className="rounded-brand border border-navy/20 bg-navy/5 p-4">
            <p className="text-small font-semibold text-navy">
              Logged as executed. This card stays open.
            </p>
            {card.executedNote && (
              <p className="mt-1 text-small italic text-warm-gray">“{card.executedNote}”</p>
            )}
            <p className="mt-2 flex flex-wrap items-center gap-1 text-small text-warm-gray">
              It closes only when youth say it worked.
              <Link className="inline-flex items-center gap-1 text-sage underline" to="/bgca/pulse">
                Run the next pulse <ArrowRight className="h-3 w-3" />
              </Link>
            </p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
