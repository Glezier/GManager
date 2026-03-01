const express = require('express')
const router = express.Router()
const pool = require('../database/db')

// GET /tarefas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tarefas ORDER BY id DESC')
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar tarefas' })
  }
})

module.exports = router