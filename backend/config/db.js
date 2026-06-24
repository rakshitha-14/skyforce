const mongoose = require('mongoose');
const { mockConnect } = require('./mockDb');

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    mockConnect();
    return;
  }

  if (!process.env.MONGO_URI) {
    console.error('MongoDB connection string is missing. Set MONGO_URI in backend/.env.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed. This backend requires a working MongoDB Atlas connection.');
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
