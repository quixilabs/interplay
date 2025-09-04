import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X, RotateCcw } from 'lucide-react';
import { DemographicsFilters, DEFAULT_FILTERS, FILTER_OPTIONS, FILTER_LABELS } from '../../types/filters';

interface DashboardFiltersProps {
  filters: DemographicsFilters;
  onFiltersChange: (filters: DemographicsFilters) => void;
  data?: any; // Survey data to calculate counts
}

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
        className={`flex items-center justify-between w-full px-4 py-2 text-sm border rounded-lg transition-colors ${
          hasSelection 
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

  const hasAnyFilters = Object.values(filters).some(filterArray => filterArray.length > 0);
  const totalActiveFilters = Object.values(filters).reduce((sum, filterArray) => sum + filterArray.length, 0);

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-warm-gray/20 p-6 mb-8">
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

      {/* Active Filters Summary */}
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
  );
}
