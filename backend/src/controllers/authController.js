const pool = require('../database/db')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const {gerarTokenEmail, gerarHashToken, gerarExpiracaoEmailToken} =  require('../utils/EmailVerification')
const { enviarEmailVerificacao } = require('../utils/EmailService')

// Função para validação do email
function isValidEmail(email){
    return validator.isEmail(email)
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
        
        // Expiração do link de verificação
        const tokenExpiraEm = gerarExpiracaoEmailToken()
        
        await pool.query(
            `INSERT INTO email_verification_tokens (usuario_id, token_hash, expires_at)
            VALUES ($1, $2, $3)`,
            [usuario.id, tokenHash, tokenExpiraEm]
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
            AND expires_at > NOW()
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
            email_verificado_em = NOW(),
            updated_at = NOW()
            WHERE id = $1`,
            [tokenData.usuario_id]
        )

        // Atualiza token para usado
        await pool.query(
            `UPDATE email_verification_tokens
            SET used_at = NOW()
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
        const tokenExpiraEm = gerarExpiracaoEmailToken()

        await pool.query(
            `INSERT INTO email_verification_tokens (usuario_id, token_hash, expires_at)
            VALUES ($1, $2, $3)`,
            [usuario.id, tokenHash, tokenExpiraEm]
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

        // Emissão do token para o usuário com sucesso no login
        const token = jwt.sign(
            { id: usuario.id},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES || "1d"} // tempo de expiração do token com fallback de 1 dia
        )

        res.json({token})

    }catch(error){
        next(error)
    }
}