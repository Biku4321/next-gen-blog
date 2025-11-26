import React from 'react';
import { Users, Heart, MessageCircle, Share2 } from 'lucide-react';

const posts = [
  { id: 1, user: 'Maya', text: 'Just tried the new AI Editor — it’s insanely good! 🔥', likes: 24, comments: 5 },
  { id: 2, user: 'Leo', text: 'Anyone working on AI-assisted storytelling? Let’s connect.', likes: 18, comments: 3 },
  { id: 3, user: 'Nina', text: 'My blog views doubled using the Analytics dashboard 📈', likes: 30, comments: 7 },
];

const Community = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Community</h1>
        <p className="text-gray-500 dark:text-gray-400">Join the conversation. Share insights, feedback, and ideas.</p>
      </div>

      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p.id} className="card p-5 rounded-2xl hover:shadow-lg transition">
            <div className="font-semibold text-blue-600 mb-1">@{p.user}</div>
            <p className="text-gray-800 dark:text-gray-200 mb-3">{p.text}</p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {p.likes}</span>
              <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {p.comments}</span>
              <span className="flex items-center gap-1"><Share2 className="w-4 h-4" /> Share</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
