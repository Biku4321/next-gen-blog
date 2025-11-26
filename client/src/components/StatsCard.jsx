import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatsCard = ({ title, value, change, icon: Icon, color = "blue" }) => {
  const positive = change >= 0;

  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    red: "from-red-500 to-red-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col justify-between transition hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-xl bg-gradient-to-r text-white shadow-md"
             style={{ background: `linear-gradient(to right, var(--tw-${color}-500), var(--tw-${color}-600))` }}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value || "0"}</p>
        </div>
      </div>

      <div className={`mt-4 flex items-center text-sm font-medium ${positive ? "text-green-600" : "text-red-600"}`}>
        {positive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
        {Math.abs(change)}%
        <span className="text-gray-500 dark:text-gray-400 ml-2">vs last period</span>
      </div>
    </div>
  );
};

export default StatsCard;
