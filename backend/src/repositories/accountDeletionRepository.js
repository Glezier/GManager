const pool = require('../database/db')

exports.registrarSolicitacao = async (usuarioId, email, tokenHash, expires_at) => {
    await pool.query(
        `INSERT INTO account_deletion_tokens (usuario_id, email_destino, token_hash, expires_at)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (usuario_id)
        DO UPDATE SET
            email_destino = EXCLUDED.email_destino,
            token_hash = EXCLUDED.token_hash,
            expires_at = EXCLUDED.expires_at,
            created_at = CURRENT_TIMESTAMP`,
        [usuarioId, email, tokenHash, expires_at]
    )
}

exports.removerSolicitacaoPorToken = async (usuarioId, tokenHash) => {
    await pool.query(
        `DELETE FROM account_deletion_tokens
         WHERE usuario_id = $1
           AND token_hash = $2`,
        [usuarioId, tokenHash]
    )
}