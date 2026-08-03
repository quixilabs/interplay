// BGCA Sandbox — mock data
// Every number on the /bgca surfaces originates here. No database calls anywhere in this module.

import type {
  Cadence,
  PlayCard,
  PulsePrompt,
  ResetPlay,
  Site,
  SurveyQuestion,
} from '../types';

export const REGION_NAME = 'Northern Indiana Alliance';

export const CADENCE_LABELS: Record<Cadence, string> = {
  fall: 'Fall 2026 Baseline',
  midyear: 'Mid-Year',
  spring: 'Spring',
};

/** Score below this on the 4-point scale trips a Play Card. */
export const FLAG_THRESHOLD = 3.0;

export const SITES: Site[] = [
  { id: 'mishawaka', name: 'Mishawaka Site', ageBand: 'Ages 9–12', momentum: 3.6 },
  { id: 'elkhart', name: 'Elkhart Club', ageBand: 'Ages 9–12', momentum: 3.5 },
  { id: 'south-bend', name: 'South Bend Central', ageBand: 'Ages 9–12', momentum: 3.0 },
  { id: 'goshen', name: 'Goshen Club', ageBand: 'Ages 9–12', momentum: 2.8 },
  { id: 'plymouth', name: 'Plymouth Extension', ageBand: 'Ages 9–12', momentum: 3.2 },
  { id: 'warsaw', name: 'Warsaw Site', ageBand: 'Ages 9–12', momentum: 3.4 },
];

export const REGIONAL_MOMENTUM = 3.2;
export const REGIONAL_POSITIVE_PCT = 82;

/**
 * Play Cards resolved in cadences before this one. The dashboard adds the live
 * seeded cards on top so the closure rate reads 37/42 (88%) on first load.
 */
export const HISTORICAL_CLOSURE = { total: 37, resolved: 36 };

export const RESET_PLAYBOOK: ResetPlay[] = [
  {
    number: 104,
    title: '2-Minute Transition Reset Protocol',
    framework: 'YPQI / De-escalation',
    targetAction: 'Assign floating staff to Gym entrance during 3:30–4:15 PM',
  },
  {
    number: 112,
    title: 'Name-and-Greet Arrival Circle',
    framework: 'YPQI / Belonging',
    targetAction: 'Two staff greet every youth by name at the door for the first 10 minutes',
  },
  {
    number: 118,
    title: 'Choice Board Reset',
    framework: 'YPQI / Youth Voice',
    targetAction: 'Post three activity options and let youth self-select for the first block',
  },
  {
    number: 127,
    title: 'Repair Conversation Script',
    framework: 'Restorative Practice',
    targetAction: 'Run the 4-question repair script within 24 hours of a peer conflict',
  },
  {
    number: 131,
    title: 'Closing Reflection Huddle',
    framework: 'YPQI / Reflection',
    targetAction: 'End each day with a 5-minute what-went-well circle',
  },
];

export const playByNumber = (n: number): ResetPlay =>
  RESET_PLAYBOOK.find((p) => p.number === n) ?? RESET_PLAYBOOK[0];

export const BARRIER_OPTIONS = [
  'Staffing coverage gap during peak arrival hours',
  'Supplies or materials not available',
  'Space conflict — room double-booked',
  'Staff not yet trained on this play',
  'Schedule does not allow the time block',
  'Transportation / arrival timing outside our control',
];

export const EXECUTIVE_LEVERS: Record<string, string> = {
  'Staffing coverage gap during peak arrival hours':
    'Reallocate floating stipend or adjust schedule across South Bend/Goshen',
  'Supplies or materials not available': 'Release site supply budget for the quarter',
  'Space conflict — room double-booked': 'Arbitrate room priority across programs',
  'Staff not yet trained on this play': 'Schedule a regional Reset Playbook refresher',
  'Schedule does not allow the time block': 'Approve a revised daily program schedule',
  'Transportation / arrival timing outside our control':
    'Open conversation with district transportation lead',
};

