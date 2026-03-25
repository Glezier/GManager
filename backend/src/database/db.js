const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl:{
    rejectUnauthorized: false, // nao precisa validar certificado
  },
})

module.exports = pool