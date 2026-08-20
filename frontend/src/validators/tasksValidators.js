export function validarTarefa({ titulo }) {
    if (!titulo.trim()) {
        return 'Informe o título da tarefa'
    }

    return null
}