// ---------------------------------------------------------------------------
// The single pulse prompt. Only prompt 1 of 6 is written; the rest are stubbed
// in the kiosk UI as "coming in the full build" so the cadence reads correctly.
// ---------------------------------------------------------------------------

export const PULSE_PROMPT: PulsePrompt = {
  id: 'safe-here',
  domainKey: 'safety',
  domainLabel: 'I Feel Safe Here',
  text: "I feel safe, calm, and respected when I'm at the Club.",
  enablerPrompt: 'What made your time here feel great this week?',
  enablers: [
    { id: 'staff-step-in', label: 'Grown-ups step in quickly when issues arise' },
    { id: 'calm-room', label: 'Calm and organized room' },
    { id: 'fair-rules', label: 'Clear and fair room rules' },
    { id: 'friends', label: 'Friends have my back' },
  ],
  frictionPrompt: 'What got in the way this week?',
  frictions: [
    { id: 'too-loud', label: 'Too loud or chaotic' },
    { id: 'unclear-rules', label: 'Unclear or unfair rules' },
    { id: 'peer-drama', label: 'Peer drama / bullying' },
    { id: 'staff-busy', label: 'Grown-ups felt too busy / loud' },
  ],
  locationPrompt: 'Where did this happen most?',
  locations: [
    { id: 'gym', label: 'Gym / Transitions' },
    { id: 'games', label: 'Games Room' },
    { id: 'tech', label: 'Tech Lab' },
    { id: 'teen', label: 'Teen Room' },
    { id: 'bathrooms', label: 'Bathrooms' },
  ],
};

export const PULSE_TOTAL_PROMPTS = 6;

/**
 * Sample question from the longer cadence survey (the NYOI-style instrument that
 * runs Fall / Mid-Year / Spring), as opposed to the 60-second kiosk pulse.
 *
 * Written to the same rules as the pulse: 4-point scale for ages 9–12, and it
 * asks about adults collectively — youth never name or rate an individual staff
 * member.
 */
export const SAMPLE_SURVEY_QUESTION: SurveyQuestion = {
  id: 'adult-believes',
  domainKey: 'belonging',
  domainLabel: 'Belonging & Support',
  index: 4,
  total: 18,
  text: 'There is an adult at the Club who believes I will be a success.',
  helper: 'Think about the grown-ups here in general — not any one person.',
  scaleLabels: [
    { value: 4, label: 'ALWAYS', sub: 'Very True' },
    { value: 3, label: 'MOST OF TIME', sub: 'On Track' },
    { value: 2, label: 'SOMETIMES', sub: 'Friction' },
    { value: 1, label: 'NOT REALLY', sub: 'Never / Low' },
  ],
  followUpPrompt: 'What makes you say that? (Select up to 2)',
  followUpOptions: [
    { id: 'notices', label: 'Someone notices when I do well' },
    { id: 'listens', label: 'Grown-ups listen when I talk' },
    { id: 'helps-goals', label: 'Someone helps me with my goals' },
    { id: 'knows-name', label: 'They know my name and what I like' },
    { id: 'too-busy', label: 'Grown-ups are usually too busy' },
    { id: 'dont-know', label: "I don't really know the grown-ups here" },
  ],
  openTextPrompt: 'Anything you want the Club to know? (Optional)',
  openTextPlaceholder: 'You can skip this one.',
};

// ---------------------------------------------------------------------------
// Seeded Play Cards — one per state so the CEO view shows the full lifecycle.
// ---------------------------------------------------------------------------

