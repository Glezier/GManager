import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { useMe } from '../hooks/useMe'
import { useTarefas } from '../hooks/useTarefas'
import { getToken } from '../utils/auth'
import { getData, formatarData } from '../utils/date'

import LoadingState from '../components/ui/LoadingState'

import "./Calendar.css"

const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
]

export default function Calendar(){
    const navigate = useNavigate()
    const token = getToken()
    const [periodo, setPeriodo] = useState({
        inicio: "",
        fim:""
    })
    const calendarRef = useRef(null)

    const hoje = new Date()
    const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth())
    const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear())

    const { data: usuario, isLoading: carregandoUsuario, error: erroUsuario } = useMe()

    const {
        data: tarefas = [],
        isLoading: carregandoTarefas,
        isFetchung: atualizandoTarefas,
        error: erroTarefas,
    } = useTarefas({
        token,
        inicio: periodo.inicio,
        fim: periodo.fim,
    })

    const loading = carregandoUsuario || carregandoTarefas || atualizandoTarefas
    const erro = erroUsuario?.message || erroTarefas?.message || ''


    useEffect(() => {

        if(!token){
            navigate('/')
            return
        }

    }, [token, navigate])

    // Anos mostrados no calendário pelo select
    const anos = useMemo(() => {
        const dataAtual = new Date()
        const anoAtual = dataAtual.getFullYear()
        const anoInicial = usuario?.created_at
            ? new Date(usuario.created_at).getFullYear() - 1 
            : anoAtual - 1

        const anoFinal = anoAtual + 3

        const lista = []

        for (let ano = anoInicial; ano <= anoFinal; ano++) {
            lista.push(ano)
        }

        return lista
    }, [usuario])

    // Controle de anos do calendario via full calendar
    const limiteCalendario = useMemo(() => {
        const dataAtual = new Date()

        const dataInicial = usuario?.created_at
            ? new Date(usuario.created_at)
            : dataAtual

        dataInicial.setFullYear(dataInicial.getFullYear()-1)

        const dataFinal = new Date(dataAtual)
        dataFinal.setFullYear(dataFinal.getFullYear() + 3)
        dataFinal.setDate(dataFinal.getDate() + 1)

        return {
            start: getData(dataInicial),
            end: getData(dataFinal),
        }
    }, [usuario])

    useEffect(() => {
        if (!token){
            navigate('/')
        }
    }, [token, navigate])

     // Navega o calendário quando mês ou ano mudam
    useEffect(() => {
        const api = calendarRef.current?.getApi()
        if (!api) return
        api.gotoDate(new Date(anoSelecionado, mesSelecionado, 1))
    }, [mesSelecionado, anoSelecionado])

    const eventos = useMemo( ()=> {
        return tarefas.map((tarefa) => ({
            id: tarefa.id,
            title: tarefa.titulo,
            date: formatarData(tarefa.data),
            classNames: [`evento-${tarefa.status}`],
        }))
    }, [tarefas])

    function handleDate(info){
        navigate(`/dia/${info.dateStr}`)
    }

    // Clicar em tarefa do dia também abre o dia da tarefa
    function handleDateClick(info){
        const data = info.event.start
        navigate(`/dia/${getData(data)}`)
    }

    // Sincroniza os selects quando o usuário navega pelas setas do FullCalendar
    function handleDatesSet(info) {
        const inicio = getData(info.start)
        const fimReal = new Date(info.end)
        fimReal.setDate(fimReal.getDate() - 1)
        const fim = getData(fimReal)
        setPeriodo({ inicio, fim })

        // Atualiza os selects para refletir o mês visível
        const dataCentral = new Date(info.start)
        dataCentral.setDate(dataCentral.getDate() + 7) // garante que está no mês correto
        setMesSelecionado(dataCentral.getMonth())
        setAnoSelecionado(dataCentral.getFullYear())
    }

    // Botão voltar do navegador apontar para Dashboard
    useEffect(()=>{
        function handlePopState(){
            navigate('/dashboard', {replace: true})
        }
        window.addEventListener('popstate', handlePopState)

        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [navigate])

    return(
        <main className='calendar-page'>
            <section className='calendar-hero'>
                <div className='calendar-hero-top'>
                    <button 
                        type='button' 
                        className='day-back' 
                        onClick={()=> navigate('/dashboard')}
                    >
                        Voltar para dashboard
                    </button>

                    <div className='calendar-toolbar'>
                        <div className='calendar-toolbar-group'>
                            <label htmlFor="select-mes">Mês:</label>
                            <select
                                id="select-mes"
                                value={mesSelecionado}
                                onChange={(e) => setMesSelecionado(Number(e.target.value))}
                            >
                                {meses.map((nome, index) => (
                                    <option key={index} value={index}>{nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className='calendar-toolbar-group'>
                            <label htmlFor="select-ano">Ano:</label>
                            <select
                                id="select-ano"
                                value={anoSelecionado}
                                onChange={(e) => setAnoSelecionado(Number(e.target.value))}
                            >
                                {anos.map((ano) => (
                                    <option key={ano} value={ano}>{ano}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className='calendar-hero-content'>
                    <p className="calendar-hero-label">Visão mensal</p>
                    <h1 className="calendar-hero-title">Calendário</h1>
                    <p className="calendar-hero-text">
                        Navegue pelo mês, visualize seus compromissos e entre em cada dia para ajustar o planejamento.
                    </p>
                </div>
            </section>

            {erro && (
                <p className="dashboard-feedback dashboard-feedback-error">
                    {erro}
                </p>
            )}

            {loading && (
                <LoadingState message="Carregando calendário..."/>
            )}

            {!loading && !erro && tarefas.length === 0 && (
                <div className="dashboard-empty-state">
                    <p className="dashboard-empty-title">Nenhuma tarefa neste período</p>
                    <p className="dashboard-empty-message">
                        Navegue entre os meses ou clique em um dia para começar a se organizar.
                    </p>
                </div>
            )}

            <section className='calendar-shell'>
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView='dayGridMonth'
                    locale='pt-br'
                    events={eventos}
                    dateClick={handleDate}
                    eventClick={handleDateClick}
                    dayMaxEvents={3}
                    height="auto"
                    datesSet={handleDatesSet}
                    validRange={limiteCalendario}
                />
            </section>
        </main>
    )
}
