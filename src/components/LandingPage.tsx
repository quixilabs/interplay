import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Users, TrendingUp, Shield, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-light-gray">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-brand border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-navy" />
              <span className="text-xl font-bold text-navy font-primary">Interplay</span>
            </div>
            <Link
              to="/admin/login"
              className="btn-primary px-4 py-2"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy font-primary mb-6">
            Evidence-Based
            <span className="block text-sage font-secondary italic">Student Success</span>
          </h1>
          <p className="text-xl text-warm-gray font-primary mb-8 max-w-3xl mx-auto leading-relaxed">
            Comprehensive analytics platform helping universities track and improve student well-being
            through data-driven insights and evidence-based interventions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/survey/saint-louis-university"
              className="btn-primary px-8 py-4 rounded-brand flex items-center justify-center text-lg font-semibold"
            >
              Saint Louis University Survey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/survey/demo-university"
              className="btn-secondary px-8 py-4 rounded-brand flex items-center justify-center"
            >
              Try Demo Survey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/admin/login"
              className="btn-subtle px-6 py-3 rounded-brand"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-navy font-primary mb-16">
            Comprehensive Student Well-Being Analytics
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-8 w-8 text-sage" />}
              title="Multi-Domain Assessment"
              description="Measure happiness, health, purpose, relationships, character, and financial stability across 6 core flourishing domains."
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-info" />}
              title="Real-Time Analytics"
              description="Interactive dashboards with demographic analysis, risk assessment, and actionable insights for administrators."
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8 text-success" />}
              title="Growth Opportunities"
              description="Identify intervention points and track improvement over time with detailed progress monitoring."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-success" />}
              title="Privacy-First Design"
              description="Anonymous responses with secure data handling and FERPA-compliant privacy protections."
            />
            <FeatureCard
              icon={<CheckCircle className="h-8 w-8 text-navy" />}
              title="Evidence-Based"
              description="Built on Harvard's validated Flourishing Measure with proven reliability and academic rigor."
            />
            <FeatureCard
              icon={<ArrowRight className="h-8 w-8 text-sage" />}
              title="Actionable Insights"
              description="Generate specific recommendations and intervention strategies based on student feedback patterns."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-navy to-sage py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Start Measuring Student Flourishing Today
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-primary">
            Join universities nationwide using Interplay to improve student outcomes
            through data-driven well-being initiatives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/survey/saint-louis-university"
              className="bg-white hover:bg-gray-100 text-navy px-8 py-4 rounded-brand font-semibold inline-flex items-center transition-colors"
            >
              Saint Louis University Survey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/survey/demo-university"
              className="bg-white/80 hover:bg-white text-navy px-8 py-4 rounded-brand font-semibold inline-flex items-center transition-colors"
            >
              Try Demo Survey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BarChart3 className="h-6 w-6 text-sage" />
            <span className="text-lg font-semibold font-primary">Interplay</span>
          </div>
          <p className="text-white/60 font-primary">
            Evidence-Based Student Success
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
    <div className="card p-6 hover:shadow-xl transition-shadow">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-navy font-primary mb-3">{title}</h3>
      <p className="text-warm-gray font-primary leading-relaxed">{description}</p>
    </div>
  );
}