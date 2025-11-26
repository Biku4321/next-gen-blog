import React from "react";

const TrendingTopics = () => {
  const topics = ["AI Tools", "Web Dev", "Design Trends", "React 19", "Tech Careers"];
  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-xl font-bold mb-4">🔥 Trending Topics</h3>
      <ul className="space-y-2">
        {topics.map((topic) => (
          <li
            key={topic}
            className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all"
          >
            #{topic}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingTopics;
