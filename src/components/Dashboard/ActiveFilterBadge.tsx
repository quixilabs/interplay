import { X } from 'lucide-react';

export interface ActiveFilter {
  key: string;
  label: string;
  displayName: string;
  value: string;
  values: string[]; // Original array of values
}

interface ActiveFilterBadgeProps {
  filter: ActiveFilter;
  onRemove: (filterKey: string) => void;
  onClick?: (filterKey: string) => void;
  showRemove?: boolean;
}

export function ActiveFilterBadge({ 
  filter, 
  onRemove, 
  onClick,
  showRemove = true 
}: ActiveFilterBadgeProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(filter.key);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(filter.key);
  };

  return (
    <div
      role="group"
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-sage/10 text-sage text-sm rounded-full border border-sage/20 transition-all hover:bg-sage/15 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
    >
      <span className="font-medium text-xs uppercase tracking-wide" id={`filter-${filter.key}-label`}>
        {filter.displayName}:
      </span>
      <span className="font-normal" aria-labelledby={`filter-${filter.key}-label`}>
        {filter.value}
      </span>
      {showRemove && (
        <button
          onClick={handleRemove}
          aria-label={`Remove ${filter.label} filter`}
          className="hover:text-danger transition-colors focus:outline-none focus:ring-2 focus:ring-sage/50 rounded"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

interface CompactFilterDisplayProps {
  activeFilters: ActiveFilter[];
  onRemoveFilter: (filterKey: string) => void;
  onBadgeClick?: (filterKey: string) => void;
  maxDisplay?: number;
}

export function CompactFilterDisplay({ 
  activeFilters, 
  onRemoveFilter,
  onBadgeClick,
  maxDisplay = 3 
}: CompactFilterDisplayProps) {
  const displayFilters = activeFilters.slice(0, maxDisplay);
  const overflowCount = activeFilters.length - maxDisplay;

  if (activeFilters.length === 0) {
    return (
      <span className="text-sm text-warm-gray/70 italic">
        No filters applied
      </span>
    );
  }

  return (
    <div className="flex items-center flex-wrap gap-2">
      {displayFilters.map((filter) => (
        <ActiveFilterBadge
          key={filter.key}
          filter={filter}
          onRemove={onRemoveFilter}
          onClick={onBadgeClick}
        />
      ))}
      {overflowCount > 0 && (
        <span className="text-sm text-warm-gray/70 px-2 py-1">
          +{overflowCount} more
        </span>
      )}
    </div>
  );
}

interface MobileFilterCountProps {
  count: number;
  onExpand: () => void;
}

export function MobileFilterCount({ count, onExpand }: MobileFilterCountProps) {
  return (
    <button
      onClick={onExpand}
      className="flex items-center gap-2 px-3 py-1.5 bg-sage/10 text-sage text-sm rounded-full border border-sage/20"
    >
      <span className="font-medium">
        {count} Filter{count !== 1 ? 's' : ''} Active
      </span>
      <span className="text-xs text-warm-gray/70">Tap to view</span>
    </button>
  );
}

