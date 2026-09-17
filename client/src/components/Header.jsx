import React from 'react';
import { Truck, RefreshCw, Database } from 'lucide-react';

export default function Header({ health, loading, onRefresh }) {
  const isConnected = health?.status === 'ok' && health?.database?.status === 'connected';

  return (
    <header className="border-b border-[#30363d] bg-[#0d1117] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Company Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#58a6ff]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#f0f6fc] tracking-tight text-base">
                  Nagarkot Forwarders
                </span>
                <span className="text-[11px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-[#161b22] text-[#8b949e] border border-[#30363d]">
                  Pvt. Ltd.
                </span>
              </div>
              <p className="text-xs text-[#8b949e]">
                Shipment Status Tracker
              </p>
            </div>
          </div>

          {/* System Health / Connectivity Status */}
          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
              isConnected
                ? 'bg-[#238636]/15 text-[#3fb950] border-[#238636]/40'
                : 'bg-[#da3633]/15 text-[#f85149] border-[#da3633]/40'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-[#3fb950] animate-pulse' : 'bg-[#f85149]'
              }`} />
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>
                  {isConnected
                    ? `PostgreSQL (${health?.database?.name || 'shipment_tracker'})`
                    : 'DB Disconnected'}
                </span>
                {isConnected && health?.database?.responseTimeMs !== undefined && (
                  <span className="text-[10px] text-[#3fb950] font-mono">
                    {health.database.responseTimeMs}ms
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onRefresh}
              disabled={loading}
              title="Refresh connection status"
              aria-label="Refresh connection status"
              className="p-2 text-[#8b949e] hover:text-[#f0f6fc] bg-[#161b22] hover:bg-[#21262d] rounded-md border border-[#30363d] transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/40"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#58a6ff]' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
