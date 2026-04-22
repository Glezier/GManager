const pool = require('../database/db');
const AppError = require('../utils/AppError')
const validator = require('validator')

// Funções de validação dos campos
function isValidDate(date) {
    return validator.isDate(date, {
        format: 'YYYY-MM-DD',
        strictMode: true,
        delimiters: ['-'],
    })
}

function isValidTime(time) {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time)
}

function isValidStatus(status) {
    return validator.isIn(status, ['pendente', 'concluida'])
}

// Criar tarefa
exports.criarTarefa = async (req, res, next) => {
    try{
        // Recebe todos os dados da requisição
        const {titulo, descricao, data, hora } = req.body
        const usuario_id = req.userId

        // Validação de título e data ausentes
        if(!titulo || !data){
            return next(new AppError(
                'Título e data obrigatórios',
                400,
                'VALIDATION_ERROR'
            ))
        }
        // Validação de título vazio
        if (!titulo.trim()) {
            return next(new AppError(
                'O título não pode estar vazio',
                400,
                'VALIDATION_ERROR'
            ))
        }
        // Validação da data informada
        if (!isValidDate(data)) {
            return next(new AppError(
                'A data deve estar no formato YYYY-MM-DD',
                400,
                'VALIDATION_ERROR'
            ))
        }
        // Validação da hora informada
        if (hora && !isValidTime(hora)) {
            return next(new AppError(
                'A hora deve estar no formato HH:MM',
                400,
                'VALIDATION_ERROR'
            ))
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
        next(error)
    }
}

//Listar tarefas
exports.listarTarefas = async (req,res, next) => {
    try{
        // Recebe usuario, inicio e fim da requisição
        const usuario_id = req.userId
        const {inicio, fim} = req.query

        // Verificação de inicio e fim informados
        if (!inicio || !fim){
            return next(new AppError(
                'É necessário informar início e fim para busca',
                400,
                'VALIDATION_ERROR'
            ))
        }

        // Verificação da validade do início e fim informados
        if (!isValidDate(inicio) || !isValidDate(fim)){
            return next(new AppError(
                'As datas devem estar no formato YYYY-MM-DD',
                400,
                'VALIDATION_ERROR'
            ))
        }

        // Busca no bando de dados pelas tarefas no tempo informado
        const result = await pool.query(
            `SELECT * 
            FROM tarefas
            WHERE usuario_id = $1
            AND data BETWEEN $2 AND $3
            ORDER BY data ASC, hora ASC NULLS LAST, created_at ASC, id ASC`,
            [usuario_id, inicio, fim]
        )

        return res.json(result.rows)

    } catch(error){
        next(error)
    }
}

// Atualizar tarefa
exports.atualizarTarefa = async (req, res, next) => {
    try {
        // Recebendo dados da requisição
        const { id } = req.params
        const { titulo, descricao, status, data, hora } = req.body
        const usuario_id = req.userId
        
        // Verificação do título
        if (titulo !== undefined && !titulo.trim()) {
            return next(new AppError(
                'O título não pode estar vazio',
                400,
                'VALIDATION_ERROR'
            ))
        }

        // Verificação do status informado
        if (status !== undefined && !isValidStatus(status)) {
            return next(new AppError(
                'Status inválido',
                400,
                'VALIDATION_ERROR'
            ))
        }
        
        // Verificação da data informada
        if (data !== undefined && !isValidDate(data)) {
            return next(new AppError(
                'A data deve estar no formato YYYY-MM-DD',
                400,
                'VALIDATION_ERROR'
            ))
        }

        // Verificação da hora informada
        if (hora !== undefined && hora !== null && hora !== '' && !isValidTime(hora)) {
            return next(new AppError(
                'A hora deve estar no formato HH:MM',
                400,
                'VALIDATION_ERROR'
            ))
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
            return next(new AppError(
                'Tarefa não encontrada',
                404,
                'TASK_NOT_FOUND'
            ))
        }

        res.json(result.rows[0])
    }catch (error){
        next(error)
    }
}

// Concluir tarefa
exports.concluirTarefa = async (req,res, next) => {
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
            return next(new AppError(
                'Tarefa não encontrada',
                404,
                'TASK_NOT_FOUND'
            ))
        }

        res.json(result.rows[0])

    }catch(error){
        next(error)
    }
}

// Deletar tarefa
exports.deletarTarefa = async (req,res, next) => {
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
            return next(new AppError(
                'Tarefa não encontrada',
                404,
                'TASK_NOT_FOUND'
            ))
        }

        res.json({message: "Tarefa deletada com sucesso"})

    }catch(error){
        next(error)
    }
}