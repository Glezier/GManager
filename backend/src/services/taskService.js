const AppError = require('../utils/AppError')
const taskRepository = require('../repositories/taskRepository')

exports.validarPeriodoPermitido = async (usuarioId, dataTarefa) => {
    const permissao = await taskRepository.checkDateAllowed(usuarioId, dataTarefa)

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
    const permissao = await taskRepository.checkRangeAllowed(usuarioId, inicio, fim)

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
    const totalNoDia = await taskRepository.countByUserAndDate(usuarioId, data)

    if (totalNoDia >= 30) {
        throw new AppError(
            'Limite de 30 tarefas por dia atingido',
            400,
            'DAILY_TASK_LIMIT_REACHED'
        )
    }
}