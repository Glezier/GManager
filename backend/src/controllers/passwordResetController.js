const passwordResetService = require('../services/passwordResetService')

exports.solicitarRecuperacaoSenha = async (req, res, next) => {
    try{
        const response = await passwordResetService.solicitarRecuperacaoSenha(req.body)

        res.json(response)
    } catch (error){
        next(error)
    }
}

exports.redefinirSenha = async (req, res, next) => {
    try{
        const response = await passwordResetService.redefinirSenha(req.body)

        res.json(response)
    } catch(error){
        next(error)
    }
}