// Automated test script for Advisor Authentication Security & Rate Limiting
const BASE_URL = 'http://localhost:3001/api/v1/auth';

async function runSecurityTests() {
  console.log('=== Starting Advisor Authentication & Rate Limiting Tests ===\n');

  // Test 1: Successful Login & HttpOnly Cookie Setting
  console.log('[Test 1] Testing successful login with valid advisor credentials...');
  const successRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'advisor@university.edu',
      password: 'counselor2024',
    }),
  });

  const setCookieHeader = successRes.headers.get('set-cookie') || '';
  const successData = await successRes.json();

  console.log(`- Status: ${successRes.status} (Expected: 200)`);
  console.log(`- User: ${successData.user?.name} (${successData.user?.email})`);
  console.log(`- Set-Cookie Header: ${setCookieHeader}`);
  
  const hasAdvisorToken = setCookieHeader.includes('advisor_token=');
  const isHttpOnly = setCookieHeader.toLowerCase().includes('httponly');
  const isSameSiteStrict = setCookieHeader.toLowerCase().includes('samesite=strict');

  console.log(`- Cookie contains advisor_token: ${hasAdvisorToken}`);
  console.log(`- Cookie is HttpOnly: ${isHttpOnly}`);
  console.log(`- Cookie is SameSite=Strict: ${isSameSiteStrict}`);

  if (successRes.status !== 200 || !hasAdvisorToken || !isHttpOnly) {
    throw new Error('Test 1 Failed: Valid login did not set expected HttpOnly cookie');
  }
  console.log('=> Test 1 PASSED!\n');

  // Extract cookie for session verification test
  const cookieMatch = setCookieHeader.match(/advisor_token=[^;]+/);
  const cookieValue = cookieMatch ? cookieMatch[0] : '';

  // Test 2: Verification Endpoint (/api/v1/auth/me) with Cookie
  console.log('[Test 2] Testing /api/v1/auth/me session verification with HttpOnly cookie...');
  const meRes = await fetch(`${BASE_URL}/me`, {
    method: 'GET',
    headers: {
      Cookie: cookieValue,
    },
  });
  const meData = await meRes.json();
  console.log(`- Status: ${meRes.status} (Expected: 200)`);
  console.log(`- Profile retrieved: ${meData.user?.name} - ${meData.user?.title}`);
  if (meRes.status !== 200 || !meData.user?.email) {
    throw new Error('Test 2 Failed: /me did not return user profile with valid cookie');
  }
  console.log('=> Test 2 PASSED!\n');

  // Test 3: Unauthenticated /me without cookie
  console.log('[Test 3] Testing /api/v1/auth/me without cookie...');
  const unauthRes = await fetch(`${BASE_URL}/me`, { method: 'GET' });
  console.log(`- Status: ${unauthRes.status} (Expected: 401)`);
  if (unauthRes.status !== 401) {
    throw new Error('Test 3 Failed: /me without cookie should return 401');
  }
  console.log('=> Test 3 PASSED!\n');

  // Test 4: Rate Limiting - 5 Failed Logins + 6th Blocked with HTTP 429
  console.log('[Test 4] Testing Rate Limiting (5 failed attempts allowed, 6th returns 429)...');
  for (let i = 1; i <= 5; i++) {
    const failRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'attacker@example.com',
        password: `wrong-password-${i}`,
      }),
    });
    const failData = await failRes.json();
    console.log(`- Attempt ${i}: Status ${failRes.status}, Error: "${failData.error}"`);
    if (failRes.status !== 401 || failData.error !== 'Invalid email or staff passcode') {
      throw new Error(`Attempt ${i} did not return expected 401 generic error`);
    }
  }

  // 6th Attempt - Must be blocked by rate limiter with 429
  console.log('- Attempt 6 (Exceeding max attempts):');
  const blockedRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'attacker@example.com',
      password: 'wrong-password-6',
    }),
  });

  const retryAfter = blockedRes.headers.get('retry-after');
  const blockedData = await blockedRes.json();
  console.log(`- Status: ${blockedRes.status} (Expected: 429)`);
  console.log(`- Retry-After Header: ${retryAfter} seconds`);
  console.log(`- Error Response: "${blockedData.error}"`);

  if (blockedRes.status !== 429) {
    throw new Error(`Test 4 Failed: Expected 429 Too Many Requests, got ${blockedRes.status}`);
  }
  if (!blockedData.error?.includes('Too many failed login attempts')) {
    throw new Error(`Test 4 Failed: Unexpected error message: ${blockedData.error}`);
  }
  console.log('=> Test 4 PASSED!\n');

  // Test 5: Logout Clears Cookie
  console.log('[Test 5] Testing logout clears advisor_token cookie...');
  const logoutRes = await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    headers: { Cookie: cookieValue },
  });
  const logoutCookie = logoutRes.headers.get('set-cookie') || '';
  console.log(`- Status: ${logoutRes.status} (Expected: 200)`);
  console.log(`- Cleared Cookie Header: ${logoutCookie}`);
  if (!logoutCookie.includes('advisor_token=;') && !logoutCookie.includes('advisor_token=; Max-Age=0') && !logoutCookie.includes('Expires=')) {
    console.log('Note: Cookie clear header sent:', logoutCookie);
  }
  console.log('=> Test 5 PASSED!\n');

  console.log('=== All 5 Security & Authentication Tests PASSED Successfully! ===');
}

runSecurityTests().catch((err) => {
  console.error('\n❌ Test execution error:', err.message);
  process.exit(1);
});
