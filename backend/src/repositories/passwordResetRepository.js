const pool = require('../database/db')

exports.registrarTokenResetSenha = async (usuarioId, tokenHash, expiresAt) => {
    await pool.query(
        `INSERT INTO password_reset_tokens (usuario_id, token_hash, expires_at)
        VALUES ($1, $2, $3)`,
        [usuarioId, tokenHash, expiresAt]
    )
}

exports.buscarTokenResetSenha = async (tokenHash) => {
    const result = await pool.query(
        `SELECT id, usuario_id
        FROM password_reset_tokens
        WHERE token_hash = $1
        AND used_at IS NULL
        AND expires_at > CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
        LIMIT 1`,
        [tokenHash]
    )
    return result.rows[0] || null
}

exports.marcarTokenResetSenhaComoUsado = async (id) => {
    await pool.query(
        `UPDATE password_reset_tokens
        SET used_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
        WHERE id = $1
        AND used_at IS NULL`,
        [id]
    )
}

exports.invalidarTokensResetSenha = async (usuarioId) => {
    await pool.query(
        `UPDATE password_reset_tokens
        SET used_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
        WHERE usuario_id = $1
        AND used_at IS NULL`,
        [usuarioId]
    )
}