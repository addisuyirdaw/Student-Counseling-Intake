import app from '../src/server.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = 3099;
let server;

async function runTests() {
  server = app.listen(PORT);
  const BASE_URL = `http://localhost:${PORT}/api/v1/auth`;

  try {
    console.log('--- 1. Login as Admin Advisor ---');
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'advisor@university.edu',
        password: 'counselor2024',
      }),
    });
    const loginData = await loginRes.json();
    console.log('Login status:', loginRes.status, 'User:', loginData.user);
    if (loginRes.status !== 200) throw new Error('Login failed');

    const token = loginData.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    console.log('\n--- 2. Test PATCH /staff/me with wrong current password ---');
    const wrongPassRes = await fetch(`${BASE_URL}/staff/me`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({
        currentPassword: 'incorrect-password',
        newPassword: 'newValidPassword123',
      }),
    });
    const wrongPassData = await wrongPassRes.json();
    console.log('Wrong pass status:', wrongPassRes.status, 'Error:', wrongPassData.error);
    if (wrongPassRes.status !== 401) throw new Error('Expected 401 for wrong current password');

    console.log('\n--- 3. Test PATCH /staff/me updating name ---');
    const updateNameRes = await fetch(`${BASE_URL}/staff/me`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'Dr. Marcus Hayes Updated',
      }),
    });
    const updateNameData = await updateNameRes.json();
    console.log('Update name status:', updateNameRes.status, 'User:', updateNameData.user);
    if (updateNameRes.status !== 200 || updateNameData.user.name !== 'Dr. Marcus Hayes Updated') {
      throw new Error('Expected 200 with updated name');
    }

    console.log('\n--- 4. Verify /me with refreshed token ---');
    const meRes = await fetch(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${updateNameData.token}` },
    });
    const meData = await meRes.json();
    console.log('/me status:', meRes.status, 'User:', meData.user);
    if (meData.user.name !== 'Dr. Marcus Hayes Updated') throw new Error('/me name mismatch');

    console.log('\n--- 5. Test Admin Listing Staff & Updating Counselor By ID ---');
    const listRes = await fetch(`${BASE_URL}/staff`, {
      headers: { Authorization: `Bearer ${updateNameData.token}` },
    });
    const listData = await listRes.json();
    console.log('Staff count:', listData.advisors?.length);
    const counselor = listData.advisors.find((a) => a.email === 'counselor@university.edu');
    if (!counselor) throw new Error('Counselor not found');

    const adminUpdateRes = await fetch(`${BASE_URL}/staff/${counselor.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${updateNameData.token}`,
      },
      body: JSON.stringify({
        password: 'newCounselorPass123',
      }),
    });
    const adminUpdateData = await adminUpdateRes.json();
    console.log('Admin update status:', adminUpdateRes.status, 'Msg:', adminUpdateData.message);
    if (adminUpdateRes.status !== 200) throw new Error('Admin password reset failed');

    // Verify counselor can login with newly set password
    const counselorLoginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'counselor@university.edu',
        password: 'newCounselorPass123',
      }),
    });
    console.log('Counselor new login status:', counselorLoginRes.status);
    if (counselorLoginRes.status !== 200) throw new Error('Counselor login with reset password failed');

    // Clean up: restore counselor password and admin name
    await fetch(`${BASE_URL}/staff/${counselor.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${updateNameData.token}`,
      },
      body: JSON.stringify({ password: 'counselor2024' }),
    });

    await fetch(`${BASE_URL}/staff/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${updateNameData.token}`,
      },
      body: JSON.stringify({ name: 'Dr. Katherine Hayes' }),
    });

    console.log('\n✅ ALL PROFILE & PASSWORD UPDATE TESTS PASSED SUCCESSFULLY!');
  } finally {
    server.close();
  }
}

runTests().catch((err) => {
  console.error('\n❌ Test failed:', err);
  if (server) server.close();
  process.exit(1);
});
