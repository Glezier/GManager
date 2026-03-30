const pool = require('../database/db')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Função para validação do email
function isValidEmail(email){
    return validator.isEmail(email)
}

// Registro
exports.registrar = async (req, res) => {
    try{
        const { nome, email, senha } = req.body // Recebe nome, email e senha da requisição
        
        // Retorna erro se algum dado estiver faltando
        if (!nome || !email || !senha){
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Todos os campos são obrigatórios",
                },
            })
        }
        // Verificação do tamanho do nome informado
        if (nome.trim().length < 2){
            return res.status(400).json({
                error:{
                    code: "VALIDATION_ERROR",
                    message: "O nome deve possuir pelo menos 2 caracteres",
                },
            })
        }
        // Verificação se o email informado é válido
        if (!isValidEmail(email)){
            return res.status(400).json({
                error:{
                    code: "VALIDATION_ERROR",
                    message: "Email inválido",
                },
            })
        }
        // Verificação do tamanho da senha
        if (senha.length < 8){
            return res.status(400).json({
                error:{
                    code: "VALIDATION_ERROR",
                    message: "A senha deve possuir pelo menor 8 caracteres",
                },
            })
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
            return res.status(400).json({
                error:{
                    code: "EMAIL_ALREADY_EXISTS",
                    message: "Email já cadastrado",
                },
            })
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
        console.error(error)
        res.status(500).json({
            error: {
                code: "INTERNAL_ERROR",
                message: "Erro ao registrar usuário",
            },
        })
    }
}

// Login
exports.login = async (req, res) => {
    try{
        const { email, senha } = req.body // Recebe email e senha da requisição

        // Retorna erro se algum dado estiver faltando
        if (!email || !senha){
            return res.status(400).json({
                error:{
                    code: "VALIDATION_ERROR",
                    message: "Email e senha são obrigatórios",
                },
            })
        }

        // Verificação de validade do email
        if (!isValidEmail(email)){
            return res.status(400).json({
                error:{
                    code: "VALIDATION_ERROR",
                    message: "Email inválido",
                },
            })
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
            return res.status(400).json({
                error: {
                    code: "INVALID_CREDENTIALS",
                    message: "Email ou senha inválidos",
                },
            })
        }

        // Retorno do usuário
        const usuario = result.rows[0]

        // Veificação da senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha)

        if (!senhaValida){
            return res.status(400).json({
                error: {
                    code: "INVALID_CREDENTIALS",
                    message: "Email ou senha inválidos",
                },
            })
        }

        // Emissão do token para o usuário com sucesso no login
        const token = jwt.sign(
            { id: usuario.id},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES || "1d"} // tempo de expiração do token com fallback de 1 dia
        )

        res.json({token})

    }catch(error){
        console.error(error)
        res.status(500).json({
            error: {
                code: "INTERNAL_ERROR",
                message: "Erro ao realizar login",
            },
        })
    }
}