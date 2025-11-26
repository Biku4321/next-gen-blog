import React from "react";
import { motion } from "framer-motion";

const ContentPolicy = () => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-5xl mx-auto py-16 px-6 text-gray-700 dark:text-gray-300"
  >
    <h1 className="text-4xl font-bold mb-6 text-center">Content Policy</h1>
    <p className="mb-4">
      Our goal is to maintain a safe and respectful environment for creators and readers.  
      We prohibit content that promotes hate, misinformation, or illegal activity.
    </p>
    <ul className="list-disc pl-6 space-y-2">
      <li>No plagiarism or copied material.</li>
      <li>No discriminatory or harmful speech.</li>
      <li>Respect copyright and privacy laws.</li>
      <li>Disclose use of AI tools clearly when applicable.</li>
    </ul>
    <p className="mt-6 text-sm text-gray-500">
      Updated: {new Date().toLocaleDateString()}
    </p>
  </motion.section>
);

export default ContentPolicy;
