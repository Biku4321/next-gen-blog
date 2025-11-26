import React from 'react';
import { Code, Key, Server } from 'lucide-react';

const DeveloperAPI = () => {
  const endpoints = [
    { name: 'GET /api/posts', desc: 'Fetch all public posts.' },
    { name: 'POST /api/posts', desc: 'Create a new post (auth required).' },
    { name: 'GET /api/ai/generate', desc: 'Use AI Assistant to generate content ideas.' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <Code className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Developer API</h1>
        <p className="text-gray-500 dark:text-gray-400">Build integrations and extend BlogPro using our REST API.</p>
      </div>

      <div className="card p-6 rounded-2xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-6 h-6 text-purple-600" />
          <h2 className="text-lg font-semibold">Authentication</h2>
        </div>
        <p className="text-gray-500 text-sm mb-3">Use JWT-based Bearer tokens to authenticate API calls.</p>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm overflow-x-auto">
{`Authorization: Bearer <your_token_here>`}
        </pre>
      </div>

      <div className="card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <Server className="w-6 h-6 text-green-600" />
          <h2 className="text-lg font-semibold">Endpoints</h2>
        </div>
        <ul className="space-y-3 text-sm">
          {endpoints.map((ep, i) => (
            <li key={i}>
              <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{ep.name}</span>
              <p className="text-gray-500 ml-2 inline">{ep.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DeveloperAPI;
