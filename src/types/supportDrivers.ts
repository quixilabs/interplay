// Support Driver Types and Definitions

export type DriverKey = 'access' | 'guidance' | 'connection' | 'trust' | 'care';

export interface DriverDefinition {
  name: string;
  description: string;
  statements: string[];
}

export interface DriverScores {
  access: number | null;
  guidance: number | null;
  connection: number | null;
  trust: number | null;
  care: number | null;
}

// Driver-to-Statement Mapping
// Maps each driver to the statement IDs (frontend format: statement_1 through statement_15)
export const DRIVER_STATEMENT_MAPPING: Record<DriverKey, number[]> = {
  access: [2, 14, 15],      // statement_2, statement_14, statement_15
  guidance: [3, 7, 9],      // statement_3, statement_7, statement_9
  connection: [5, 8, 11],   // statement_5, statement_8, statement_11
  trust: [4, 10, 12],       // statement_4, statement_10, statement_12
  care: [1, 6, 13]          // statement_1, statement_6, statement_13
};

// Driver Definitions with Names, Descriptions, and Statement Text
export const DRIVER_DEFINITIONS: Record<DriverKey, DriverDefinition> = {
  access: {
    name: "Access",
    description: "Do students know where to go for help?",
    statements: [
      "It's hard to find information about campus resources.",
      "I don't know where to go when I need help.",
      "It takes too long to get an appointment when I need support."
    ]
  },
  guidance: {
    name: "Guidance",
    description: "Do students feel confident about their academic/career path?",
    statements: [
      "I'm unsure about my academic or career direction.",
      "I want more help planning my next steps.",
      "I'm confused about which courses I need to take."
    ]
  },
  connection: {
    name: "Connection",
    description: "Do students have mentors and feel connected?",
    statements: [
      "I don't have a mentor or someone I can turn to.",
      "It's hard for me to make friends here.",
      "I don't feel connected to other students."
    ]
  },
  trust: {
    name: "Trust",
    description: "Do students receive timely, clear communication?",
    statements: [
      "My messages or emails aren't answered in a timely way.",
      "Communication from the school feels unclear or inconsistent.",
      "I'm often bounced between offices when trying to get help."
    ]
  },
  care: {
    name: "Care",
    description: "Do students feel understood and supported?",
    statements: [
      "I don't feel understood or supported when I'm struggling.",
      "Staff or faculty don't show empathy when I raise a concern.",
      "I don't feel like the school cares about students like me."
    ]
  }
};

// Display order for tiles (matches 3-2 grid layout)
export const DRIVER_DISPLAY_ORDER: DriverKey[] = [
  'access',
  'guidance', 
  'connection',
  'trust',
  'care'
];

