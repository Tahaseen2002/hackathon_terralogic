/**
 * Database configuration and connection management
 */
const mongoose = require('mongoose');

const dbConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pulsevo',
  options: {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 5000,
  },
  settings: {
    bufferCommands: false,
    bufferTimeoutMS: 3000
  }
};

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    // Apply mongoose settings
    mongoose.set('bufferCommands', dbConfig.settings.bufferCommands);
    mongoose.set('bufferTimeoutMS', dbConfig.settings.bufferTimeoutMS);

    console.log('🔌 Attempting MongoDB connection...');
    
    if (dbConfig.uri.includes('mongodb+srv')) {
      console.log('📡 Using MongoDB Atlas');
    } else {
      console.log('💻 Using local MongoDB');
    }

    await mongoose.connect(dbConfig.uri, dbConfig.options);
    console.log('✅ MongoDB connected successfully');
    
    return true;
  } catch (error) {
    console.log('⚠️ MongoDB connection failed, using in-memory storage');
    console.log('Error:', error.message);
    console.log('💡 Tip: Check your MONGODB_URI in backend/.env');
    return false;
  }
};

/**
 * Check if MongoDB is connected
 */
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Disconnect from MongoDB
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};

module.exports = {
  connectDB,
  isConnected,
  disconnectDB,
  dbConfig
};
