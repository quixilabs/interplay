import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Users, TrendingUp, Shield, ArrowRight, CheckCircle, Sparkles, X, Mail, Calendar, HelpCircle } from 'lucide-react';

const CONTACT_EMAIL = 'hello@brandnewday.group';
const CALENDLY_URL = 'https://calendly.com/artworksinc/brand-new-day';

export default function LandingPage() {
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);
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
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-4 py-2"
            >
              Schedule a Demo
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="relative px-4 py-20 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy font-primary mb-6">
            Measure What Matters
            {/* <span className="block text-navy font-primary">Drive Better Outcomes.</span> */}
          </h1>
          <p className="text-xl text-warm-gray font-primary mb-8 max-w-3xl mx-auto leading-relaxed">
            Interplay turns student voice into early insights—so colleges can strengthen the foundations that prepare students for what’s next.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-4 rounded-brand flex items-center justify-center text-lg font-semibold"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Schedule a Demo
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20">
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
        </div>
      </section>

      {/* Mid-Page Contact Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="card p-8 sm:p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy font-primary mb-4">
              Ready to Transform Student Well-Being at Your Institution?
            </h2>
            <p className="text-warm-gray font-primary mb-8 max-w-2xl mx-auto">
              See how Interplay can help your institution measure and improve student flourishing. Schedule a personalized demo or learn more about our evidence-based approach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-8 py-4 rounded-brand flex items-center justify-center text-lg font-semibold w-full sm:w-auto"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule a Demo
              </a>
              <button
                type="button"
                onClick={() => setShowLearnMoreModal(true)}
                className="btn-subtle px-6 py-3 rounded-brand inline-flex items-center w-full sm:w-auto justify-center"
              >
                <HelpCircle className="mr-2 h-5 w-5" />
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Learn More Modal */}
      {showLearnMoreModal && (
        <LearnMoreModal onClose={() => setShowLearnMoreModal(false)} />
      )}

      {/* Footer */}
      <footer className="bg-navy text-white/80 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Left: Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <BarChart3 className="h-8 w-8 text-sage" />
                <span className="text-xl font-semibold font-primary text-white">Interplay</span>
              </div>
              <p className="text-white/80 font-primary text-sm leading-relaxed mb-4">
                Measure What Matters. Interplay turns youth perspectives into actionable insights for universities, colleges, and youth organizations.
              </p>
              <p className="text-white/50 text-sm font-primary">
                © {new Date().getFullYear()} Interplay. All rights reserved.
              </p>
            </div>

            {/* Center: Quick Links */}
            <div>
              <h4 className="text-white font-semibold font-primary mb-4 text-sm uppercase tracking-wider">
                Quick Links
              </h4>
              <nav className="space-y-3">
                <Link to="/#about" className="block text-white/80 hover:text-sage font-primary text-sm transition-colors">
                  About
                </Link>
                <Link to="/#features" className="block text-white/80 hover:text-sage font-primary text-sm transition-colors">
                  Features
                </Link>
                <Link to="/#contact" className="block text-white/80 hover:text-sage font-primary text-sm transition-colors">
                  Contact
                </Link>
                <Link to="/privacy" className="block text-white/80 hover:text-sage font-primary text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="block text-white/80 hover:text-sage font-primary text-sm transition-colors">
                  Terms of Service
                </Link>
                <Link to="/admin/login" className="block text-white/40 hover:text-white/60 font-primary text-sm transition-colors mt-4">
                  Admin Login
                </Link>
              </nav>
            </div>

            {/* Right: Contact Info */}
            <div>
              <h4 className="text-white font-semibold font-primary mb-4 text-sm uppercase tracking-wider">
                Contact
              </h4>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 text-white/80 hover:text-sage font-primary text-sm transition-colors mb-2"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                {CONTACT_EMAIL}
              </a>
              <p className="text-white/60 font-primary text-sm mt-4">
                Institutional inquiries and demo requests welcome.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LearnMoreModal({ onClose }: { onClose: () => void }) {
  const faqs = [
    {
      q: 'What is Interplay?',
      a: 'Interplay is a flourishing analytics platform that helps universities, colleges, and youth organizations measure well-being using Harvard\'s validated Flourishing Measure. We turn anonymous survey responses into real-time dashboards and actionable insights.',
    },
    {
      q: 'Who is it for?',
      a: 'Interplay serves universities, colleges, Scout troops, youth camps, community programs, and any organization focused on youth well-being. Our framework scales from campus wellness initiatives to troop-level assessments.',
    },
    {
      q: 'How does a demo work?',
      a: 'Schedule a demo and we\'ll walk you through the platform, show sample dashboards, and discuss how Interplay can be tailored to your institution\'s needs. Demos typically take 30–45 minutes.',
    },
    {
      q: 'Is student data private?',
      a: 'Yes. Interplay is FERPA-compliant with anonymous responses and secure data handling. We never collect personally identifiable information from survey participants.',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="learn-more-title"
    >
      <div
        className="bg-white rounded-brand shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 id="learn-more-title" className="text-xl font-bold text-navy font-primary">
              Learn More About Interplay
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-warm-gray hover:text-navy rounded-brand transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="font-semibold text-navy font-primary mb-2">{faq.q}</h3>
                <p className="text-warm-gray font-primary text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-6 py-3 rounded-brand inline-flex items-center text-sm font-semibold"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Schedule a Demo
            </a>
          </div>
        </div>
      </div>
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