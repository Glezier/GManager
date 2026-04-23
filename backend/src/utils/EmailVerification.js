const crypto = require('crypto')

function gerarTokenEmail(){
    return crypto.randomBytes(32).toString('hex')
}

function gerarHashToken(token){
    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')
}

function gerarExpiracaoEmailToken(){
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10) // Expira após 10 minutos
    return expiresAt
}

module.exports = {
    gerarTokenEmail,
    gerarHashToken,
    gerarExpiracaoEmailToken,
}