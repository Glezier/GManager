const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DB_URL,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

module.exports = pool
