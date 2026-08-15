const pool = require("../database/db")

exports.verificarDataPermitida = async (usuarioId, dataTarefa) => {
    const result = await pool.query(
        `SELECT
            $2::date BETWEEN
                (created_at::date - INTERVAL '1 year')::date
                AND ((CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')::date + INTERVAL '3 years')::date
            AS periodo_permitido
        FROM usuarios
        WHERE id = $1`,
        [usuarioId, dataTarefa]
    )

    return result.rows[0] || null   
}

// Insercao de tarefas deve ser no intervalo de 1 ano atras e 3 anos para frente
exports.verificarIntervaloPermitido = async (usuarioId, inicio, fim) => {
    const result = await pool.query(
        `SELECT
            $2::date >= (created_at::date - INTERVAL '1 year')::date
            AND $3::date <= ((CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo')::date + INTERVAL '3 years')::date
            AS periodo_permitido
        FROM usuarios
        WHERE id = $1`,
        [usuarioId, inicio, fim]
    )

    return result.rows[0] || null
}

exports.contarTarefasDoDia = async (usuarioId, data) => {
    const response = await pool.query(
        `SELECT COUNT(*)::int AS total
        FROM tarefas
        WHERE usuario_id = $1
        AND data = $2`,
        [usuarioId, data]
    )
    return response.rows[0].total
}

// Para validação de quantidade diária de tarefas ao atualizar
exports.contarTarefasDoDiaExcetoTarefa = async (usuarioId, data, tarefaId) => {
    const result = await pool.query(
        `SELECT COUNT(*)::int AS total
        FROM tarefas
        WHERE usuario_id = $1
        AND data = $2
        AND id <> $3`,
        [usuarioId, data, tarefaId]
    )

    return result.rows[0].total
}

exports.criarTarefa = async (titulo, descricao, usuarioId, data, hora) => {
    const result = await pool.query(
        `INSERT INTO tarefas (titulo, descricao, status, usuario_id, data, hora)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
            titulo, 
            descricao, 
            'pendente', 
            usuarioId, 
            data, 
            hora
        ]
    )
    return result.rows[0]
}

exports.listarTarefas = async (usuarioId, inicio, fim) => {
    const result = await pool.query(
        `SELECT * 
        FROM tarefas
        WHERE usuario_id = $1
        AND data BETWEEN $2 AND $3
        ORDER BY data ASC, hora ASC NULLS LAST, created_at ASC, id ASC`,
        [usuarioId, inicio, fim]
    )
    return result.rows
}

exports.atualizarTarefa = async (titulo, descricao, status, data, hora, id, usuarioId) => {
    const result = await pool.query(
        `UPDATE tarefas
        SET titulo = $1,
            descricao = $2,
            status = $3,
            data = $4,
            hora = $5
        WHERE id = $6 AND usuario_id = $7
        RETURNING *`,
        [
            titulo,
            descricao,
            status,
            data,
            hora,
            id,
            usuarioId,
        ]
    )
    return result.rows[0] || null
}

exports.concluirTarefa = async (id, usuarioId) => {
    const result = await pool.query(
        `UPDATE tarefas
        SET status = $1
        WHERE id = $2
        AND usuario_id = $3
        RETURNING *`,
        ["concluida", id, usuarioId]
    )
    return result.rows[0] || null
}

exports.deletarTarefa = async (id, usuarioId) => {
    const result = await pool.query(
        `DELETE FROM tarefas
        WHERE id = $1 AND usuario_id = $2 
        RETURNING id`,
        [id, usuarioId]
    )
    return result.rows[0] || null
}
