const pool = require('../database/db');

//Listar tarefas
exports.listarTarefas = async (req,res) => {
    try{
        const usuario_id = req.userId

        const result = await pool.query(
            `SELECT * 
            FROM tarefas
            WHERE usuario_id = $1
            ORDER BY id DESC`,
            [usuario_id]
        )

        return res.json(result.rows)

    } catch(error){
        console.error(error)
        res.status(500).json({ error: 'Erro ao buscar tarefas' })
    }
}

// Criar tarefa
exports.criarTarefa = async (req, res) => {
    try{
        const {titulo, descricao, status} = req.body
        const usuario_id = req.userId

        const statusValidos = ["pendente", "concluida"]

        if(!titulo || !statusValidos.includes(status)){
            return res.status(400).json({error: "Informções pendentes ou incorretas"})
        }

        const result = await pool.query(
            `INSERT INTO tarefas (titulo, descricao, status, usuario_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [titulo, descricao || null, status || 'pendente', usuario_id]
        )
        res.status(201).json(result.rows[0])
    } catch(error){
        console.error(error)
        res.status(500).json({error: "Erro ao criar tarefa"})
    }
}

// Atualizar tarefa
exports.atualizarTarefa = async (req, res) => {
    try {
        const { id } = req.params
        const { titulo, descricao, status } = req.body
        const usuario_id = req.userId
        

        const result = await pool.query(
            `UPDATE tarefas
            SET titulo = COALESCE($1, titulo),
                descricao = COALESCE($2, descricao),
                status = COALESCE($3, status)
            WHERE id = $4 AND usuario_id = $5
            RETURNING *`,
            [titulo, descricao, status, id, usuario_id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Tarefa não encontrada"})
        }

        res.json(result.rows[0])
    }catch (error){
        console.error(error)
        res.status(500).json({error: "Erro ao atualizar tarefa"})
    }
}

// Deletar tarefa
exports.deletarTarefa = async (req,res) => {
    try{
        const { id } = req.params
        const usuario_id = req.userId
         
        const result = await pool.query(
            `DELETE FROM tarefas
            WHERE id = $1 AND usuario_id = $2 
            RETURNING *`,
            [id, usuario_id]
        )
        
        if (result.rows.length === 0){
            return res.status(404).json({error: "Erro ao encontrar tarefa"})
        }

        res.json({message: "Tarefa deletada com sucesso"})

    }catch(error){
        console.error(error)
        res.status(500).json({error: "Erro ao deletar tarefa"})
    }
}