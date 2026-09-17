import prisma from '../lib/prisma.js';

/**
 * Health Check Controller
 * GET /api/health
 * 
 * Verifies that the Express API is running and checks live connectivity
 * to the PostgreSQL database via Prisma.
 */
export const checkHealth = async (req, res) => {
  const startTime = Date.now();

  try {
    // Run a lightweight raw query to test PostgreSQL connectivity
    const [dbResult] = await prisma.$queryRaw`SELECT current_database() as db_name, now() as db_time`;

    const responseTimeMs = Date.now() - startTime;

    return res.status(200).json({
      status: 'ok',
      message: 'Shipment Tracker API is running',
      timestamp: new Date().toISOString(),
      database: {
        status: 'connected',
        name: dbResult.db_name,
        responseTimeMs,
      },
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
    });
  } catch (error) {
    console.error('Database connection error in health check:', error.message);

    return res.status(503).json({
      status: 'degraded',
      message: 'Shipment Tracker API is running but database is unreachable',
      timestamp: new Date().toISOString(),
      database: {
        status: 'disconnected',
        error: error.message,
      },
      environment: process.env.NODE_ENV || 'development',
    });
  }
};
