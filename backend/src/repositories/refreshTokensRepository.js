const pool = require('../database/db')

// Inserir refresh token
exports.registrarRefreshToken = async (usuario_id, token_hash, expires_at) => {
    await pool.query(
        `INSERT INTO refresh_tokens (usuario_id, token_hash, expires_at)
        VALUES ($1, $2, $3)`,
        [usuario_id, token_hash, expires_at]
    )
}

// Revogar todos os refresh tokens
exports.revokeRefreshTokens = async (usuario_id) => {
    await pool.query(
        `UPDATE refresh_tokens
        SET revoked_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
        WHERE usuario_id = $1
        AND revoked_at IS NULL`,
        [usuario_id]
    )
}