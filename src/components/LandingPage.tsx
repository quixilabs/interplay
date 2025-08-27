import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Users, TrendingUp, Shield, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-800">The Growth Index</span>
            </div>
            <Link 
              to="/admin/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Measure Student
            <span className="block text-blue-600">Flourishing</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Comprehensive analytics platform based on the Harvard Flourishing Measure, helping universities 
            track and improve student well-being with actionable insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/survey/demo-university" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center transition-all hover:shadow-lg hover:shadow-blue-500/25"
            >
              Try Demo Survey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/admin/login" 
              className="border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">
            Comprehensive Student Well-Being Analytics
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-8 w-8 text-blue-600" />}
              title="Multi-Domain Assessment"
              description="Measure happiness, health, purpose, relationships, character, and financial stability across 6 core flourishing domains."
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-teal-600" />}
              title="Real-Time Analytics"
              description="Interactive dashboards with demographic analysis, risk assessment, and actionable insights for administrators."
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8 text-orange-600" />}
              title="Growth Opportunities"
              description="Identify intervention points and track improvement over time with detailed progress monitoring."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-green-600" />}
              title="Privacy-First Design"
              description="Anonymous responses with secure data handling and FERPA-compliant privacy protections."
            />
            <FeatureCard
              icon={<CheckCircle className="h-8 w-8 text-purple-600" />}
              title="Evidence-Based"
              description="Built on Harvard's validated Flourishing Measure with proven reliability and academic rigor."
            />
            <FeatureCard
              icon={<ArrowRight className="h-8 w-8 text-red-600" />}
              title="Actionable Insights"
              description="Generate specific recommendations and intervention strategies based on student feedback patterns."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Start Measuring Student Flourishing Today
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join universities nationwide using The Growth Index to improve student outcomes 
            through data-driven well-being initiatives.
          </p>
          <Link 
            to="/survey/demo-university" 
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-xl font-semibold inline-flex items-center transition-colors"
          >
            Experience the Survey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BarChart3 className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold">The Growth Index</span>
          </div>
          <p className="text-slate-400">
            Empowering universities with student flourishing analytics
          </p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200/50">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}