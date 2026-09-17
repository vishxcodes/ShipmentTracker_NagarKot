import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import prisma from './lib/prisma.js';

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Nagarkot Forwarders Backend API`);
  console.log(`📡 Server listening on: http://localhost:${PORT}`);
  console.log(`🩺 Health check URL:   http://localhost:${PORT}/api/health`);
  console.log(`📦 Database target:    ${process.env.DATABASE_URL ? 'Configured' : 'Missing'}`);
  console.log(`==================================================\n`);
});

// Graceful Shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    await prisma.$disconnect();
    console.log('PostgreSQL connection closed via Prisma.');
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
