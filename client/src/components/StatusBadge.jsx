import React from 'react';
import { getStatusConfig } from '../constants/shipmentStatus';

export default function StatusBadge({ status, size = 'sm', className = '' }) {
  const config = getStatusConfig(status);

  const sizeClasses = size === 'sm' 
    ? 'px-2.5 py-0.5 text-xs' 
    : 'px-3 py-1 text-sm font-medium';

  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.badgeClass} ${sizeClasses} ${className}`}
      title={config.description}
    >
      <span className={`rounded-full ${config.dotClass} ${dotSize}`} />
      <span>{config.label}</span>
    </span>
  );
}
