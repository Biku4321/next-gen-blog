import React from 'react';
import { MessageSquare, User, ThumbsUp } from 'lucide-react';

const HelpForum = () => {
  const topics = [
    { id: 1, title: 'How do I use the AI Editor?', author: 'Jane', replies: 5, likes: 12 },
    { id: 2, title: 'Fixing Google OAuth redirect issue', author: 'DevCoder', replies: 3, likes: 8 },
    { id: 3, title: 'How to optimize SEO for my posts?', author: 'Alex', replies: 2, likes: 5 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Help Forum</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Ask questions, share solutions, and learn from the community.
        </p>
      </div>

      <div className="space-y-4">
        {topics.map((topic) => (
          <div key={topic.id} className="card p-4 hover:shadow-lg transition rounded-2xl">
            <h3 className="text-lg font-semibold text-blue-600 mb-1 cursor-pointer hover:underline">
              {topic.title}
            </h3>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> {topic.author}</span>
              <span>{topic.replies} replies</span>
              <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> {topic.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpForum;
