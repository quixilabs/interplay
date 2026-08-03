// BGCA Sandbox — display constants.
// Kept out of ui.tsx so that file only exports components (keeps Fast Refresh working).

import type { HealthBand, PlayCardStatus } from '../../types';

export const BAND_META: Record<
  HealthBand,
  { label: string; dot: string; text: string; bar: string }
> = {
  flourishing: { label: 'Flourishing', dot: '🟢', text: 'text-success', bar: 'bg-success' },
  watch: { label: 'Watch List', dot: '🟡', text: 'text-warning', bar: 'bg-warning' },
  action: { label: 'Action Needed', dot: '🔴', text: 'text-danger', bar: 'bg-danger' },
};

export const STATUS_META: Record<
  PlayCardStatus,
  { label: string; dot: string; className: string; blurb: string }
> = {
  flagged: {
    label: 'Flagged',
    dot: '🔴',
    className: 'bg-danger/10 text-danger border-danger/30',
    blurb: 'Youth feedback tripped the threshold. A Reset Play is attached.',
  },
  blocked: {
    label: 'Blocked Play',
    dot: '🟡',
    className: 'bg-warning/10 text-warning border-warning/30',
    blurb: 'Staff cannot run the play. Needs an executive unblocker.',
  },
  unblocked: {
    label: 'Unblocked',
    dot: '🟢',
    className: 'bg-info/10 text-info border-info/30',
    blurb: 'The bottleneck is cleared. The site can now run the play.',
  },
  executed: {
    label: 'Executed — awaiting youth',
    dot: '🔵',
    className: 'bg-navy/10 text-navy border-navy/30',
    blurb: 'Staff ran the play. The card stays open until youth confirm it worked.',
  },
  closed: {
    label: 'Verified / Closed',
    dot: '✅',
    className: 'bg-success/10 text-success border-success/30',
    blurb: 'A youth pulse confirmed the score recovered.',
  },
};
