const pool = require('../database/db');
const AppError = require('../utils/AppError')
const taskValidators = require("../validators/taskValidators")
const taskService = require("../services/taskService")

// Criar tarefa
exports.criarTarefa = async (req, res, next) => {
    try{
        // Recebe todos os dados da requisição
        const {titulo, descricao, data, hora } = req.body
        const usuario_id = req.userId

        //Validações dos campos recebidos
        const tituloCorrigido = taskValidators.validateTitle(titulo)
        const dataCorrigida = taskValidators.validateDate(data)
        const descricaoCorrigida = taskValidators.validateDesc(descricao)
        

        // Validação do período
        await periodoPermitido(usuario_id, data)
        // Validação da hora informada
        if (hora && !isValidTime(hora)) {
            return next(new AppError(
                'A hora deve estar no formato HH:MM',
                400,
                'VALIDATION_ERROR'
            ))
        }

        taskValidators.validateTime(hora)

        // Permite no máximo 30 tarefas por dia
        const totalNoDia = await pool.query(
            `SELECT COUNT(*)::int AS total
            FROM tarefas
            WHERE usuario_id = $1
            AND data = $2`,
            [usuario_id, data]
        )

        if (totalNoDia.rows[0].total >= 30) {
            return next(new AppError(
                'Limite de 30 tarefas por dia atingido',
                400,
                'DAILY_TASK_LIMIT_REACHED'
            ))
        }

        // Inserção no banco de dados
        const result = await pool.query(
            `INSERT INTO tarefas (titulo, descricao, status, usuario_id, data, hora)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                tituloCorrigido, 
                descricaoCorrigida, // Proteção caso descricao seja null
                'pendente', 
                usuario_id, 
                dataCorrigida, 
                horaCorrigida
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

        const inicioCorrigido = taskValidators.validateDate(inicio)
        const fimCorrigido = taskValidators.validateDate(fim)


        // Validação da data seguindo a regra de negócio
        await intervaloPermitido(usuario_id, inicio, fim)

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
        
        // Verificação dos campos informados
        const tituloCorrigido = taskValidators.validateTitle(titulo)
        const descricaoCorrigida = taskValidators.validateDesc(descricao)
        const statusCorrigido = taskValidators.validateStatus(status)
        const dataCorrigida = taskValidators.validateDate(data)
        const horaCorrigida = taskValidators.validateTime(hora)

        // Validação do período
        if (data!== undefined){
            await periodoPermitido(usuario_id, data)
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
                tituloCorrigido,
                descricaoCorrigida,
                statusCorrigido,
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
            RETURNING id`,
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