const { rateLimit } =  require('express-rate-limit')

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Intervalo de tempo de 15 minutos
    limit: 20, // Máximo de 20 requisições
    standardHeaders: true, // Headers de retorno de quantidade de tentativas
    legacyHeaders: false, // Desativa headers antigos
    message:{
        error:{
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Muitas tentativas. Tente novamente em 15 minutos.'
        }
    }
})

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message:{
        error:{
            code: 'LOGIN_RATE_LIMIT_EXCEEDED',
            message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
        }
    }
})

const tasksWriterLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error:{
            code: 'TASK_WRITE_RATE_LIMIT_EXCEEDED',
            message: 'Muitas alterações em tarefas. Tente novamente em instantes.'
        }
    }
})

module.exports = { authLimiter, loginLimiter, tasksWriterLimiter}