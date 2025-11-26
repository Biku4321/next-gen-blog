import React from "react";
import { motion } from "framer-motion";

const DeveloperForum = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="max-w-6xl mx-auto py-16 px-6"
  >
    <h1 className="text-4xl font-bold mb-6 text-center">Developer Forum</h1>
    <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-10">
      Discuss integrations, share code, and collaborate with fellow developers building on BlogPro’s API.
    </p>
    <div className="glass-card rounded-2xl p-6">
      <p>🧑‍💻 Coming soon: Developer Q&A boards and plugin showcase.</p>
    </div>
  </motion.div>
);

export default DeveloperForum;
