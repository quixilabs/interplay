import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-light-gray">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center text-warm-gray hover:text-navy font-primary text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-navy font-primary mb-8">Terms of Service</h1>
        <div className="prose prose-navy font-primary text-warm-gray leading-relaxed">
          <p className="mb-4">
            By using Interplay, you agree to these terms of service. Interplay is provided for institutions and organizations to measure student and youth flourishing.
          </p>
          <p className="mb-4">
            <strong>Use of Service:</strong> Institutions are responsible for obtaining appropriate consent and ensuring compliance with local regulations when administering surveys.
          </p>
          <p className="mb-4">
            <strong>Data Ownership:</strong> Institutions retain ownership of their data. Interplay processes data solely to provide analytics and insights.
          </p>
          <p className="mb-4">
            <strong>Contact:</strong> For questions about these terms, please contact us at{' '}
            <a href="mailto:hello@interplay.quixilabs.com" className="text-sage hover:underline">
              hello@interplay.quixilabs.com
            </a>
            .
          </p>
          <p className="text-sm text-warm-gray/80">
            Last updated: {new Date().toLocaleDateString('en-US')}
          </p>
        </div>
      </div>
    </div>
  );
}
