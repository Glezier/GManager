require('dotenv').config()
const express = require('express')
const cors = require('cors')

const pool = require('./database/db')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: "API funcionando" })
})

const PORT = process.env.PORT || 3000

const tarefasRoutes = require('./routes/tarefas.routes')

app.use('/tarefas', tarefasRoutes)

pool.query('SELECT NOW()')
  .then(res => {
    console.log('Banco conectado:', res.rows[0])
  })
  .catch(err => {
    console.error('Erro ao conectar no banco:', err)
  })

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})