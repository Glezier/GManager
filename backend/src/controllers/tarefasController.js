const taskService = require("../services/taskService")

// Criar tarefa
exports.criarTarefa = async (req, res, next) => {
    try{
        // Encaminha os dados da requisição para validação no service
        const tarefa = await taskService.criarTarefa(req.userId, req.body)

        res.status(201).json(tarefa)
    } catch(error){
        next(error)
    }
}

//Listar tarefas
exports.listarTarefas = async (req,res, next) => {
    try{
        const tarefas = await taskService.listarTarefas(req.userId, req.query)

        res.json(tarefas)
    } catch(error){
        next(error)
    }
}

// Atualizar tarefa
exports.atualizarTarefa = async (req, res, next) => {
    try {
        const tarefa = await taskService.atualizarTarefa(req.userId, req.params.id, req.body)
        
        res.json(tarefa)
    }catch (error){
        next(error)
    }
}

// Concluir tarefa
exports.concluirTarefa = async (req,res, next) => {
    try{
        const tarefa = await taskService.concluirTarefa(req.userId, req.params.id)
        
        res.json(tarefa)
    }catch(error){
        next(error)
    }
}

// Deletar tarefa
exports.deletarTarefa = async (req,res, next) => {
    try{
        const resposta = await taskService.deletarTarefa(req.userId, req.params.id)

        res.json(resposta)
    }catch(error){
        next(error)
    }
}