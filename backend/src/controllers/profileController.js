const userRepository = require('../repositories/userRepository')
const AppError = require('../utils/AppError')
const validator = require('validator')
const {gerarTokenEmail, gerarHashToken} =  require('../utils/EmailVerification')
const bcrypt = require('bcryptjs')
const { enviarEmailVerificacao } = require('../utils/EmailService')
const emailVerificationRepository = require('../repositories/emailVerificationRepository')
const refreshTokensRepository = require('../repositories/refreshTokensRepository')

// Limites para campos do usuário
const LIMITES_USUARIO = {
    nome_minimo: 2,
    nome_maximo: 100,
    email: 120,
    senha_minima: 8,
    senha_maxima: 50
}

// Função para validação do email
function isValidEmail(email){
    return validator.isEmail(email)
}

// Dados do usuário
exports.me = async(req,res,next) => {
    try{
        const usuario_id = req.userId

        const usuario = await userRepository.findPublicById(usuario_id)

        if (!usuario){
            return next(new AppError(
                'Usuário não encontrado',
                404,
                'USER_NOT_FOUND'
            ))
        }

        res.json(usuario)
    } catch(error){
        next(error)
    }
}

// Atualizar perfil QUE NA VERDADE É SÓ O NOME
exports.atualizarNome = async(req,res,next) => {
    try{
        const usuarioId = req.userId
        const { nome } = req.body

        if(!nome){
            return next(new AppError(
                'Nome é obrigatório',
                400,
                'VALIDATION_ERROR'
            ))
        }

        const nomeCorrigido = nome.trim()

        if (nomeCorrigido.length > LIMITES_USUARIO.nome_maximo || nomeCorrigido.length < LIMITES_USUARIO.nome_minimo){
            return next(new AppError(
                `O nome deve possuir tamanho entre ${LIMITES_USUARIO.nome_minimo} e ${LIMITES_USUARIO.nome_maximo} caracteres`,
                400,
                'VALIDATION_ERROR'
            ))
        }

        const usuario = await userRepository.updateName(usuarioId, nomeCorrigido)

        res.json(usuario)

    } catch(error){
        next(error)
    }
}

// Troca de email
exports.atualizarEmail = async (req, res, next) => {
    try {
        const usuarioId = req.userId
        const { email, senhaAtual } = req.body

        if (!email || !senhaAtual) {
            return next(new AppError(
                'Novo email e senha atual são obrigatórios',
                400,
                'VALIDATION_ERROR'
            ))
        }

        if (!isValidEmail(email)) {
            return next(new AppError('Email inválido', 400, 'VALIDATION_ERROR'))
        }

        const novoEmail = email.trim().toLowerCase()

        if (novoEmail.length > LIMITES_USUARIO.email) {
            return next(new AppError(
                `O email deve possuir no máximo ${LIMITES_USUARIO.email} caracteres`,
                400,
                'VALIDATION_ERROR'
            ))
        }

        const usuario = await userRepository.findByEmail(usuarioId)

        if (usuario === null) {
            return next(new AppError(
                'Usuário não encontrado',
                404,
                'USER_NOT_FOUND'
            ))
        }

        if (novoEmail === usuario.email) {
            return next(new AppError(
                'O novo email deve ser diferente do email atual',
                400,
                'SAME_EMAIL'
            ))
        }

        const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha)

        if (!senhaValida) {
            return next(new AppError(
                'Senha atual incorreta',
                400,
                'INVALID_CURRENT_PASSWORD'
            ))
        }

        const emailExist = await userRepository.findByEmailExceptUser(novoEmail, usuarioId)

        if (emailExist) {
            return next(new AppError(
                'Email já cadastrado',
                400,
                'EMAIL_ALREADY_EXISTS'
            ))
        }

        const tokenEmail = gerarTokenEmail()
        const tokenHash = gerarHashToken(tokenEmail)

        await emailVerificationRepository.invalidateOldersEmailTokens(usuarioId)
        
        await emailVerificationRepository.createEmailChangeToken(usuarioId, tokenHash, novoEmail)

        await enviarEmailVerificacao({
            email: novoEmail,
            nome: usuario.nome,
            token: tokenEmail,
            motivo: 'troca-email'
        })

        res.json({
            message: 'Enviamos um link de verificação para o novo email.'
        })
    } catch (error) {
        next(error)
    }
}

// Funcao para verificação de senha
function validarNovaSenha(novaSenha, confirmarSenha){
    if (!novaSenha || !confirmarSenha){
        throw new AppError(
            `Nova senha e confirmação são obrigatórias`,
            400,
            'VALIDATION_ERROR'
        )
    }

    if (novaSenha !== confirmarSenha){
        throw new AppError(
            'Senhas não conferem',
            400,
            'VALIDATION_ERROR'
        )
    }

    if (
        novaSenha.length < LIMITES_USUARIO.senha_minima ||
        novaSenha.length > LIMITES_USUARIO.senha_maxima
    ) {
        throw new AppError(
            `A senha deve possuir entre ${LIMITES_USUARIO.senha_minima} e ${LIMITES_USUARIO.senha_maxima} caracteres`,
            400,
            'VALIDATION_ERROR'
        )
    }
}

// Atualizar senha
exports.atualizarSenha = async(req,res,next) => {
    try{
        const usuarioId = req.userId
        const { senhaAtual, novaSenha, confirmarSenha } = req.body

        if (!senhaAtual){
            return next(new AppError(
                'Senha atual é obrigatória',
                400,
                'VALIDATION_ERROR'
            ))
        }

        validarNovaSenha(novaSenha, confirmarSenha)

        const senha = await userRepository.getSenha(usuarioId)

        if (senha == null){
            return next(new AppError(
                'Usuário não encontrado',
                404,
                'USER_NOT_FOUND'
            ))
        }

        const senhaAtualValida = await bcrypt.compare(senhaAtual, senha)

        if (!senhaAtualValida) {
            return next(new AppError(
                'Senha atual incorreta',
                400,
                'INVALID_CURRENT_PASSWORD'
            ))
        }

        const senhaIgual = await bcrypt.compare(novaSenha, senha)

        if (senhaIgual) {
            return next(new AppError(
                'A nova senha deve ser diferente da senha atual',
                400,
                'SAME_PASSWORD'
            ))
        }

        const novaSenhaHash = await bcrypt.hash(novaSenha, 10)

        // Atualiza na tabela usuários
        await userRepository.updateSenha(usuarioId, novaSenhaHash)

        // Revoga os refresh tokens
        await refreshTokensRepository.revokeRefreshTokens(usuarioId)

        res.json({
            message: 'Senha atualizada com sucesso'
        })


    } catch(error){
        next(error)
    }
}

// Atualizar tema
exports.atualizarTema = async(req,res,next) => {
    try{
        const usuarioId = req.userId
        const { tema } = req.body

        if(!tema){
            return(next(new AppError(
                'Tema é obrigatório',
                400,
                'VALIDATION_ERROR'
            )))
        }

        if (!['dark', 'light'].includes(tema)) {
            return next(new AppError(
                'Tema inválido',
                400,
                'VALIDATION_ERROR'
            ))
        }

        const result = await userRepository.updateTheme(usuarioId, tema)

        res.json(result)

    } catch(error){
        next(error)
    }
}
