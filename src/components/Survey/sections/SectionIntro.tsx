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
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                    {title}
                </h2>
                <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">
                        {description}
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-12">
                <button
                    onClick={onBack}
                    disabled={!canGoBack}
                    className={`flex items-center px-6 py-3 transition-colors ${canGoBack
                        ? 'text-slate-600 hover:text-slate-800'
                        : 'text-slate-300 cursor-not-allowed'
                        }`}
                >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back
                </button>
                <button
                    onClick={onNext}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                    Get Started
                    <ChevronRight className="h-5 w-5 ml-1" />
                </button>
            </div>
        </div>
    );
}
