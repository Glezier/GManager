const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const userRepository = require('../repositories/userRepository')

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization
    const [tipo, token, extra] = (authHeader || '').split(' ')

    if (!authHeader) {
        return next(
            new AppError('Token não fornecido', 401, 'TOKEN_MISSING')
        )
    }

    if (tipo !== 'Bearer' || !token || extra) {
        return next(
            new AppError('Token inválido', 401, 'TOKEN_INVALID')
        )
    }

    let decoded

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (
            typeof decoded !== 'object' ||
            !Number.isInteger(decoded.id) ||
            decoded.id <= 0
        ) {
            throw new Error('Identificação inválida')
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(
                new AppError('Token expirado', 401, 'TOKEN_EXPIRED')
            )
        }

        return next(
            new AppError('Token inválido', 401, 'TOKEN_INVALID')
        )
    }

    try {
        const existe = await userRepository.usuarioExistePorId(decoded.id)

        if (!existe) {
            return next(
                new AppError(
                    'Sessão inválida. Faça login novamente.',
                    401,
                    'TOKEN_INVALID'
                )
            )
        }

        req.userId = decoded.id
        return next()
    } catch (error) {
        return next(error)
    }
}