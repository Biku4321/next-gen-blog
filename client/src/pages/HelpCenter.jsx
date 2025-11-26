import React from 'react';
import { HelpCircle, Search, BookOpen, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import FAQSection from '../components/FAQSection.jsx';
import ContactSupport from "../components/ContactSupport.jsx";
const HelpCenter = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <HelpCircle className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Help Center</h1>
        <p className="text-gray-500 dark:text-gray-400">Find answers, tutorials, and community discussions.</p>
      </div>

      {/* Search bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 shadow-sm">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help topics..."
            className="ml-2 w-full bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Link to="/help/forum" className="card p-6 hover:shadow-lg transition-all rounded-2xl">
          <MessageCircle className="w-8 h-8 text-blue-600 mb-3" />
          <h2 className="text-lg font-semibold mb-1">Help Forum</h2>
          <p className="text-gray-500 text-sm">Ask questions and get support from other creators.</p>
        </Link>

        <Link to="/help/videos" className="card p-6 hover:shadow-lg transition-all rounded-2xl">
          <BookOpen className="w-8 h-8 text-purple-600 mb-3" />
          <h2 className="text-lg font-semibold mb-1">Video Tutorials</h2>
          <p className="text-gray-500 text-sm">Watch short tutorials to master BlogPro features.</p>
        </Link>

        <Link to="/community" className="card p-6 hover:shadow-lg transition-all rounded-2xl">
          <HelpCircle className="w-8 h-8 text-green-600 mb-3" />
          <h2 className="text-lg font-semibold mb-1">Community</h2>
          <p className="text-gray-500 text-sm">Collaborate, share tips, and grow together.</p>
        </Link>
      </div>

      {/* FAQ Section */}
          <FAQSection />
          <ContactSupport />
    </div>
  );
};

export default HelpCenter;
