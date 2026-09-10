import { useMemo } from 'react'
import { formatarData, getData } from '../../utils/date'
import './TaskMonthGrid.css'

const diasSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']

export default function TaskMonthGrid({
    ano,
    mes,
    tarefas = [],
    onSelectDate,
    modoPreview = false,
}){
    const hoje = getData()
    const interativo = Boolean(onSelectDate)

    const celulas = useMemo(() => {
        const primeiroDia = new Date(ano, mes, 1)
        const ultimoDia = new Date(ano, mes + 1, 0)
        const diasNoMes = ultimoDia.getDate()
        const inicioSemana = primeiroDia.getDay()

        const tarefasPorData = tarefas.reduce((grupos, tarefa) => {
            const data = formatarData(tarefa.data)
            const dataObj = new Date(`${data}T00:00:00`)

            if (dataObj.getMonth() !== mes || dataObj.getFullYear() !== ano) {
                return grupos
            }

            if (!grupos[data]) {
                grupos[data] = []
            }

            grupos[data].push(tarefa)
            return grupos
        }, {})

        const resultado = []

        for (let i = 0; i < inicioSemana; i++) {
            resultado.push(null)
        }

        for (let dia = 1; dia <= diasNoMes; dia++) {
            const data = getData(new Date(ano, mes, dia))
            const tarefasDoDia = tarefasPorData[data] || []
            const temPendente = tarefasDoDia.some((tarefa) => tarefa.status === 'pendente')

            resultado.push({
                data,
                dia,
                total: tarefasDoDia.length,
                statusResumo: tarefasDoDia.length > 0
                    ? temPendente ? 'pendente' : 'concluida'
                    : '',
            })
        }

        while (resultado.length % 7 !== 0) {
            resultado.push(null)
        }

        return resultado
    }, [ano, mes, tarefas])

    return(
        <div className={`task-month-grid ${modoPreview ? 'task-month-grid-preview' : ''}`}>
            <div className="task-month-weekdays">
                {diasSemana.map((dia, index) => (
                    <span key={`${dia}-${index}`}>{dia}</span>
                ))}
            </div>

            <div className="task-month-days">
                {celulas.map((celula, index) => {
                    if (!celula) {
                        return <span key={`empty-${index}`} className="task-month-cell is-empty" />
                    }

                    const className = [
                        'task-month-cell',
                        celula.data === hoje ? 'is-today' : '',
                        celula.total > 0 ? 'has-task' : '',
                        celula.statusResumo ? `task-status-${celula.statusResumo}` : '',
                    ].join(' ').trim()

                    const conteudo = (
                        <>
                            <span className="task-month-day-number">{celula.dia}</span>
                            {celula.total > 0 && (
                                <span
                                    className="task-month-dot"
                                    title={`${celula.total} ${celula.total === 1 ? 'tarefa' : 'tarefas'}`}
                                />
                            )}
                        </>
                    )

                    if (!interativo) {
                        return(
                            <span key={celula.data} className={className}>
                                {conteudo}
                            </span>
                        )
                    }

                    return(
                        <button
                            key={celula.data}
                            type="button"
                            className={className}
                            onClick={() => onSelectDate(celula.data)}
                            title={`Abrir tarefas de ${celula.dia}`}
                        >
                            {conteudo}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
