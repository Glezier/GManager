import { useMemo } from "react"

export default function useProgress(tarefas = []){
    const tarefasConcluidas = useMemo(() => {
        const concluidas = tarefas.filter((tarefa) => tarefa.status === 'concluida')
        return concluidas
    }, [tarefas])

    const progresso = useMemo(()=>{
        return(tarefasConcluidas.length / tarefas.length ) * 100  || 0
    }, [tarefas, tarefasConcluidas])

    return{
        quantidadeConcluidas: tarefasConcluidas.length,
        progresso
    }
}