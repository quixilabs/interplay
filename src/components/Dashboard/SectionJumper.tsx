import { useState, useRef, useEffect } from 'react';
import { ChevronDown, List } from 'lucide-react';

interface Section {
  id: string;
  label: string;
  icon: string;
}

const sections: Section[] = [
  { id: 'metrics', label: 'Key Metrics', icon: '📊' },
  { id: 'flourishing', label: 'Flourishing Analysis', icon: '🌟' },
  { id: 'demographics', label: 'Demographics', icon: '👥' },
  { id: 'growth-index', label: 'Growth Index', icon: '📈' },
  { id: 'action-pathway', label: 'Action Pathway', icon: '🎯' },
  { id: 'tensions', label: 'Tension Analysis', icon: '⚖️' },
  { id: 'key-insights', label: 'Key Actionable Insights', icon: '💡' },
  { id: 'student-voice', label: 'Student Voice', icon: '💬' },
  { id: 'enablers-barriers', label: 'Enablers & Barriers', icon: '🔄' },
  { id: 'insights', label: 'Research Insights', icon: '📚' }
];

export default function SectionJumper() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSectionClick = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      // Scroll with offset to account for sticky header
      const headerOffset = 80; // Adjust based on your sticky header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-warm-gray hover:text-sage border border-warm-gray/30 rounded-lg hover:border-sage/50 transition-colors whitespace-nowrap"
        aria-label="Navigate to section"
        aria-expanded={isOpen}
      >
        <List className="w-4 h-4" />
        <span className="hidden sm:inline">Jump to</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-warm-gray/30 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="py-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-warm-gray hover:bg-sage/5 hover:text-sage transition-colors text-left"
              >
                <span className="text-lg">{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

