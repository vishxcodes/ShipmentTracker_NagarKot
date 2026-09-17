import React, { useMemo } from 'react';
import { MapPin, FileText, Clock } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/formatters';

export default function StatusTimeline({ history = [] }) {
  // Guarantee chronological oldest-to-newest order based on createdAt timestamp
  const sortedHistory = useMemo(() => {
    if (!Array.isArray(history)) return [];
    return [...history].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime() || 0;
      const timeB = new Date(b.createdAt).getTime() || 0;
      return timeA - timeB;
    });
  }, [history]);

  if (sortedHistory.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-[#8b949e] bg-[#0d1117] rounded-lg border border-[#30363d]">
        No status history recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#30363d]">
      {sortedHistory.map((entry, index) => {
        const isLatest = index === sortedHistory.length - 1;

        return (
          <div key={entry.id || `${entry.status}-${index}`} className="relative group">
            {/* Timeline Dot */}
            <span
              className={`absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-transform ${
                isLatest
                  ? 'bg-[#1f6feb] border-[#58a6ff] ring-4 ring-[#1f6feb]/25 scale-110'
                  : 'bg-[#0d1117] border-[#30363d]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isLatest ? 'bg-white' : 'bg-[#8b949e]'}`} />
            </span>

            {/* Content Container */}
            <div className={`p-3 rounded-lg border transition-colors ${
              isLatest 
                ? 'bg-[#161b22] border-[#30363d]' 
                : 'bg-[#0d1117] border-[#21262d]'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={entry.status} size="sm" />
                  {isLatest && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#1f6feb]/20 text-[#58a6ff] border border-[#1f6feb]/40">
                      Current
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[#8b949e] font-mono">
                  <Clock className="w-3 h-3 text-[#8b949e]" />
                  <span>{formatDate(entry.createdAt, true)}</span>
                </div>
              </div>

              {/* Location */}
              {entry.location && (
                <div className="flex items-center gap-1.5 text-xs text-[#c9d1d9] mt-2 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#58a6ff] flex-shrink-0" />
                  <span>{entry.location}</span>
                </div>
              )}

              {/* Note */}
              {entry.note && (
                <div className="flex items-start gap-1.5 text-xs text-[#8b949e] mt-1.5 bg-[#0d1117] p-2 rounded border border-[#30363d]">
                  <FileText className="w-3.5 h-3.5 text-[#8b949e] flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{entry.note}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
