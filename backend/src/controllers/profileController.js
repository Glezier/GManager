const userRepository = require('../repositories/userRepository')
const AppError = require('../utils/AppError')
const authValidators = require("../validators/authValidators")
const userValidators = require("../validators/userValidators")
const {gerarTokenEmail, gerarHashToken} =  require('../utils/EmailVerification')
const bcrypt = require('bcryptjs')
const { enviarEmailVerificacao } = require('../utils/EmailService')
const emailVerificationRepository = require('../repositories/emailVerificationRepository')
const refreshTokensRepository = require('../repositories/refreshTokensRepository')

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

        const nomeCorrigido = userValidators.validarNome(nome)

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

        const { emailCorrigido } = authValidators.validarTrocaEmail({ email, senhaAtual })

        const usuario = await userRepository.findByEmail(usuarioId)

        if (usuario === null) {
            return next(new AppError(
                'Usuário não encontrado',
                404,
                'USER_NOT_FOUND'
            ))
        }

        if (emailCorrigido === usuario.email) {
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

        const emailExist = await userRepository.findByEmailExceptUser(emailCorrigido, usuarioId)

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
        
        await emailVerificationRepository.createEmailChangeToken(usuarioId, tokenHash, emailCorrigido)

        await enviarEmailVerificacao({
            email: emailCorrigido,
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

// Atualizar senha
exports.atualizarSenha = async(req,res,next) => {
    try{
        const usuarioId = req.userId
        const { senhaAtual, novaSenha, confirmarSenha } = req.body

        authValidators.validarTrocaSenha({ senhaAtual, novaSenha, confirmarSenha})

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
        await refreshTokensRepository.revokeAllRefreshTokens(usuarioId)

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

        const temaCorrigido = userValidators.validarTema(tema)

        const result = await userRepository.updateTheme(usuarioId, temaCorrigido)

        res.json(result)

    } catch(error){
        next(error)
    }
}