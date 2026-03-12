const pool = require('../database/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Registro
exports.registrar = async (req, res) => {
    try{
        const { nome, email, senha } = req.body

        if (!nome || !email || !senha){
            return res.status(400).json({error: "Todos os campos são obrigatórios"})
        }

        const emailExist = await pool.query(
            `SELECT id from usuarios WHERE email = $1`,
            [email]
        )

        if (emailExist.rows.length > 0){
            return res.status(400).json({ error: "Email já cadastrado"})
        }

        const senhaHash = await bcrypt.hash(senha, 10)

        const result = await pool.query(
            `INSERT INTO usuarios (nome, email, senha)
            VALUES ($1, $2, $3)
            RETURNING id, nome, email`,
            [nome, email, senhaHash]
        )

        res.status(201).json(result.rows[0])

    }catch(error){
        console.error(error)
        res.status(500).json({error: "Erro ao registrar usuário"})
    }
}

// Login
exports.login = async (req, res) => {
    try{
        const { email, senha } = req.body

        const result = await pool.query(
            'SELECT * from usuarios WHERE email = $1',
            [email]
        )

        if (result.rows.length === 0){
            return res.status(400).json({error: "Usuário não encontrado"})
        }

        const usuario = result.rows[0]

        const senhaValida = await bcrypt.compare(senha, usuario.senha)

        if (!senhaValida){
            return res.status(400).json({error: "Senha inválida"})
        }

        const token = jwt.sign(
            { id: usuario.id},
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES}
        )

        res.json({token})

    }catch(error){
        console.error(error)
        res.status(500).json({error: "Erro ao realizar login"})
    }
}