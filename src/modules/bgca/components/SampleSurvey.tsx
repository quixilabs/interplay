// BGCA Sandbox — one sample question from the longer cadence survey.
//
// This is the deeper Fall / Mid-Year / Spring instrument, distinct from the
// 60-second kiosk pulse. Same 4-point scale and the same no-staff-blame rule.

import { useState } from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import { SAMPLE_SURVEY_QUESTION as Q, SITES } from '../data/mockData';
import { SandboxNote } from './shared/ui';

export default function SampleSurvey() {
  const [rating, setRating] = useState<number | null>(null);
  const [selections, setSelections] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const site = SITES.find((s) => s.id === 'goshen')!;
  const pct = Math.round((Q.index / Q.total) * 100);

  const toggle = (id: string) =>
    setSelections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : prev.length >= 2 ? prev : [...prev, id]
    );

  const reset = () => {
    setRating(null);
    setSelections([]);
    setNote('');
    setSubmitted(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-h2 font-semibold text-navy">Cadence Survey — Sample Question</h1>
        <p className="mt-1 max-w-3xl text-body text-warm-gray">
          The longer instrument that runs three times a year (Fall, Mid-Year, Spring). It sets each
          site&apos;s momentum index, while the kiosk pulse keeps it current between waves. One
          question is shown here as a sample of the format.
        </p>
      </div>

      <div className="overflow-hidden rounded-brand border border-navy/10 bg-white shadow-brand">
        <div className="border-b border-navy/10 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-small">
            <span className="font-semibold uppercase tracking-wide text-sage">
              {Q.domainLabel}
            </span>
            <span className="text-warm-gray">
              {site.name} · {site.ageBand} · Fall 2026 Baseline
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-light-gray">
              <div className="h-full rounded-full bg-sage" style={{ width: `${pct}%` }} />
            </div>
            <span className="shrink-0 text-small text-warm-gray">
              Question {Q.index} of {Q.total}
            </span>
          </div>
        </div>

        {submitted ? (
          <div className="px-6 py-14 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
            <p className="mt-4 text-h3 font-medium text-navy">Answer recorded.</p>
            <p className="mt-2 text-body text-warm-gray">
              In the full survey this would advance to question {Q.index + 1} of {Q.total}.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 rounded-brand border-2 border-sage px-6 py-2.5 text-small font-semibold text-navy transition-colors hover:bg-sage/10"
            >
              Show the question again
            </button>
          </div>
        ) : (
          <div className="px-6 py-8 sm:px-10">
            <p className="text-h3 font-medium leading-snug text-navy">{Q.text}</p>
            <p className="mt-2 text-small italic text-warm-gray">{Q.helper}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {Q.scaleLabels.map((opt) => {
                const active = rating === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRating(opt.value)}
                    className={`rounded-brand border-2 px-3 py-5 text-center transition-all ${
                      active
                        ? 'border-navy bg-navy/5 ring-2 ring-navy/15'
                        : 'border-navy/15 hover:border-navy/40 hover:bg-light-gray'
                    }`}
                  >
                    <span className="block text-2xl font-semibold text-navy">{opt.value}</span>
                    <span className="mt-1 block text-small font-semibold text-navy">
                      {opt.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-warm-gray">{opt.sub}</span>
                  </button>
                );
              })}
            </div>

            {rating !== null && (
              <div className="mt-8 border-t border-navy/10 pt-6">
                <p className="text-h4 font-medium text-navy">{Q.followUpPrompt}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {Q.followUpOptions.map((opt) => {
                    const active = selections.includes(opt.id);
                    const atLimit = selections.length >= 2 && !active;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={atLimit}
                        onClick={() => toggle(opt.id)}
                        className={`flex items-center gap-3 rounded-brand border-2 px-4 py-3.5 text-left text-body transition-all ${
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

                <div className="mt-7">
                  <label
                    htmlFor="bgca-survey-note"
                    className="text-h4 font-medium text-navy"
                  >
                    {Q.openTextPrompt}
                  </label>
                  <textarea
                    id="bgca-survey-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder={Q.openTextPlaceholder}
                    className="mt-3 w-full rounded-brand border border-navy/20 px-4 py-3 text-body text-navy placeholder:text-warm-gray/60 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="mt-6 rounded-brand bg-navy px-8 py-3 text-body font-semibold text-white transition-colors hover:bg-navy/90"
                >
                  Next question
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <SandboxNote>
        <strong className="text-navy">Why this question:</strong> it is the strongest single
        predictor in youth-development research — a young person naming at least one adult who
        believes in them. It asks about grown-ups <em>collectively</em>, so it never becomes a staff
        performance rating. Swap it for a different stem any time; the format stays the same.
      </SandboxNote>
    </div>
  );
}
