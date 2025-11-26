import React from "react";

const AudienceInsights = ({ audience }) => {
  if (!audience?.demographics)
    return <p>No audience data available.</p>;

  const { age, location } = audience.demographics;

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-xl font-semibold mb-4">Audience Insights</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Age Distribution</h4>
          {Object.entries(age).map(([range, value]) => (
            <div key={range} className="flex items-center justify-between text-sm mb-1">
              <span>{range}</span>
              <span>{value}%</span>
            </div>
          ))}
        </div>
        <div>
          <h4 className="font-semibold mb-2 mt-4">Top Locations</h4>
          {Object.entries(location).map(([country, value]) => (
            <div key={country} className="flex items-center justify-between text-sm mb-1">
              <span>{country}</span>
              <span>{value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudienceInsights;
