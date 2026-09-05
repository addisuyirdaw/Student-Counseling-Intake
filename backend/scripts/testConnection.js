import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || '';

console.log('🔍 Checking Neon PostgreSQL connection...');

if (!dbUrl || dbUrl.includes('ep-cool-host.neon.tech')) {
  console.error('\n❌ Placeholder Detected in DATABASE_URL:');
  console.error('   Please replace "ep-cool-host.neon.tech" in backend/.env with your actual Neon database connection string.\n');
  process.exit(1);
}

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('📡 Connecting to Neon database host...');
    const result = await prisma.$queryRaw`SELECT NOW() as server_time, current_database() as db_name, version() as pg_version;`;
    
    console.log('✅ Connection Successful!');
    console.log('   - Server Time:', result[0]?.server_time);
    console.log('   - Database Name:', result[0]?.db_name);
    console.log('   - PostgreSQL Version:', result[0]?.pg_version?.split(' ')?.[0] || 'PostgreSQL');

    // Test Read: Counts
    const students = await prisma.student.count();
    const requests = await prisma.counselingRequest.count();
    console.log(`📊 Current Records in Neon:`);
    console.log(`   - Students: ${students}`);
    console.log(`   - Counseling Requests: ${requests}`);

    console.log('\n🎉 Neon PostgreSQL is fully connected and ready for production!');
  } catch (err) {
    console.error('\n❌ Database Connection Failed:');
    console.error(err.message || err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
