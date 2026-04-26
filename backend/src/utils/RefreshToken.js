const crypto = require('crypto')

function gerarRefreshToken(){
    return crypto.randomBytes(40).toString('hex')
}

function gerarHashRefreshToken(token){
    return crypto.createHmac('sha256', process.env.REFRESH_TOKEN_SECRET)
    .update(token)
    .digest('hex')
}

// Gera refresh token com duração máxima de 30 dias
function gerarExpiracaoRefreshToken(){
    const expiresAt = new Date()
    expiresAt.setDate(
        expiresAt.getDate() + Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS || 30)
    )
    return expiresAt
}

module.exports = {
    gerarRefreshToken,
    gerarHashRefreshToken,
    gerarExpiracaoRefreshToken
}