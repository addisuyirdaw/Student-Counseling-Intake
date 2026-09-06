import app from '../src/server.js';
import http from 'http';

async function testAvatarFlow() {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(3099, resolve));
  console.log('Test server listening on port 3099');

  const BASE_URL = 'http://localhost:3099/api/v1/auth';

  try {
    // 1. Login
    console.log('[1] Logging in as advisor...');
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'advisor@university.edu',
        password: 'counselor2024',
      }),
    });
    const loginData = await loginRes.json();
    console.log('Login response user:', loginData.user);
    if (loginRes.status !== 200 || !loginData.token) {
      throw new Error(`Login failed with status ${loginRes.status}`);
    }

    const token = loginData.token;

    // 2. Update avatarUrl via PATCH /staff/me
    console.log('[2] Updating avatarUrl via PATCH /staff/me...');
    const testAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const updateRes = await fetch(`${BASE_URL}/staff/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        avatarUrl: testAvatar,
      }),
    });
    const updateData = await updateRes.json();
    console.log('Update status:', updateRes.status);
    console.log('Update response user avatarUrl exists:', Boolean(updateData.user?.avatarUrl));

    if (updateRes.status !== 200 || updateData.user?.avatarUrl !== testAvatar) {
      throw new Error(`Avatar update failed: ${JSON.stringify(updateData)}`);
    }

    // 3. Verify /me returns the updated avatar
    console.log('[3] Verifying updated avatar via GET /me with refreshed token...');
    const meRes = await fetch(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${updateData.token}` },
    });
    const meData = await meRes.json();
    console.log('GET /me user avatarUrl matches:', meData.user?.avatarUrl === testAvatar);

    if (meData.user?.avatarUrl !== testAvatar) {
      throw new Error('GET /me did not return updated avatar');
    }

    console.log('\n>>> ALL AVATAR BACKEND TESTS PASSED SUCCESSFULLY! <<<\n');
    server.close();
    process.exit(0);
  } finally {
    server.close();
  }
}

testAvatarFlow().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
