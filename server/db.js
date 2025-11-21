const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/joselyn';

const pool = new Pool({ connectionString });

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool
};
