import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

prisma.$connect().then(() => {
  console.log('Database connected successfully');
}).catch((err) => {
  console.error('Database connection warning (ensure DATABASE_URL points to a live PostgreSQL instance):', err.message || err);
});

export default prisma;