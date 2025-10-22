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
    label: 'Mental & Physical Health',
    columns: ['mental_physical_health_1', 'mental_physical_health_2']
  },
  meaning_purpose: {
    label: 'Meaning & Purpose',
    columns: ['meaning_purpose_1', 'meaning_purpose_2']
  },
  happiness_satisfaction: {
    label: 'Happiness & Life Satisfaction',
    columns: ['happiness_satisfaction_1', 'happiness_satisfaction_2']
  },
  character_virtue: {
    label: 'Character & Growth',
    columns: ['character_virtue_1', 'character_virtue_2']
  },
  financial_stability: {
    label: 'Financial & Material Stability',
    columns: ['financial_stability_1', 'financial_stability_2']
  },
  social_relationships: {
    label: 'Close Social Relationships',
    columns: ['social_relationships_1', 'social_relationships_2']
  }
} as const;

export type DomainKey = keyof typeof DOMAIN_CONFIG;

