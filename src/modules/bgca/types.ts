// BGCA Sandbox — type definitions
// Demo-only module. Nothing here touches Supabase or the production Interplay survey.

export type PlayCardStatus = 'flagged' | 'blocked' | 'unblocked' | 'executed' | 'closed';

export type HealthBand = 'flourishing' | 'watch' | 'action';

export type Cadence = 'fall' | 'midyear' | 'spring';

export interface Site {
  id: string;
  name: string;
  ageBand: string;
  /** Momentum score on the 4-point youth scale. */
  momentum: number;
}

/** An entry in the Reset Playbook — a pre-trained 5-minute practice. */
export interface ResetPlay {
  number: number;
  title: string;
  framework: string;
  targetAction: string;
}

export interface PlayCardEvent {
  label: string;
  at: string;
}

/**
 * A Play Card is one intervention ticket. It moves:
 *   flagged -> [blocked -> unblocked] -> executed -> closed
 * Only a youth pulse response can move a card to `closed`.
 */
export interface PlayCard {
  id: string;
  siteId: string;
  domainKey: string;
  domainLabel: string;
  /** The score that tripped the flag (below 3.0). */
  score: number;
  youthFeedback: string;
  location: string;
  play: ResetPlay;
  status: PlayCardStatus;
  barrier?: string;
  staffNote?: string;
  executiveLever: string;
  executedNote?: string;
  history: PlayCardEvent[];
  /** `live` cards were created by the sandbox visitor via the kiosk. */
  origin: 'seeded' | 'live';
}

export interface PulseOption {
  id: string;
  label: string;
}

export interface PulsePrompt {
  id: string;
  domainKey: string;
  domainLabel: string;
  text: string;
  enablerPrompt: string;
  enablers: PulseOption[];
  frictionPrompt: string;
  frictions: PulseOption[];
  locationPrompt: string;
  locations: PulseOption[];
}

export interface SurveyQuestion {
  id: string;
  domainKey: string;
  domainLabel: string;
  index: number;
  total: number;
  text: string;
  helper: string;
  scaleLabels: { value: number; label: string; sub: string }[];
  followUpPrompt: string;
  followUpOptions: PulseOption[];
  openTextPrompt: string;
  openTextPlaceholder: string;
}

export interface PulseSubmission {
  siteId: string;
  promptId: string;
  rating: number;
  selections: string[];
  location?: string;
}
