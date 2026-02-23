"use client";

import { useFetch } from "@/hooks/useFetch";

export default function DashboardPage() {
  const { data, loading, error } = useFetch("/health");

  return (
    <div className="py-16">
      <div className="text-white bg-slate-800 p-8 rounded-lg">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-700 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">API Status</h2>
            {loading && <p className="text-gray-300">Loading...</p>}
            {error && <p className="text-red-400">Error: {error}</p>}
            {data && (
              <div className="text-gray-300">
                <p>Status: <span className="text-green-400 font-semibold">{data.status}</span></p>
                <p>Database: <span className="text-green-400 font-semibold">{data.database}</span></p>
              </div>
            )}
          </div>

          <div className="bg-slate-700 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
            <ul className="text-gray-300">
              <li>Users: <span className="text-blue-400">--</span></li>
              <li>Active Sessions: <span className="text-blue-400">0</span></li>
              <li>API Uptime: <span className="text-green-400">100%</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
