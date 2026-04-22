import { useMemo } from 'react'
import { formatarData } from '../utils/date'
import './MiniCalendar.css'

const diasSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']

export default function MiniCalendar({tarefas = [], onOpen}){
    const hoje = new Date()
    const mes = hoje.getMonth()
    const ano = hoje.getFullYear()
    const diaAtual = hoje.getDate()

    const nomeMes = hoje.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
    })

    const { celulas, diasComTarefa } = useMemo(()=>{
        const primeiroDia = new Date(ano, mes, 1)
        const ultimoDia = new Date(ano, mes+1, 0)
        const diasNoMes = ultimoDia.getDate()

        // Inicio da semana como domingo
        const inicioSemana = (primeiroDia.getDay())

        const diasComTarefa = new Set(
            tarefas
                .filter((tarefa) => { //Filtro de tarefas do mês atual
                    const data = new Date(`${formatarData(tarefa.data)}T00:00:00`)
                    return data.getMonth() === mes && data.getFullYear() === ano
                })
                .map((tarefa) => { // Retorna apenas o dia das tarefas
                    const data = new Date(`${formatarData(tarefa.data)}T00:00:00`)
                    return data.getDate()
                })
        )

        const resultado = []
        // Preenche dias antes do mês como null
        let i;
        for (i = 0; i<inicioSemana; i++){
            resultado.push(null)
        }
        // Preenche dias do mês 
        let dia;
        for (dia = 1; dia<=diasNoMes; dia++){
            resultado.push(dia)
        }
        // Preenche dias depois do mês como null
        while (resultado.length % 7 !== 0) {
            resultado.push(null)
        }

        return {
            celulas: resultado,
            diasComTarefa: diasComTarefa
        }
    }, [tarefas, ano, mes])
    
    return(
        <button
            type='button'
            className='mini-calendar-card'
            onClick={onOpen}
        >
            <div className='mini-calendar-head'>
                <p className='mini-calendar-label'>Calendário</p>
                <h2>{nomeMes}</h2>
                <p className='mini-calendar-text'>
                    Veja seus compromissos por mês.
                </p>
            </div>

             <div className="mini-calendar-weekdays">
                {diasSemana.map((dia, index) => (
                    <span key={`${dia}-${index}`}>{dia}</span>
                ))}
            </div>

            <div className="mini-calendar-grid">
                {celulas.map((dia, index) => {
                    if (!dia) {
                        return <span key={`empty-${index}`} className="mini-calendar-cell is-empty" />
                    }

                    const isHoje = dia === diaAtual
                    const temTarefa = diasComTarefa.has(dia)

                    return (
                        <span
                            key={dia}
                            className={[
                                'mini-calendar-cell',
                                isHoje ? 'is-today' : '',
                                temTarefa ? 'has-task' : '',
                            ].join(' ').trim()}
                        >
                            <span className="mini-calendar-day-number">{dia}</span>
                            {temTarefa && <span className="mini-calendar-dot" />}
                        </span>
                    )
                })}
            </div>
        </button>
    )
}