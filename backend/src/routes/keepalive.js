const express = require('express')
const router = express.Router()
const pool = require('../database/db')

router.get('/', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.status(200).json({ ok: true })
  } catch {
    res.status(500).json({ ok: false })
  }
})

module.exports = router