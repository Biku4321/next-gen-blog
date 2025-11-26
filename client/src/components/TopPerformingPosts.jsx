import React from "react";
import { Eye, Heart, MessageCircle } from "lucide-react";

const TopPerformingPosts = ({ posts = [] }) => {
  if (!posts.length) return <p>No top posts found.</p>;

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-xl font-semibold mb-4">Top Performing Posts</h3>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li
            key={post.id}
            className="p-4 bg-white/10 dark:bg-gray-800/30 rounded-xl hover:bg-white/20 transition"
          >
            <h4 className="font-semibold mb-1">{post.title}</h4>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {post.views}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" /> {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" /> {post.comments}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopPerformingPosts;
