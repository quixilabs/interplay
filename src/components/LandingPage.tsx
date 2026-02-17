import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Users, TrendingUp, Shield, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

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
            Your Voice
            <span className="block text-navy font-primary">Matters</span>
          </h1>
          <p className="text-xl text-warm-gray font-primary mb-8 max-w-3xl mx-auto leading-relaxed">
            Interplay turns youth perspectives into a real-time measure of flourishing—helping universities, colleges, and youth organizations like Scouts identify hidden tensions across happiness, health, purpose, relationships, character, and stability, then translate them into strategies that drive success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/survey/demo-university"
              className="btn-primary px-8 py-4 rounded-brand flex items-center justify-center text-lg font-semibold"
            >
              Take a demo survey
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
          <h2 className="text-3xl font-bold text-center text-navy font-primary mb-4">
            Comprehensive Student & Youth Well-Being Analytics
          </h2>
          <p className="text-center text-warm-gray font-primary mb-16 max-w-2xl mx-auto">
            Built for universities, colleges, and youth organizations—from campus wellness programs to Scout troops and community youth groups.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-8 w-8 text-sage" />}
              title="Multi-Domain Assessment"
              description="Assess student well-being across six flourishing domains—happiness, health, purpose, relationships, character, and stability—using Harvard’s validated framework as the foundation."
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8 text-info" />}
              title="Real-Time Analytics"
              description="Go beyond static reports. Interplay delivers interactive dashboards that reveal patterns and tensions across flourishing domains, segmented by demographics, programs, and cohorts."
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8 text-success" />}
              title="Growth Opportunities"
              description="Pinpoint areas where students struggle most, then monitor progress over time. Interplay connects well-being data directly to outcomes like engagement, retention, and student success."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-success" />}
              title="Privacy-First Design"
              description="FERPA-compliant, anonymous responses and secure data handling ensure trust and integrity for universities, youth organizations, and participants alike."
            />
            <FeatureCard
              icon={<CheckCircle className="h-8 w-8 text-navy" />}
              title="Evidence-Based"
              description="Grounded in Harvard’s Flourishing Measure, Interplay integrates global research with institutional data, applying proven reliability and academic rigor—for higher education, Scout troops, and youth programs."
            />
            <FeatureCard
              icon={<ArrowRight className="h-8 w-8 text-sage" />}
              title="Actionable Insights"
              description="What makes Interplay different: our proprietary Flourishing Intelligence™ closes the loop—translating student voice into prioritized, evidence-based strategies tailored to your university’s resources."
            />
          </div>
        </div>
      </section>

      {/* Youth Organizations Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="h-10 w-10 text-sage mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-navy font-primary mb-6">
            For Youth Organizations: Scouts, Troops & Community Programs
          </h2>
          <p className="text-xl text-warm-gray font-primary mb-8 leading-relaxed">
            Interplay isn’t just for universities. Scout troops, youth clubs, camps, and community programs can measure member flourishing with the same Harvard-validated framework—anonymous surveys, real-time insights, and actionable strategies tailored to your organization’s resources.
          </p>
          <ul className="text-left max-w-2xl mx-auto text-warm-gray font-primary space-y-3 mb-8">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-6 w-6 text-sage flex-shrink-0 mt-0.5" />
              <span><strong className="text-navy">Scout troops</strong>—track youth well-being and growth across patrols and programs</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-6 w-6 text-sage flex-shrink-0 mt-0.5" />
              <span><strong className="text-navy">Youth camps & clubs</strong>—understand what drives belonging and thriving</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-6 w-6 text-sage flex-shrink-0 mt-0.5" />
              <span><strong className="text-navy">Community programs</strong>—evidence-based data for grants and improvement</span>
            </li>
          </ul>
          <Link
            to="/survey/demo-university"
            className="btn-primary px-6 py-3 rounded-brand inline-flex items-center"
          >
            Try the demo survey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-navy to-sage py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Start Measuring Flourishing Today
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-primary">
            Join universities, colleges, and youth organizations using Interplay to improve outcomes through data-driven well-being initiatives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/survey/demo-university"
              className="bg-white hover:bg-gray-100 text-navy px-8 py-4 rounded-brand font-semibold inline-flex items-center transition-colors"
            >
              Take a demo survey
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
            Your Voice Matters
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