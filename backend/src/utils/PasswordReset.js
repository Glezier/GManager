const crypto = require('crypto')

// Token para trocar de senha enviado por email
function gerarTokenResetSenha() {
    const token = crypto.randomBytes(32).toString('hex')
    return token
}

// Hash do token a ser salvo no banco
function gerarHashTokenResetSenha(token) {
    const hash = crypto.createHmac('sha256', process.env.PASSWORD_RESET_TOKEN_SECRET)
                .update(token)
                .digest('hex')
    return hash
}

// Tempo de expiração do token
function gerarExpiracaoResetSenha() {
    const expiresAt = new Date
    expiresAt.setMinutes(
        expiresAt.getMinutes() + Number(process.env.PASSWORD_RESET_EXPIRES_MINUTES || 15)
    )
    return expiresAt
}

module.exports = {
    gerarTokenResetSenha,
    gerarHashTokenResetSenha,
    gerarExpiracaoResetSenha
}