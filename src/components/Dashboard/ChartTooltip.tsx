import { Info } from 'lucide-react';
import { useState } from 'react';

interface ChartTooltipProps {
  title: string;
  content: string | string[];
}

export default function ChartTooltip({ title, content }: ChartTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const contentArray = Array.isArray(content) ? content : [content];

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="p-1 text-slate-400 hover:text-sage transition-colors focus:outline-none"
        aria-label="How to use this chart"
        type="button"
      >
        <Info className="h-4 w-4" />
      </button>

      {isVisible && (
        <div className="absolute left-0 top-full mt-1 z-50 w-72 sm:w-80 bg-white rounded-lg shadow-xl border border-slate-200 p-4 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-start space-x-2 mb-2">
            <Info className="h-4 w-4 text-sage mt-0.5 flex-shrink-0" />
            <h4 className="font-semibold text-slate-900 text-sm">{title}</h4>
          </div>
          <div className="space-y-2">
            {contentArray.map((item, index) => (
              <p key={index} className="text-xs text-slate-700 leading-relaxed">
                {item}
              </p>
            ))}
          </div>
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white border-l border-t border-slate-200 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}

