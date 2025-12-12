/**
 * SUPPORT BARRIERS SCORING UTILITIES (V2 FORMAT)
 * 
 * These functions calculate scores from checkbox-based support barrier responses.
 * Used for dashboard analytics and reporting.
 * 
 * Scoring Logic:
 * - Each driver has 3 statements
 * - Driver Score = 10 - (Number of Selected Items × 2.5)
 * - Growth Index Score = Average of all 5 driver scores
 * 
 * Score Interpretation:
 * - 10.0: Strong support (0 barriers selected)
 * - 7.5: Good support (1 barrier selected)
 * - 5.0: Moderate support (2 barriers selected)
 * - 2.5: Weak support (3 barriers selected)
 */

import { SUPPORT_DRIVER_MAPPING } from '../components/Survey/sections/SchoolWellbeingSection';

export type SupportDriver = 'access' | 'guidance' | 'connection' | 'trust' | 'care';

export interface BarrierResponses {
  statement_1?: boolean;
  statement_2?: boolean;
  statement_3?: boolean;
  statement_4?: boolean;
  statement_5?: boolean;
  statement_6?: boolean;
  statement_7?: boolean;
  statement_8?: boolean;
  statement_9?: boolean;
  statement_10?: boolean;
  statement_11?: boolean;
  statement_12?: boolean;
  statement_13?: boolean;
  statement_14?: boolean;
  statement_15?: boolean;
  [key: string]: boolean | undefined;
}

/**
 * Get statement IDs for a specific driver
 */
export function getStatementIdsForDriver(driver: SupportDriver): number[] {
  return Object.entries(SUPPORT_DRIVER_MAPPING)
    .filter(([_, data]) => data.driver === driver)
    .map(([id, _]) => parseInt(id));
}

/**
 * Calculate score for a specific support driver
 * 
 * @param responses - Checkbox responses (statement_1: boolean, etc.)
 * @param driver - The support driver to calculate score for
 * @returns Score from 0 to 10 (10 = strong support, 0 = weak support)
 */
export function calculateDriverScore(
  responses: BarrierResponses,
  driver: SupportDriver
): number {
  // Get statements for this driver
  const driverStatements = getStatementIdsForDriver(driver);
  
  // Count selected items for this driver
  const selectedCount = driverStatements.filter(id => {
    const key = `statement_${id}`;
    return responses[key] === true;
  }).length;
  
  // Calculate score: 10 - (selected × 2.5)
  const score = 10 - (selectedCount * 2.5);
  
  // Ensure score is within bounds [0, 10]
  return Math.max(0, Math.min(10, score));
}

/**
 * Calculate overall Growth Index Score
 * Average of all 5 driver scores
 * 
 * @param responses - Checkbox responses
 * @returns Growth Index Score from 0 to 10
 */
export function calculateGrowthIndexScore(responses: BarrierResponses): number {
  const drivers: SupportDriver[] = ['access', 'guidance', 'connection', 'trust', 'care'];
  const driverScores = drivers.map(driver => calculateDriverScore(responses, driver));
  
  const sum = driverScores.reduce((acc, score) => acc + score, 0);
  const average = sum / drivers.length;
  
  return Math.round(average * 10) / 10; // Round to 1 decimal place
}

/**
 * Calculate all driver scores at once
 * 
 * @param responses - Checkbox responses
 * @returns Object with scores for each driver
 */
export function calculateAllDriverScores(responses: BarrierResponses): Record<SupportDriver, number> {
  return {
    access: calculateDriverScore(responses, 'access'),
    guidance: calculateDriverScore(responses, 'guidance'),
    connection: calculateDriverScore(responses, 'connection'),
    trust: calculateDriverScore(responses, 'trust'),
    care: calculateDriverScore(responses, 'care')
  };
}

/**
 * Get count of selected barriers for each driver
 * 
 * @param responses - Checkbox responses
 * @returns Object with barrier counts for each driver
 */
export function getDriverBarrierCounts(responses: BarrierResponses): Record<SupportDriver, number> {
  const drivers: SupportDriver[] = ['access', 'guidance', 'connection', 'trust', 'care'];
  const counts: Record<string, number> = {};
  
  drivers.forEach(driver => {
    const driverStatements = getStatementIdsForDriver(driver);
    const selectedCount = driverStatements.filter(id => {
      const key = `statement_${id}`;
      return responses[key] === true;
    }).length;
    counts[driver] = selectedCount;
  });
  
  return counts as Record<SupportDriver, number>;
}

/**
 * Get total count of selected barriers
 * 
 * @param responses - Checkbox responses
 * @returns Total number of barriers selected (0-15)
 */
export function getTotalBarrierCount(responses: BarrierResponses): number {
  let count = 0;
  for (let i = 1; i <= 15; i++) {
    const key = `statement_${i}`;
    if (responses[key] === true) {
      count++;
    }
  }
  return count;
}

/**
 * Get list of selected barrier statements with their drivers
 * 
 * @param responses - Checkbox responses
 * @returns Array of selected barriers with statement text and driver
 */
export function getSelectedBarriers(responses: BarrierResponses): Array<{
  id: number;
  statement: string;
  driver: SupportDriver;
}> {
  const selected: Array<{ id: number; statement: string; driver: SupportDriver }> = [];
  
  Object.entries(SUPPORT_DRIVER_MAPPING).forEach(([id, data]) => {
    const statementId = parseInt(id);
    const key = `statement_${statementId}`;
    
    if (responses[key] === true) {
      selected.push({
        id: statementId,
        statement: data.statement,
        driver: data.driver as SupportDriver
      });
    }
  });
  
  return selected;
}

