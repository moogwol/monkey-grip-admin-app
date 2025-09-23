const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'bjj_club_db',
  user: process.env.DB_USER || 'bjjuser',
  password: process.env.DB_PASSWORD || 'bjjpass',
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to BJJ Club PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};