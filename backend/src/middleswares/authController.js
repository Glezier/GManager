const pool = require('../database/db')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')

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
            `INSERT INTO usuarios (nome, email, senha)
            VALUES ($1, $2, $3)
            RETURNING id, nome, email`,
            [nome.trim(), emailCorrigido, senhaHash]
        )

        res.status(201).json(result.rows[0])

    }catch(error){
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