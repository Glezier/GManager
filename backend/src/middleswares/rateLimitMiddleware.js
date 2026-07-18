const { rateLimit, ipKeyGenerator } =  require('express-rate-limit')

exports.authLimiter = rateLimit({
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

exports.loginLimiter = rateLimit({
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

exports.tasksWriterLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => { // Limita por IP ou por id do usuário
        return req.userId ? `user:${req.userId}` : `ip:${ipKeyGenerator(req.ip)}`
    },
    message: {
        error:{
            code: 'TASK_WRITE_RATE_LIMIT_EXCEEDED',
            message: 'Muitas alterações em tarefas. Tente novamente em instantes.'
        }
    }
})

exports.profileNameLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `user:${req.userId}`,
    message: {
        error: {
            code: 'PROFILE_NAME_RATE_LIMIT_EXCEEDED',
            message: 'Muitas alterações de nome. Tente novamente mais tarde.'
        }
    }
})

exports.emailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 3,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `user:${req.userId}`,
    message: {
        error: {
            code: 'EMAIL_CHANGE_RATE_LIMIT_EXCEEDED',
            message: 'Muitas tentativas de troca de email. Tente novamente mais tarde.'
        }
    }
})

exports.passwordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 2,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `user:${req.userId}`,
    message: {
        error: {
            code: 'PASSWORD_CHANGE_RATE_LIMIT_EXCEEDED',
            message: 'Muitas tentativas de alteração de senha. Tente novamente mais tarde.'
        }
    }
})

exports.themeLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `user:${req.userId}`,
    message: {
        error:{
            code: 'THEME_CHANGE_RATE_LIMIT_EXCEEDED',
            message: 'Aguarde 1 minuto para mudar de tema novamente.'
        }
    }
})
