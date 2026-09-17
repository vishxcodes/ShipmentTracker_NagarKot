import React from 'react';

export default function MetricCard({
  label,
  value,
  icon: Icon,
  description,
  accentColor = 'text-[#58a6ff]',
  badgeColor = 'bg-[#1f6feb]/15 text-[#58a6ff] border-[#1f6feb]/35',
  onClick,
  active = false,
}) {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border transition-all ${
        active
          ? 'bg-[#161b22] border-[#58a6ff] ring-1 ring-[#58a6ff]/40 shadow-sm'
          : 'bg-[#0d1117] border-[#30363d] hover:border-[#8b949e]/60'
      } ${isClickable ? 'cursor-pointer hover:bg-[#161b22]' : ''}`}
    >
      <div className="flex items-center justify-between text-[#8b949e]">
        <span className="text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <div className={`p-1.5 rounded-md border ${badgeColor}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="text-2xl sm:text-3xl font-bold text-[#f0f6fc] font-mono mt-2 tracking-tight">
        {value !== undefined && value !== null ? value : '—'}
      </div>

      {description && (
        <p className="text-[11px] text-[#8b949e] mt-1 truncate">
          {description}
        </p>
      )}
    </div>
  );
}
