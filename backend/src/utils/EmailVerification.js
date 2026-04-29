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

module.exports = {
    gerarTokenEmail,
    gerarHashToken
}