import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarTarefas, isAuthError } from '../api/api'

import { getToken, removeToken } from '../utils/auth'
import { getData, formatarData } from '../utils/date'

import "./Calendar.css"
import './DayPage.css'

const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
]

export default function Calendar(){
    const [tarefas, setTarefas] = useState([])
    const navigate = useNavigate()
    const token = getToken()
    const [periodo, setPeriodo] = useState({
        inicio: "",
        fim:""
    })
    const [erro, setErro] = useState("")
    const [loading, setLoading] = useState(false)

    const calendarRef = useRef(null)

    const hoje = new Date()
    const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth())
    const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear())

    const anos = []
    
    for (let ano = hoje.getFullYear() - 5; ano <= hoje.getFullYear() + 5; ano++) {
        anos.push(ano)
    }

    useEffect(() => {
        async function carregar() {
            try{
                setErro("")
                setLoading(true)

                const data = await listarTarefas(token, periodo.inicio, periodo.fim)
                setTarefas(data)
            } catch (error){
                setErro(error.message)
                if (isAuthError(error.message)) {
                    removeToken()
                    navigate("/")
                }
            } finally {
                setLoading(false)
            }
        }

        if(!token){
            navigate("/")
            return
        }

        if(!periodo.inicio || !periodo.fim){
            return
        }

        carregar()
    },[token, navigate, periodo])

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
        <main style={{ margin: "35px"}}>
            <h1>
                Calendário
            </h1>

            <div style={{ display: "flex", gap: "18px", alignItems: "center", justifyContent: "flex-end"}}>
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

            {erro && <p>{erro}</p>}
            {loading && <p>Carregando calendário...</p>}

            <button type='button' className='day-back' onClick={()=> navigate('/dashboard')}>
                Voltar para Dashboard
            </button>

            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView='dayGridMonth'
                locale='pt-br'
                events={eventos}
                dateClick={handleDate}
                dayMaxEvents={3}
                height="auto"
                datesSet={handleDatesSet}
            />
        </main>
    )
}