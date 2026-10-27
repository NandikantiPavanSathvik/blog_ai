// ============================================
// Database Connection Configuration
// ============================================
// This file connects our app to MongoDB (the database).
//
// Think of MongoDB as a giant filing cabinet where we store:
// - User accounts
// - Business profiles
// - Generated articles
// - Learning data for our AI agent
// ============================================

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // If we can't connect to the database, the app can't work
    // So we stop the app completely
    process.exit(1);
  }
};

export default connectDB;
