import React from "react";

const CategoryFilter = ({ selected, onSelect }) => {
  const categories = [
    "all",
    "technology",
    "design",
    "business",
    "lifestyle",
    "health",
    "travel",
    "food",
    "other",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            selected === cat
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              : "glass-card hover:bg-white/20 text-gray-700 dark:text-gray-300"
          }`}
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
