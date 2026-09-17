import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ShipmentRow from './ShipmentRow';

export default function ShipmentTable({
  shipments = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange,
  onSelectDetails,
}) {
  const { page, totalPages, total, limit } = pagination;

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="rounded-lg border border-[#30363d] bg-[#0d1117] overflow-hidden">
      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="hidden md:table-header-group bg-[#161b22] border-b border-[#30363d] text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider">
            <tr>
              <th scope="col" className="py-3 px-4">Tracking Number</th>
              <th scope="col" className="py-3 px-4">Sender</th>
              <th scope="col" className="py-3 px-4">Receiver</th>
              <th scope="col" className="py-3 px-4">Route & Weight</th>
              <th scope="col" className="py-3 px-4">Status</th>
              <th scope="col" className="py-3 px-4">Created Date</th>
              <th scope="col" className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#21262d]">
            {shipments.map((shipment) => (
              <ShipmentRow
                key={shipment.id || shipment.trackingNumber}
                shipment={shipment}
                onSelectDetails={onSelectDetails}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 bg-[#0d1117] border-t border-[#30363d] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#8b949e]">
        <div>
          Showing <span className="font-mono text-[#f0f6fc]">{startItem}</span> to{' '}
          <span className="font-mono text-[#f0f6fc]">{endItem}</span> of{' '}
          <span className="font-mono text-[#f0f6fc]">{total}</span> shipments
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="mr-2 text-[#8b949e] font-mono">
            Page {page} of {Math.max(1, totalPages)}
          </span>

          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/40"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/40"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
