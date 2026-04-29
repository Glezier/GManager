const pool = require('../database/db')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const {gerarTokenEmail, gerarHashToken} =  require('../utils/EmailVerification')
const { enviarEmailVerificacao } = require('../utils/EmailService')
const { 
    gerarRefreshToken,
    gerarHashRefreshToken,
    gerarExpiracaoRefreshToken
} = require('../utils/RefreshToken')

// Função para validação do email
function isValidEmail(email){
    return validator.isEmail(email)
}

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

    await pool.query(
        `INSERT INTO refresh_tokens (usuario_id, token_hash, expires_at)
        VALUES ($1, $2, $3)`,
        [usuarioId, tokenHash, expiresAt]
    )

    return refreshToken
}

// Dados do usuário
exports.me = async(req,res,next) => {
    try{
        const usuario_id = req.userId

        const result = await pool.query(
            `SELECT id, nome, email, created_at
            FROM usuarios
            WHERE id = $1`,
            [usuario_id]
        )

        if (result.rows.length === 0){
            return next(new AppError(
                'Usuário não encontrado',
                404,
                'USER_NOT_FOUND'
            ))
        }

        res.json(result.rows[0])
    } catch(error){
        next(error)
    }
}

// Registro
exports.registrar = async (req, res, next) => {
    try{
        const { nome, email, senha } = req.body // Recebe nome, email e senha da requisição
        
        // Retorna erro se algum dado estiver faltando
        if (!nome || !email || !senha){
            return next(new AppError("Todos os campos são obrigatórios", 400, 'VALIDATION_ERROR'))
        }
        
        // Verificação do tamanho do nome informado
        if (nome.trim().length < 2){
            return next(new AppError('O nome deve possuir pelo menos 2 caracteres', 400, 'VALIDATION_ERROR'))
        }
        
        // Verificação se o email informado é válido
        if (!isValidEmail(email)){
            return next(new AppError('Email inválido', 400, 'VALIDATION_ERROR'))
        }
        
        // Verificação do tamanho da senha
        if (senha.length < 8){
            return next(new AppError('A senha deve possuir pelo menos 8 caracteres', 400, 'VALIDATION_ERROR'))
        }
        
        // Eliminação de espaços e transformação para caracteres minúsculos
        const emailCorrigido = email.trim().toLowerCase()
        
        // Busca pelo email no banco de dados
        const emailExist = await pool.query(
            `SELECT id from usuarios WHERE email = $1`,
            [emailCorrigido]
        )
        
        // Verificaçãp do email já cadastrado
        if (emailExist.rows.length > 0){
            return next(new AppError('Email já cadastrado', 400, 'EMAIL_ALREADY_EXISTS'))
        }
        // Senha criptografada
        const senhaHash = await bcrypt.hash(senha, 10)
        
        // Inserção do usuário no banco de dados
        const result = await pool.query(
            `INSERT INTO usuarios (nome, email, senha, email_verificado, provider)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, nome, email, email_verificado`,
            [nome.trim(), emailCorrigido, senhaHash, false, 'local',]
        )
        
        const usuario = result.rows[0]
        
        // Gerar token para ser enviado por email
        const tokenEmail = gerarTokenEmail()
        
        // Produz hash do token
        const tokenHash = gerarHashToken(tokenEmail)
        
        await pool.query(
            `INSERT INTO email_verification_tokens (usuario_id, token_hash, expires_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo' + INTERVAL '10 minutes')`,
            [usuario.id, tokenHash]
        )
        
        // Enviar email de varificação
        await enviarEmailVerificacao({
            email: usuario.email,
            nome: usuario.nome,
            token: tokenEmail,
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

// Verificação de email
exports.verificarEmail = async(req, res, next) => {
    try{
        const {token} = req.query

        if (!token){
            return next(new AppError(
                'Token de verificação não informado',
                400,
                'VALIDATION_ERROR'
            ))
        }

        const tokenHash = gerarHashToken(token)

        // Busca token não usado nem expirado
        const tokenResult = await pool.query(
            `SELECT *
            FROM email_verification_tokens
            WHERE token_hash = $1
            AND used_at IS NULL
            AND expires_at > CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
            LIMIT 1`,
            [tokenHash]
        )

        if (tokenResult.rows.length === 0){
            return next(new AppError(
                'Token inválido ou expirado',
                400,
                'INVALID_TOKEN'
            ))
        }

        const tokenData = tokenResult.rows[0]

        // Atualiza o usuário para email verificado
        await pool.query(
            `UPDATE usuarios
            SET email_verificado = true,
            email_verificado_em = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo',
            updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
            WHERE id = $1`,
            [tokenData.usuario_id]
        )

        // Atualiza token para usado
        await pool.query(
            `UPDATE email_verification_tokens
            SET used_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
            WHERE id = $1`,
            [tokenData.id]
        )

        res.json({
            message: 'Email verificado com sucesso'
        })

    } catch(error){
        next(error)
    }
}

// Reenviar email de verificação
exports.reenviarVerificacao = async(req,res,next) => {
    try{
        const { email } = req.body

        if(!email){
            return next(new AppError(
                'Email é obrigatório',
                400,
                'VALIDATION_ERROR'
            ))
        }

        if(!isValidEmail(email)){
            return next(new AppError(
                'Email inválido',
                400,
                'VALIDATION_ERROR'
            ))
        }

        const emailCorrigido = email.trim().toLowerCase()

        const result = await pool.query(
            `SELECT id, nome, email, email_verificado
            FROM usuarios
            WHERE email = $1`,
            [emailCorrigido]
        )

        if (result.rows.length === 0){
            return next(new AppError(
                'Usuário não encontrado',
                404,
                'USER_NOT_FOUND'
            ))
        }

        const usuario = result.rows[0]

        if (usuario.email_verificado){
            return next(new AppError(
                'Este email já foi verificado',
                400,
                'EMAIL_ALREADY_VERIFIED'
            ))
        }

        const tokenEmail = gerarTokenEmail()
        const tokenHash = gerarHashToken(tokenEmail)

        await pool.query(
            `INSERT INTO email_verification_tokens (usuario_id, token_hash, expires_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo' + INTERVAL '10 minutes')`,
            [usuario.id, tokenHash]
        )

        await enviarEmailVerificacao({
            email: usuario.email,
            nome: usuario.nome,
            token: tokenEmail
        })

        res.json({message: 'Um novo email de verificação foi enviado'})
    } catch(error){
        next(error)
    }
}

// Login
exports.login = async (req, res, next) => {
    try{
        const { email, senha } = req.body // Recebe email e senha da requisição

        // Retorna erro se algum dado estiver faltando
        if (!email || !senha){
            return next(new AppError('Email e senha são obrigatórios', 400, 'VALIDATION_ERROR'))
        }

        // Verificação de validade do email
        if (!isValidEmail(email)){
            return next(new AppError('Email inválido', 400, 'VALIDATION_ERROR'))
        }

        // Eliminação de espaços e transformação para caracteres minúsculos
        const emailCorrigido = email.trim().toLowerCase()

        // Busca pelo email no banco de dados
        const result = await pool.query(
            'SELECT * from usuarios WHERE email = $1',
            [emailCorrigido]
        )

        // Erro por invalidade de algum elemento
        if (result.rows.length === 0){
            return next(new AppError('Email ou senha inválidos', 400, 'INVALID_CREDENTIALS'))
        }

        // Retorno do usuário
        const usuario = result.rows[0]

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
        res.json({token: accessToken})

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
        const result = await pool.query(
            `SELECT *
            FROM refresh_tokens
            WHERE token_hash = $1
            AND revoked_at IS NULL
            AND expires_at > (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')
            LIMIT 1`,
            [tokenHash]
        )

        if (result.rows.length === 0){
            return next(new AppError(
                'Refresh token inválido ou expirado',
                401,
                'INVALID_REFRESH_TOKEN'
            ))
        }

        const tokenData = result.rows[0]

        // Ajusta no banco a data de revogação do refresh token
        await pool.query(
            `UPDATE refresh_tokens
            SET revoked_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
            WHERE id = $1`,
            [tokenData.id]
        )

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
            await pool.query(
                `UPDATE refresh_tokens
                SET revoked_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
                WHERE token_hash = $1 
                AND revoked_at IS NULL`,
                [tokenHash]
            )
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