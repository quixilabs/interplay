import { DRIVER_DEFINITIONS, DRIVER_DISPLAY_ORDER, DriverKey, DriverScores } from '../../types/supportDrivers';
import ChartTooltip from './ChartTooltip';

interface SupportDriverTilesProps {
  driverScores: DriverScores | null;
}

// Color coding helper function based on score ranges
function getDriverColors(score: number | null | undefined) {
  // No data state - neutral gray
  if (score === null || score === undefined) {
    return {
      borderColor: '#E0E0E0',
      scoreColor: '#666666',
      dotColor: '#E0E0E0',
      bgTint: ''
    };
  }

  // High Support (8.0 - 10.0): Green
  if (score >= 8.0) {
    return {
      borderColor: '#4CAF50',
      scoreColor: '#4CAF50',
      dotColor: '#4CAF50',
      bgTint: 'bg-green-50/50'
    };
  }

  // Moderate Support (5.0 - 7.9): Orange
  if (score >= 5.0) {
    return {
      borderColor: '#FF9800',
      scoreColor: '#FF9800',
      dotColor: '#FF9800',
      bgTint: 'bg-orange-50/50'
    };
  }

  // Low Support (0.0 - 4.9): Red
  return {
    borderColor: '#F44336',
    scoreColor: '#F44336',
    dotColor: '#F44336',
    bgTint: 'bg-red-50/50'
  };
}

// Progress Dots Component (10-dot indicator)
function ProgressDots({ score }: { score: number | null }) {
  const filledDots = score !== null && score !== undefined ? Math.round(score) : 0;

  return (
    <div className="flex items-center justify-center gap-[3px]" role="presentation">
      {Array.from({ length: 10 }).map((_, index) => {
        const isFilled = index < filledDots;
        const colors = getDriverColors(score);

        return (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300`}
            style={{
              backgroundColor: isFilled ? colors.dotColor : '#E0E0E0'
            }}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

export default function SupportDriverTiles({ driverScores }: SupportDriverTilesProps) {
  // Check if we have any data
  const hasData = driverScores && Object.values(driverScores).some(score => score !== null);

  const DriverTile = ({ driverKey }: { driverKey: DriverKey }) => {
    const definition = DRIVER_DEFINITIONS[driverKey];
    const score = driverScores?.[driverKey];
    const colors = getDriverColors(score);
    const displayScore = score !== null && score !== undefined ? score.toFixed(1) : '—';
    const displayDescription = score !== null && score !== undefined
      ? definition.description
      : 'No data available yet';

    // Format aria-label for accessibility
    const ariaLabel = score !== null && score !== undefined
      ? `${definition.name}: ${displayScore} out of 10. ${definition.description}`
      : `${definition.name}: No data available. ${definition.description}`;

    return (
      <button
        className={`group relative bg-white rounded-lg p-5 flex flex-col items-center justify-center
          min-h-[180px] sm:min-h-[200px] lg:min-h-[220px]
          transition-all duration-200 ease-out
          hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${colors.bgTint}`}
        style={{
          border: `2px solid ${colors.borderColor}`
        }}
        aria-label={ariaLabel}
        type="button"
      >
        {/* Driver Name */}
        <h3
          className="text-sm font-bold tracking-wider text-gray-800 mb-3 text-center uppercase"
          aria-hidden="true"
        >
          {definition.name}
        </h3>

        {/* Score Number */}
        <div
          className="text-5xl font-bold mb-3 transition-colors duration-300"
          style={{ color: colors.scoreColor }}
          aria-hidden="true"
        >
          {displayScore}
        </div>

        {/* Progress Dots */}
        <div className="mb-4">
          <ProgressDots score={score} />
        </div>

        {/* Description Text */}
        <p
          className="text-xs text-gray-600 text-center leading-relaxed max-w-[180px] px-2"
          aria-hidden="true"
        >
          {displayDescription}
        </p>
      </button>
    );
  };

  if (!hasData) {
    // No Data State
    return (
      <div className="mb-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Growth Index Data Available
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Your Growth Index Score Card will appear here once students complete the school wellbeing
            section (v2 format) of the survey. These scores help identify specific areas of
            institutional support that need attention.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Unified Card Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Card Header */}
        <div className="px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  Growth Index Score Card
                </h2>
                <ChartTooltip
                  title="Growth Index Score Card"
                  content={[
                    "These scores show how well your institution is supporting students across 5 critical dimensions. Higher scores = stronger support. Click any tile for detailed breakdown.",
                    "Each driver score (0-10) is calculated from student responses about barriers they face. The average of all 5 drivers equals your overall Growth Index Score.",
                    "Color coding: Green (8.0-10.0) = High Support, Orange (5.0-7.9) = Moderate Support, Red (0.0-4.9) = Low Support",
                    "Trust: Do students receive timely, clear communication?",
                    "Access: Do students know where to go for help?",
                    "Care: Do students feel understood and supported?",
                    "Guidance: Do students feel confident about their academic/career path?",
                    "Connection: Do students have mentors and feel connected?"
                  ]}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Click any driver to see detailed barrier breakdown
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Tile Grid */}
        <div className="px-6 py-6">
          {/* Desktop: 3-2 grid, Tablet: 2-2-1 grid, Mobile: 1 column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Top row: Trust, Access, Care (on desktop) */}
            <DriverTile driverKey="trust" />
            <DriverTile driverKey="access" />
            <DriverTile driverKey="care" />

            {/* Bottom row: Guidance, Connection (centered on desktop) */}
            <div className="sm:col-span-2 lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:max-w-[calc(66.666%-1.25rem)] lg:mx-auto">
                <DriverTile driverKey="guidance" />
                <DriverTile driverKey="connection" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

