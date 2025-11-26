import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'How do I use the AI Editor?',
      a: 'Go to the AI Studio or Editor page and start writing — the AI Assistant will generate suggestions in real-time as you type.',
    },
    {
      q: 'Can I import posts from another platform?',
      a: 'Yes! In your Dashboard, click "Import Content" and upload supported file formats (Markdown, Word, or HTML).',
    },
    {
      q: 'How is my data secured?',
      a: 'We use encryption, HTTPS, and secure cloud storage to protect all user content. You can delete your data anytime under Settings > Privacy.',
    },
    {
      q: 'Is the AI content unique?',
      a: 'Our AI model ensures originality by generating context-aware, non-repetitive text. However, you should still review and edit before publishing.',
    },
    {
      q: 'Where can I report bugs or request features?',
      a: 'You can submit a request in the Help Forum or email us directly at support@blogpro.ai.',
    },
  ];

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <HelpCircle className="w-10 h-10 text-blue-600 mx-auto mb-3" />
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Quick answers to common queries.</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="card cursor-pointer border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <div className="flex justify-between items-center px-5 py-4">
              <h3 className="font-medium">{faq.q}</h3>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-blue-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
            {openIndex === index && (
              <div className="px-5 pb-4 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
