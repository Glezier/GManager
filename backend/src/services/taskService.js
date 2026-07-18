const AppError = require('../utils/AppError')
const taskRepository = require('../repositories/taskRepository')
const taskValidators = require('../validators/taskValidators')

exports.validarPeriodoPermitido = async (usuarioId, dataTarefa) => {
    const permissao = await taskRepository.verificarDataPermitida(usuarioId, dataTarefa)

    if (!permissao) {
        throw new AppError(
            'Usuário não encontrado',
            404,
            'USER_NOT_FOUND'
        )
    }

    if (!permissao.periodo_permitido) {
        throw new AppError(
            'Data fora do período permitido',
            400,
            'TASK_DATE_OUT_OF_RANGE'
        )
    }
}

exports.validarIntervaloPermitido = async (usuarioId, inicio, fim) => {
    const permissao = await taskRepository.verificarIntervaloPermitido(usuarioId, inicio, fim)

    if (!permissao) {
        throw new AppError(
            'Usuário não encontrado',
            404,
            'USER_NOT_FOUND'
        )
    }

    if (!permissao.periodo_permitido) {
        throw new AppError(
            'Período fora do limite permitido',
            400,
            'TASK_DATE_OUT_OF_RANGE'
        )
    }
}

exports.validarLimiteDiario = async (usuarioId, data) => {
    const totalNoDia = await taskRepository.contarTarefasDoDia(usuarioId, data)

    if (totalNoDia >= 30) {
        throw new AppError(
            'Limite de 30 tarefas por dia atingido',
            400,
            'DAILY_TASK_LIMIT_REACHED'
        )
    }
}

exports.criarTarefa = async (usuarioId, dados) => {
    // Recebe dados da requisicao
    const tarefa = taskValidators.validarCriacaoTarefa(dados)

    await exports.validarPeriodoPermitido(usuarioId, tarefa.data)
    await exports.validarLimiteDiario(usuarioId, tarefa.data)
   
    const result = await taskRepository.criarTarefa(
        tarefa.titulo,
        tarefa.descricao,
        usuarioId,
        tarefa.data,
        tarefa.hora
    )

    return result
}

exports.listarTarefas = async (usuarioId, filtros) => {
    const periodo = taskValidators.validarListagemTarefas(filtros)
    
    await exports.validarIntervaloPermitido(usuarioId, periodo.inicio, periodo.fim)

    const result = await taskRepository.listarTarefas(usuarioId, periodo.inicio, periodo.fim)
    return result
}

exports.atualizarTarefa = async (usuarioId, id, dados) => {
    const tarefa = taskValidators.validarAtualizacaoTarefa(dados)

    await exports.validarPeriodoPermitido(usuarioId, tarefa.data)

    const tarefaAtualizada = await taskRepository.atualizarTarefa(
        tarefa.titulo,
        tarefa.descricao,
        tarefa.status,
        tarefa.data,
        tarefa.hora,
        id,
        usuarioId
    )

    taskValidators.validateResultAfterQuery(tarefaAtualizada)

    return tarefaAtualizada
}

exports.concluirTarefa = async (usuarioId, id) => {
    const tarefaConcluida = await taskRepository.concluirTarefa(id, usuarioId)

    taskValidators.validateResultAfterQuery(tarefaConcluida)

    return tarefaConcluida
}

exports.deletarTarefa = async (usuarioId, id) => {
    const tarefaDeletada = await taskRepository.deletarTarefa(id, usuarioId)

    taskValidators.validateResultAfterQuery(tarefaDeletada)

    return {
        message: 'Tarefa deletada com sucesso'
    }
}
