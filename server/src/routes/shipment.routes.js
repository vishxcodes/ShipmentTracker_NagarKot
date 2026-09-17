import { Router } from 'express';
import {
  createShipment,
  listShipments,
  getShipmentsSummary,
  getShipmentDetails,
  updateShipmentStatus,
  getShipmentHistory,
} from '../controllers/shipment.controller.js';

const router = Router();

// 1. Root Collection Routes
router.post('/', createShipment);
router.get('/', listShipments);

// 2. Summary Route
// CRITICAL: Registered BEFORE /:trackingNumber to prevent "summary" from being matched as a tracking number parameter
router.get('/summary', getShipmentsSummary);

// 3. Sub-resource Routes
router.get('/:trackingNumber/history', getShipmentHistory);
router.patch('/:trackingNumber/status', updateShipmentStatus);

// 4. Single Resource Route
router.get('/:trackingNumber', getShipmentDetails);

export default router;
