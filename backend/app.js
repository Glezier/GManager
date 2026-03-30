require('dotenv').config()

//Validação de variáves de ambiente
const requiredEnv = ['DB_URL', 'JWT_SECRET']
const errEnv = requiredEnv.filter((envVar) => !process.env[envVar])
if (errEnv.length > 0) {
  throw new Error(
    `Variáveis de ambiente obrigatórias ausentes: ${errEnv.join(', ')}`
  )
}


const express = require('express')
const cors = require('cors')

const tarefasRoutes = require('./src/routes/tarefasRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: "API funcionando" })
})

app.use('/tarefas', tarefasRoutes)

const authRoutes = require('./src/routes/authRoutes')

app.use('/auth', authRoutes)

module.exports = app