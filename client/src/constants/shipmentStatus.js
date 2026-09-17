/**
 * Canonical Shipment Statuses matching backend enum
 */
export const SHIPMENT_STATUSES = [
  'BOOKED',
  'PICKED_UP',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'EXCEPTION',
  'CANCELLED',
];

export const STATUS_CONFIG = {
  BOOKED: {
    label: 'Booked',
    description: 'Shipment created and booking confirmed',
    badgeClass: 'bg-[#1f6feb]/15 text-[#58a6ff] border-[#1f6feb]/40',
    dotClass: 'bg-[#58a6ff]',
    iconColor: 'text-[#58a6ff]',
  },
  PICKED_UP: {
    label: 'Picked Up',
    description: 'Cargo received from sender',
    badgeClass: 'bg-[#8957e5]/15 text-[#bc8cff] border-[#8957e5]/40',
    dotClass: 'bg-[#bc8cff]',
    iconColor: 'text-[#bc8cff]',
  },
  IN_TRANSIT: {
    label: 'In Transit',
    description: 'En route between distribution hubs',
    badgeClass: 'bg-[#d29922]/15 text-[#e3b341] border-[#d29922]/40',
    dotClass: 'bg-[#e3b341]',
    iconColor: 'text-[#e3b341]',
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    description: 'Assigned to final mile courier vehicle',
    badgeClass: 'bg-[#a371f7]/15 text-[#d2a8ff] border-[#a371f7]/40',
    dotClass: 'bg-[#d2a8ff]',
    iconColor: 'text-[#d2a8ff]',
  },
  DELIVERED: {
    label: 'Delivered',
    description: 'Successfully delivered to recipient',
    badgeClass: 'bg-[#238636]/15 text-[#3fb950] border-[#238636]/40',
    dotClass: 'bg-[#3fb950]',
    iconColor: 'text-[#3fb950]',
  },
  EXCEPTION: {
    label: 'Exception',
    description: 'Delivery delay or issue encountered',
    badgeClass: 'bg-[#da3633]/15 text-[#f85149] border-[#da3633]/40',
    dotClass: 'bg-[#f85149]',
    iconColor: 'text-[#f85149]',
  },
  CANCELLED: {
    label: 'Cancelled',
    description: 'Shipment cancelled by sender or system',
    badgeClass: 'bg-[#21262d] text-[#8b949e] border-[#30363d]',
    dotClass: 'bg-[#8b949e]',
    iconColor: 'text-[#8b949e]',
  },
};

export function getStatusConfig(status) {
  if (!status) return STATUS_CONFIG.BOOKED;
  const uppercase = String(status).toUpperCase();
  return STATUS_CONFIG[uppercase] || {
    label: status,
    description: '',
    badgeClass: 'bg-[#21262d] text-[#8b949e] border-[#30363d]',
    dotClass: 'bg-[#8b949e]',
    iconColor: 'text-[#8b949e]',
  };
}
