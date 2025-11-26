import React from 'react';
import { FileText } from 'lucide-react';

const Terms = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Please read these terms carefully before using BlogPro.
        </p>
      </div>

      <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            By using BlogPro, you agree to comply with these Terms of Service. If you do not agree, you may not use the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. User Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Content Ownership</h2>
          <p>
            You retain ownership of your original content but grant BlogPro a license to host and display it. You agree not to post illegal or harmful material.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Prohibited Activities</h2>
          <ul className="list-disc list-inside ml-4">
            <li>Spamming or distributing malicious content</li>
            <li>Impersonating others</li>
            <li>Using AI-generated content deceptively</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate these terms or engage in abusive behavior.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. Updates</h2>
          <p>
            BlogPro may modify these terms at any time. Continued use of the platform implies acceptance of changes.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-10">
          Last updated: October 2025
        </p>
      </div>
    </div>
  );
};

export default Terms;
