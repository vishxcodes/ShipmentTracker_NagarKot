import React from 'react';
import { PackageX, Plus, RotateCcw } from 'lucide-react';

export default function EmptyState({
  title = 'No shipments found',
  message = 'There are no shipments matching your search or status filter.',
  onClearFilters,
  onCreateShipment,
  isFiltered = false,
}) {
  return (
    <div className="p-12 text-center flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center text-[#8b949e] mb-3">
        <PackageX className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-[#f0f6fc]">{title}</h4>
      <p className="text-xs text-[#8b949e] mt-1 max-w-sm">{message}</p>

      <div className="flex items-center gap-3 mt-4">
        {isFiltered && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] border border-[#30363d] transition-colors focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}

        {onCreateShipment && (
          <button
            onClick={onCreateShipment}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-[#238636] hover:bg-[#2ea043] text-white font-medium transition-colors border border-[#2ea043]/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#238636]/40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Shipment</span>
          </button>
        )}
      </div>
    </div>
  );
}
