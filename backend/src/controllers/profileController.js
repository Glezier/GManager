const profileService = require("../services/profileService")

// Dados do usuário
exports.me = async(req,res,next) => {
    try{
        const usuario = await profileService.buscarPerfil(req.userId)
        
        res.json(usuario)
    } catch(error){
        next(error)
    }
}

// Atualizar nome
exports.atualizarNome = async(req,res,next) => {
    try{
        const usuario = await profileService.atualizarNome(req.userId, req.body)

        res.json(usuario)

    } catch(error){
        next(error)
    }
}

// Troca de email
exports.atualizarEmail = async (req, res, next) => {
    try {
        const resposta = await profileService.atualizarEmail(req.userId, req.body)

        res.json(resposta)
    } catch (error) {
        next(error)
    }
}

// Atualizar senha
exports.atualizarSenha = async(req,res,next) => {
    try{
        const resposta = await profileService.atualizarSenha(req.userId, req.body)
        
        res.json(resposta)
    } catch(error){
        next(error)
    }
}

// Atualizar tema
exports.atualizarTema = async(req,res,next) => {
    try{
        const usuario = await profileService.atualizarTema(req.userId, req.body)

        res.json(usuario)
    } catch(error){
        next(error)
    }
}