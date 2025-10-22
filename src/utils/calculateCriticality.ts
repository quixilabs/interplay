import { CriticalityLevel } from '../types/actionPathway';

/**
 * Calculate criticality level based on domain average score
 * 
 * Score Thresholds:
 * - Level 4 - Critical (Red): Average score < 5.0
 * - Level 3 - Priority (Orange): Average score 5.0 - 6.49
 * - Level 2 - Watch (Yellow): Average score 6.5 - 7.99
 * - Level 1 - Informational (Green): Average score ≥ 8.0
 */
export function getCriticalityLevel(averageScore: number): CriticalityLevel {
  if (averageScore < 5.0) {
    return {
      level: 4,
      label: 'Critical',
      color: '#EF4444', // Tailwind red-500
      bgColor: '#FEE2E2' // Tailwind red-100
    };
  } else if (averageScore >= 5.0 && averageScore < 6.5) {
    return {
      level: 3,
      label: 'Priority',
      color: '#F97316', // Tailwind orange-500
      bgColor: '#FFEDD5' // Tailwind orange-100
    };
  } else if (averageScore >= 6.5 && averageScore < 8.0) {
    return {
      level: 2,
      label: 'Watch',
      color: '#EAB308', // Tailwind yellow-500
      bgColor: '#FEF9C3' // Tailwind yellow-100
    };
  } else {
    return {
      level: 1,
      label: 'Informational',
      color: '#22C55E', // Tailwind green-500
      bgColor: '#D1FAE5' // Tailwind green-100
    };
  }
}

