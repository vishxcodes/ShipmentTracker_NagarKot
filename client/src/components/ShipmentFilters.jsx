import React, { useState, useEffect } from 'react';
import { Search, Plus, RefreshCw, X, Filter } from 'lucide-react';
import { SHIPMENT_STATUSES, getStatusConfig } from '../constants/shipmentStatus';

export default function ShipmentFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onCreateClick,
  onRefresh,
  loading = false,
  totalCount = 0,
}) {
  const [searchInput, setSearchInput] = useState(search || '');

  useEffect(() => {
    setSearchInput(search || '');
  }, [search]);

  // 350ms debounce for search query
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== search) {
        onSearchChange(searchInput);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput, search, onSearchChange]);

  const handleClearSearch = () => {
    setSearchInput('');
    onSearchChange('');
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 p-3.5 bg-[#0d1117] border border-[#30363d] rounded-lg">
      {/* Search & Status Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tracking number (e.g. NF2026...)"
            aria-label="Search by tracking number"
            className="w-full bg-[#010409] border border-[#30363d] rounded-md pl-9 pr-8 py-1.5 text-xs text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-colors"
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2.5 top-2 text-[#8b949e] hover:text-[#f0f6fc] p-0.5 rounded"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative min-w-[160px]">
          <div className="absolute left-3 top-2.5 pointer-events-none text-[#8b949e]">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by shipment status"
            className="w-full appearance-none bg-[#010409] border border-[#30363d] rounded-md pl-8 pr-8 py-1.5 text-xs text-[#e6edf3] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-colors cursor-pointer"
          >
            <option value="">All Statuses ({totalCount})</option>
            {SHIPMENT_STATUSES.map((st) => (
              <option key={st} value={st}>
                {getStatusConfig(st).label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-2.5 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-[#8b949e]" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          onClick={onRefresh}
          disabled={loading}
          title="Refresh shipment list"
          aria-label="Refresh shipment list"
          className="p-2 text-[#8b949e] hover:text-[#f0f6fc] bg-[#161b22] hover:bg-[#21262d] rounded-md border border-[#30363d] transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#58a6ff]' : ''}`} />
        </button>

        <button
          onClick={onCreateClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#238636] hover:bg-[#2ea043] text-white border border-[rgba(240,246,252,0.1)] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3fb950]/50"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Shipment</span>
        </button>
      </div>
    </div>
  );
}
