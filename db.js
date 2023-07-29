const { Pool } = require('pg');

// config db
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bts',
  password: 'admin',
  port: 5432,
});

module.exports = pool;
