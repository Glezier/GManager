const pool = require('../database/db')


// Registrar novo token de verificação
exports.registrarTokenEmail = async(usuario_id, token_hash) => {
    await pool.query(
        `INSERT INTO email_verification_tokens (usuario_id, token_hash, expires_at)
        VALUES ($1, $2, CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo' + INTERVAL '10 minutes')`,
        [usuario_id, token_hash]
    )
} 

// Buscar token não usado nem expirado
exports.getToken = async (token_hash) => {
    const result = await pool.query(
        `SELECT id, usuario_id, tipo, novo_email
        FROM email_verification_tokens
        WHERE token_hash = $1
        AND used_at IS NULL
        AND expires_at > CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
        LIMIT 1`,
        [token_hash]
    )
    return result.rows[0] || null
}

// Marcar token como usado apos validação por email
exports.setTokenEmailUsado = async(id) => {
    await pool.query(
        `UPDATE email_verification_tokens
        SET used_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
        WHERE id = $1`,
        [id]
    )
}

// Invalidar tokens antigos de verificação de email
exports.invalidateOldersEmailTokens = async (usuario_id) => {
    await pool.query(
        `UPDATE email_verification_tokens
        SET used_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
        WHERE usuario_id = $1
            AND used_at is NULL
            AND tipo = 'troca-email'`,
        [usuario_id]
    )
}

// Registrar token de verificação de email de troca de email
exports.createEmailChangeToken = async(usuario_id, token_hash, novo_email) => {
    await pool.query(
        `INSERT INTO email_verification_tokens
            (usuario_id, token_hash, expires_at, tipo, novo_email)
        VALUES ($1, $2, CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo' + INTERVAL '10 minutes', $3, $4)`,
        [usuario_id, token_hash, 'troca-email', novo_email]
    )
}