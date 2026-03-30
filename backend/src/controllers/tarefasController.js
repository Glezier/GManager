const pool = require('../database/db');

// Funções de validação dos campos
function isValidDate(date) {
    return /^\d{4}-\d{2}-\d{2}$/.test(date)
}

function isValidTime(time) {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time)
}

function isValidStatus(status) {
    return ['pendente', 'concluida'].includes(status)
}

// Criar tarefa
exports.criarTarefa = async (req, res) => {
    try{
        // Recebe todos os dados da requisição
        const {titulo, descricao, data, hora } = req.body
        const usuario_id = req.userId

        // Validação de título e data ausentes
        if(!titulo || !data){
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Título e data obrigatórios",
                },
            })
        }
        // Validação de título vazio
        if (!titulo.trim()) {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'O título não pode estar vazio',
                },
            })
        }
        // Validação da data informada
        if (!isValidDate(data)) {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'A data deve estar no formato YYYY-MM-DD',
                },
            })
        }
        // Validação da hora informada
        if (hora && !isValidTime(hora)) {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'A hora deve estar no formato HH:MM',
                },
            })
        }

        // Inserção no banco de dados
        const result = await pool.query(
            `INSERT INTO tarefas (titulo, descricao, status, usuario_id, data, hora)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                titulo.trim(), 
                descricao?.trim() || null, // Proteção caso descricao seja null
                'pendente', 
                usuario_id, 
                data, 
                hora || null
            ]
        )

        res.status(201).json(result.rows[0])
    } catch(error){
        console.error(error)
        res.status(500).json({
            error: {
                code: "INTERNAL_ERROR",
                message: "Erro ao criar tarefa",
            },
        })
    }
}

//Listar tarefas
exports.listarTarefas = async (req,res) => {
    try{
        // Recebe usuario, inicio e fim da requisição
        const usuario_id = req.userId
        const {inicio, fim} = req.query

        // Verificação de inicio e fim informados
        if (!inicio || !fim){
            return res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "É necessário informar início e fim para busca",
                },
            })
        }

        // Verificação da validade do início e fim informados
        if (!isValidDate(inicio) || !isValidDate(fim)){
            return res.status(400).json({
                error:{
                    code: "VALIDATION_ERROR",
                    message: "As datas devem estar no formato YYYY-MM-DD",
                },
            })
        }

        // Busca no bando de dados pelas tarefas no tempo informado
        const result = await pool.query(
            `SELECT * 
            FROM tarefas
            WHERE usuario_id = $1
            AND data BETWEEN $2 AND $3
            ORDER BY data ASC, hora ASC NULLS LAST`,
            [usuario_id, inicio, fim]
        )

        return res.json(result.rows)

    } catch(error){
        console.error(error)
        res.status(500).json({
            error: {
                code: "INTERNAL_ERROR",
                message: "Erro ao buscar tarefas",
            },
        })
    }
}

// Atualizar tarefa
exports.atualizarTarefa = async (req, res) => {
    try {
        // Recebendo dados da requisição
        const { id } = req.params
        const { titulo, descricao, status, data, hora } = req.body
        const usuario_id = req.userId
        
        // Verificação do título
        if (titulo !== undefined && !titulo.trim()) {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'O título não pode estar vazio',
                },
            })
        }

        // Verificação do status informado
        if (status !== undefined && !isValidStatus(status)) {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Status inválido',
                },
            })
        }
        
        // Verificação da data informada
        if (data !== undefined && !isValidDate(data)) {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'A data deve estar no formato YYYY-MM-DD',
                },
            })
        }

        // Verificação da hora informada
        if (hora !== undefined && hora !== null && hora !== '' && !isValidTime(hora)) {
            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'A hora deve estar no formato HH:MM',
                },
            })
        }

        // Update no banco de dados
        const result = await pool.query(
            `UPDATE tarefas
            SET titulo = COALESCE($1, titulo),
                descricao = COALESCE($2, descricao),
                status = COALESCE($3, status),
                data = COALESCE($4, data),
                hora = COALESCE($5, hora)
            WHERE id = $6 AND usuario_id = $7
            RETURNING *`,
            [
                titulo !== undefined ? titulo.trim() : null,
                descricao !== undefined ? descricao.trim() || null : null,
                status,
                data,
                hora === '' ? null : hora,
                id,
                usuario_id,
            ]
        )

        // Tarefa não cadastrada
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: {
                    code: "TASK_NOT_FOUND",
                    message: "Tarefa não encontrada",
                },
            })
        }

        res.json(result.rows[0])
    }catch (error){
        console.error(error)
        res.status(500).json({
            error: {
                code: "INTERNAL_ERROR",
                message: "Erro ao atualizar tarefa",
            },
        })
    }
}

// Concluir tarefa
exports.concluirTarefa = async (req,res) => {
    try{
        // Reeceb dados da requisição
        const { id } = req.params
        const usuario_id = req.userId

        // Update no banco de dados
        const result = await pool.query(
            `UPDATE tarefas
            SET status = $1
            WHERE id = $2
            AND usuario_id = $3
            RETURNING *`,
            ["concluida", id, usuario_id]
        )

        // Tarefa não encontrada
        if (result.rows.length === 0){
            return res.status(404).json({
                error: {
                    code: "TASK_NOT_FOUND",
                    message: "Tarefa não encontrada",
                },
            })
        }

        res.json(result.rows[0])

    }catch(error){
        console.error(error)
        res.status(500).json({
            error: {
                code: "INTERNAL_ERROR",
                message: "Erro ao concluir tarefa",
            },
        })
    }
}

// Deletar tarefa
exports.deletarTarefa = async (req,res) => {
    try{
        // Recebe dados da requisição
        const { id } = req.params
        const usuario_id = req.userId
         
        // Delete no banco de dados
        const result = await pool.query(
            `DELETE FROM tarefas
            WHERE id = $1 AND usuario_id = $2 
            RETURNING *`,
            [id, usuario_id]
        )
        
        // Tarefa não cadastrada
        if (result.rows.length === 0){
            return res.status(404).json({
                error: {
                    code: "TASK_NOT_FOUND",
                    message: "Tarefa não encontrada",
                },
            })
        }

        res.json({message: "Tarefa deletada com sucesso"})

    }catch(error){
        console.error(error)
        res.status(500).json({
            error: {
                code: "INTERNAL_ERROR",
                message: "Erro ao deletar tarefa",
            },
        })
    }
}
