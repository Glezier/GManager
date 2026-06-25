const validator = require('validator')
const AppError = require("../utils/AppError")

// Limites para campos do usuário
exports.LIMITES_USUARIO = {
    nome_minimo: 2,
    nome_maximo: 100,
    email: 120,
    senha_minima: 8,
    senha_maxima: 50
}

exports.validarNome = (nome) => {
    if (!nome){
        throw new AppError("Nome é obrigatório", 400, 'VALIDATION_ERROR')
    }

    const nomeCorrigido = nome.trim()

    if (
        nomeCorrigido.length < exports.LIMITES_USUARIO.nome_minimo ||
        nomeCorrigido.length > exports.LIMITES_USUARIO.nome_maximo
    ){
        throw new AppError(
            `O nome deve possuir entre ${exports.LIMITES_USUARIO.nome_minimo} e ${exports.LIMITES_USUARIO.nome_maximo}`,
            400,
            "VALIDATION_ERROR"
        )
    }

    return nomeCorrigido
}

exports.validarEmail = (email) => {
    if (!email){
        throw new AppError("Email é obrigatório", 400, "VALIDATION_ERROR")
    }
    
    const emailCorrigido = email.trim().toLowerCase()

    if(!validator.isEmail(emailCorrigido)){
        throw new AppError('Email inválido', 400, 'VALIDATION_ERROR')
    }

    if (emailCorrigido.length > exports.LIMITES_USUARIO.email){
        throw new AppError(
            `O email deve possuir no máximo ${exports.LIMITES_USUARIO.email} caracteres`,
            400,
            'VALIDATION_ERROR'
        )
    }

    return emailCorrigido
}

exports.validarSenha = (senha) => {
    if (!senha){
        throw new AppError("Senha é obrigatória", 400, "VALIDATION_ERROR")
    }

    if (senha.length < exports.LIMITES_USUARIO.senha_minima || senha.length > exports.LIMITES_USUARIO.senha_maxima){
        throw new AppError(
            `A senha deve possuir entre ${exports.LIMITES_USUARIO.senha_minima} e ${exports.LIMITES_USUARIO.senha_maxima} caracteres`, 
            400, 
            'VALIDATION_ERROR'
        )
    }
}

exports.confirmarSenha = (senha, confirmarSenha) => {
    if (!confirmarSenha){
        throw new AppError("Confirmação de senha obrigatória", 400, "VALIDATION_ERROR")
    }

    exports.validarSenha(senha)
    exports.validarSenha(confirmarSenha)

    if (senha !== confirmarSenha){
        throw new AppError("As senhas devem conferir", 400, "VALIDATION_ERROR")
    }
}

exports.validarTema = (tema) => {
    if(!tema){
        throw new AppError('Tema é obrigatório', 400, 'VALIDATION_ERROR')
    }

    if (!['dark', 'light'].includes(tema)) {
        throw new AppError('Tema inválido', 400, 'VALIDATION_ERROR')
    }

    return tema
}