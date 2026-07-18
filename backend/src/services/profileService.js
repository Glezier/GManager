const userValidators = require("../validators/userValidators")
const authValidators = require("../validators/authValidators")
const userRepository = require("../repositories/userRepository")
const refreshTokensRepository = require("../repositories/refreshTokensRepository")
const emailVerificationRepository = require('../repositories/emailVerificationRepository')
const { enviarEmailVerificacao } = require('../utils/EmailService')
const { gerarTokenEmail, gerarHashToken } =  require('../utils/EmailVerification')
const bcrypt = require("bcryptjs")
const AppError = require("../utils/AppError")

function validarUsuarioEncontrado (usuario) {
    if (!usuario) {
        throw new AppError(
            'Usuário não encontrado',
            404,
            'USER_NOT_FOUND'
        )
    }
}

async function validarSenhaAtual (senhaInformada, senhaHash) {
    const senhaValida = await bcrypt.compare(senhaInformada, senhaHash)

    if (!senhaValida) {
        throw new AppError(
            'Senha atual incorreta',
            400,
            'INVALID_CURRENT_PASSWORD'
        )
    }
}

exports.buscarPerfil = async (usuarioId) => {
    const usuario = await userRepository.findPublicById(usuarioId)
    
    validarUsuarioEncontrado(usuario)

    return usuario
}

exports.atualizarNome = async (usuarioId, dados) => {
    const nomeCorrigido = userValidators.validarNome(dados.nome)

    const usuario = await userRepository.updateName(usuarioId, nomeCorrigido)

    validarUsuarioEncontrado(usuario)
    
    return usuario
} 

exports.atualizarTema = async (usuarioId, dados) => {
    const temaCorrigido = userValidators.validarTema(dados.tema)
    
    const usuario = await userRepository.updateTheme(usuarioId, temaCorrigido)

    validarUsuarioEncontrado(usuario)

    return usuario
}

exports.atualizarSenha = async (usuarioId, dados) => {
    const { senhaAtual, novaSenha, confirmarSenha } = dados

    authValidators.validarTrocaSenha({ senhaAtual, novaSenha, confirmarSenha })

    const senha = await userRepository.getSenha(usuarioId)

    validarUsuarioEncontrado(senha)

    await validarSenhaAtual(senhaAtual, senha)

    const senhaIgual = await bcrypt.compare(novaSenha, senha)

    if (senhaIgual) {
        throw new AppError(
            'A nova senha deve ser diferente da senha atual',
            400,
            'SAME_PASSWORD'
        )
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10)

    // Atualiza na tabela usuários
    await userRepository.updateSenha(usuarioId, novaSenhaHash)

    // Revoga os refresh tokens
    await refreshTokensRepository.revokeAllRefreshTokens(usuarioId)

    return {
        message: "Senha atualizada com sucesso"
    }
}

exports.atualizarEmail = async (usuarioId, dados) => {
    const { email, senhaAtual } = dados

    const { emailCorrigido } = authValidators.validarTrocaEmail({ email, senhaAtual })

    const usuario = await userRepository.findByEmail(usuarioId)

    validarUsuarioEncontrado(usuario)

    if (emailCorrigido === usuario.email) {
        throw new AppError(
            'O novo email deve ser diferente do email atual',
            400,
            'SAME_EMAIL'
        )
    }

    await validarSenhaAtual(senhaAtual, usuario.senha)

    const emailExist = await userRepository.findByEmailExceptUser(emailCorrigido, usuarioId)

    if (emailExist) {
        throw new AppError(
            'Email já cadastrado',
            400,
            'EMAIL_ALREADY_EXISTS'
        )
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

    return{
        message: 'Enviamos um link de verificação para o novo email.'
    }
}