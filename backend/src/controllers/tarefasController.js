const pool = require('../database/db');

//Listar tarefas
exports.listarTarefas = async (req,res) => {
    try{
        const result = await pool.query('SELECT * FROM tarefas ORDER BY id DESC');
        return res.json(result.rows);
    } catch(error){
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
}

// Criar tarefa
exports.criarTarefa = async (req, res) => {
    try{
        const {titulo, descricao, status} = req.body

        if(!titulo){
            return res.status(400).json({error: "Título é obrigatório"})
        }

        const result = await pool.query(
            `INSERT INTO tarefas (titulo, descricao, status)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [titulo, descricao || null, status || 'pendente']
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

        const result = await pool.query(
            `UPDATE tarefas
            SET titulo = COALESCE($1, titulo),
                descricao = COALESCE($2, descricao),
                status = COALESCE($3, status)
            WHERE id = $4
            RETURNING *`,
            [titulo, descricao, status, id]
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
        
        const result = await pool.query(
            `DELETE FROM tarefas
            WHERE id = $1
            RETURNING *`,
            [id]
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