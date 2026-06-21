const fetch = global.fetch;
const base = 'http://localhost:5000/api';
(async () => {
  try {
    const adminLogin = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'Admin@123' }),
    });
    const adminBody = await adminLogin.text();
    console.log('admin login status:', adminLogin.status);
    console.log('admin login body:', adminBody);

    const newUserEmail = 'flowtester@example.com';
    const userPassword = 'Flow1234';
    const register = await fetch(`${base}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Flow Tester',
        email: newUserEmail,
        password: userPassword,
        role: 'Manager',
        department: 'QA',
        designation: 'Lead',
      }),
    });
    console.log('register status:', register.status);
    console.log('register body:', await register.text());

    const unapprovedLogin = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newUserEmail, password: userPassword }),
    });
    console.log('unapproved login status:', unapprovedLogin.status);
    console.log('unapproved login body:', await unapprovedLogin.text());

    if (adminLogin.status !== 200) {
      return;
    }
    const adminData = JSON.parse(adminBody);
    const usersRes = await fetch(`${base}/admin/users`, {
      headers: { Authorization: `Bearer ${adminData.token}` },
    });
    const users = await usersRes.json();
    console.log('users count:', users.length);
    const target = users.find((u) => u.email === newUserEmail);
    if (!target) {
      console.log('target user not found');
      return;
    }
    console.log('target user', target);

    const approveRes = await fetch(`${base}/admin/users/${target._id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminData.token}` },
    });
    console.log('approve status:', approveRes.status, await approveRes.text());

    const approvedLogin = await fetch(`${base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newUserEmail, password: userPassword }),
    });
    console.log('approved login status:', approvedLogin.status);
    console.log('approved login body:', await approvedLogin.text());
  } catch (error) {
    console.error(error);
  }
})();
