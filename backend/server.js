const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

// Load env vars
dotenv.config();

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'SkyForceLocalDevSecret123!';
  console.warn('⚠️  WARNING: JWT_SECRET is not set. Using a local default secret. Set JWT_SECRET in .env for production.');
}

const createDefaultAdmin = async () => {
  const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
  const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123';

  try {
    const existingAdmin = await User.findOne({ role: 'Admin' });
    if (!existingAdmin) {
      await User.create({
        name: 'Administrator',
        email: defaultAdminEmail,
        password: defaultAdminPassword,
        role: 'Admin',
        department: 'Administration',
        designation: 'Admin',
        isApproved: true,
      });
      console.log('------------------------------------------------------------');
      console.log(`✅ Default admin user created:`);
      console.log(`   Email: ${defaultAdminEmail}`);
      console.log(`   Password: ${defaultAdminPassword}`);
      console.log('------------------------------------------------------------');
    }
  } catch (error) {
    console.error('Failed to create default admin user:', error.message);
  }
};

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routes
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const userRoutes = require('./routes/userRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const adminRoutes = require('./routes/adminRoutes');

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Enterprise Project & Workforce Management System API' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await createDefaultAdmin();

  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
};

startServer();

module.exports = app;
