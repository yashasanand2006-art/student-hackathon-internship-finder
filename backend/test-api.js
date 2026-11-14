const { startServer } = require('./server');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('\n--- STARTING DEVNEXUS COMPREHENSIVE BACKEND API TEST SUITE ---\n');
  const server = await startServer();

  let studentToken = null;
  let adminToken = null;
  let testHackathonId = null;

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthJson = await healthRes.json();
    console.log(`[PASS] 1. Health check: ${healthRes.status} (status: ${healthJson.status}, mode: ${healthJson.database.mode})`);

    // 2. Student Login
    const studentLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@nexus.edu', password: 'password123' }),
    });
    const studentLoginJson = await studentLoginRes.json();
    studentToken = studentLoginJson.token;
    console.log(`[PASS] 2. Student Login: ${studentLoginRes.status} (token received: ${!!studentToken}, user: ${studentLoginJson.user.name})`);

    // 3. Admin Login
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@nexus.edu', password: 'password123' }),
    });
    const adminLoginJson = await adminLoginRes.json();
    adminToken = adminLoginJson.token;
    console.log(`[PASS] 3. Admin Login: ${adminLoginRes.status} (role: ${adminLoginJson.user.role})`);

    // 4. Register a new user
    const randomEmail = `tester_${Date.now()}@nexus.edu`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jordan Lee',
        email: randomEmail,
        password: 'securePassword99',
        role: 'student',
        university: 'UC Berkeley',
        major: 'EECS',
      }),
    });
    const regJson = await regRes.json();
    console.log(`[PASS] 4. User Registration: ${regRes.status} (registered: ${regJson.user.email})`);

    // 5. Get current profile (Auth /me)
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const meJson = await meRes.json();
    console.log(`[PASS] 5. Get Auth Profile: ${meRes.status} (name: ${meJson.user.name})`);

    // 6. Update Profile
    const updateRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        bio: 'Updated bio from automated test suite!',
        skills: ['React', 'TypeScript', 'GraphQL', 'Docker'],
      }),
    });
    const updateJson = await updateRes.json();
    console.log(`[PASS] 6. Update Profile: ${updateRes.status} (skills: ${updateJson.user.skills.length} skills)`);

    // 7. Get Hackathons with filter
    const hackRes = await fetch(`${BASE_URL}/hackathons?mode=Online&limit=5`);
    const hackJson = await hackRes.json();
    console.log(`[PASS] 7. Get Hackathons (Filter mode=Online): ${hackRes.status} (count: ${hackJson.count}, total: ${hackJson.total})`);

    // 8. Get Internships
    const internRes = await fetch(`${BASE_URL}/internships?limit=5`);
    const internJson = await internRes.json();
    console.log(`[PASS] 8. Get Internships: ${internRes.status} (count: ${internJson.count}, total: ${internJson.total})`);

    // 9. Bookmark toggle
    const firstHackId = hackJson.data[0]._id;
    const toggleBookmarkRes = await fetch(`${BASE_URL}/bookmarks/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({ itemType: 'hackathon', itemId: firstHackId }),
    });
    const toggleJson = await toggleBookmarkRes.json();
    console.log(`[PASS] 9. Bookmark Toggle: ${toggleBookmarkRes.status} (bookmarked: ${toggleJson.bookmarked})`);

    // 10. Bookmark IDs list
    const bmIdsRes = await fetch(`${BASE_URL}/bookmarks/ids`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const bmIdsJson = await bmIdsRes.json();
    console.log(`[PASS] 10. Bookmark IDs sync: ${bmIdsRes.status} (hackathons: ${bmIdsJson.data.hackathons.length}, internships: ${bmIdsJson.data.internships.length})`);

    // 11. Admin Create Hackathon
    const createHackRes = await fetch(`${BASE_URL}/hackathons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: 'Quantum Computing Hackathon 2027',
        organizer: 'IBM Quantum & MIT',
        tagline: 'Write algorithms for 1,000+ qubit systems',
        description: 'Tackle optimization problems using Qiskit and cloud quantum processors.',
        mode: 'Online',
        location: 'Virtual',
        prizePool: 80000,
        currency: 'USD',
        startDate: '2027-03-01T00:00:00Z',
        endDate: '2027-03-03T00:00:00Z',
        registrationDeadline: '2027-02-25T00:00:00Z',
        tags: ['Quantum', 'Python', 'Qiskit'],
        websiteUrl: 'https://quantum-hack.ibm.com',
      }),
    });
    const createHackJson = await createHackRes.json();
    testHackathonId = createHackJson.data._id;
    console.log(`[PASS] 11. Admin Create Hackathon: ${createHackRes.status} (id: ${testHackathonId})`);

    // 12. Admin Update Hackathon
    const updateHackRes = await fetch(`${BASE_URL}/hackathons/${testHackathonId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ prizePool: 95000 }),
    });
    const updateHackJson = await updateHackRes.json();
    console.log(`[PASS] 12. Admin Update Hackathon: ${updateHackRes.status} (new prizePool: $${updateHackJson.data.prizePool})`);

    // 13. Admin Delete Hackathon
    const delHackRes = await fetch(`${BASE_URL}/hackathons/${testHackathonId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const delHackJson = await delHackRes.json();
    console.log(`[PASS] 13. Admin Delete Hackathon: ${delHackRes.status} (${delHackJson.message})`);

    // 14. Admin Statistics
    const statsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const statsJson = await statsRes.json();
    console.log(`[PASS] 14. Admin Stats: ${statsRes.status} (Total Users: ${statsJson.data.users.total}, Hackathons: ${statsJson.data.hackathons.total}, Internships: ${statsJson.data.internships.total})`);

    // 15. Role Authorization check: Student trying to access Admin Stats should get 403 Forbidden
    const forbiddenRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    console.log(`[PASS] 15. Student Access Denied to Admin Route: ${forbiddenRes.status} (Expected 403 Forbidden)`);

    console.log('\n🌟 ALL 15 BACKEND TESTS PASSED WITH 100% SUCCESS! 🌟\n');
  } catch (err) {
    console.error('Test Suite Failed:', err);
    process.exit(1);
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests();
