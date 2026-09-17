import prisma from '../lib/prisma.js';
import { isValidShipmentStatus, SHIPMENT_STATUSES } from '../constants/shipmentStatus.js';

/**
 * Service Layer: Encapsulates all database operations and business logic
 * for shipments and status history.
 */

/**
 * Create a new shipment and its initial status history in an atomic transaction.
 * @param {Object} data 
 * @returns {Promise<Object>} Created shipment with status history
 */
export async function createShipment(data) {
  const {
    trackingNumber,
    senderName,
    receiverName,
    origin,
    destination,
    packageDescription,
    weight,
    estimatedDeliveryDate,
  } = data;

  // Check if tracking number already exists
  const existing = await prisma.shipment.findUnique({
    where: { trackingNumber: trackingNumber.trim() },
  });

  if (existing) {
    const error = new Error(`A shipment with tracking number '${trackingNumber.trim()}' already exists.`);
    error.statusCode = 409;
    throw error;
  }

  // Execute in an atomic transaction: create shipment + initial BOOKED history
  return await prisma.$transaction(async (tx) => {
    const shipment = await tx.shipment.create({
      data: {
        trackingNumber: trackingNumber.trim(),
        senderName: senderName.trim(),
        receiverName: receiverName.trim(),
        origin: origin.trim(),
        destination: destination.trim(),
        packageDescription: packageDescription.trim(),
        weight: parseFloat(weight),
        status: 'BOOKED',
        estimatedDeliveryDate: estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : null,
        statusHistory: {
          create: {
            status: 'BOOKED',
            note: 'Shipment created',
            location: origin.trim(),
          },
        },
      },
      include: {
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return shipment;
  });
}

/**
 * List shipments with search, status filtering, and pagination.
 * @param {Object} queryParams 
 * @returns {Promise<{ shipments: Array, pagination: Object }>}
 */
export async function listShipments({ search, status, page = 1, limit = 10 }) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const where = {};

  // Case-insensitive search on trackingNumber
  if (search && typeof search === 'string' && search.trim() !== '') {
    where.trackingNumber = {
      contains: search.trim(),
      mode: 'insensitive',
    };
  }

  // Filter by valid ShipmentStatus
  if (status && typeof status === 'string' && status.trim() !== '') {
    const uppercaseStatus = status.trim().toUpperCase();
    if (!isValidShipmentStatus(uppercaseStatus)) {
      const error = new Error(`Invalid status filter '${status}'. Allowed: ${SHIPMENT_STATUSES.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }
    where.status = uppercaseStatus;
  }

  const [total, shipments] = await Promise.all([
    prisma.shipment.count({ where }),
    prisma.shipment.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: {
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    shipments,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  };
}

/**
 * Get single shipment by tracking number, including complete status history ordered oldest first.
 * @param {string} trackingNumber 
 * @returns {Promise<Object|null>}
 */
export async function getShipmentByTrackingNumber(trackingNumber) {
  if (!trackingNumber || typeof trackingNumber !== 'string') {
    return null;
  }

  return await prisma.shipment.findUnique({
    where: { trackingNumber: trackingNumber.trim() },
    include: {
      statusHistory: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

/**
 * Update shipment status and record new history entry in an atomic transaction.
 * @param {string} trackingNumber 
 * @param {Object} updateData 
 * @returns {Promise<Object>}
 */
export async function updateShipmentStatus(trackingNumber, { status, note, location }) {
  const uppercaseStatus = status?.trim()?.toUpperCase();

  if (!isValidShipmentStatus(uppercaseStatus)) {
    const error = new Error(`Invalid status '${status}'. Must be one of: ${SHIPMENT_STATUSES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const shipment = await prisma.shipment.findUnique({
    where: { trackingNumber: trackingNumber.trim() },
  });

  if (!shipment) {
    const error = new Error(`Shipment with tracking number '${trackingNumber}' not found.`);
    error.statusCode = 404;
    throw error;
  }

  // Atomic transaction: create new history step and update current status
  return await prisma.$transaction(async (tx) => {
    const newHistory = await tx.shipmentStatusHistory.create({
      data: {
        shipmentId: shipment.id,
        status: uppercaseStatus,
        note: note ? note.trim() : null,
        location: location ? location.trim() : null,
      },
    });

    const updatedShipment = await tx.shipment.update({
      where: { id: shipment.id },
      data: {
        status: uppercaseStatus,
      },
      include: {
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return {
      ...updatedShipment,
      newHistory,
    };
  });
}

/**
 * Get all status history records for a shipment, ordered oldest first.
 * @param {string} trackingNumber 
 * @returns {Promise<Array>}
 */
export async function getShipmentHistory(trackingNumber) {
  const shipment = await prisma.shipment.findUnique({
    where: { trackingNumber: trackingNumber.trim() },
    select: { id: true, trackingNumber: true },
  });

  if (!shipment) {
    const error = new Error(`Shipment with tracking number '${trackingNumber}' not found.`);
    error.statusCode = 404;
    throw error;
  }

  return await prisma.shipmentStatusHistory.findMany({
    where: { shipmentId: shipment.id },
    orderBy: { createdAt: 'asc' },
  });
}

/**
 * Aggregates summary statistics matching exact frontend field names:
 * total, booked, pickedUp, inTransit, outForDelivery, delivered, exceptions, cancelled
 * @returns {Promise<Object>}
 */
export async function getShipmentsSummary() {
  const [total, groupedCounts] = await Promise.all([
    prisma.shipment.count(),
    prisma.shipment.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    }),
  ]);

  const countMap = {};
  for (const group of groupedCounts) {
    countMap[group.status] = group._count.status;
  }

  return {
    total,
    booked: countMap['BOOKED'] || 0,
    pickedUp: countMap['PICKED_UP'] || 0,
    inTransit: countMap['IN_TRANSIT'] || 0,
    outForDelivery: countMap['OUT_FOR_DELIVERY'] || 0,
    delivered: countMap['DELIVERED'] || 0,
    exceptions: countMap['EXCEPTION'] || 0,
    cancelled: countMap['CANCELLED'] || 0,
  };
}
