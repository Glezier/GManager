import TaskMonthGrid from './calendar/TaskMonthGrid'
import './MiniCalendar.css'

export default function MiniCalendar({tarefas = [], onOpen}){
    const hoje = new Date()
    const mes = hoje.getMonth()
    const ano = hoje.getFullYear()

    const nomeMes = hoje.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
    })
    
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

            <TaskMonthGrid
                ano={ano}
                mes={mes}
                tarefas={tarefas}
                modoPreview
            />
        </button>
    )
}
