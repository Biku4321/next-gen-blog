import React from 'react';
import { Shield } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Your privacy is important to us. This policy explains how we handle your information.
        </p>
      </div>

      <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
          <p>
            We collect personal information such as name, email, and account preferences to provide better services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. How We Use Information</h2>
          <ul className="list-disc list-inside ml-4">
            <li>To personalize your experience</li>
            <li>To improve our AI writing tools and analytics</li>
            <li>To communicate important updates</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Cookies</h2>
          <p>
            BlogPro uses cookies to enhance site navigation, analyze traffic, and improve usability. You may disable cookies via browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
          <p>
            We use encryption and secure cloud infrastructure to protect your data. No system is completely secure, but we take all reasonable measures.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Third-Party Services</h2>
          <p>
            Some AI or analytics features may rely on trusted third-party APIs. These providers have their own privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
          <p>
            You can request data deletion, correction, or export at any time by contacting support@blogpro.ai.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-10">
          Last updated: October 2025
        </p>
      </div>
    </div>
  );
};

export default Privacy;
