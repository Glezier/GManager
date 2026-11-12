const pool = require("../database/db")

exports.criarNota = async (usuarioId, titulo, conteudo) => {
    const result = await pool.query(
        `INSERT INTO notas (usuario_id, titulo, conteudo)
        VALUES ($1, $2, $3)
        RETURNING id, titulo, conteudo, created_at, updated_at`,
        [usuarioId, titulo, conteudo]
    )

    return result.rows[0]
}

exports.listarNotas = async (usuarioId) => {
    const result = await pool.query(
        `SELECT id, titulo, conteudo, created_at, updated_at
        FROM notas
        WHERE usuario_id = $1
        ORDER BY updated_at DESC, id DESC`,
        [usuarioId]
    )

    return result.rows
}

exports.buscarNotaPorId = async (usuarioId, id) => {
    const result = await pool.query(
        `SELECT id, titulo, conteudo, created_at, updated_at
        FROM notas
        WHERE id = $1 AND usuario_id = $2`,
        [id, usuarioId]
    )

    return result.rows[0] || null
}

exports.contarNotasDoUsuario = async (usuarioId) => {
    const result = await pool.query(
        `SELECT COUNT(*)::int AS total
         FROM notas
         WHERE usuario_id = $1`,
        [usuarioId]
    )

    return result.rows[0].total
}

exports.atualizarNota = async (usuarioId, id, titulo, conteudo) => {
    const result = await pool.query(
        `UPDATE notas
         SET titulo = $1,
             conteudo = $2,
             updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo'
         WHERE id = $3 AND usuario_id = $4
         RETURNING id, titulo, conteudo, created_at, updated_at`,
        [titulo, conteudo, id, usuarioId]
    )

    return result.rows[0] || null
}

exports.deletarNota = async (usuarioId, id) => {
    const result = await pool.query(
        `DELETE FROM notas
         WHERE id = $1 AND usuario_id = $2
         RETURNING id`,
        [id, usuarioId]
    )

    return result.rows[0] || null
}