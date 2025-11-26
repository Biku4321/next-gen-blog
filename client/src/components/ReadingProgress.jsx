import React, { useState, useEffect } from "react";

/**
 * ReadingProgress - defensive, safe
 * Accepts: targetRef (React ref to the main article container)
 * Calculates estimated read time (minutes) and progress %
 */

const ReadingProgress = ({ targetRef }) => {
  const [progress, setProgress] = useState(0);
  const [readTime, setReadTime] = useState(0);

  useEffect(() => {
    const targetElement = targetRef?.current;
    if (!targetElement || typeof targetElement.textContent !== "string") {
      setReadTime(0);
      setProgress(0);
      return;
    }

    const calculateReadTime = () => {
      try {
        const textContent = (targetElement.textContent || "").toString().trim();
        if (!textContent) return 0;
        // average reading speed ~200-220 words per minute
        const wordCount = textContent.split(/\s+/).filter(Boolean).length;
        const minutes = Math.max(1, Math.round(wordCount / 200)); // at least 1 minute
        return minutes;
      } catch {
        return 0;
      }
    };

    setReadTime(calculateReadTime());

    const handleScroll = () => {
      const el = targetRef?.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const top = rect.top;
      const height = rect.height;
      const windowHeight = window.innerHeight;
      const scrollableDistance = height - windowHeight;
      if (scrollableDistance <= 0) {
        setProgress(top < 0 ? 100 : 0);
        return;
      }
      const scrolled = Math.min(Math.max(-top, 0), scrollableDistance);
      const percent = (scrolled / scrollableDistance) * 100;
      setProgress(Math.max(0, Math.min(100, percent)));
    };

    // initial calc
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [targetRef]);

  if (!targetRef?.current || readTime === 0) return null;

  return (
    <>
      <div className="fixed top-20 left-0 w-full h-1.5 bg-gray-200/50 dark:bg-slate-700/50 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="fixed bottom-8 right-8 glass-card px-4 py-2 rounded-full shadow-lg">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {readTime} min read • {Math.round(progress)}%
        </span>
      </div>
    </>
  );
};

export default ReadingProgress;
