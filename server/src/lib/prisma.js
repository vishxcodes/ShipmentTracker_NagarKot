import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton Instance
 * 
 * Concept for MongoDB/Mongoose developers:
 * - In Mongoose, you do `mongoose.connect()` and access collections via models (e.g. `User.find()`).
 * - In Prisma, `PrismaClient` is your unified query builder and connection manager.
 * - In development environments (like nodemon), file changes re-run this script.
 *   Attaching `prisma` to `globalThis` prevents opening duplicate database connections.
 */

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
