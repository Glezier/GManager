const express = require('express')
const router = express.Router()
const pool = require('../database/db')

// GET /tarefas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tarefas ORDER BY id DESC') //Select no banco de dados
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar tarefas' })
  }
})

// POST /tarefas
router.post('/', async (req, res) => {
  try {
    const { titulo, descricao, status } = req.body

    // É obrigatório tarefa possuir título
    if (!titulo) {
      return res.status(400).json({ error: "O título é obrigatório" })
    }

    // Adiciona a tarefa colocando status pendente como padrão
    const result = await pool.query(
      `INSERT INTO tarefas (titulo, descricao, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [titulo, descricao || null, status || 'pendente']
    )

    res.status(201).json(result.rows[0])

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao criar tarefa" })
  }
})

// PUT /tarefas/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { titulo, descricao, status } = req.body

    // Realiza a atualização da tarefa buscando por id
    // e altera apenas os campos enviados para alteração
    const result = await pool.query(
      `UPDATE tarefas
       SET titulo = COALESCE($1, titulo),
           descricao = COALESCE($2, descricao),
           status = COALESCE($3, status)
       WHERE id = $4
       RETURNING *`,
      [titulo, descricao, status, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada" })
    }

    res.json(result.rows[0])

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao atualizar tarefa" })
  }
})

// DELETE /tarefas/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    // Remove a tarefa pelo id
    const result = await pool.query(
      'DELETE FROM tarefas WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada" })
    }

    res.json({ message: "Tarefa deletada com sucesso" })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao deletar tarefa" })
  }
})

module.exports = router