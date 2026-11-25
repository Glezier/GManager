const AppError = require('../utils/AppError')

exports.validarTokenExclusao = (token) => {
    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)){
        throw new AppError(
            'Link de exclusão inválido',
            400,
            'INVALID_ACCOUNT_DELETION_TOKEN'
        )
    }
    return token
}