import React from "react";

const PlanSubscriptions: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Active Subscriptions</h2>
      <p className="text-gray-600">List of tenants subscribed to this plan will appear here.</p>
    </div>
  );
};

export default PlanSubscriptions;
