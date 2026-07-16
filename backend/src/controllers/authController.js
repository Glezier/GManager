const userRepository = require('../repositories/userRepository')
const refreshTokenRepository = require('../repositories/refreshTokensRepository')
const emailVerificationRepository = require('../repositories/emailVerificationRepository')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const authValidators = require("../validators/authValidators")
const {gerarTokenEmail, gerarHashToken} =  require('../utils/EmailVerification')
const { enviarEmailVerificacao } = require('../utils/EmailService')
const { 
    gerarRefreshToken,
    gerarHashRefreshToken,
    gerarExpiracaoRefreshToken
} = require('../utils/RefreshToken')

// Gerar token de acesso
function gerarAccessToken(usuarioId){
    return jwt.sign(
        { id: usuarioId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES || '15m'}
    )
}

// Define regras do refresh token
function getRefreshTokenOptions(){
    return{
        httpOnly: true, // Frontend não consegue ler
        secure: process.env.COOKIE_SECURE === 'true', // Enviar apenas via HTTPS
        sameSite: 'lax', // Reduz envios indevidos,
        path: '/' // Válido em toda a aplicação
    }
}

// Salvar refresh token no banco
async function criarSessaoRefreshToken(usuarioId){
    const refreshToken = gerarRefreshToken()
    const tokenHash = gerarHashRefreshToken(refreshToken)
    const expiresAt = gerarExpiracaoRefreshToken()

    await refreshTokenRepository.registrarRefreshToken(usuarioId, tokenHash, expiresAt)

    return refreshToken
}

// Registro
exports.registrar = async (req, res, next) => {
    try{
        const { nome, email, senha } = req.body // Recebe nome, email e senha da requisição

        const { nomeCorrigido, emailCorrigido } = authValidators.validarRegistro({ nome, email, senha })
        
        // Busca pelo email no banco de dados
        const emailExist = await userRepository.emailExists(emailCorrigido)
        
        // Verificaçãp do email já cadastrado
        if (emailExist){
            return next(new AppError('Email já cadastrado', 400, 'EMAIL_ALREADY_EXISTS'))
        }
        // Senha criptografada
        const senhaHash = await bcrypt.hash(senha, 10)
        
        // Inserção do usuário no banco de dados
        const usuario = await userRepository.registrarUsuario(nomeCorrigido, emailCorrigido, senhaHash)
        
        // Gerar token para ser enviado por email
        const tokenEmail = gerarTokenEmail()
        
        // Produzir hash do token
        const tokenHash = gerarHashToken(tokenEmail)

        // Adicionar token de verificação de email no banco
        await emailVerificationRepository.registrarTokenEmail(usuario.id, tokenHash)
        
        // Enviar email de varificação
        await enviarEmailVerificacao({
            email: usuario.email,
            nome: usuario.nome,
            token: tokenEmail,
            motivo: "cadastro"
        })
        
        const response = {
            usuario,
            message: 'Conta criada com sucesso. Verifique seu email para ativar a conta.',
        }
        
        if (process.env.NODE_ENV !== 'production'){
            response.devVerificationToken = tokenEmail
        }
        
        res.status(201).json(response)
        
    }catch(error){
        next(error)
    }
}

// Login
exports.login = async (req, res, next) => {
    try{
        const { email, senha } = req.body // Recebe email e senha da requisição

        const { emailCorrigido } = authValidators.validarLogin({ email, senha })

        // Busca pelo email no banco de dados
        const usuario = await userRepository.getUserByEmailLogin(emailCorrigido)
        
        if (usuario === null){
            return next(new AppError('Email ou senha inválidos', 400, 'INVALID_CREDENTIALS'))
        }

        // Veificação da senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha)

        if (!senhaValida){
            return next(new AppError('Email ou senha inválidos', 400, 'INVALID_CREDENTIALS'))
        }

        // Não permite logar sem verificar email antes
        if(!usuario.email_verificado){
            return next(new AppError(
                'Verifique seu email antes de entrar na conta',
                403,
                'EMAIL_NOT_VERIFIED'
            ))
        }

        // Gerar token e refresh token
        const accessToken = gerarAccessToken(usuario.id)
        const refreshToken = await criarSessaoRefreshToken(usuario.id)

        // Adicionar cookie na resposta
        res.cookie('refreshToken', refreshToken, getRefreshTokenOptions())
        res.json({
            token: accessToken,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tema: usuario.tema
            }
        })

    }catch(error){
        next(error)
    }
}

// Refresh token
exports.refreshToken = async (req,res,next) => {
    try{
        // Pega refresh token da requisição
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken){
            return next(new AppError(
                'Refresh token não fornecido',
                401,
                'REFRESH_TOKEN_MISSING'
            ))
        }

        //Gera hash do refresh token
        const tokenHash = gerarHashRefreshToken(refreshToken)

        // Confere no banco se é válido o refresh token informado
        const tokenData = await refreshTokenRepository.getRefreshToken(tokenHash)

        if (tokenData === null){
            return next(new AppError(
                'Refresh token inválido ou expirado',
                401,
                'INVALID_REFRESH_TOKEN'
            ))
        }

        // Ajusta no banco a data de revogação do refresh token
        await refreshTokenRepository.revokeRefreshToken(tokenData.id)

        // Gera novos tokens
        const novoRefreshToken = await criarSessaoRefreshToken(tokenData.usuario_id)
        const novoAccessToken = gerarAccessToken(tokenData.usuario_id)

        res.cookie('refreshToken', novoRefreshToken, getRefreshTokenOptions())

        res.json({token: novoAccessToken})
    } catch(error){
        next(error)
    }
}

// Logout
exports.logout = async(req,res,next) => {
    try{
        // Pega refresh token da requisição
        const refreshToken = req.cookies.refreshToken

        // Se houver refresh token
        if (refreshToken){
            const tokenHash = gerarHashRefreshToken(refreshToken)

            // Revoga o token no banco
            await refreshTokenRepository.revokeAllRefreshTokensLogout(tokenHash)
        }

        // Retira cookie
        res.clearCookie('refreshToken', {
            ...getRefreshTokenOptions(),
        })

        res.json({message: 'Logout realizado com sucesso'})
        
    } catch(error){
        next(error)
    }
}