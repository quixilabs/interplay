import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Lock, Mail, BarChart3, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { isAuthenticated, login } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);

    if (!success) {
      setError('Invalid credentials. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <BarChart3 className="h-10 w-10 text-navy" />
            <span className="text-2xl font-bold text-navy font-primary">Interplay</span>
          </div>
          <h2 className="text-3xl font-bold text-navy font-primary">
            Admin Dashboard Login
          </h2>
          <p className="mt-2 text-sm text-warm-gray font-primary">
            Access your university's student success analytics
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-sage/10 border border-sage/30 rounded-brand p-4">
          <h3 className="text-sm font-semibold text-navy font-primary mb-3">Demo Credentials:</h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-navy font-primary">Demo University:</p>
              <p className="text-sm text-warm-gray font-primary">Email: admin@university.edu</p>
              <p className="text-sm text-warm-gray font-primary">Password: demo123</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6 card p-8" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-danger/10 border border-danger/30 rounded-brand p-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-danger mr-2" />
              <span className="text-sm text-danger font-primary">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-navy font-primary">
                Email Address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-warm-gray" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 text-navy font-primary rounded-brand focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-navy font-primary">
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-warm-gray" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 text-navy font-primary rounded-brand focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm rounded-brand focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}