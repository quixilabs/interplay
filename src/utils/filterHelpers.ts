import { DemographicsFilters, FILTER_LABELS } from '../types/filters';
import { ActiveFilter } from '../components/Dashboard/ActiveFilterBadge';

/**
 * Formats multiple selected values into a compact display string
 * Examples:
 * - Single value: "Freshman"
 * - Two values: "Freshman +1"
 * - Three+ values: "Freshman +2"
 * - Many values: "4 selected"
 */
export function formatMultiSelect(values: string[], threshold: number = 4): string {
  if (values.length === 0) return '';
  if (values.length === 1) return values[0];
  if (values.length >= threshold) return `${values.length} selected`;
  
  // For 2-3 values, show first value + count
  const firstValue = values[0];
  const remaining = values.length - 1;
  
  // Shorten the first value if it's too long
  const displayValue = firstValue.length > 15 
    ? firstValue.substring(0, 15) + '...' 
    : firstValue;
  
  return `${displayValue} +${remaining}`;
}

/**
 * Gets short display names for filter labels
 * Used in collapsed sticky mode to save space
 */
export function getShortFilterLabel(filterKey: keyof DemographicsFilters): string {
  const shortLabels: Record<keyof DemographicsFilters, string> = {
    yearInSchool: 'Year',
    enrollmentStatus: 'Status',
    ageRange: 'Age',
    genderIdentity: 'Gender',
    raceEthnicity: 'Race',
    isInternational: 'International',
    employmentStatus: 'Employment',
    hasCaregavingResponsibilities: 'Caregiving',
    inGreekOrganization: 'Greek Life',
    studyMode: 'Study Mode',
    transferStudent: 'Transfer'
  };
  
  return shortLabels[filterKey] || FILTER_LABELS[filterKey];
}

/**
 * Extracts all active filters from filter state
 * Only includes filters that have at least one value selected (non-empty arrays)
 */
export function getActiveFilters(filterState: DemographicsFilters): ActiveFilter[] {
  const active: ActiveFilter[] = [];
  
  // Define priority order for filter display
  const priorityOrder: (keyof DemographicsFilters)[] = [
    'yearInSchool',
    'enrollmentStatus',
    'studyMode',
    'ageRange',
    'genderIdentity',
    'raceEthnicity',
    'isInternational',
    'employmentStatus',
    'hasCaregavingResponsibilities',
    'inGreekOrganization',
    'transferStudent'
  ];
  
  priorityOrder.forEach((filterKey) => {
    const values = filterState[filterKey];
    
    // Only include if there are selected values
    if (values && values.length > 0) {
      active.push({
        key: filterKey,
        label: FILTER_LABELS[filterKey],
        displayName: getShortFilterLabel(filterKey),
        value: formatMultiSelect(values),
        values: values
      });
    }
  });
  
  return active;
}

/**
 * Checks if any filters are currently active
 */
export function hasActiveFilters(filterState: DemographicsFilters): boolean {
  return Object.values(filterState).some(filterArray => filterArray.length > 0);
}

/**
 * Gets total count of active filter selections
 */
export function getActiveFilterCount(filterState: DemographicsFilters): number {
  return Object.values(filterState).reduce((sum, filterArray) => sum + filterArray.length, 0);
}

/**
 * Removes all selections for a specific filter
 */
export function clearFilter(
  filterState: DemographicsFilters, 
  filterKey: keyof DemographicsFilters
): DemographicsFilters {
  return {
    ...filterState,
    [filterKey]: []
  };
}

