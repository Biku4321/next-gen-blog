import React from "react";

const StatsCounter = () => {
  const stats = [
    { label: "Active Writers", value: "1.2K+" },
    { label: "Published Articles", value: "3.4K+" },
    { label: "Monthly Readers", value: "25K+" },
  ];

  return (
    <div className="flex justify-center gap-10 mt-8">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {stat.value}
          </div>
          <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCounter;
