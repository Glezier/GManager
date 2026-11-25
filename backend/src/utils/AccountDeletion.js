const crypto = require('crypto')

function gerarTokenExclusao() {
    return crypto.randomBytes(32).toString('hex')
}

function gerarHashTokenExclusao(token) {
    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')
}

// 10 minutos para o token de exclusão de conta expirar
function gerarExpiracaoExclusao() {
    return new Date(Date.now() + 10 * 60 * 1000)
}

module.exports = {
    gerarTokenExclusao,
    gerarHashTokenExclusao,
    gerarExpiracaoExclusao
}