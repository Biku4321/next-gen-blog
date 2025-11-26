
import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";

const SEOAnalyzer = ({ title, content, onScoreUpdate }) => {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    if (!title && !content) return;

    // ✅ Basic SEO scoring logic
    let newScore = 100;
    const issues = [];

    if (!title) {
      newScore -= 15;
      issues.push("Missing title");
    } else if (title.length < 30) {
      newScore -= 10;
      issues.push("Title too short");
    }

    if (!content) {
      newScore -= 40;
      issues.push("No content");
    } else {
      const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
      if (words < 300) {
        newScore -= 20;
        issues.push("Content too short (<300 words)");
      }
      if (!content.toLowerCase().includes("keyword")) {
        newScore -= 10;
        issues.push("No primary keyword found");
      }
    }

    setScore(Math.max(0, newScore));
    setFeedback(issues);
    if (onScoreUpdate) onScoreUpdate(newScore);
  }, [title, content, onScoreUpdate]);

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="w-5 h-5 text-green-500" />
        <h3 className="font-semibold">SEO Analysis</h3>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          Overall SEO Score
        </span>
        <span
          className={`font-bold ${
            score >= 80
              ? "text-green-500"
              : score >= 60
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          {score}/100
        </span>
      </div>

      {feedback.length > 0 ? (
        <ul className="text-sm space-y-1 text-gray-500 dark:text-gray-400">
          {feedback.map((f, i) => (
            <li key={i} className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-blue-500" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-green-600">Excellent SEO! ✅</p>
      )}
    </div>
  );
};

export default SEOAnalyzer;
