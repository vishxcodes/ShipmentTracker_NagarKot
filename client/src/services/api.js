// Normalize API Base URL: handles with or without trailing slash and with or without '/api'
const RAW_BASE_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5001').trim();
const cleanBaseUrl = RAW_BASE_URL.replace(/\/+$/, '');
const API_BASE_URL = cleanBaseUrl.endsWith('/api') ? cleanBaseUrl : `${cleanBaseUrl}/api`;

/**
 * Check backend API health and database connectivity
 * GET /api/health
 * @returns {Promise<Object>}
 */
export async function fetchHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: 'error',
        message: errorData.message || `Server responded with status ${response.status}`,
        database: { status: 'disconnected' },
      };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      status: 'offline',
      message: 'Backend server is offline or unreachable',
      database: { status: 'disconnected', error: error.message },
    };
  }
}

// Alias for backwards compatibility
export const fetchHealthStatus = fetchHealth;

/**
 * Fetch summary statistics for the dashboard KPI cards
 * GET /api/shipments/summary
 * @returns {Promise<Object>} Summary counts: { total, booked, pickedUp, inTransit, outForDelivery, delivered, exceptions, cancelled }
 */
export async function fetchShipmentSummary() {
  const response = await fetch(`${API_BASE_URL}/shipments/summary`);
  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json.message || `Failed to fetch shipment summary (${response.status})`);
  }

  return json.data;
}

/**
 * Fetch paginated, searchable, filterable shipments list
 * GET /api/shipments?search=...&status=...&page=...&limit=...
 * @param {Object} params { search, status, page, limit }
 * @returns {Promise<{ shipments: Array, pagination: Object }>}
 */
export async function fetchShipments({ search = '', status = '', page = 1, limit = 10 } = {}) {
  const query = new URLSearchParams();

  if (search && search.trim()) {
    query.set('search', search.trim());
  }
  if (status && status.trim()) {
    query.set('status', status.trim());
  }
  if (page) {
    query.set('page', String(page));
  }
  if (limit) {
    query.set('limit', String(limit));
  }

  const url = `${API_BASE_URL}/shipments${query.toString() ? `?${query.toString()}` : ''}`;
  const response = await fetch(url);
  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json.message || `Failed to fetch shipments (${response.status})`);
  }

  return {
    shipments: json.data || [],
    pagination: json.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
  };
}

/**
 * Fetch single shipment details by tracking number including full status history
 * GET /api/shipments/:trackingNumber
 * @param {string} trackingNumber 
 * @returns {Promise<Object>}
 */
export async function fetchShipmentDetails(trackingNumber) {
  if (!trackingNumber) {
    throw new Error('Tracking number is required');
  }

  const response = await fetch(`${API_BASE_URL}/shipments/${encodeURIComponent(trackingNumber)}`);
  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json.message || `Failed to fetch shipment ${trackingNumber} (${response.status})`);
  }

  return json.data;
}

/**
 * Create a new shipment
 * POST /api/shipments
 * @param {Object} payload 
 * @returns {Promise<Object>}
 */
export async function createShipment(payload) {
  const response = await fetch(`${API_BASE_URL}/shipments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json.message || `Failed to create shipment (${response.status})`);
  }

  return json.data;
}

/**
 * Update shipment status and add a new history step
 * PATCH /api/shipments/:trackingNumber/status
 * @param {string} trackingNumber 
 * @param {Object} payload { status, location, note }
 * @returns {Promise<Object>}
 */
export async function updateShipmentStatus(trackingNumber, payload) {
  if (!trackingNumber) {
    throw new Error('Tracking number is required');
  }

  const response = await fetch(`${API_BASE_URL}/shipments/${encodeURIComponent(trackingNumber)}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json.message || `Failed to update shipment status (${response.status})`);
  }

  return json.data;
}

/**
 * Fetch shipment status history entries
 * GET /api/shipments/:trackingNumber/history
 * @param {string} trackingNumber 
 * @returns {Promise<Array>}
 */
export async function fetchShipmentHistory(trackingNumber) {
  if (!trackingNumber) {
    throw new Error('Tracking number is required');
  }

  const response = await fetch(`${API_BASE_URL}/shipments/${encodeURIComponent(trackingNumber)}/history`);
  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json.message || `Failed to fetch shipment history (${response.status})`);
  }

  return json.data || [];
}
