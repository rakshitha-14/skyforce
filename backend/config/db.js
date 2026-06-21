const mongoose = require('mongoose');
const { mockConnect } = require('./mockDb');

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    mockConnect();
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    mockConnect();
  }
};

module.exports = connectDB;
