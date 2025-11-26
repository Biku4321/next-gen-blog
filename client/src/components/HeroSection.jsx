// components/HeroSection.jsx
import React from 'react';
import { Clock, User, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                Featured Article
              </span>
              <h1 className="text-hero bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                The Future of Web Development in 2025
              </h1>
              <p className="text-body-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                Discover the latest trends, technologies, and best practices that are shaping the future of web development. From AI integration to modern frameworks.
              </p>
            </div>

            {/* Meta Info */}
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>John Doe</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>8 min read</span>
              </div>
              <span>Dec 15, 2024</span>
            </div>

            {/* CTA Button with neumorphism */}
            <button className="group inline-flex items-center space-x-2 px-8 py-4 bg-white dark:bg-slate-800 shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] dark:shadow-[8px_8px_16px_#0f172a,-8px_-8px_16px_#334155] hover:shadow-[inset_8px_8px_16px_#d1d5db,inset_-8px_-8px_16px_#ffffff] dark:hover:shadow-[inset_8px_8px_16px_#0f172a,inset_-8px_-8px_16px_#334155] rounded-2xl transition-all duration-300">
              <span className="font-semibold">Read Full Article</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Featured Image */}
          <div className="relative">
            <div className="glass-card p-8 rounded-3xl">
              <img 
                src="/api/placeholder/600/400" 
                alt="Featured article"
                className="w-full h-80 object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
