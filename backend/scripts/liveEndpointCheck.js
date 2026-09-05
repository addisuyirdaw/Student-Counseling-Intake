/**
 * Production Deployment Sanity Check Script
 * Usage:
 *   node scripts/liveEndpointCheck.js https://<your-render-app>.onrender.com https://<your-vercel-app>.vercel.app
 */

const backendUrl = process.argv[2] || process.env.BACKEND_URL || 'http://localhost:3001';
const frontendUrl = process.argv[3] || process.env.FRONTEND_URL || 'http://localhost:5173';

console.log('🚀 Running Production Deployment Sanity Checks');
console.log(`   - Backend Target:  ${backendUrl}`);
console.log(`   - Frontend Target: ${frontendUrl}\n`);

async function runChecks() {
  let passed = 0;
  let failed = 0;

  // Test 1: Backend Health Check
  try {
    console.log('[Test 1] Checking Backend Health (/health)...');
    const res = await fetch(`${backendUrl}/health`);
    const data = await res.json();
    if (res.status === 200 && data.status === 'OK') {
      console.log(`   ✅ 200 OK — Server active (timestamp: ${data.timestamp})`);
      passed++;
    } else {
      throw new Error(`Unexpected status ${res.status}`);
    }
  } catch (err) {
    console.error(`   ❌ Health Check Failed:`, err.message);
    failed++;
  }

  // Test 2: Database Connectivity via Counts Endpoint
  try {
    console.log('\n[Test 2] Checking Neon PostgreSQL Connection (/api/v1/counseling/counts)...');
    const res = await fetch(`${backendUrl}/api/v1/counseling/counts`);
    const data = await res.json();
    if (res.status === 200 && data.data) {
      console.log(`   ✅ 200 OK — Neon PostgreSQL connected!`);
      console.log(`   📊 Live Counts: Total: ${data.data.TOTAL}, Pending: ${data.data.PENDING}, Urgent: ${data.data.URGENT}`);
      passed++;
    } else {
      throw new Error(`Status ${res.status}: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    console.error(`   ❌ Database Check Failed:`, err.message);
    failed++;
  }

  // Test 3: Advisor Authentication Flow & Token Issuance
  let authToken = null;
  try {
    console.log('\n[Test 3] Checking Advisor Authentication (/api/v1/auth/login)...');
    const res = await fetch(`${backendUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'advisor@university.edu',
        password: 'counselor2024',
      }),
    });
    const data = await res.json();
    if (res.status === 200 && data.token) {
      authToken = data.token;
      console.log(`   ✅ 200 OK — Authenticated as ${data.user?.name} (${data.user?.title})`);
      console.log(`   🔒 Token issued with dual-mode cookie & Bearer support`);
      passed++;
    } else {
      throw new Error(`Status ${res.status}: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    console.error(`   ❌ Auth Check Failed:`, err.message);
    failed++;
  }

  // Test 4: Protected Session Verification
  if (authToken) {
    try {
      console.log('\n[Test 4] Checking Protected Advisor Session (/api/v1/auth/me)...');
      const res = await fetch(`${backendUrl}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.status === 200 && data.user) {
        console.log(`   ✅ 200 OK — Profile verified: ${data.user.name}`);
        passed++;
      } else {
        throw new Error(`Status ${res.status}`);
      }
    } catch (err) {
      console.error(`   ❌ Session Verification Failed:`, err.message);
      failed++;
    }
  }

  // Test 5: Frontend Route Accessibility
  try {
    console.log('\n[Test 5] Checking Frontend Accessibility (/ and /requests)...');
    const res1 = await fetch(`${frontendUrl}/`);
    const res2 = await fetch(`${frontendUrl}/requests`);
    if (res1.status === 200 && res2.status === 200) {
      console.log(`   ✅ 200 OK — Both Student Portal (/) and Advisor Gate (/requests) reachable`);
      passed++;
    } else {
      throw new Error(`Portal status: ${res1.status}, Advisor status: ${res2.status}`);
    }
  } catch (err) {
    console.error(`   ❌ Frontend Check Failed:`, err.message);
    failed++;
  }

  console.log(`\n===========================================`);
  console.log(`🏁 Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`===========================================`);
}

runChecks();
