// BGCA Sandbox — Youth Pulse Kiosk (ages 9–12), tablet framing.
//
// Rule enforced by design: questions ask about the room and about grown-ups as a
// group. Youth never name or rate an individual staff member.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, CheckCircle2 } from 'lucide-react';
import {
  PULSE_PROMPT,
  PULSE_TOTAL_PROMPTS,
  SITES,
} from '../data/mockData';
import { useBgcaStore } from '../store/bgcaStore';
import { SandboxNote } from './shared/ui';

type Phase = 'rating' | 'branch' | 'done';

export default function PulseKiosk() {
  const submitPulse = useBgcaStore((s) => s.submitPulse);
  const [siteId, setSiteId] = useState('goshen');
  const [phase, setPhase] = useState<Phase>('rating');
  const [rating, setRating] = useState<number | null>(null);
  const [selections, setSelections] = useState<string[]>([]);
  const [location, setLocation] = useState<string | undefined>();
  const [result, setResult] = useState<{ closedCardId: string | null; flaggedCardId: string | null }>();

  const site = SITES.find((s) => s.id === siteId)!;
  const isFriction = rating !== null && rating <= 2;
  const options = isFriction ? PULSE_PROMPT.frictions : PULSE_PROMPT.enablers;

  const toggle = (id: string) =>
    setSelections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : prev.length >= 2 ? prev : [...prev, id]
    );

  const restart = () => {
    setPhase('rating');
    setRating(null);
    setSelections([]);
    setLocation(undefined);
    setResult(undefined);
  };

  const handleRate = (value: number) => {
    setRating(value);
    setSelections([]);
    setLocation(undefined);
    setPhase('branch');
  };

  const handleSubmit = () => {
    if (rating === null) return;
    setResult(submitPulse({ siteId, promptId: PULSE_PROMPT.id, rating, selections, location }));
    setPhase('done');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-h2 font-semibold text-navy">Youth Pulse Kiosk</h1>
          <p className="mt-1 text-body text-warm-gray">
            What a young person sees on the tablet in the club. Takes under a minute.
          </p>
        </div>
        <label className="text-small text-warm-gray">
          <span className="mr-2">Kiosk location:</span>
          <select
            value={siteId}
            onChange={(e) => {
              setSiteId(e.target.value);
              restart();
            }}
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

      {/* Tablet frame */}
      <div className="rounded-[28px] border-8 border-navy/80 bg-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-[20px] bg-navy px-6 py-3 text-white">
          <span className="text-small font-semibold uppercase tracking-wide">
            Youth Pulse · {site.ageBand}
          </span>
          <span className="text-small">{site.name}</span>
          <span className="text-small opacity-80">
            Prompt 1 of {PULSE_TOTAL_PROMPTS} · {PULSE_PROMPT.domainLabel}
          </span>
        </div>

        <div className="px-6 py-8 sm:px-10 sm:py-12">
          {phase === 'done' ? (
            <DoneScreen result={result} onRestart={restart} />
          ) : (
            <>
              <p className="text-center text-2xl font-medium leading-snug text-navy sm:text-3xl">
                “{PULSE_PROMPT.text}”
              </p>

              <p className="mt-6 text-center text-small font-semibold uppercase tracking-wide text-warm-gray">
                Select one option below
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                {[
                  { v: 4, label: 'ALWAYS', sub: 'Very True', tone: 'border-success text-success' },
                  { v: 3, label: 'MOST OF TIME', sub: 'On Track', tone: 'border-success text-success' },
                  { v: 2, label: 'SOMETIMES', sub: 'Friction', tone: 'border-warning text-warning' },
                  { v: 1, label: 'NOT REALLY', sub: 'Never / Low', tone: 'border-danger text-danger' },
                ].map((opt) => {
                  const active = rating === opt.v;
                  return (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => handleRate(opt.v)}
                      className={`rounded-brand border-2 px-3 py-6 text-center transition-all ${
                        active
                          ? `${opt.tone} bg-light-gray ring-2 ring-navy/20`
                          : 'border-navy/15 text-navy hover:border-navy/40 hover:bg-light-gray'
                      }`}
                    >
                      <span className="block text-3xl font-semibold">{opt.v}</span>
                      <span className="mt-1 block text-small font-semibold">{opt.label}</span>
                      <span className="mt-0.5 block text-xs text-warm-gray">{opt.sub}</span>
                    </button>
                  );
                })}
              </div>

              {phase === 'branch' && rating !== null && (
                <div className="mt-8 border-t border-navy/10 pt-8">
                  <p className="text-center text-h4 font-medium text-navy">
                    <span aria-hidden className="mr-2">
                      {isFriction ? '🔴' : '🟢'}
                    </span>
                    {isFriction ? PULSE_PROMPT.frictionPrompt : PULSE_PROMPT.enablerPrompt}
                  </p>
                  <p className="mt-1 text-center text-small text-warm-gray">Select up to 2</p>

                  <div className="mx-auto mt-5 grid max-w-3xl gap-3 sm:grid-cols-2">
                    {options.map((opt) => {
                      const active = selections.includes(opt.id);
                      const atLimit = selections.length >= 2 && !active;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={atLimit}
                          onClick={() => toggle(opt.id)}
                          className={`flex items-center gap-3 rounded-brand border-2 px-4 py-4 text-left text-body transition-all ${
                            active
                              ? 'border-navy bg-navy/5 text-navy'
                              : atLimit
                                ? 'cursor-not-allowed border-navy/10 text-warm-gray/50'
                                : 'border-navy/15 text-navy hover:border-navy/40 hover:bg-light-gray'
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
                              active ? 'border-navy bg-navy text-white' : 'border-navy/30'
                            }`}
                          >
                            {active && <Check className="h-3.5 w-3.5" />}
                          </span>
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  {isFriction && (
                    <div className="mx-auto mt-8 max-w-3xl">
                      <p className="text-center text-h4 font-medium text-navy">
                        {PULSE_PROMPT.locationPrompt}
                      </p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {PULSE_PROMPT.locations.map((loc) => (
                          <button
                            key={loc.id}
                            type="button"
                            onClick={() => setLocation(loc.label)}
                            className={`rounded-full border-2 px-4 py-2 text-small font-medium transition-all ${
                              location === loc.label
                                ? 'border-navy bg-navy text-white'
                                : 'border-navy/15 text-navy hover:border-navy/40'
                            }`}
                          >
                            {loc.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-9 text-center">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="inline-flex items-center gap-2 rounded-brand bg-navy px-10 py-4 text-h4 font-semibold text-white transition-colors hover:bg-navy/90"
                    >
                      Submit Pulse
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <SandboxNote>
        <strong className="text-navy">Try the loop:</strong> answer <strong>1</strong> or{' '}
        <strong>2</strong> for Goshen to open a new Play Card, then watch it appear on the{' '}
        <Link className="text-sage underline" to="/bgca/dashboard">
          Executive Dashboard
        </Link>
        . Answering <strong>3</strong> or <strong>4</strong> at Elkhart closes the card that is
        already awaiting youth verification.
      </SandboxNote>
    </div>
  );
}

function DoneScreen({
  result,
  onRestart,
}: {
  result?: { closedCardId: string | null; flaggedCardId: string | null };
  onRestart: () => void;
}) {
  return (
    <div className="py-6 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
      <p className="mt-4 text-h3 font-medium text-navy">Thanks for telling us.</p>
      <p className="mt-2 text-body text-warm-gray">Your answer is anonymous.</p>

      <div className="mx-auto mt-8 max-w-lg rounded-brand border border-navy/10 bg-light-gray p-4 text-left text-small">
        <p className="font-semibold uppercase tracking-wide text-warm-gray">
          What just happened behind the scenes
        </p>
        {result?.flaggedCardId && (
          <p className="mt-2 text-navy">
            🔴 A new <strong>Play Card</strong> opened and a Reset Play was auto-attached. It is now
            visible to the Unit Director and the CEO.
          </p>
        )}
        {result?.closedCardId && (
          <p className="mt-2 text-navy">
            ✅ A Play Card that was awaiting verification is now <strong>Closed</strong>. Youth
            feedback is the only thing that can close a card.
          </p>
        )}
        {!result?.flaggedCardId && !result?.closedCardId && (
          <p className="mt-2 text-navy">
            No card changed state. Scores at or above 3.0 with no open executed card simply feed the
            site&apos;s momentum index.
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="mt-8 rounded-brand border-2 border-sage px-6 py-2.5 text-small font-semibold text-navy transition-colors hover:bg-sage/10"
      >
        Run another pulse
      </button>
    </div>
  );
}
