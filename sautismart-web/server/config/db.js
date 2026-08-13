const mongoose = require('mongoose');
const dns = require('dns');

// Configure Node.js DNS to use Google and Cloudflare public DNS for SRV queries
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

/**
 * Asynchronously connects to MongoDB Atlas or local MongoDB using Mongoose.
 * Evaluates process.env.MONGODB_URI or process.env.MONGO_URI, falling back to localhost.
 */
const connectDB = async () => {
  try {
    // Resolve connection URI from environment variables loaded by dotenv
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sautismart';

    // Enforce strict query filtering in Mongoose to prevent unexpected field queries
    mongoose.set('strictQuery', true);

    // Initiate MongoDB connection
    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    // Register event listener for runtime connection errors
    mongoose.connection.on('error', (error) => {
      console.error(`MongoDB connection error: ${error.message}`);
    });

    // Register event listener for connection loss events
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB connection lost. Attempting to reconnect is handled by the driver.');
    });

    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB Atlas: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
