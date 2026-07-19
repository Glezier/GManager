const emailVerificationService = require("../services/emailVerificationService")

// Verificação de email
exports.verificarEmail = async(req, res, next) => {
    try{
        const response = await emailVerificationService.verificarEmail(req.query.token)
        
        res.json(response)
    } catch(error){
        next(error)
    }
}

// Reenviar email de verificação
exports.reenviarVerificacao = async(req,res,next) => {
    try{
        const response = await emailVerificationService.reenviarVerificacao(req.body)
        
        res.json(response)
    } catch(error){
        next(error)
    }
}