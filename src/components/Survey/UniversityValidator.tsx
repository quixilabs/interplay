import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, AlertTriangle, ArrowLeft } from 'lucide-react';
import { UniversityService, University } from '../../services/universityService';

interface UniversityValidatorProps {
    universitySlug: string;
    children: React.ReactNode;
}

export default function UniversityValidator({ universitySlug, children }: UniversityValidatorProps) {
    const [university, setUniversity] = useState<University | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const validateUniversity = async () => {
            try {
                setLoading(true);
                const universityData = await UniversityService.getUniversityBySlug(universitySlug);

                if (!universityData) {
                    setError('University not found');
                    setUniversity(null);
                } else if (!universityData.survey_active) {
                    setError('Survey is not currently active for this university');
                    setUniversity(universityData);
                } else {
                    setUniversity(universityData);
                    setError(null);
                }
            } catch (err) {
                console.error('Error validating university:', err);
                setError('Error loading university information');
                setUniversity(null);
            } finally {
                setLoading(false);
            }
        };

        validateUniversity();
    }, [universitySlug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-light-gray flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-sage border-t-transparent mx-auto mb-4"></div>
                    <p className="text-warm-gray font-primary">Loading survey...</p>
                </div>
            </div>
        );
    }

    if (error || !university) {
        return (
            <div className="min-h-screen bg-light-gray flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center space-x-3 mb-6">
                            <BarChart3 className="h-10 w-10 text-navy" />
                            <span className="text-2xl font-bold text-navy font-primary">Interplay</span>
                        </div>
                    </div>

                    {/* Error Card */}
                    <div className="card p-8 text-center">
                        <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="h-8 w-8 text-danger" />
                        </div>

                        <h2 className="text-xl font-bold text-navy font-primary mb-2">
                            {error === 'University not found' ? 'University Not Found' : 'Survey Unavailable'}
                        </h2>

                        <p className="text-warm-gray font-primary mb-6">
                            {error === 'University not found'
                                ? `We couldn't find a university with the identifier "${universitySlug}". Please check the link and try again.`
                                : error === 'Survey is not currently active for this university'
                                    ? `The survey for ${university?.name} is currently not accepting responses. Please contact your administrator.`
                                    : 'There was an error loading the survey. Please try again later.'
                            }
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/"
                                className="btn-primary flex items-center justify-center px-6 py-3 rounded-brand"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Return Home
                            </Link>

                            <button
                                onClick={() => window.location.reload()}
                                className="btn-secondary px-6 py-3 rounded-brand"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>

                    {/* Available Universities */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-warm-gray font-primary mb-3">Available surveys:</p>
                        <div className="flex flex-col gap-2">
                            <Link
                                to="/survey/demo-university"
                                className="text-sage hover:text-navy font-primary text-sm transition-colors"
                            >
                                Demo University Survey
                            </Link>
                            <Link
                                to="/survey/saint-louis-university"
                                className="text-sage hover:text-navy font-primary text-sm transition-colors"
                            >
                                Saint Louis University Survey
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // University is valid and survey is active, render the survey
    return <>{children}</>;
}
