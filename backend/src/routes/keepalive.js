const express = require('express')
const router = express.Router()
const pool = require('../database/db')

router.get('/', async (req, res) => {
  const secret = process.env.KEEPALIVE_SECRET

  if (process.env.NODE_ENV === 'production'){
    if(!secret || req.query.secret !== secret){
      return res.status(404).json({ ok:false})
    }
  }
  try {
    await pool.query('SELECT 1')
    res.status(200).json({ ok: true })
  } catch {
    res.status(500).json({ ok: false })
  }
})

module.exports = router