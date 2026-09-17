/**
 * Canonical list of supported shipment statuses
 * Matches the Prisma `ShipmentStatus` enum in schema.prisma
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

/**
 * Helper to validate if a given string is a valid ShipmentStatus
 * @param {string} status 
 * @returns {boolean}
 */
export const isValidShipmentStatus = (status) => {
  return typeof status === 'string' && SHIPMENT_STATUSES.includes(status);
};
