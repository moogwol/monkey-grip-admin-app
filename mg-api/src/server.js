const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import routes
const membersRouter = require('./routes/contacts'); // Members routes (renamed from contacts)
const couponsRouter = require('./routes/coupons');
const memberCouponsRouter = require('./routes/member-coupons');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api/members', membersRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api/members', memberCouponsRouter); // Member-specific coupon routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'BJJ Club Management API'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'BJJ Club Management API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      members: '/api/members',
      coupons: '/api/coupons',
      member_coupons: '/api/members/:id/coupons',
      member_stats: '/api/members/stats',
      coupon_stats: '/api/coupons/stats'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🥋 BJJ Club Management API server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DB_NAME || 'bjj_club_db'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;