const bcrypt = require('bcryptjs')
const AppError = require('../utils/AppError')
const userValidators = require('../validators/userValidators')
const userRepository = require('../repositories/userRepository')
const passwordResetRepository = require('../repositories/passwordResetRepository')
const refreshTokenRepository = require('../repositories/refreshTokensRepository')
const {
    gerarTokenResetSenha,
    gerarHashTokenResetSenha,
    gerarExpiracaoResetSenha
} = require('../utils/PasswordReset')
const { enviarEmailRecuperacaoSenha } = require('../utils/EmailService')

const MENSAGEM_RECUPERACAO = 'Verifique o email informado'

// Gera token de troca de senha e guarda no banco
exports.solicitarRecuperacaoSenha = async ({ email }) => {
    const emailCorrigido = userValidators.validarEmail(email)
    
    const usuario = await userRepository.getUserByEmail(emailCorrigido)

    if (!usuario){
        return {
            message: MENSAGEM_RECUPERACAO
        }
    }

    await passwordResetRepository.invalidarTokensResetSenha(usuario.id)

    const token = gerarTokenResetSenha()
    const tokenHash = gerarHashTokenResetSenha(token)
    const expiresAt = gerarExpiracaoResetSenha()

    await passwordResetRepository.registrarTokenResetSenha(
        usuario.id,
        tokenHash,
        expiresAt
    )

    await enviarEmailRecuperacaoSenha({
        email: usuario.email,
        nome: usuario.nome,
        token
    })

    return {
        message: MENSAGEM_RECUPERACAO,
        devPasswordResetToken: process.env.NODE_ENV !== 'production' ? token : undefined
    }
}

exports.redefinirSenha = async ({ token, novaSenha, confirmarSenha }) => {
    if (!token){
        throw new AppError(
            'Token de recuperação não informado',
            400,
            'VALIDATION_ERROR'
        )
    }

    userValidators.confirmarSenha(novaSenha, confirmarSenha)

    const tokenHash = gerarHashTokenResetSenha(token)

    const tokenData = await passwordResetRepository.buscarTokenResetSenha(tokenHash)

    if (!tokenData){
        throw new AppError(
            'Link de recuperação inválido ou expirado',
            400,
            'INVALID_RESET_TOKEN'
        )
    }

    const senhaAtualHash = await userRepository.getSenha(tokenData.usuario_id)

    if (!senhaAtualHash){
        throw new AppError(
            'Usuário não encontrado',
            404,
            'USER_NOT_FOUND'
        )
    }

    const senhaIgual = await bcrypt.compare(novaSenha, senhaAtualHash)

    if (senhaIgual){
        throw new AppError(
            'A nova senha deve ser diferente da senha atual',
            400,
            'SAME_PASSWORD'
        )
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10)

    await userRepository.updateSenha(tokenData.usuario_id, novaSenhaHash)
    await passwordResetRepository.marcarTokenResetSenhaComoUsado(tokenData.id)
    await refreshTokenRepository.revokeAllRefreshTokens(tokenData.usuario_id)

    return {
        message: 'Senha redefinida com sucesso'
    }
}