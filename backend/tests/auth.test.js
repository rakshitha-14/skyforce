const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Authentication Integration Tests', () => {
  const testUser = {
    name: 'Test Tester',
    email: `tester_${Date.now()}@test.com`,
    password: 'password123',
    role: 'Employee',
    department: 'QA',
    designation: 'Tester'
  };

  test('POST /api/auth/register should successfully register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('Registration successful');
  });

  test('POST /api/auth/login should authenticate user after admin approval', async () => {
    // 1. Login as Admin to get token
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'Admin@123' });
    
    expect(adminLogin.statusCode).toEqual(200);
    const adminToken = adminLogin.body.token;

    // 2. Fetch all users as Admin
    const usersRes = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(usersRes.statusCode).toEqual(200);
    const targetUser = usersRes.body.find(u => u.email === testUser.email.toLowerCase());
    expect(targetUser).toBeDefined();

    // 3. Approve the test user
    const approveRes = await request(app)
      .put(`/api/admin/users/${targetUser._id}/approve`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(approveRes.statusCode).toEqual(200);

    // 4. Now login as the test user
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toEqual(testUser.email.toLowerCase());
  });

  test('POST /api/auth/login should allow unapproved users to authenticate but return isApproved: false', async () => {
    const unapprovedEmail = `unapproved_${Date.now()}@test.com`;
    // Register
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Unapproved Tester',
        email: unapprovedEmail,
        password: 'password123',
        role: 'Employee',
        department: 'QA',
        designation: 'Tester'
      });

    // Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: unapprovedEmail,
        password: 'password123'
      });

    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body).toHaveProperty('token');
    expect(loginRes.body.isApproved).toBe(false);

    const token = loginRes.body.token;

    // Test profile retrieval (GET /api/auth/profile should be allowed)
    const profileRes = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(profileRes.statusCode).toEqual(200);
    expect(profileRes.body.isApproved).toBe(false);

    // Test restricted endpoint (GET /api/projects should be blocked)
    const projectsRes = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);
    expect(projectsRes.statusCode).toEqual(403);
    expect(projectsRes.body.message).toContain('pending admin approval');
  });

  test('Admin should block/unblock users, and blocked users should be denied access', async () => {
    const blockEmail = `block_${Date.now()}@test.com`;
    // Register
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Block Tester',
        email: blockEmail,
        password: 'password123',
        role: 'Employee',
        department: 'QA',
        designation: 'Tester'
      });

    // Login as Admin to approve & block
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'Admin@123' });
    const adminToken = adminLogin.body.token;

    // Get target user ID
    const usersRes = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);
    const targetUser = usersRes.body.find(u => u.email === blockEmail.toLowerCase());
    expect(targetUser).toBeDefined();

    // Block target user
    const blockRes = await request(app)
      .put(`/api/admin/users/${targetUser._id}/block`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(blockRes.statusCode).toEqual(200);
    expect(blockRes.body.isBlocked).toBe(true);

    // Try to login as blocked user
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: blockEmail,
        password: 'password123'
      });
    expect(loginRes.statusCode).toEqual(403);
    expect(loginRes.body.message).toContain('blocked');

    // Unblock target user
    const unblockRes = await request(app)
      .put(`/api/admin/users/${targetUser._id}/unblock`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(unblockRes.statusCode).toEqual(200);
    expect(unblockRes.body.isBlocked).toBe(false);

    // Try login again (this user is also approved by default for login now since unapproved logins are allowed)
    const loginRes2 = await request(app)
      .post('/api/auth/login')
      .send({
        email: blockEmail,
        password: 'password123'
      });
    expect(loginRes2.statusCode).toEqual(200);
  });
});


