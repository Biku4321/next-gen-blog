import React from "react";
import { motion } from "framer-motion";

const BloggerBuzz = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="max-w-6xl mx-auto py-16 px-6"
  >
    <h1 className="text-4xl font-bold mb-6 text-center">Blogger Buzz</h1>
    <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-10">
      Stay updated with the latest blogging tips, creator spotlights, and community stories.
    </p>
    <div className="grid md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="glass-card p-5 rounded-xl">
          <h3 className="font-semibold text-xl mb-2">Featured Story #{i}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">New features, events, and creative highlights.</p>
        </div>
      ))}
    </div>
  </motion.div>
);

export default BloggerBuzz;
