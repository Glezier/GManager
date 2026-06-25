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
exports.revokeAllRefreshTokens = async (usuario_id) => {
    await pool.query(
        `UPDATE refresh_tokens
        SET revoked_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
        WHERE usuario_id = $1
        AND revoked_at IS NULL`,
        [usuario_id]
    )
}

// Revogar refresh token usado em refresh token do authcontroller
exports.revokeRefreshToken = async (usuario_id) => {
    await pool.query(
        `UPDATE refresh_tokens
        SET revoked_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
        WHERE id = $1`,
        [usuario_id]
    )
}

// Revogar todos os refreshtokens
// Usado no logout
exports.revokeAllRefreshTokensLogout = async (token_hash) => {
    await pool.query(
        `UPDATE refresh_tokens
        SET revoked_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
        WHERE token_hash = $1 
        AND revoked_at IS NULL`,
        [token_hash]
    )
} 

// Retorna refresh token valido
// Usado em refresh token do auth controlller
exports.getRefreshToken = async (token_hash) => {
    const result = await pool.query(
        `SELECT id, usuario_id
        FROM refresh_tokens
        WHERE token_hash = $1
        AND revoked_at IS NULL
        AND expires_at > (CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')
        LIMIT 1`,
        [token_hash]
    )
    return result.rows[0] || null
}