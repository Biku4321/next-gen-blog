import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex justify-center items-center h-full min-h-[calc(100vh-200px)] text-center p-4">
      <div className="max-w-md">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Something went wrong.</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2 mb-4">
          We're sorry for the inconvenience. Please try refreshing the page.
        </p>
        <pre className="text-xs text-left bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto mb-4">
          {error.message}
        </pre>
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
