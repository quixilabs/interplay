import { ChevronRight, ChevronLeft } from 'lucide-react';

interface SectionIntroProps {
    title: string;
    description: string;
    onNext: () => void;
    onBack: () => void;
    canGoBack?: boolean;
}

export default function SectionIntro({
    title,
    description,
    onNext,
    onBack,
    canGoBack = true
}: SectionIntroProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-3xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 sm:mb-6">
                    {title}
                </h2>
                <div className="prose prose-slate max-w-none">
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed whitespace-pre-line">
                        {description}
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between mt-8 sm:mt-12 space-y-4 sm:space-y-0">
                <button
                    onClick={onBack}
                    disabled={!canGoBack}
                    className={`flex items-center justify-center sm:justify-start px-6 py-3 transition-colors ${canGoBack
                        ? 'text-slate-600 hover:text-slate-800'
                        : 'text-slate-300 cursor-not-allowed'
                        }`}
                >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back
                </button>
                <button
                    onClick={onNext}
                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                    Get Started
                    <ChevronRight className="h-5 w-5 ml-1" />
                </button>
            </div>
        </div>
    );
}
