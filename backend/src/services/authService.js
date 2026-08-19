const authValidators = require("../validators/authValidators")
const userRepository = require("../repositories/userRepository")
const emailVerificationRepository = require("../repositories/emailVerificationRepository")
const refreshTokenRepository = require("../repositories/refreshTokensRepository")
const AppError = require("../utils/AppError")
const { enviarEmailVerificacao } = require("../utils/EmailService")
const bcrypt = require('bcryptjs')
const { OAuth2Client } = require('google-auth-library')
const jwt = require("jsonwebtoken")
const { gerarRefreshToken, gerarHashRefreshToken, gerarExpiracaoRefreshToken } = require("../utils/RefreshToken")
const { gerarTokenEmail, gerarHashToken } = require("../utils/EmailVerification")

exports.registrar = async (dados) => {
    const { nome, email, senha } = dados

    const { nomeCorrigido, emailCorrigido } = authValidators.validarRegistro({ nome, email, senha })

    const emailExist = await userRepository.emailExists(emailCorrigido)

    if (emailExist){
        throw new AppError(
            'Email já cadastrado', 
            400, 
            'EMAIL_ALREADY_EXISTS'
        )
    }

    // Senha criptografada
    const senhaHash = await bcrypt.hash(senha, 10)

    // Inserção do usuário no banco de dados
    const usuario = await userRepository.registrarUsuario(nomeCorrigido, emailCorrigido, senhaHash)

    // Gerar token de verificação
    const tokenEmail = gerarTokenEmail()

    // Produzir hash do token
    const tokenHash = gerarHashToken(tokenEmail)

    // Adicionar token de verificação de email no banco
    await emailVerificationRepository.registrarTokenEmail(usuario.id, tokenHash)
    
    // Chama o Resend pra enviar email
    await enviarEmailVerificacao({
        email: usuario.email,
        nome: usuario.nome,
        token: tokenEmail,
        motivo: 'cadastro'
    })

    const response = {
        usuario,
        message: 'Conta criada com sucesso. Verifique seu email para ativar a conta.'
    }

    // Não envia o token por email em desenvolvimento
    if (process.env.NODE_ENV !== 'production'){
        response.devVerificationToken = tokenEmail
    }

    return response
}

// Geerar token de acesso
function gerarAccessToken(usuarioId) {
    return jwt.sign(
        { id: usuarioId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES || '15m' }
    )
}

// Salvar refresh token no banco
async function criarSessaoRefreshToken(usuarioId){
    const refreshToken = gerarRefreshToken()
    const tokenHash = gerarHashRefreshToken(refreshToken)
    const expiresAt = gerarExpiracaoRefreshToken()

    await refreshTokenRepository.registrarRefreshToken(usuarioId, tokenHash, expiresAt)

    return refreshToken
}

exports.login = async (dados) => {
    const { email, senha } = dados

    const { emailCorrigido } = authValidators.validarLogin({ email, senha })

    const usuario = await userRepository.getUserByEmailLogin(emailCorrigido)

    if (usuario == null){
        throw new AppError(
            'Email ou senha inválidos',
            400,
            'INVALID_CREDENTIALS'
        )
    }

    // Verificação da senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha)

    if (!senhaValida){
        throw new AppError(
            'Email ou senha inválidos', 
            400, 
            'INVALID_CREDENTIALS'
        )
    }

    // Não permite logar sem verificar email antes
    if(!usuario.email_verificado){
        throw new AppError(
            'Verifique seu email antes de entrar na conta',
            403,
            'EMAIL_NOT_VERIFIED'
        )
    }

    // Gerar token e refresh token
    const accessToken = gerarAccessToken(usuario.id)
    const refreshToken = await criarSessaoRefreshToken(usuario.id)

    return {
        accessToken,
        refreshToken,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tema: usuario.tema
        }
    }
}

exports.refreshToken = async (refreshToken) => {
    if (!refreshToken){
        throw new AppError(
            'Refresh token não fornecido',
            401,
            'REFRESH_TOKEN_MISSING'
        )
    }

    const tokenHash = gerarHashRefreshToken(refreshToken)

    const tokenData = await refreshTokenRepository.getRefreshToken(tokenHash)

    if (tokenData === null){
        throw new AppError(
            'Refresh token inválido ou expirado',
            401,
            'INVALID_REFRESH_TOKEN'
        )
    }

    // Ajusta no banco a data de revogação do refresh token
    await refreshTokenRepository.revokeRefreshToken(tokenData.id)

    // Gera novos tokens
    const novoRefreshToken = await criarSessaoRefreshToken(tokenData.usuario_id)
    const novoAccessToken = gerarAccessToken(tokenData.usuario_id)

    return {
        accessToken: novoAccessToken,
        refreshToken: novoRefreshToken
    }
}

exports.logout = async (refreshToken) => {
    if (refreshToken){
        const tokenHash = gerarHashRefreshToken(refreshToken)

        // Revoga os tokens no banco
        await refreshTokenRepository.revokeAllRefreshTokensLogout(tokenHash)
    }

    return {
        message: 'Logout realizado com sucesso'
    }
}

// Cliente para validar as credenciais enviadas
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

exports.loginGoogle = async ({ credential }) => {
    if (!credential){
        throw new AppError(
            'Credencial do Google não informada',
            400,
            'VALIDATION_ERROR'
        )
    }

    // Validação do token
    // Se foi enviado para o My Gmanager
    const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()

    if (!payload?.email || !payload?.sub){
        throw new AppError(
            'Não foi possível validar a conta Google',
            401,
            'INVALID_GOOGLE_TOKEN'
        )
    }

    const googleId = payload.sub
    const emailCorrigido = payload.email.trim().toLocaleLowerCase()
    const nome = payload.name || emailCorrigido.split('@')[0]

    let usuario = await userRepository.findByGoogleId(googleId)

    // Caso de usuário sem link com o Google
    if (!usuario){
        const usuarioExistente = await userRepository.getUserByEmailLogin(emailCorrigido)

        // Usuário com email existente 
        if (usuarioExistente) {
            usuario = await userRepository.linkGoogleAccount(usuarioExistente.id, googleId)
        } else{ // Usuário que nunca realizou registro
            usuario = await userRepository.createGoogleUser({
                nome,
                email: emailCorrigido,
                googleId
            })
        }
    }

    const accessToken = gerarAccessToken(usuario.id)
    const refreshToken = await criarSessaoRefreshToken(usuario.id)

    return {
        accessToken,
        refreshToken,
        usuario : {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tema: usuario.tema
        }
    }
}