export const SEEDED_PLAY_CARDS: PlayCard[] = [
  {
    id: 'pc-goshen-safety',
    siteId: 'goshen',
    domainKey: 'safety',
    domainLabel: 'I Feel Safe Here',
    score: 2.2,
    youthFeedback: 'Too loud, chaotic, and peer drama in the Gym during transitions.',
    location: 'Gym / Transitions',
    play: playByNumber(104),
    status: 'blocked',
    barrier: 'Staffing coverage gap during peak arrival hours',
    staffNote: 'Short 2 staff members Tue/Thu; cannot float staff without leaving Art Room bare.',
    executiveLever: EXECUTIVE_LEVERS['Staffing coverage gap during peak arrival hours'],
    origin: 'seeded',
    history: [
      { label: 'Flagged by Fall 2026 Baseline pulse — score 2.2', at: 'Sep 8' },
      { label: 'Reset Play #104 auto-assigned', at: 'Sep 8' },
      { label: 'Unit Director logged an execution bottleneck', at: 'Sep 10' },
    ],
  },
  {
    id: 'pc-southbend-belonging',
    siteId: 'south-bend',
    domainKey: 'belonging',
    domainLabel: 'Belonging & Support',
    score: 2.9,
    youthFeedback: "New kids say they don't know who to sit with at snack.",
    location: 'Games Room',
    play: playByNumber(112),
    status: 'flagged',
    executiveLever: 'No executive action needed yet — awaiting site response',
    origin: 'seeded',
    history: [
      { label: 'Flagged by Fall 2026 Baseline pulse — score 2.9', at: 'Sep 8' },
      { label: 'Reset Play #112 auto-assigned', at: 'Sep 8' },
    ],
  },
  {
    id: 'pc-elkhart-joy',
    siteId: 'elkhart',
    domainKey: 'joy',
    domainLabel: 'Joy & Energy',
    score: 2.7,
    youthFeedback: 'Same activities every day, kind of boring after homework hour.',
    location: 'Games Room',
    play: playByNumber(118),
    status: 'executed',
    executiveLever: 'None required — resolved at site level',
    executedNote: 'Choice board ran 5 straight days. Attendance in the block is up.',
    origin: 'seeded',
    history: [
      { label: 'Flagged by Fall 2026 Baseline pulse — score 2.7', at: 'Sep 8' },
      { label: 'Reset Play #118 auto-assigned', at: 'Sep 8' },
      { label: 'Unit Director confirmed the play ran 5 days', at: 'Sep 19' },
    ],
  },
  {
    id: 'pc-plymouth-growth',
    siteId: 'plymouth',
    domainKey: 'growth',
    domainLabel: 'Growth & Responsibility',
    score: 2.9,
    youthFeedback: "When something goes wrong we just get moved, nobody talks it out.",
    location: 'Teen Room',
    play: playByNumber(127),
    status: 'unblocked',
    barrier: 'Staff not yet trained on this play',
    staffNote: 'Two of four floor staff started in August and missed the restorative training.',
    executiveLever: EXECUTIVE_LEVERS['Staff not yet trained on this play'],
    origin: 'seeded',
    history: [
      { label: 'Flagged by Fall 2026 Baseline pulse — score 2.9', at: 'Sep 8' },
      { label: 'Reset Play #127 auto-assigned', at: 'Sep 8' },
      { label: 'Unit Director logged an execution bottleneck', at: 'Sep 11' },
      { label: 'CEO approved: regional Reset Playbook refresher', at: 'Sep 12' },
    ],
  },
  {
    id: 'pc-warsaw-purpose',
    siteId: 'warsaw',
    domainKey: 'purpose',
    domainLabel: 'Direction & Purpose',
    score: 2.8,
    youthFeedback: "I don't know what we're working toward here.",
    location: 'Tech Lab',
    play: playByNumber(131),
    status: 'closed',
    executiveLever: 'None required — resolved at site level',
    executedNote: 'Closing huddle became part of the daily schedule.',
    origin: 'seeded',
    history: [
      { label: 'Flagged by Fall 2026 Baseline pulse — score 2.8', at: 'Sep 8' },
      { label: 'Reset Play #131 auto-assigned', at: 'Sep 8' },
      { label: 'Unit Director confirmed the play ran 5 days', at: 'Sep 18' },
      { label: 'Verified by youth pulse — score recovered to 3.4', at: 'Oct 6' },
    ],
  },
];

/** Maps a friction option chosen at the kiosk to the play the system auto-attaches. */
export const FRICTION_TO_PLAY: Record<string, number> = {
  'too-loud': 104,
  'unclear-rules': 118,
  'peer-drama': 127,
  'staff-busy': 112,
};
