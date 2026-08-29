// Load environment variables from server/.env file into process.env
require('dotenv').config();

// SautiSmart Express Server Root
const express = require('express');
const cors = require('cors');

// Import MongoDB database connection helper
const connectDB = require('./config/db');

// Import REST API route modules
const authRoutes = require('./routes/authRoutes');
const archiveRoutes = require('./routes/archiveRoutes');
const setPieceRoutes = require('./routes/setPieceRoutes');
const theoryRoutes = require('./routes/theoryRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Establish connection to MongoDB Atlas or local database
connectDB();

// Initialize the Express application
const app = express();

// Enable Cross-Origin Resource Sharing (CORS) so the Next.js client can make requests
app.use(cors());

// Parse incoming request payloads as JSON (limit 10mb for media metadata / uploads)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint: Used to check if the backend API is live and responding
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'SautiSmart API',
    timestamp: new Date().toISOString(),
  });
});

// Register API Domain Routes
app.use('/api/auth', authRoutes);
app.use('/api/archive', archiveRoutes);
app.use('/api/setpieces', setPieceRoutes);
app.use('/api/theory', theoryRoutes);
app.use('/api/admin', adminRoutes);

// 404 Fallback Middleware: Handles requests to unregistered endpoints
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler Middleware: Catches uncaught server errors cleanly
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Define server port from environment configuration (defaults to 5000)
const PORT = process.env.PORT || 5000;

// Start listening for incoming HTTP requests when executed directly
if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`SautiSmart API server running on port ${PORT}`);
  });
}

module.exports = app;
