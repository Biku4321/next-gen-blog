// components/DarkModeToggle.jsx
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="relative p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
      aria-label="Toggle dark mode"
    >
      <div className="relative w-6 h-6">
        <Sun className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
          darkMode ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
        }`} />
        <Moon className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
          darkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
        }`} />
      </div>
    </button>
  );
};