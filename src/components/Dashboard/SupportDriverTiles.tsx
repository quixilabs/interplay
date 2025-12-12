import { Target } from 'lucide-react';
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
      background: 'bg-slate-50',
      border: 'border-slate-200',
      textEmphasis: 'text-slate-600',
      scoreColor: 'text-slate-700'
    };
  }

  // High Support (8.0 - 10.0): Green shades
  if (score >= 8.0) {
    return {
      background: 'bg-green-50',
      border: 'border-green-500',
      textEmphasis: 'text-green-800',
      scoreColor: 'text-green-700'
    };
  }
  
  // Moderate Support (5.0 - 7.9): Yellow/Orange shades
  if (score >= 5.0) {
    return {
      background: 'bg-orange-50',
      border: 'border-orange-400',
      textEmphasis: 'text-orange-800',
      scoreColor: 'text-orange-700'
    };
  }
  
  // Low Support (0.0 - 4.9): Red shades
  return {
    background: 'bg-red-50',
    border: 'border-red-500',
    textEmphasis: 'text-red-800',
    scoreColor: 'text-red-700'
  };
}

export default function SupportDriverTiles({ driverScores }: SupportDriverTilesProps) {
  // Check if we have any data
  const hasData = driverScores && Object.values(driverScores).some(score => score !== null);

  const DriverTile = ({ driverKey }: { driverKey: DriverKey }) => {
    const definition = DRIVER_DEFINITIONS[driverKey];
    const score = driverScores?.[driverKey];
    const colors = getDriverColors(score);

    return (
      <div className={`card p-6 flex flex-col border-2 ${colors.background} ${colors.border} transition-colors duration-300`}>
        {/* Header with Icon */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className={`text-lg font-semibold font-primary mb-1 ${colors.textEmphasis}`}>
              {definition.name}
            </h3>
            <p className="text-sm text-slate-700 font-primary">
              {definition.description}
            </p>
          </div>
          <div className={`p-2 rounded-brand ml-3 ${colors.background}`}>
            <Target className={`h-5 w-5 ${colors.textEmphasis}`} />
          </div>
        </div>

        {/* Score Display */}
        <div className="mt-auto pt-4 border-t border-slate-300">
          {score !== null && score !== undefined ? (
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-slate-700 font-primary">
                Current Score
              </span>
              <div className="flex items-baseline">
                <span className={`text-3xl font-bold font-primary ${colors.scoreColor}`}>
                  {score.toFixed(1)}
                </span>
                <span className="text-lg text-slate-600 font-primary ml-1">
                  / 10
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <span className="text-sm text-slate-600 font-primary">
                No data available
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-navy font-primary">
            Support Driver Breakdown
          </h2>
          <ChartTooltip
            title="Understanding Support Drivers"
            content={[
              "These five drivers measure how well your institution supports students across critical areas.",
              "Each driver score (0-10) is calculated from student responses about barriers they face. Higher scores indicate fewer barriers.",
              "Color coding: Green (8.0-10.0) = High Support, Orange (5.0-7.9) = Moderate Support, Red (0.0-4.9) = Low Support",
              "Access: Can students find and reach resources?",
              "Guidance: Do students have clear academic/career direction?",
              "Connection: Do students have mentors and feel connected?",
              "Trust: Do students receive timely, clear communication?",
              "Care: Do students feel understood and supported?",
              "Focus on drivers with lower scores to improve your Growth Index Score."
            ]}
          />
        </div>
        
        {/* Color Legend */}
        {hasData && (
          <div className="flex items-center space-x-4 text-xs font-medium">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-slate-600">High (8.0-10.0)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-orange-400"></div>
              <span className="text-slate-600">Moderate (5.0-7.9)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-slate-600">Low (0.0-4.9)</span>
            </div>
          </div>
        )}
      </div>

      {!hasData ? (
        // No Data State
        <div className="card p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-light-gray mb-4">
            <Target className="h-8 w-8 text-sage" />
          </div>
          <h3 className="text-lg font-semibold text-navy font-primary mb-2">
            No Support Driver Data Available
          </h3>
          <p className="text-warm-gray font-primary max-w-md mx-auto">
            Support driver scores will appear here once students complete the school wellbeing 
            section (v2 format) of the survey. These scores help identify specific areas of 
            institutional support that need attention.
          </p>
        </div>
      ) : (
        // Driver Tiles Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Top Row: Access, Guidance, Connection */}
          {DRIVER_DISPLAY_ORDER.slice(0, 3).map((driverKey) => (
            <DriverTile key={driverKey} driverKey={driverKey} />
          ))}
          
          {/* Bottom Row: Trust, Care (centered on large screens) */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:max-w-2xl lg:mx-auto">
              {DRIVER_DISPLAY_ORDER.slice(3, 5).map((driverKey) => (
                <DriverTile key={driverKey} driverKey={driverKey} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

