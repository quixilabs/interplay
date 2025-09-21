import { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  ArrowLeft,
  Users,
  BarChart3,
  Globe,
  AlertCircle
} from 'lucide-react';
import { SuperAdminUniversityService } from '../services/universityService';
import { UniversityData, UniversityStats } from '../types';

interface UniversityListProps {
  onNavigate: (view: string, data?: any) => void;
}

export default function UniversityList({ onNavigate }: UniversityListProps) {
  const [universities, setUniversities] = useState<(UniversityData & { stats: UniversityStats })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);

  useEffect(() => {
    loadUniversities();
  }, []);

  const loadUniversities = async () => {
    try {
      setLoading(true);
      const data = await SuperAdminUniversityService.getAllUniversities();
      setUniversities(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load universities:', err);
      setError('Failed to load universities');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUniversity = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to deactivate "${name}"? This will disable all surveys for this university.`)) {
      return;
    }

    try {
      await SuperAdminUniversityService.deleteUniversity(id);
      await loadUniversities();
      setSelectedUniversity(null);
    } catch (err) {
      console.error('Failed to delete university:', err);
      alert('Failed to delete university. Please try again.');
    }
  };

  const filteredUniversities = universities.filter(university =>
    university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    university.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    university.admin_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (university: UniversityData) => {
    if (!university.is_active) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Suspended</span>;
    }
    if (!university.survey_active) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Inactive</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Loading universities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <Building2 className="h-6 w-6 text-red-600" />
                <h1 className="text-xl font-bold text-slate-900">Universities</h1>
              </div>
            </div>

            <button
              onClick={() => onNavigate('create-university')}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add University</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Universities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUniversities.map((university) => (
            <div key={university.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{university.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">/{university.slug}</p>
                  {getStatusBadge(university)}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setSelectedUniversity(selectedUniversity === university.id ? null : university.id)}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  
                  {selectedUniversity === university.id && (
                    <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-10 min-w-48">
                      <button
                        onClick={() => onNavigate('view-university', university)}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={() => onNavigate('edit-university', university)}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteUniversity(university.id!, university.name)}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Deactivate</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Admin Email:</span>
                  <span className="text-slate-900">{university.admin_email}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Survey URL:</span>
                  <a
                    href={`/survey/${university.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <Globe className="h-3 w-3" />
                    <span>View</span>
                  </a>
                </div>

                <div className="border-t border-slate-200 pt-3 mt-3">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
                        <Users className="h-4 w-4" />
                      </div>
                      <p className="text-lg font-semibold text-slate-900">{university.stats.total_responses}</p>
                      <p className="text-xs text-slate-600">Total</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center space-x-1 text-green-600 mb-1">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                      <p className="text-lg font-semibold text-slate-900">{university.stats.completion_rate}%</p>
                      <p className="text-xs text-slate-600">Complete</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center space-x-1 text-orange-600 mb-1">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <p className="text-lg font-semibold text-slate-900">{university.stats.active_sessions}</p>
                      <p className="text-xs text-slate-600">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUniversities.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No universities found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first university.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => onNavigate('create-university')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Add University
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}