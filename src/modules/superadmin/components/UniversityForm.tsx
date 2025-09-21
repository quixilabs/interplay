import { useState, useEffect } from 'react';
import { ArrowLeft, Save, AlertCircle, Check } from 'lucide-react';
import { SuperAdminUniversityService } from '../services/universityService';
import { UniversityData, UniversityFormData } from '../types';

interface UniversityFormProps {
  onNavigate: (view: string) => void;
  university?: UniversityData;
  mode: 'create' | 'edit';
}

export default function UniversityForm({ onNavigate, university, mode }: UniversityFormProps) {
  const [formData, setFormData] = useState<UniversityFormData>({
    name: '',
    slug: '',
    admin_email: '',
    survey_active: true,
    is_active: true,
    branding_config: {
      primary_color: '#1e3a5f',
      logo_url: '',
      custom_domain: ''
    },
    survey_config: {
      max_responses: 10000,
      allow_anonymous: true,
      require_email: false
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [slugValid, setSlugValid] = useState(true);
  const [checkingSlug, setCheckingSlug] = useState(false);

  useEffect(() => {
    if (university && mode === 'edit') {
      setFormData({
        name: university.name,
        slug: university.slug,
        admin_email: university.admin_email,
        survey_active: university.survey_active,
        is_active: university.is_active,
        branding_config: university.branding_config || {
          primary_color: '#1e3a5f',
          logo_url: '',
          custom_domain: ''
        },
        survey_config: university.survey_config || {
          max_responses: 10000,
          allow_anonymous: true,
          require_email: false
        }
      });
    }
  }, [university, mode]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === 'name' && mode === 'create') {
      const generatedSlug = SuperAdminUniversityService.generateSlug(value);
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
      validateSlug(generatedSlug);
    }
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof UniversityFormData],
        [field]: value
      }
    }));
  };

  const validateSlug = async (slug: string) => {
    if (!slug) {
      setSlugValid(false);
      return;
    }

    setCheckingSlug(true);
    try {
      const isValid = await SuperAdminUniversityService.validateSlug(slug, university?.id);
      setSlugValid(isValid);
    } catch (err) {
      setSlugValid(false);
    } finally {
      setCheckingSlug(false);
    }
  };

  const handleSlugChange = (value: string) => {
    const cleanSlug = SuperAdminUniversityService.generateSlug(value);
    setFormData(prev => ({ ...prev, slug: cleanSlug }));
    validateSlug(cleanSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!slugValid) {
      setError('Please fix the slug before submitting.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === 'create') {
        await SuperAdminUniversityService.createUniversity(formData);
      } else {
        await SuperAdminUniversityService.updateUniversity(university!.id!, formData);
      }
      
      setSuccess(true);
      setTimeout(() => {
        onNavigate('universities');
      }, 1500);
    } catch (err: any) {
      console.error('Failed to save university:', err);
      setError(err.message || 'Failed to save university. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            University {mode === 'create' ? 'Created' : 'Updated'} Successfully!
          </h2>
          <p className="text-slate-600">Redirecting to universities list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('universities')}
                className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold text-slate-900">
                {mode === 'create' ? 'Add New University' : 'Edit University'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  University Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter university name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  URL Slug *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      slugValid ? 'border-slate-300' : 'border-red-300'
                    }`}
                    placeholder="university-slug"
                  />
                  {checkingSlug && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-300 border-t-red-600"></div>
                    </div>
                  )}
                </div>
                {!slugValid && (
                  <p className="text-sm text-red-600 mt-1">This slug is already taken</p>
                )}
                <p className="text-sm text-slate-500 mt-1">
                  Survey URL: /survey/{formData.slug}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Admin Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.admin_email}
                  onChange={(e) => handleInputChange('admin_email', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="admin@university.edu"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="survey_active"
                    checked={formData.survey_active}
                    onChange={(e) => handleInputChange('survey_active', e.target.checked)}
                    className="h-4 w-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="survey_active" className="ml-2 text-sm text-slate-700">
                    Survey Active
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="h-4 w-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm text-slate-700">
                    University Active
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Branding Configuration */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Branding Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Primary Color
                </label>
                <input
                  type="color"
                  value={formData.branding_config.primary_color}
                  onChange={(e) => handleNestedInputChange('branding_config', 'primary_color', e.target.value)}
                  className="w-full h-10 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={formData.branding_config.logo_url}
                  onChange={(e) => handleNestedInputChange('branding_config', 'logo_url', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Custom Domain
                </label>
                <input
                  type="text"
                  value={formData.branding_config.custom_domain}
                  onChange={(e) => handleNestedInputChange('branding_config', 'custom_domain', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="surveys.university.edu"
                />
              </div>
            </div>
          </div>

          {/* Survey Configuration */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Survey Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Max Responses
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.survey_config.max_responses}
                  onChange={(e) => handleNestedInputChange('survey_config', 'max_responses', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allow_anonymous"
                    checked={formData.survey_config.allow_anonymous}
                    onChange={(e) => handleNestedInputChange('survey_config', 'allow_anonymous', e.target.checked)}
                    className="h-4 w-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="allow_anonymous" className="ml-2 text-sm text-slate-700">
                    Allow Anonymous Responses
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="require_email"
                    checked={formData.survey_config.require_email}
                    onChange={(e) => handleNestedInputChange('survey_config', 'require_email', e.target.checked)}
                    className="h-4 w-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="require_email" className="ml-2 text-sm text-slate-700">
                    Require Email for Results
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => onNavigate('universities')}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !slugValid}
              className="flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{mode === 'create' ? 'Create University' : 'Update University'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}