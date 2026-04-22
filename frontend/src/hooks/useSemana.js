import { useMemo } from "react"
import { formatarData, getData } from "../utils/date"
import { ordenarTarefas } from "../utils/taskOrder"

export default function useSemana(data, tarefas = []){
    const semana = useMemo(()=>{
        const base = new Date(`${data}T00:00:00`)
        const dias = []
        let i 
        for (i = 1; i<6; i++){
            const data = new Date(base)
            data.setDate(base.getDate()+i)

            const dataFormatada = getData(data)
            const tarefasDoDia = ordenarTarefas(
                tarefas.filter((tarefa) => formatarData(tarefa.data) === dataFormatada)
            )

            dias.push({
                id: dataFormatada,
                label: data.toLocaleDateString('pt-BR', {weekday: 'short'}),
                numero: data.getDate(),
                tarefas: tarefasDoDia.slice(0,3)
            })
        }

        return dias
    }, [data, tarefas])

    return semana
}