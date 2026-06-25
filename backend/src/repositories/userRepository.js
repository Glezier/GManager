const pool = require('../database/db')

exports.registrarUsuario = async (nome, email, senha) => {
    const result = await pool.query(
        `INSERT INTO usuarios (nome, email, senha, email_verificado, provider)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, nome, email`,
        [nome, email, senha, false, 'local']
    )
    return result.rows[0] || null
}

exports.findPublicById = async (id) => {
    const result = await pool.query(
        `SELECT id, nome, email, created_at, tema
        FROM usuarios
        WHERE id = $1`,
        [id]
    )
    return result.rows[0] || null
}

// Busca por email, usada em atualizar email, retorna senha
exports.findByEmail = async (id) => {
    const result = await pool.query(
        `SELECT id, nome, email, senha
        FROM usuarios
        WHERE id = $1`,
        [id]
    )
    return result.rows[0] || null
}

// Verificação de email já existente em atualizar email
exports.findByEmailExceptUser = async (email, id) => {
    const result = await pool.query(
        `SELECT id
        FROM usuarios
        WHERE email = $1 
        AND id <> $2`, // Retorna dados excluindo ele próprio
        [email, id]
    )
    return result.rows[0] || null
}

// Confirmação de verificação de email
// Em troca de email
exports.setNovoEmailVerificado = async (usuario_id, novo_email) => {
    await pool.query(
        `UPDATE usuarios
        SET email = $1,
            email_verificado = true,
            email_verificado_em = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo',
            updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
        WHERE id = $2`,
        [novo_email, usuario_id]
    )
}

// Busca do usuário via email
// Usada em verificação de email
exports.getUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT id, nome, email, email_verificado
        FROM usuarios
        WHERE email = $1`,
        [email]
    )
    return result.rows[0] || null
}

// Busa usuário via email
// Usada no login
exports.getUserByEmailLogin = async(email) => {
    const result = await pool.query(
        'SELECT id, nome, email, senha, email_verificado, tema from usuarios WHERE email = $1',
        [email]
    )
    return result.rows[0] || null
}



// Em cadastro
exports.setEmailVerificado = async (usuario_id) => {
    await pool.query(
        `UPDATE usuarios
        SET email_verificado = true,
            email_verificado_em = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo',
            updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
        WHERE id = $1`,
        [usuario_id]
    )
}

// Retorna a senha para atualização de senha
exports.getSenha = async(id) => {
    const result = await pool.query(
        `SELECT senha
        FROM usuarios
        WHERE id = $1`,
        [id]
    )
    return result.rows[0]?.senha || null
}

// Retorna se email ja esta cadastrado (usado no cadastro de usuario)
exports.emailExists = async (email) => {
    const result = await pool.query(
        `SELECT EXISTS (
            SELECT 1
            FROM usuarios
            WHERE email = $1
        ) AS exists`,
        [email]
    )

    return result.rows[0].exists
}

exports.updateName = async (id, nome) => {
    const result = await pool.query(
        `UPDATE usuarios 
        SET nome = $1,
            updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
        WHERE id = $2
        RETURNING id, nome, email, created_at, tema`,
        [nome, id]
    ) 
    return result.rows[0] || null
}

exports.updateSenha = async(id, senha) => {
    await pool.query(
        `UPDATE usuarios
        SET senha = $1,
            updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
        WHERE id = $2`,
        [senha, id]
    )
}

exports.updateTheme = async (id, tema) => {
    const result = await pool.query(
        `UPDATE usuarios
        SET tema = $1,
            updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
        WHERE id = $2
        RETURNING id, nome, email, created_at, tema`,
        [tema, id]
    )
    return result.rows[0] || null
}