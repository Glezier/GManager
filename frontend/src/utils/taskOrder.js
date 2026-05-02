import { formatarHora } from "./date";

function getHora(hora){
    const horaFormatada = formatarHora(hora)

    if (!horaFormatada){ // Colocar tarefa com hora bem grande para ir para o final
        return '99:99'
    }

    return horaFormatada
}

function getPesoStatus(status){
    return status === 'concluida' ? 1 : 0
}

export function ordenarTarefas(tarefas = []){
    return [...tarefas].sort((a,b) => { // Trabalha com cópia do array
        const statusA = getPesoStatus(a.status)
        const statusB = getPesoStatus(b.status)

        if (statusA !== statusB) {
            return statusA - statusB
        }
        
        const horaA = getHora(a.hora)
        const horaB = getHora(b.hora)

        if (horaA !== horaB) {
            return horaA.localeCompare(horaB) // Compara por horário
        }

        if (a.created_at && b.created_at && a.created_at !== b.created_at) { // Dsempata por created_at
            return new Date(a.created_at) - new Date(b.created_at)
        }

        return (a.id || 0) - (b.id || 0)
    })
}