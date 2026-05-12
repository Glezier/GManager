const app = require('./app')
const pool = require('./src/database/db')

const PORT = process.env.PORT || 3000 //fallback de porta

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
  })
}

module.exports = app