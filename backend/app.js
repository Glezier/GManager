require('dotenv').config()
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