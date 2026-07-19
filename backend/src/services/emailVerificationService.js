const userRepository = require("../repositories/userRepository")
const emailVerificationRepository = require("../repositories/emailVerificationRepository")
const userValidators = require("../validators/userValidators")
const { gerarTokenEmail, gerarHashToken } =  require('../utils/EmailVerification')
const { enviarEmailVerificacao } = require('../utils/EmailService')
const AppError = require("../utils/AppError")

// Verificação de email
exports.verificarEmail = async(token) => {
    if (!token){
        throw new AppError(
            'Token de verificação não informado',
            400,
            'VALIDATION_ERROR'
        )        
    }

    const tokenHash = gerarHashToken(token)

    // Busca token não usado nem expirado
    const tokenData = await emailVerificationRepository.getToken(tokenHash)

    if (tokenData == null){
        throw new AppError(
            'Token inválido ou expirado',
            400,
            'INVALID_TOKEN'
        )
    }

    // Verifica o tipo de email (cadastro ou mudança)
    // Mudança de email
    if (tokenData.tipo === 'troca-email') {
        const emailExist = await userRepository.findByEmailExceptUser(
            tokenData.novo_email, 
            tokenData.usuario_id
        )

        if (emailExist) {
            throw new AppError(
                'Este email já está em uso',
                400,
                'EMAIL_ALREADY_EXISTS'
            )
        }

        // Registra o novo email no banco
        await userRepository.setNovoEmailVerificado(
            tokenData.usuario_id, 
            tokenData.novo_email
        )

    } else { // Cadastro inicial de email 
        await userRepository.setEmailVerificado(tokenData.usuario_id)
    }

    // Atualiza token para usado
    await emailVerificationRepository.setTokenEmailUsado(tokenData.id)

    return {
        message: 'Email verificado com sucesso'
    }
}

// Reenviar email de verificação
exports.reenviarVerificacao = async(dados) => {
    const { email } = dados

    const emailCorrigido = userValidators.validarEmail(email)

    const usuario = await userRepository.getUserByEmail(emailCorrigido)

    if (usuario === null){
        throw new AppError(
            'Usuário não encontrado',
            404,
            'USER_NOT_FOUND'
        )
    }

    if (usuario.email_verificado){
        throw new AppError(
            'Este email já foi verificado',
            400,
            'EMAIL_ALREADY_VERIFIED'
        )
    }

    const tokenEmail = gerarTokenEmail()
    const tokenHash = gerarHashToken(tokenEmail)

    await emailVerificationRepository.registrarTokenEmail(usuario.id, tokenHash)

    await enviarEmailVerificacao({
        email: usuario.email,
        nome: usuario.nome,
        token: tokenEmail,
        motivo: "cadastro"
    })

    return {
        message: 'Um novo email de verificação foi enviado'
    }
}