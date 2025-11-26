// components/Sidebar.jsx
import React from 'react';
import { Search, Mail, Tag, TrendingUp } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-80 space-y-8 sticky top-24">
      {/* Search Widget */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-h4 mb-4">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-h4 mb-4 flex items-center">
          <Tag className="w-5 h-5 mr-2" />
          Categories
        </h3>
        <div className="space-y-3">
          {['Web Development', 'UI/UX Design', 'JavaScript', 'React', 'Node.js'].map((category) => (
            <a key={category} href={`/category/${category.toLowerCase()}`} 
               className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <span>{category}</span>
              <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">12</span>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div className="glass-card p-6 rounded-2xl">
        <h3 className="text-h4 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Recent Posts
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <a key={item} href="#" className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <img src="/api/placeholder/60/60" alt="" className="w-15 h-15 rounded-lg object-cover" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Building Modern React Applications</h4>
                <p className="text-xs text-gray-500">Dec 10, 2024</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="text-center space-y-4">
          <Mail className="w-12 h-12 mx-auto text-blue-600" />
          <h3 className="text-h4">Stay Updated</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get the latest articles delivered to your inbox
          </p>
          <div className="space-y-3">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
            <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
