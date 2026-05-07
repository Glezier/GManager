const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DB_URL,
  max: 1,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
})

module.exports = pool