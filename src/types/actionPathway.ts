// Action Pathway Types

export interface CriticalityLevel {
  level: 1 | 2 | 3 | 4;
  label: 'Informational' | 'Watch' | 'Priority' | 'Critical';
  color: string;
  bgColor: string;
}

export interface DomainActionData {
  domainKey: string;
  domainLabel: string;
  averageScore: number;
  criticality: CriticalityLevel;
  topEnabler: string;
  topBarrier: string;
  sampleSize: number; // Number of students for this domain
}

export interface ActionPathwayData {
  domains: DomainActionData[];
  totalResponses: number;
}

// Domain configuration for mapping database columns to display labels
export const DOMAIN_CONFIG = {
  mental_physical_health: {
    label: 'Health & Balance',
    columns: ['mental_physical_health_1', 'mental_physical_health_2']
  },
  meaning_purpose: {
    label: 'Direction & Purpose',
    columns: ['meaning_purpose_1', 'meaning_purpose_2']
  },
  happiness_satisfaction: {
    label: 'Joy & Energy',
    columns: ['happiness_satisfaction_1', 'happiness_satisfaction_2']
  },
  character_virtue: {
    label: 'Growth & Responsibility',
    columns: ['character_virtue_1', 'character_virtue_2']
  },
  financial_stability: {
    label: 'Stability & Security',
    columns: ['financial_stability_1', 'financial_stability_2']
  },
  social_relationships: {
    label: 'Belonging & Support',
    columns: ['social_relationships_1', 'social_relationships_2']
  }
} as const;

export type DomainKey = keyof typeof DOMAIN_CONFIG;

