// BGCA Sandbox — overview / entry point.

import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, LayoutDashboard, Tablet, Wrench } from 'lucide-react';
import { REGION_NAME } from '../data/mockData';

const SURFACES = [
  {
    to: '/bgca/pulse',
    icon: Tablet,
    title: 'Youth Pulse Kiosk',
    who: 'Ages 9–12, on a tablet in the club',
    body: 'A 60-second check on how the room feels. One rating, then a branch: what helped, or what got in the way and where.',
  },
  {
    to: '/bgca/survey',
    icon: ClipboardList,
    title: 'Cadence Survey',
    who: 'Ages 9–12, three times a year',
    body: 'The deeper instrument that sets each site’s momentum index. One sample question shown.',
  },
  {
    to: '/bgca/director',
    icon: Wrench,
    title: 'Unit Director Console',
    who: 'Site lead',
    body: 'Says what is blocking a play and confirms when it has been run. Cannot close a card.',
  },
  {
    to: '/bgca/dashboard',
    icon: LayoutDashboard,
    title: 'Executive Dashboard',
    who: 'Alliance CEO',
    body: 'Regional health, every site at a glance, and the unblocking lever for whatever is stuck.',
  },
];

const LOOP = [
  { n: 1, state: 'Flagged', who: 'Youth', text: 'A score below 3.0 opens a Play Card and auto-attaches a Reset Play.' },
  { n: 2, state: 'Blocked', who: 'Unit Director', text: 'If staff cannot run it, the bottleneck is logged and escalates to the CEO.' },
  { n: 3, state: 'Unblocked', who: 'CEO', text: 'The executive clears the bottleneck with a lever only they control.' },
  { n: 4, state: 'Executed', who: 'Unit Director', text: 'Staff ran the play for 5 days. The card stays open.' },
  { n: 5, state: 'Verified / Closed', who: 'Youth', text: 'The next pulse confirms the score recovered. Only this can close a card.' },
];

export default function BgcaHome() {
  return (
    <div className="space-y-10">
      <header>
        <p className="text-small font-semibold uppercase tracking-wide text-sage">
          {REGION_NAME} · Fall 2026 Pilot
        </p>
        <h1 className="mt-2 text-h1 font-semibold leading-tight text-navy">
          Feedback that ends in a finished action.
        </h1>
        <p className="mt-4 max-w-3xl font-secondary text-h4 leading-relaxed text-warm-gray">
          Clubs already collect youth feedback, and staff are already trained in the practices that
          fix what it surfaces. The gap is in between: nothing turns a signal into a completed
          action. This sandbox shows what closing that gap looks like.
        </p>
      </header>

      <section>
        <h2 className="text-h3 font-medium text-navy">Four surfaces</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {SURFACES.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group rounded-brand border border-navy/10 bg-white p-5 shadow-brand transition-all hover:border-sage/50 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-brand bg-sage/10 text-sage">
                  <s.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-h4 font-medium text-navy group-hover:text-sage">
                    {s.title}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wide text-warm-gray">
                    {s.who}
                  </p>
                  <p className="mt-2 text-small leading-relaxed text-warm-gray">{s.body}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-h3 font-medium text-navy">How a Play Card closes</h2>
        <p className="mt-1 text-body text-warm-gray">
          Like an IT ticket: open until resolved, and the barrier is visible if it cannot be.
        </p>
        <ol className="mt-5 space-y-2">
          {LOOP.map((step) => (
            <li
              key={step.n}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-brand border border-navy/10 bg-white px-4 py-3 shadow-brand"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-small font-semibold text-white">
                {step.n}
              </span>
              <span className="w-44 shrink-0 text-body font-medium text-navy">{step.state}</span>
              <span className="w-32 shrink-0 text-small font-semibold uppercase tracking-wide text-sage">
                {step.who}
              </span>
              <span className="flex-1 text-small text-warm-gray">{step.text}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 rounded-brand border-l-4 border-sage bg-sage/5 px-4 py-3 font-secondary text-body text-navy">
          Staff saying “we did it” moves a card to Executed — never to Closed. If the young people
          do not feel the difference, the card is still open.
        </p>
      </section>

      <section className="rounded-brand border border-navy/10 bg-white p-6 shadow-brand">
        <h2 className="text-h4 font-medium text-navy">Walk the loop in about a minute</h2>
        <ol className="mt-3 space-y-2 text-body text-warm-gray">
          <li>
            <strong className="text-navy">1.</strong> At the{' '}
            <Link className="text-sage underline" to="/bgca/pulse">
              kiosk
            </Link>
            , pick Goshen and answer <strong>1 — Not Really</strong>. A Play Card opens.
          </li>
          <li>
            <strong className="text-navy">2.</strong> In the{' '}
            <Link className="text-sage underline" to="/bgca/director">
              Director console
            </Link>
            , log a bottleneck on it. It escalates.
          </li>
          <li>
            <strong className="text-navy">3.</strong> On the{' '}
            <Link className="text-sage underline" to="/bgca/dashboard">
              Executive Dashboard
            </Link>
            , approve the unblocker, then confirm the play ran back in the Director console.
          </li>
          <li>
            <strong className="text-navy">4.</strong> Return to the kiosk and answer{' '}
            <strong>4 — Always</strong>. The card closes. Nothing else could have closed it.
          </li>
        </ol>
        <Link
          to="/bgca/pulse"
          className="mt-5 inline-flex items-center gap-2 rounded-brand bg-navy px-6 py-3 text-body font-semibold text-white transition-colors hover:bg-navy/90"
        >
          Start at the kiosk
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
