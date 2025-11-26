
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Calendar } from 'lucide-react';

const PostCard = ({ post }) => {
  const date = post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : null;
  
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      className="glass-card rounded-2xl overflow-hidden h-full flex flex-col"
    >
      <Link to={`/posts/${post.slug || post._id}`} className="block">
        <img src={post.image || "https://placehold.co/600x400/eee/ccc?text=No+Image"} alt={post.title} className="w-full h-48 object-cover" />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{post.category}</span>
        <h3 className="text-xl font-bold mt-2 flex-grow">
            <Link to={`/posts/${post.slug || post._id}`} className="hover:text-blue-600 transition-colors">
                {post.title}
            </Link>
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">{post.excerpt}</p>
        
        <div className="border-t border-gray-200 dark:border-slate-700 mt-4 pt-4 flex items-center text-sm text-gray-500">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>{post.author?.username || 'Anonymous'}</span>
          </div>
          <div className="flex items-center ml-auto">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;

