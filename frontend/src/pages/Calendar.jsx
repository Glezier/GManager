import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { listarTarefas } from '../api/tasksApi'
import { useMe } from '../hooks/useMe'
import { useTarefas } from '../hooks/useTarefas'
import { getToken } from '../utils/auth'
import { getData, formatarData } from '../utils/date'
import { compartilharTextoWhatsapp, formatarTarefasPorPeriodoParaTexto, baixarPdfTarefasPorPeriodo } from '../utils/exportTasks'

import ExportMenu from '../components/ExportMenu'
import LoadingState from '../components/ui/LoadingState'
import AppFooter from '../components/AppFooter'

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

    const [exportacaoAberta, setExportacaoAberta] = useState(false)

    const [periodoExportacao, setPeriodoExportacao] = useState({
        inicio: '',
        fim: ''
    })

    const [erroExportacao, setErroExportacao] = useState('')
    const [carregandoExportacao, setCarregandoExportacao] = useState(false)

    function validarPeriodoExportacao() {
        const { inicio, fim } = periodoExportacao

        if (!inicio || !fim) {
            setErroExportacao('Informe a data inicial e a data final.')
            return false
        }

        if (inicio > fim) {
            setErroExportacao('A data inicial não pode ser maior que a data final.')
            return false
        }

        if (inicio < limiteCalendario.start) {
            setErroExportacao('A data inicial está fora do período permitido.')
            return false
        }

        if (fim >= limiteCalendario.end) {
            setErroExportacao('A data final está fora do período permitido.')
            return false
        }

        setErroExportacao('')
        return true
    }

    async function buscarTarefasParaExportacao() {
        const periodoValido = validarPeriodoExportacao()

        if (!periodoValido) {
            return null
        }

        try {
            setCarregandoExportacao(true)
            setErroExportacao('')

            const tarefasExportacao = await listarTarefas(
                periodoExportacao.inicio,
                periodoExportacao.fim
            )

            if (tarefasExportacao.length === 0) {
                setErroExportacao('Nenhuma tarefa encontrada nesse período.')
                return null
            }

            return tarefasExportacao
        } catch (error) {
            setErroExportacao(error.message)
            return null
        } finally {
            setCarregandoExportacao(false)
        }
    }

    const calendarRef = useRef(null)

    // Voltar para mes correto apos entrar em um daypage
    // Mostra o dia de hoje ao entrar pela primeira vez
    const location = useLocation()
    const dataCalendario = location.state?.calendarDate
    const dataInicialCalendario = dataCalendario 
        ? new Date(`${dataCalendario}T00:00:00`) 
        : new Date()

    
    const [mesSelecionado, setMesSelecionado] = useState(dataInicialCalendario.getMonth())
    const [anoSelecionado, setAnoSelecionado] = useState(dataInicialCalendario.getFullYear())
    const [calendarioCompacto, setCalendarioCompacto] = useState(() => {
        return typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches
    })

    useEffect(() => {
        if (exportacaoAberta) {
            return
        }
        const inicio = new Date(anoSelecionado, mesSelecionado, 1)
        const fim = new Date(anoSelecionado, mesSelecionado + 1, 0)

        setPeriodoExportacao({
            inicio: getData(inicio),
            fim: getData(fim)
        })
    }, [mesSelecionado, anoSelecionado, exportacaoAberta])

    const { data: usuario, isLoading: carregandoUsuario, error: erroUsuario } = useMe()

    const {
        data: tarefas = [],
        isLoading: carregandoTarefas,
        isFetching: atualizandoTarefas,
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

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 640px)')

        function atualizarCalendarioCompacto(event){
            setCalendarioCompacto(event.matches)
        }

        mediaQuery.addEventListener('change', atualizarCalendarioCompacto)

        return () => {
            mediaQuery.removeEventListener('change', atualizarCalendarioCompacto)
        }
    }, [])

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

    // Vai para o mês correto após day page
    function getCalendarState(){
        return {
            from: "calendario",
            calendarDate: getData(new Date(anoSelecionado, mesSelecionado, 1))
        }
    }

    function handleDate(info){
        navigate(`/dia/${info.dateStr}`, {
            state: getCalendarState()
        })
    }    

    // Clicar em tarefa do dia também abre o dia da tarefa
    function handleDateClick(info){
        const data = info.event.start
        navigate(`/dia/${getData(data)}`, {
            state: getCalendarState()
        })
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

    async function handleExportarWhatsapp() {
        const tarefasExportacao = await buscarTarefasParaExportacao()

        if (!tarefasExportacao) {
            return
        }

        const texto = formatarTarefasPorPeriodoParaTexto({
            inicio: periodoExportacao.inicio,
            fim: periodoExportacao.fim,
            tarefas: tarefasExportacao
        })

        compartilharTextoWhatsapp(texto)
    }

    async function handleExportarPdf() {
        const tarefasExportacao = await buscarTarefasParaExportacao()

        if (!tarefasExportacao) {
            return
        }

        baixarPdfTarefasPorPeriodo({
            inicio: periodoExportacao.inicio,
            fim: periodoExportacao.fim,
            tarefas: tarefasExportacao
        })
    }

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

                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setExportacaoAberta((aberto) => !aberto)}
                        >
                            Exportar
                        </button>

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

            {exportacaoAberta && (
                <section className="calendar-export-box">
                    <div className="calendar-export-fields">
                        <div className="calendar-toolbar-group">
                            <label htmlFor="export-inicio">Início:</label>
                            <input
                                id="export-inicio"
                                type="date"
                                value={periodoExportacao.inicio}
                                min={limiteCalendario.start}
                                max={limiteCalendario.end}
                                onChange={(e) => {
                                    setPeriodoExportacao((atual) => ({
                                        ...atual,
                                        inicio: e.target.value
                                    }))
                                }}
                            />
                        </div>

                        <div className="calendar-toolbar-group">
                            <label htmlFor="export-fim">Fim:</label>
                            <input
                                id="export-fim"
                                type="date"
                                value={periodoExportacao.fim}
                                min={limiteCalendario.start}
                                max={limiteCalendario.end}
                                onChange={(e) => {
                                    setPeriodoExportacao((atual) => ({
                                        ...atual,
                                        fim: e.target.value
                                    }))
                                }}
                            />
                        </div>

                        <ExportMenu
                            label={carregandoExportacao ? 'Exportando...' : 'Gerar'}
                            onWhatsapp={handleExportarWhatsapp}
                            onPdf={handleExportarPdf}
                            disabled={carregandoExportacao}
                        />
                    </div>

                    {erroExportacao && (
                        <p className="dashboard-feedback dashboard-feedback-error">
                            {erroExportacao}
                        </p>
                    )}
                </section>
            )}

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
                    headerToolbar={{
                        left: 'title',
                        center: '',
                        right: 'today prev,next'
                    }}
                    buttonText={{
                        today: 'Hoje'
                    }}
                    dayHeaderFormat={calendarioCompacto ? { weekday: 'narrow' } : { weekday: 'short' }}
                    events={eventos}
                    dateClick={handleDate}
                    eventClick={handleDateClick}
                    dayMaxEvents={calendarioCompacto ? 1 : 3}
                    fixedWeekCount={false}
                    height="auto"
                    datesSet={handleDatesSet}
                    validRange={limiteCalendario}
                />
            </section>

            <AppFooter minimal />
        </main>
    )
}
