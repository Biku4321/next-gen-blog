import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-full min-h-[calc(100vh-200px)]">
      <div className="flex flex-col items-center space-y-2">
        <Loader className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
