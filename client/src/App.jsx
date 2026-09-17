import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { fetchHealthStatus } from './services/api';

export default function App() {
  const [health, setHealth] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);

  const checkHealth = async () => {
    setHealthLoading(true);
    const healthData = await fetchHealthStatus();
    setHealth(healthData);
    setHealthLoading(false);
  };

  useEffect(() => {
    checkHealth();
    // Auto-poll health status every 30s
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#010409] text-[#e6edf3] selection:bg-[#388bfd]/30 selection:text-[#58a6ff] antialiased font-sans">
      {/* Nagarkot Forwarders Header with Database connection indicator */}
      <Header health={health} loading={healthLoading} onRefresh={checkHealth} />

      {/* Main Operations Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Dashboard health={health} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363d] py-4 bg-[#0d1117] text-xs text-[#8b949e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#c9d1d9]">Nagarkot Forwarders Pvt. Ltd.</span>
            <span>•</span>
            <span>Logistics Operations & Dispatch Tracker</span>
          </div>
          <div className="font-mono text-[11px] text-[#8b949e]">
            Node.js Express API • PostgreSQL + Prisma • React 19 + Tailwind
          </div>
        </div>
      </footer>
    </div>
  );
}
