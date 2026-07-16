const pool = require("../database/db")

exports.checkDateAllowed = async (usuarioId, dataTerefa) => {
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

exports.checkRangeAllowed = async (usuarioId, inicio, fim) => {
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

