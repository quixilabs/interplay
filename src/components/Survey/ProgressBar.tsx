import React from 'react';

interface ProgressBarProps {
  currentSection: number;
  totalSections: number;
  sections: string[];
}

export default function ProgressBar({ currentSection, totalSections, sections }: ProgressBarProps) {
  const progressPercentage = (currentSection / (totalSections - 1)) * 100;

  return (
    <div className="mt-4">
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-blue-600 to-teal-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Section Indicators */}
      <div className="flex justify-between text-xs text-slate-500">
        {sections.map((section, index) => (
          <div 
            key={section}
            className={`flex flex-col items-center transition-colors ${
              index <= currentSection ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <div 
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1 transition-colors ${
                index < currentSection 
                  ? 'bg-blue-600 text-white' 
                  : index === currentSection
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                    : 'bg-slate-200 text-slate-400'
              }`}
            >
              {index + 1}
            </div>
            <span className="hidden sm:block">{section}</span>
          </div>
        ))}
      </div>
    </div>
  );
}