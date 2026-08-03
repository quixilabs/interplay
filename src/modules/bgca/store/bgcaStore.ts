// BGCA Sandbox — in-memory state.
// Deliberately not persisted: a page refresh returns the demo to its seeded state.

import { create } from 'zustand';
import {
  EXECUTIVE_LEVERS,
  FLAG_THRESHOLD,
  FRICTION_TO_PLAY,
  HISTORICAL_CLOSURE,
  PULSE_PROMPT,
  SEEDED_PLAY_CARDS,
  SITES,
  playByNumber,
} from '../data/mockData';
import type { Cadence, HealthBand, PlayCard, PulseSubmission } from '../types';

const stamp = (): string =>
  new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const clone = (cards: PlayCard[]): PlayCard[] =>
  cards.map((c) => ({ ...c, history: [...c.history] }));

export const bandFor = (score: number): HealthBand => {
  if (score < FLAG_THRESHOLD) return 'action';
  if (score < 3.2) return 'watch';
  return 'flourishing';
};

interface BgcaState {
  cadence: Cadence;
  selectedSiteId: string;
  playCards: PlayCard[];
  /** Pulse responses submitted from the kiosk during this session. */
  submissions: PulseSubmission[];
  /** Set when a kiosk submission closes a card, so the kiosk can celebrate it. */
  lastClosedCardId: string | null;

  setCadence: (c: Cadence) => void;
  selectSite: (siteId: string) => void;
  submitPulse: (submission: PulseSubmission) => { closedCardId: string | null; flaggedCardId: string | null };
  logBarrier: (cardId: string, barrier: string, staffNote: string) => void;
  approveUnblocker: (cardId: string) => void;
  markExecuted: (cardId: string, note: string) => void;
  resetSandbox: () => void;
  clearLastClosed: () => void;
}

export const useBgcaStore = create<BgcaState>((set, get) => ({
  cadence: 'fall',
  selectedSiteId: 'goshen',
  playCards: clone(SEEDED_PLAY_CARDS),
  submissions: [],
  lastClosedCardId: null,

  setCadence: (cadence) => set({ cadence }),

  selectSite: (selectedSiteId) => set({ selectedSiteId }),

  /**
   * The closed loop, both directions:
   *  - a 1–2 rating opens (or re-opens) a Play Card for that site + domain
   *  - a 3–4 rating VERIFIES an executed card and closes it
   * Youth feedback is the only thing that can close a card.
   */
  submitPulse: (submission) => {
    const cards = clone(get().playCards);
    let closedCardId: string | null = null;
    let flaggedCardId: string | null = null;

    const existing = cards.find(
      (c) =>
        c.siteId === submission.siteId &&
        c.domainKey === submission.promptId &&
        c.status !== 'closed'
    );

    if (submission.rating >= 3) {
      if (existing && existing.status === 'executed') {
        existing.status = 'closed';
        existing.history.push({
          label: `Verified by youth pulse — score recovered to ${submission.rating}.0`,
          at: stamp(),
        });
        closedCardId = existing.id;
      }
    } else if (!existing) {
      const firstFriction = submission.selections[0];
      const playNumber = FRICTION_TO_PLAY[firstFriction] ?? 104;
      const labels = submission.selections
        .map((id) => PULSE_PROMPT.frictions.find((f) => f.id === id)?.label)
        .filter(Boolean)
        .join('; ');

      const card: PlayCard = {
        id: `pc-live-${submission.siteId}-${submission.promptId}-${cards.length}`,
        siteId: submission.siteId,
        domainKey: submission.promptId,
        domainLabel: PULSE_PROMPT.domainLabel,
        score: submission.rating,
        youthFeedback: labels || 'Youth reported friction without selecting a reason.',
        location: submission.location ?? 'Not specified',
        play: playByNumber(playNumber),
        status: 'flagged',
        executiveLever: 'No executive action needed yet — awaiting site response',
        origin: 'live',
        history: [
          { label: `Flagged by youth pulse — score ${submission.rating}.0`, at: stamp() },
          { label: `Reset Play #${playNumber} auto-assigned`, at: stamp() },
        ],
      };
      cards.unshift(card);
      flaggedCardId = card.id;
    }

    set({
      playCards: cards,
      submissions: [...get().submissions, submission],
      lastClosedCardId: closedCardId,
      selectedSiteId: submission.siteId,
    });

    return { closedCardId, flaggedCardId };
  },

  logBarrier: (cardId, barrier, staffNote) =>
    set({
      playCards: clone(get().playCards).map((c) =>
        c.id === cardId
          ? {
              ...c,
              status: 'blocked',
              barrier,
              staffNote,
              executiveLever:
                EXECUTIVE_LEVERS[barrier] ?? 'Executive review needed to clear this bottleneck',
              history: [
                ...c.history,
                { label: 'Unit Director logged an execution bottleneck', at: stamp() },
              ],
            }
          : c
      ),
    }),

  approveUnblocker: (cardId) =>
    set({
      playCards: clone(get().playCards).map((c) =>
        c.id === cardId
          ? {
              ...c,
              status: 'unblocked',
              history: [
                ...c.history,
                { label: `CEO approved: ${c.executiveLever}`, at: stamp() },
              ],
            }
          : c
      ),
    }),

  markExecuted: (cardId, note) =>
    set({
      playCards: clone(get().playCards).map((c) =>
        c.id === cardId
          ? {
              ...c,
              status: 'executed',
              executedNote: note,
              history: [
                ...c.history,
                { label: 'Unit Director confirmed the play ran 5 days', at: stamp() },
              ],
            }
          : c
      ),
    }),

  resetSandbox: () =>
    set({
      playCards: clone(SEEDED_PLAY_CARDS),
      submissions: [],
      lastClosedCardId: null,
      selectedSiteId: 'goshen',
      cadence: 'fall',
    }),

  clearLastClosed: () => set({ lastClosedCardId: null }),
}));

// --- derived selectors -----------------------------------------------------

/**
 * Each selector below must return a primitive or an existing reference.
 * Building a fresh object or array inside a zustand selector gives React a new
 * snapshot on every render, which loops until "Maximum update depth exceeded".
 */
export const useClosureStats = () => {
  const cardCount = useBgcaStore((s) => s.playCards.length);
  const closedCount = useBgcaStore((s) => s.playCards.filter((c) => c.status === 'closed').length);

  const total = HISTORICAL_CLOSURE.total + cardCount;
  const resolved = HISTORICAL_CLOSURE.resolved + closedCount;
  return { total, resolved, pct: Math.round((resolved / total) * 100) };
};

/**
 * Band-based, matching the CEO mock: a site "needs attention" when its momentum
 * is below the 3.0 threshold — not merely because it has an open Play Card.
 * Open cards are normal operating state; a sinking score is not.
 */
export const SITES_NEEDING_ATTENTION = SITES.filter(
  (site) => bandFor(site.momentum) === 'action'
);
