import React, { useState } from 'react';
import { Copy, Check, ChevronRight, ArrowRight, MapPin } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate, formatWeight, copyToClipboard } from '../utils/formatters';

export default function ShipmentRow({ shipment, onSelectDetails }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    const success = await copyToClipboard(shipment.trackingNumber);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Desktop Table Row */}
      <tr 
        onClick={() => onSelectDetails(shipment.trackingNumber)}
        className="hidden md:table-row border-b border-[#21262d] hover:bg-[#161b22] transition-colors cursor-pointer group"
      >
        {/* Tracking Number with Copy button */}
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-[#58a6ff] group-hover:underline">
              {shipment.trackingNumber}
            </span>
            <button
              onClick={handleCopy}
              title="Copy tracking number"
              aria-label={`Copy tracking number ${shipment.trackingNumber}`}
              className="p-1 text-[#8b949e] hover:text-[#f0f6fc] rounded hover:bg-[#21262d] transition-colors focus:outline-none focus:ring-1 focus:ring-[#58a6ff]/40"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#3fb950]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <span className="text-[11px] text-[#8b949e] block truncate max-w-[150px]" title={shipment.packageDescription}>
            {shipment.packageDescription || 'General Cargo'}
          </span>
        </td>

        {/* Sender */}
        <td className="py-3 px-4 text-xs text-[#c9d1d9] font-medium">
          {shipment.senderName || '—'}
        </td>

        {/* Receiver */}
        <td className="py-3 px-4 text-xs text-[#c9d1d9] font-medium">
          {shipment.receiverName || '—'}
        </td>

        {/* Route: Origin -> Destination */}
        <td className="py-3 px-4 text-xs text-[#c9d1d9]">
          <div className="flex items-center gap-1.5 font-medium">
            <span>{shipment.origin || '—'}</span>
            <ArrowRight className="w-3 h-3 text-[#8b949e] flex-shrink-0" />
            <span className="text-[#f0f6fc]">{shipment.destination || '—'}</span>
          </div>
          <span className="text-[11px] text-[#8b949e]">
            {formatWeight(shipment.weight)}
          </span>
        </td>

        {/* Status */}
        <td className="py-3 px-4">
          <StatusBadge status={shipment.status} />
        </td>

        {/* Created Date */}
        <td className="py-3 px-4 text-xs text-[#8b949e] font-mono">
          {formatDate(shipment.createdAt, false)}
        </td>

        {/* Action: Details */}
        <td className="py-3 px-4 text-right">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectDetails(shipment.trackingNumber);
            }}
            aria-label={`View details for ${shipment.trackingNumber}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] transition-colors focus:outline-none focus:ring-2 focus:ring-[#58a6ff]/40"
          >
            <span>Details</span>
            <ChevronRight className="w-3 h-3 text-[#8b949e]" />
          </button>
        </td>
      </tr>

      {/* Mobile Card Layout (visible on mobile only) */}
      <tr className="md:hidden border-b border-[#21262d]">
        <td colSpan={7} className="p-3">
          <div
            onClick={() => onSelectDetails(shipment.trackingNumber)}
            className="p-3.5 rounded-lg bg-[#0d1117] border border-[#30363d] hover:border-[#8b949e]/60 transition-colors cursor-pointer space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-[#58a6ff]">
                  {shipment.trackingNumber}
                </span>
                <button
                  onClick={handleCopy}
                  title="Copy tracking number"
                  className="p-1 text-[#8b949e] hover:text-[#f0f6fc] rounded"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-[#3fb950]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <StatusBadge status={shipment.status} size="sm" />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#c9d1d9]">
              <MapPin className="w-3.5 h-3.5 text-[#8b949e] flex-shrink-0" />
              <span>{shipment.origin || '—'}</span>
              <ArrowRight className="w-3 h-3 text-[#8b949e]" />
              <span className="font-semibold text-[#f0f6fc]">{shipment.destination || '—'}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#8b949e] pt-1 border-t border-[#21262d]">
              <div className="truncate max-w-[200px]">
                To: <span className="text-[#c9d1d9]">{shipment.receiverName || '—'}</span> • {formatWeight(shipment.weight)}
              </div>
              <span className="text-[#58a6ff] flex items-center gap-0.5 font-medium">
                View <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
