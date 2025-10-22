import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Filter, X, RotateCcw } from 'lucide-react';
import { DemographicsFilters, DEFAULT_FILTERS, FILTER_OPTIONS, FILTER_LABELS } from '../../types/filters';
import { CompactFilterDisplay, MobileFilterCount } from './ActiveFilterBadge';
import { getActiveFilters, clearFilter, hasActiveFilters, getActiveFilterCount } from '../../utils/filterHelpers';

interface DashboardFiltersProps {
  filters: DemographicsFilters;
  onFiltersChange: (filters: DemographicsFilters) => void;
  data?: any; // Survey data to calculate counts
}

type FilterBarMode = 'normal' | 'sticky-collapsed' | 'sticky-expanded';

interface FilterDropdownProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  counts?: Record<string, number>;
}

function FilterDropdown({ label, options, selectedValues, onChange, counts }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSelection = selectedValues.length > 0;

  const handleOptionToggle = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter(v => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-2 text-sm border rounded-lg transition-colors ${hasSelection
          ? 'border-sage bg-sage/5 text-sage'
          : 'border-warm-gray/30 bg-white text-warm-gray hover:border-sage/50'
          }`}
      >
        <span className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          {label}
          {hasSelection && (
            <span className="ml-2 px-2 py-0.5 bg-sage text-white text-xs rounded-full">
              {selectedValues.length}
            </span>
          )}
        </span>
        <div className="flex items-center">
          {hasSelection && (
            <X
              className="h-4 w-4 mr-2 text-warm-gray hover:text-danger cursor-pointer"
              onClick={handleClearAll}
            />
          )}
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-warm-gray/30 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="p-2">
            {options.map(option => {
              const isSelected = selectedValues.includes(option);
              const count = counts?.[option];

              return (
                <label
                  key={option}
                  className="flex items-center justify-between p-2 hover:bg-light-gray rounded cursor-pointer"
                >
                  <div className="flex items-center flex-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleOptionToggle(option)}
                      className="h-4 w-4 text-sage border-warm-gray/30 rounded focus:ring-2 focus:ring-sage/20"
                    />
                    <span className="ml-3 text-sm text-warm-gray">{option}</span>
                  </div>
                  {count !== undefined && (
                    <span className="text-xs text-warm-gray/60 ml-2">({count})</span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardFilters({ filters, onFiltersChange, data }: DashboardFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState<FilterBarMode>('normal');
  const [manuallyExpanded, setManuallyExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [filterBarHeight, setFilterBarHeight] = useState(0);

  const filterBarRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Capture filter bar height to prevent layout shift
  useEffect(() => {
    const updateHeight = () => {
      if (filterBarRef.current && mode === 'normal') {
        setFilterBarHeight(filterBarRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [mode, isExpanded]); // Re-measure when mode or expansion changes

  // Detect mobile/tablet/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection Observer for sticky behavior
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Use requestAnimationFrame to prevent scroll interference
        requestAnimationFrame(() => {
          // When sentinel is out of view at the top
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            setMode(manuallyExpanded ? 'sticky-expanded' : 'sticky-collapsed');
          } else {
            // Back in normal view
            setMode('normal');
            setManuallyExpanded(false); // Reset manual expansion when scrolling back up
          }
        });
      },
      {
        threshold: [0, 1], // Check both fully visible and not visible
        rootMargin: '0px 0px 0px 0px' // No margin offset
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [manuallyExpanded]);

  // Calculate filter counts from data if available
  const calculateCounts = (filterKey: keyof DemographicsFilters) => {
    if (!data?.responses) return {};

    const counts: Record<string, number> = {};
    const options = FILTER_OPTIONS[filterKey];

    options.forEach(option => {
      counts[option] = data.responses.filter((response: any) => {
        const value = response.demographics?.[filterKey];
        if (Array.isArray(value)) {
          return value.includes(option);
        }
        return value === option;
      }).length;
    });

    return counts;
  };

  const handleFilterChange = (filterKey: keyof DemographicsFilters, values: string[]) => {
    onFiltersChange({
      ...filters,
      [filterKey]: values
    });
  };

  const handleClearAllFilters = () => {
    onFiltersChange(DEFAULT_FILTERS);
  };

  const handleRemoveFilter = (filterKey: string) => {
    onFiltersChange(clearFilter(filters, filterKey as keyof DemographicsFilters));
  };

  const handleBadgeClick = (filterKey: string) => {
    // Expand the sticky bar when a badge is clicked
    if (mode === 'sticky-collapsed') {
      setManuallyExpanded(true);
      setMode('sticky-expanded');
    }
  };

  const handleToggleCollapse = () => {
    if (mode === 'sticky-collapsed') {
      setManuallyExpanded(true);
      setMode('sticky-expanded');
    } else if (mode === 'sticky-expanded') {
      setManuallyExpanded(false);
      setMode('sticky-collapsed');
    }
  };

  const hasAnyFilters = hasActiveFilters(filters);
  const totalActiveFilters = getActiveFilterCount(filters);
  const activeFilters = getActiveFilters(filters);

  // Primary filters (always visible)
  const primaryFilters: (keyof DemographicsFilters)[] = [
    'yearInSchool',
    'enrollmentStatus',
    'ageRange',
    'genderIdentity'
  ];

  // Secondary filters (shown when expanded)
  const secondaryFilters: (keyof DemographicsFilters)[] = [
    'raceEthnicity',
    'isInternational',
    'employmentStatus',
    'hasCaregavingResponsibilities',
    'inGreekOrganization',
    'studyMode',
    'transferStudent'
  ];

  // Sticky Collapsed Mode - Show only active filters
  if (mode === 'sticky-collapsed') {
    return (
      <>
        {/* Sentinel element for Intersection Observer */}
        <div ref={sentinelRef} className="h-1 -mb-1" aria-hidden="true" />

        {/* Spacer to prevent layout shift when filter bar becomes sticky */}
        {filterBarHeight > 0 && (
          <div style={{ height: `${filterBarHeight}px` }} aria-hidden="true" />
        )}

        <div
          ref={filterBarRef}
          className="sticky top-0 z-40 bg-white border-b border-warm-gray/20 shadow-md transition-all duration-300 ease-in-out"
          role="region"
          aria-label="Filter controls"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3 gap-4">
              {/* Expand button */}
              <button
                onClick={handleToggleCollapse}
                aria-expanded={false}
                aria-controls="filter-bar-content"
                aria-label="Expand filters"
                className="flex items-center text-sage hover:text-sage-dark transition-colors focus:outline-none focus:ring-2 focus:ring-sage/50 rounded p-1"
              >
                <ChevronDown className="h-5 w-5" />
              </button>

              {/* Active filters display */}
              <div className="flex-1 min-w-0">
                {isMobile ? (
                  <MobileFilterCount
                    count={activeFilters.length}
                    onExpand={handleToggleCollapse}
                  />
                ) : (
                  <CompactFilterDisplay
                    activeFilters={activeFilters}
                    onRemoveFilter={handleRemoveFilter}
                    onBadgeClick={handleBadgeClick}
                    maxDisplay={3}
                  />
                )}
              </div>

              {/* Clear all button */}
              {hasAnyFilters && (
                <button
                  onClick={handleClearAllFilters}
                  className="flex items-center px-3 py-1.5 text-sm text-warm-gray hover:text-danger transition-colors whitespace-nowrap"
                  aria-label="Clear all filters"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Sticky Expanded Mode - Full filters but sticky positioned
  if (mode === 'sticky-expanded') {
    return (
      <>
        {/* Sentinel element for Intersection Observer */}
        <div ref={sentinelRef} className="h-1 -mb-1" aria-hidden="true" />

        {/* Spacer to prevent layout shift when filter bar becomes sticky */}
        {filterBarHeight > 0 && (
          <div style={{ height: `${filterBarHeight}px` }} aria-hidden="true" />
        )}

        <div
          ref={filterBarRef}
          className="sticky top-0 z-40 bg-white border-b border-warm-gray/20 shadow-md transition-all duration-300 ease-in-out max-h-[80vh] overflow-y-auto"
          role="region"
          aria-label="Filter controls"
          id="filter-bar-content"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Header with collapse button */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <button
                  onClick={handleToggleCollapse}
                  aria-expanded={true}
                  aria-controls="filter-bar-content"
                  aria-label="Collapse filters"
                  className="mr-3 text-sage hover:text-sage-dark transition-colors focus:outline-none focus:ring-2 focus:ring-sage/50 rounded p-1"
                >
                  <ChevronUp className="h-5 w-5" />
                </button>
                <Filter className="h-5 w-5 text-sage mr-2" />
                <h3 className="text-lg font-semibold text-warm-gray font-primary">
                  Filter Dashboard
                </h3>
                {hasAnyFilters && (
                  <span className="ml-3 px-3 py-1 bg-sage/10 text-sage text-sm rounded-full font-medium">
                    {totalActiveFilters} filter{totalActiveFilters !== 1 ? 's' : ''} active
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                {hasAnyFilters && (
                  <button
                    onClick={handleClearAllFilters}
                    className="flex items-center px-3 py-1.5 text-sm text-warm-gray hover:text-danger transition-colors"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Clear All
                  </button>
                )}

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center px-3 py-1.5 text-sm text-sage hover:text-sage-dark transition-colors"
                >
                  {isExpanded ? 'Show Less' : 'More Filters'}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </button>
              </div>
            </div>

            {/* Primary Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {primaryFilters.map(filterKey => (
                <FilterDropdown
                  key={filterKey}
                  label={FILTER_LABELS[filterKey]}
                  options={FILTER_OPTIONS[filterKey]}
                  selectedValues={filters[filterKey]}
                  onChange={(values) => handleFilterChange(filterKey, values)}
                  counts={calculateCounts(filterKey)}
                />
              ))}
            </div>

            {/* Secondary Filters (Expandable) */}
            {isExpanded && (
              <div className="border-t border-warm-gray/20 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {secondaryFilters.map(filterKey => (
                    <FilterDropdown
                      key={filterKey}
                      label={FILTER_LABELS[filterKey]}
                      options={FILTER_OPTIONS[filterKey]}
                      selectedValues={filters[filterKey]}
                      onChange={(values) => handleFilterChange(filterKey, values)}
                      counts={calculateCounts(filterKey)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Normal Mode - Regular positioned filter bar
  return (
    <>
      {/* Sentinel element for Intersection Observer */}
      <div ref={sentinelRef} className="h-1 -mb-1" aria-hidden="true" />

      <div
        ref={filterBarRef}
        className="bg-white rounded-xl shadow-sm border border-warm-gray/20 p-6 mb-8 transition-all duration-300 ease-in-out"
        role="region"
        aria-label="Filter controls"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-sage mr-2" />
            <h3 className="text-lg font-semibold text-warm-gray font-primary">
              Filter Dashboard
            </h3>
            {hasAnyFilters && (
              <span className="ml-3 px-3 py-1 bg-sage/10 text-sage text-sm rounded-full font-medium">
                {totalActiveFilters} filter{totalActiveFilters !== 1 ? 's' : ''} active
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {hasAnyFilters && (
              <button
                onClick={handleClearAllFilters}
                className="flex items-center px-3 py-1.5 text-sm text-warm-gray hover:text-danger transition-colors"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear All
              </button>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center px-3 py-1.5 text-sm text-sage hover:text-sage-dark transition-colors"
            >
              {isExpanded ? 'Show Less' : 'More Filters'}
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 ml-1" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </button>
          </div>
        </div>

        {/* Primary Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {primaryFilters.map(filterKey => (
            <FilterDropdown
              key={filterKey}
              label={FILTER_LABELS[filterKey]}
              options={FILTER_OPTIONS[filterKey]}
              selectedValues={filters[filterKey]}
              onChange={(values) => handleFilterChange(filterKey, values)}
              counts={calculateCounts(filterKey)}
            />
          ))}
        </div>

        {/* Secondary Filters (Expandable) */}
        {isExpanded && (
          <div className="border-t border-warm-gray/20 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {secondaryFilters.map(filterKey => (
                <FilterDropdown
                  key={filterKey}
                  label={FILTER_LABELS[filterKey]}
                  options={FILTER_OPTIONS[filterKey]}
                  selectedValues={filters[filterKey]}
                  onChange={(values) => handleFilterChange(filterKey, values)}
                  counts={calculateCounts(filterKey)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Summary (in normal mode) */}
        {hasAnyFilters && (
          <div className="border-t border-warm-gray/20 pt-4 mt-4">
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([filterKey, values]) =>
                values.map(value => (
                  <span
                    key={`${filterKey}-${value}`}
                    className="inline-flex items-center px-3 py-1 bg-sage/10 text-sage text-sm rounded-full"
                  >
                    <span className="font-medium text-xs uppercase tracking-wide mr-2">
                      {FILTER_LABELS[filterKey as keyof DemographicsFilters]}:
                    </span>
                    {value}
                    <button
                      onClick={() => handleFilterChange(
                        filterKey as keyof DemographicsFilters,
                        values.filter(v => v !== value)
                      )}
                      className="ml-2 hover:text-danger transition-colors"
                      aria-label={`Remove ${value} from ${FILTER_LABELS[filterKey as keyof DemographicsFilters]}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
