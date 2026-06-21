const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const base = 'http://localhost:5000/api';
(async () => {
  try {
    const adminLoginRes = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'Admin@123' }),
    });
    const adminLoginBody = await adminLoginRes.text();
    console.log('admin login status:', adminLoginRes.status);
    console.log('admin login body:', adminLoginBody);

    const regRes = await fetch(`${base}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Flow Tester',
        email: 'flowtester@example.com',
        password: 'Flow1234',
        role: 'Manager',
        department: 'QA',
        designation: 'Lead',
      }),
    });
    const regBody = await regRes.text();
    console.log('register status:', regRes.status);
    console.log('register body:', regBody);

    const adminData = JSON.parse(adminLoginBody);
    if (!adminData.token) {
      return;
    }

    const usersRes = await fetch(`${base}/admin/users`, {
      headers: { Authorization: `Bearer ${adminData.token}` },
    });
    const users = await usersRes.json();
    console.log('users length:', users.length);
    const target = users.find((u) => u.email === 'flowtester@example.com');
    console.log('target:', target ? { email: target.email, isApproved: target.isApproved, isRejected: target.isRejected } : 'not found');
    if (!target) return;

    const approveRes = await fetch(`${base}/admin/users/${target._id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminData.token}` },
    });
    const approveBody = await approveRes.text();
    console.log('approve status:', approveRes.status, 'body:', approveBody);

    const loginRes = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'flowtester@example.com', password: 'Flow1234' }),
    });
    const loginBody = await loginRes.text();
    console.log('login after approve status:', loginRes.status);
    console.log('login after approve body:', loginBody);
  } catch (error) {
    console.error('error', error);
  }
})();
