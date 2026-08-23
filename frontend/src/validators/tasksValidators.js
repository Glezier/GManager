import { VALIDATION_LIMITS } from './validationRules'

export function validarTarefa({ titulo, descricao, data, dataMinima, dataMaxima }) {
    if (!titulo.trim()) {
        return 'Informe o título da tarefa'
    }

    if (titulo.trim().length > VALIDATION_LIMITS.tituloMax) {
        return `O título deve ter no máximo ${VALIDATION_LIMITS.tituloMax} caracteres`
    }

    if (descricao.trim().length > VALIDATION_LIMITS.descricaoMax) {
        return `A descrição deve ter no máximo ${VALIDATION_LIMITS.descricaoMax} caracteres`
    }

    if (!data) {
        return 'Informe a data da tarefa'
    }

    if (data < dataMinima) {
        return 'Só é permitido adicionar tarefas retroativas em um período de até 1 ano'
    }

    if (data > dataMaxima) {
        return 'Use a aba de tarefas sem data definida para datas distantes'
    }

    return null
}
