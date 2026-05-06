require('dotenv').config()
const cookieParser = require('cookie-parser')
const corsOptions = require('./src/config/corsOptions')
const helmet = require('helmet') // Comportamento mais seguro no navegador, cuida dos headers

//Validação de variáves de ambiente
if (process.env.NODE_ENV === 'production'){
  const requiredEnv = [
    'DB_URL', 'JWT_SECRET', 
    'REFRESH_TOKEN_SECRET', 
    'FRONTEND_URL', 
    'RESEND_API_KEY', 'EMAIL_FROM'
  ]

  const missingEnv = requiredEnv.filter((envVar) => !process.env[envVar])

  if (missingEnv.length > 0) {
    throw new Error(
      `Variaveis de ambiente obrigatorias em producao ausentes: ${missingEnv.join(', ')}`
    )
  }

  if (process.env.COOKIE_SECURE !== 'true') {
    throw new Error('COOKIE_SECURE deve ser true em producao')
  }
}

const express = require('express')
const cors = require('cors')

const tarefasRoutes = require('./src/routes/tarefasRoutes')
const authRoutes = require('./src/routes/authRoutes')
const errorMiddleware = require('./src/middleswares/errorMiddleware')

const app = express()

app.set('etag', false)

app.use(cookieParser())
app.use(cors(corsOptions))
app.use(helmet())
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
}

app.get('/', (req, res) => {
  res.json({ message: "API funcionando" })
})

app.use((req, res, next) => {
  const inicio = Date.now()

  res.on('finish', () => {
    const duracao = Date.now() - inicio

    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duracao}ms`)
  })

  next()
})

app.use('/tarefas', tarefasRoutes)
app.use('/auth', authRoutes)

app.use(errorMiddleware)

module.exports = app