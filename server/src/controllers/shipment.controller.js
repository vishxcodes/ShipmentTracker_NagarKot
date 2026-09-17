import * as shipmentService from '../services/shipment.service.js';
import { isValidShipmentStatus, SHIPMENT_STATUSES } from '../constants/shipmentStatus.js';

/**
 * Controller: Handles HTTP request parsing, input validation, and standardized responses.
 */

// POST /api/shipments
export async function createShipment(req, res, next) {
  try {
    const {
      trackingNumber,
      senderName,
      receiverName,
      origin,
      destination,
      packageDescription,
      weight,
      estimatedDeliveryDate,
    } = req.body;

    const requiredFields = [
      { name: 'trackingNumber', value: trackingNumber },
      { name: 'senderName', value: senderName },
      { name: 'receiverName', value: receiverName },
      { name: 'origin', value: origin },
      { name: 'destination', value: destination },
      { name: 'packageDescription', value: packageDescription },
    ];

    for (const field of requiredFields) {
      if (!field.value || typeof field.value !== 'string' || field.value.trim() === '') {
        return res.status(400).json({
          success: false,
          message: `Field '${field.name}' is required and cannot be empty.`,
        });
      }
    }

    if (weight === undefined || weight === null || isNaN(weight) || Number(weight) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Field "weight" is required and must be a positive number greater than 0.',
      });
    }

    if (estimatedDeliveryDate) {
      const parsedDate = new Date(estimatedDeliveryDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Field "estimatedDeliveryDate" must be a valid ISO date string.',
        });
      }
    }

    const shipment = await shipmentService.createShipment({
      trackingNumber,
      senderName,
      receiverName,
      origin,
      destination,
      packageDescription,
      weight,
      estimatedDeliveryDate,
    });

    return res.status(201).json({
      success: true,
      data: shipment,
    });
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

// GET /api/shipments
export async function listShipments(req, res, next) {
  try {
    const { search, status, page, limit } = req.query;

    if (page !== undefined && (isNaN(page) || Number(page) < 1)) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "page" must be a positive integer >= 1.',
      });
    }

    if (limit !== undefined && (isNaN(limit) || Number(limit) < 1 || Number(limit) > 50)) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "limit" must be an integer between 1 and 50.',
      });
    }

    const result = await shipmentService.listShipments({
      search,
      status,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: result.shipments,
      pagination: result.pagination,
    });
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

// GET /api/shipments/summary
export async function getShipmentsSummary(req, res, next) {
  try {
    const summary = await shipmentService.getShipmentsSummary();
    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/shipments/:trackingNumber
export async function getShipmentDetails(req, res, next) {
  try {
    const { trackingNumber } = req.params;

    const shipment = await shipmentService.getShipmentByTrackingNumber(trackingNumber);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: `Shipment with tracking number '${trackingNumber}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: shipment,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/shipments/:trackingNumber/status
export async function updateShipmentStatus(req, res, next) {
  try {
    const { trackingNumber } = req.params;
    const { status, note, location } = req.body;

    if (!status || typeof status !== 'string' || !isValidShipmentStatus(status.trim().toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status '${status}'. Must be one of: ${SHIPMENT_STATUSES.join(', ')}`,
      });
    }

    const updated = await shipmentService.updateShipmentStatus(trackingNumber, {
      status,
      note,
      location,
    });

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.statusCode === 400) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

// GET /api/shipments/:trackingNumber/history
export async function getShipmentHistory(req, res, next) {
  try {
    const { trackingNumber } = req.params;

    const history = await shipmentService.getShipmentHistory(trackingNumber);

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}
