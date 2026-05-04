// Trata toda a lógica do cors

const AppError = require("../utils/AppError")

const defaultDevOrigins = ['http://localhost:5173']

// Definir a origem das requisições podendo ser react default ou do deploy
function getAllowedOrigins(){
    const configuredOrigins = process.env.CORS_ALLOWED_ORIGINS
    ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
    : []

    if (process.env.NODE_ENV === 'production' && configuredOrigins.length === 0){
        throw new Error('FRONTEND_URL deve ser configurada em produção')
    }

    return configuredOrigins.length > 0 ? configuredOrigins : defaultDevOrigins
}

const allowedOrigins = getAllowedOrigins()

const corsOptions = {
    origin(origin, callback){ // Chamada toda vez que se recebe uma requisição
        if (!origin || allowedOrigins.includes(origin)){ // Verifica se a requisição é válida
            callback(null, true) // Tudo ok, passa null como erro e permite requisição
            return
        }

        callback(new AppError('Origem não permitida', 403, 'CORS_ORIGIN_NOT_ALLOWED')) // Requisição de origem inválida
    },
    credentials: true // Permite troca de cookies
}

module.exports = corsOptions