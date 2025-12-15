import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import DashboardHeader from '../Dashboard/DashboardHeader';
import { Building2, Lock, FileText, Download, User, ArrowLeft } from 'lucide-react';

type SettingsTab = 'profile' | 'account' | 'survey' | 'data';

export default function AdminSettings() {
  const { adminUser } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Form states
  const [contactEmail, setContactEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState(adminUser?.username || '');

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage('');

    // TODO: Implement API call to save profile
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setSaveMessage('Passwords do not match');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    // TODO: Implement API call to change password
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'University Profile', icon: Building2 },
    { id: 'account' as SettingsTab, label: 'Account Security', icon: Lock },
    { id: 'survey' as SettingsTab, label: 'Survey Management', icon: FileText },
    { id: 'data' as SettingsTab, label: 'Data & Export', icon: Download }
  ];

  return (
    <div className="min-h-screen bg-light-gray">
      <DashboardHeader
        universityName={adminUser?.universityName || 'Demo University'}
        dateRange="semester"
        onDateRangeChange={() => { }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-warm-gray hover:text-sage transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy font-primary mb-2">Settings</h1>
          <p className="text-warm-gray">Manage your university profile, account, and preferences</p>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-brand ${saveMessage.includes('success')
            ? 'bg-sage/10 text-sage border border-sage/30'
            : 'bg-danger/10 text-danger border border-danger/30'
            }`}>
            {saveMessage}
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="bg-white rounded-t-xl shadow-sm border border-warm-gray/20">
          <div className="border-b border-warm-gray/20">
            <nav className="flex space-x-4 px-6" aria-label="Settings tabs">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                      ? 'border-sage text-sage'
                      : 'border-transparent text-warm-gray hover:text-navy hover:border-warm-gray/30'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* University Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-navy mb-4">University Profile</h2>
                  <p className="text-warm-gray mb-6">Update your university's information displayed throughout the dashboard.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      University Name
                    </label>
                    <input
                      type="text"
                      value={adminUser?.universityName || ''}
                      disabled
                      className="w-full px-4 py-2 border border-warm-gray/30 rounded-brand bg-gray-50 text-warm-gray cursor-not-allowed"
                    />
                    <p className="text-xs text-warm-gray mt-1">University name cannot be changed.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-warm-gray/30 rounded-brand focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage"
                      placeholder="contact@university.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      University Slug
                    </label>
                    <input
                      type="text"
                      value={adminUser?.universitySlug || ''}
                      disabled
                      className="w-full px-4 py-2 border border-warm-gray/30 rounded-brand bg-gray-50 text-warm-gray cursor-not-allowed"
                    />
                    <p className="text-xs text-warm-gray mt-1">This is your unique identifier and cannot be changed.</p>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="btn-primary px-6 py-2"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Account Security Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-navy mb-4">Account Security</h2>
                  <p className="text-warm-gray mb-6">Update your login credentials and security settings.</p>
                </div>

                {/* Username Section */}
                <div className="bg-light-gray p-6 rounded-brand mb-6">
                  <h3 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Username
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border border-warm-gray/30 rounded-brand focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage"
                        placeholder="Enter username"
                      />
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="btn-primary px-6 py-2"
                    >
                      Update Username
                    </button>
                  </div>
                </div>

                {/* Password Section */}
                <div className="bg-light-gray p-6 rounded-brand">
                  <h3 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-warm-gray/30 rounded-brand focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage"
                        placeholder="Enter current password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-warm-gray/30 rounded-brand focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-warm-gray/30 rounded-brand focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <button
                      onClick={handleChangePassword}
                      disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
                      className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Survey Management Tab */}
            {activeTab === 'survey' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-navy mb-4">Survey Management</h2>
                  <p className="text-warm-gray mb-6">Configure survey settings and manage active surveys.</p>
                </div>

                <div className="bg-light-gray p-6 rounded-brand">
                  <h3 className="text-lg font-semibold text-navy mb-4">Survey Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-brand">
                      <div>
                        <h4 className="font-medium text-navy">Survey Link</h4>
                        <p className="text-sm text-warm-gray mt-1">
                          Share this link with students to take the survey
                        </p>
                      </div>
                      <code className="px-3 py-2 bg-sage/10 text-sage rounded text-sm">
                        /survey/{adminUser?.universitySlug}
                      </code>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-brand">
                      <div>
                        <h4 className="font-medium text-navy">Total Responses</h4>
                        <p className="text-sm text-warm-gray mt-1">
                          Number of completed surveys
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-sage">127</span>
                    </div>

                    <div className="p-4 bg-white rounded-brand">
                      <h4 className="font-medium text-navy mb-2">Survey Status</h4>
                      <p className="text-sm text-warm-gray mb-4">
                        Control whether students can currently access the survey
                      </p>
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span>Survey is active</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data & Export Tab */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-navy mb-4">Data & Export</h2>
                  <p className="text-warm-gray mb-6">Export your survey data and analytics for further analysis.</p>
                </div>

                <div className="bg-light-gray p-6 rounded-brand">
                  <h3 className="text-lg font-semibold text-navy mb-4">Export Analytics</h3>
                  <p className="text-warm-gray mb-4">
                    Download a comprehensive report of all analytics and insights from your dashboard.
                  </p>
                  <button className="btn-primary px-6 py-2 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Analytics Report (PDF)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

