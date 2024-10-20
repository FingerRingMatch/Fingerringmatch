// lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// Create a singleton Prisma Client instance
const prisma = new PrismaClient();

// Export the Prisma client for use in other parts of your application
export { prisma };
