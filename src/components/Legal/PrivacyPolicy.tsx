import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
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
        <h1 className="text-3xl font-bold text-navy font-primary mb-8">Privacy Policy</h1>
        <div className="prose prose-navy font-primary text-warm-gray leading-relaxed">
          <p className="mb-4">
            Interplay is committed to protecting your privacy. This page outlines how we collect, use, and safeguard information.
          </p>
          <p className="mb-4">
            <strong>Student Data:</strong> Survey responses are collected anonymously. We do not collect personally identifiable information from survey participants. All data is handled in accordance with FERPA and applicable privacy regulations.
          </p>
          <p className="mb-4">
            <strong>Institutional Data:</strong> Administrative contact information is used solely to provide service and support for your institution.
          </p>
          <p className="mb-4">
            <strong>Contact:</strong> For privacy inquiries, please contact us at{' '}
            <a href="mailto:hello@brandnewday.group" className="text-sage hover:underline">
              hello@brandnewday.group
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
