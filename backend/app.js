require('dotenv').config()
const cookieParser = require('cookie-parser')
const corsOptions = require('./src/config/corsOptions')
const helmet = require('helmet') // Comportamento mais seguro no navegador, cuida dos headers

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
const authRoutes = require('./src/routes/authRoutes')
const errorMiddleware = require('./src/middleswares/errorMiddleware')

const app = express()

app.use(cookieParser())
app.use(cors(corsOptions))
app.use(helmet())
app.use(express.json())
app.set('trust proxy', 1)

app.get('/', (req, res) => {
  res.json({ message: "API funcionando" })
})

app.use('/tarefas', tarefasRoutes)
app.use('/auth', authRoutes)

app.use(errorMiddleware)

module.exports = app