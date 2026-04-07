import { useEffect, useState, useCallback, useMemo  } from "react"
import { useNavigate } from 'react-router-dom'
import { listarTarefas, criarTarefa, deletarTarefa, concluirTarefa } from "../api/api"
import { getData, formatarData } from "../utils/date"

import TaskForm from "../components/TaskForm"
import TaskCard from "../components/TaskCard"

import "./Dashboard.css"
import CalendarIcon from '../assets/icons/calendar.png'
import NotesIcon from '../assets/icons/notes.png'
import LogoutIcon from '../assets/icons/logout.png'
import AddIcon from '../assets/icons/add.png'


export default function Dashboard(){
    const [tarefas, setTarefas] = useState([])
    const [addTarefa, setAddTarefa ] = useState(false)
    const [erroPagina, setErroPagina] = useState("")
    const [erroForm, setErroForm] = useState('')
    const [loading, setLoading] = useState(true)
    const [sucesso, setSucesso] = useState("")

    const navigate = useNavigate()
    const token = localStorage.getItem("token") || ""
    const hoje = getData()

    const dataFim = (() => {
        const data = new Date(`${hoje}T00:00:00`)
        data.setDate(data.getDate() + 5)
        return getData(data)
    })()

    const carregarTarefas = useCallback(async () => {
        try {
            setErroPagina("")
            setLoading(true)

            const data = await listarTarefas(token, hoje, dataFim);
            setTarefas(data);
        } catch (error) {
            setErroPagina(error.message)
            if(
                error.message === "Token inválido" ||
                error.message === "Token não fornecido"
            ){
                localStorage.removeItem("token")
                navigate("/")
            }            
        } finally{
            setLoading(false)
        }
    }, [token, navigate, hoje, dataFim]);

    async function novaTarefa(tarefa){
        try{
            setErroForm('')
            setSucesso('')
            await criarTarefa(token, tarefa)
            setAddTarefa(false)
            await carregarTarefas()
            setSucesso("Tarefa cadastrada com sucesso")
        }catch(error){
            setErroForm(error.message)
        }
    }

    async function removerTarefa(id){
        try{
            setErroPagina('')
            setSucesso('')
            await deletarTarefa(token, id)
            await carregarTarefas()
            setSucesso("Tarefa excluída com sucesso")
        }catch(error){
            setErroPagina(error.message)
        }
    }

    async function finalizarTarefa(id){
        try{
            setErroPagina('')
            setSucesso('')
            await concluirTarefa(token, id)
            await carregarTarefas()
            setSucesso("Tarefa concluída com sucesso")
        } catch(error){
            setErroPagina(error.message)
        }
    }

    const tarefasDeHoje = useMemo(() => {
        return tarefas.filter((tarefa) => formatarData(tarefa.data) === hoje)
    }, [tarefas, hoje])

    const tarefasConcluidasHoje = useMemo(() => {
        return tarefasDeHoje.filter((tarefa) => tarefa.status === "concluida")
    }, [tarefasDeHoje])

    const progressoHoje = tarefasConcluidasHoje.length / tarefasDeHoje.length * 100 || 0 

    const semana = useMemo(() => {
        const base = new Date(`${hoje}T00:00:00`)
        const dias = []

        for (let i = 1; i < 6; i++) {
            const data = new Date(base)
            data.setDate(base.getDate() + i)

            const dataFormatada = getData(data)
            const tarefasDoDia = tarefas.filter(
                (tarefa) => formatarData(tarefa.data) === dataFormatada
            ) // retorna todas as tarefas do dia

            dias.push({
                id: dataFormatada,
                label: data.toLocaleDateString("pt-BR", { weekday: "short" }), // dia da semana abreviado
                numero: data.getDate(),
                tarefas: tarefasDoDia.slice(0, 3), // retorna no máximo 3 tarefas do dia
            })
        }

        return dias
    }, [tarefas, hoje])

    useEffect(()=>{
        if(!token){
            navigate('/')
            return
        }

        carregarTarefas()
       
    }, [token, navigate, carregarTarefas])


    useEffect(() => {
        if (addTarefa) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }

        return () => {
            document.body.style.overflow = "auto"
        }
    }, [addTarefa])

    // Controle do tempo de exibição das mensagens de sucesso de ações do usuário
    useEffect(()=>{
        if (sucesso){
            const timer = setTimeout(() => {
                setSucesso('')
            }, 2500)

            return () => clearTimeout(timer)
        }
        return
    }, [sucesso])

    return(
        <main className="dashboard">
            <header className="dashboard-topbar">
                <div className="dashboard-brand">
                    Gerenciador
                </div>

                <nav className="dashboard-nav">
                    <button type="button" onClick={() => navigate("/calendario")}>
                        <img src={CalendarIcon} alt="Calendário" className="bar-icons" title="Calendário"/>
                    </button>
                    <button type="button">
                        <img src={NotesIcon} alt="Notas" className="bar-icons" title="Notas"/>
                    </button>
                </nav>

                <button
                    type="button"
                    className="dashboard-logout"
                    onClick={() =>{
                        localStorage.removeItem("token")
                        navigate("/")
                    }}
                >
                    <img src={LogoutIcon} className="bar-icons" alt="Sair" title="Sair" />
                </button>
            </header>

            <section className="dashboard-top">
                <div className="dashboard-panel dashboard-panel-today">
                    <div className="dashboard-head">
                        <p>Hoje</p>
                        <h1>Tarefas do dia</h1>
                    </div>

                    {erroPagina && <p className="dashboard-feedback dashboard-feedback-error">{erroPagina}</p>}
                    {sucesso && <p className="dashboard-feedback dashboard-feedback-success">{sucesso}</p>}

                    <div className="dashboard-progress">
                        <button
                            type="button"
                            className="dashboard-add-task"
                            onClick={() => {
                                setAddTarefa(true)
                                setErroForm('')
                            }}
                        >
                            <img src={AddIcon} alt="Adicionar tarefas" className="day-icons"/>
                            Nova tarefa
                        </button>

                        <div className="dashboard-progress-info">
                            <div className="dashboard-progress-text">
                                <span>
                                    {tarefasConcluidasHoje.length} de {tarefasDeHoje.length} concluí­das
                                </span>
                                <span>{Math.round(progressoHoje)}%</span>
                            </div>

                            <div className="dashboard-progress-bar">
                                <div
                                    className="dashboard-progress-fill"
                                    style={{ width: `${progressoHoje}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {addTarefa && (
                        <div className="task-modal-overlay" onClick={() => setAddTarefa(false)}>
                            <div className="task-modal" onClick={(e) => e.stopPropagation()}>
                                <TaskForm
                                    criar={novaTarefa}
                                    cancelar={() => {
                                        setAddTarefa(false)
                                        setErroForm('')
                                    }}
                                    hoje={hoje}
                                    erro={erroForm}
                                />
                            </div>
                        </div>
                    )}

                    <div className="dashboard-task-list">
                        {loading ? (
                            <p>Carregando tarefas...</p>
                        ) : tarefasDeHoje.length > 0 ? (
                            tarefasDeHoje.map((tarefa) => (
                                <TaskCard 
                                    key={tarefa.id}
                                    tarefa={tarefa}
                                    concluir={finalizarTarefa}
                                    remover={removerTarefa}
                                />
                            ))
                        ) : (
                            <p>
                                Nenhuma tarefa para hoje
                            </p>
                        )}
                    </div>
                </div>

                <div className="dashboard-panel dashboard-panel-calendar">
                    <button type="button" className="calendario" onClick={() => navigate("/calendario")}>
                        Calendário
                    </button>
                    <h2>Visão mensal</h2>
                </div>
            </section>

            <section className="dashboard-panel">
                <div className="dashboard-head">
                    <p>Semana</p>
                    <h2>Próximos dias</h2>
                </div>

                <div className="dashboard-week">
                    {semana.map((dia) => (
                        <button 
                            key={dia.id} 
                            type="button"
                            className="dashboard-day"
                            onClick={() => navigate(`/dia/${dia.id}`)} 
                            title={`Tarefas de ${dia.label}`} 
                        >
                            <div className="dashboard-day-head">
                                <span>{dia.label}</span>
                                <strong>{dia.numero}</strong>
                            </div>

                            {dia.tarefas.length > 0 ? (
                                dia.tarefas.map((tarefa) => (
                                    <p key={tarefa.id} className="dashboard-mini-task">
                                        {tarefa.titulo}
                                    </p>        
                                ))
                            ) : (
                                <p className="dashboard-mini-task dashboard-mini-empty">
                                    Sem tarefas
                                </p>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            <section className="dashboard-bottom">
                <div className="dashboard-panel">
                    <div className="dashboard-head">
                        <p>Notas rápidas</p>
                        <h2>Anotações gerais</h2>
                    </div>

                    <div className="dashboard-notes-box">
                        Área reservada para notas gerais.
                    </div>
                </div>

                
            </section>

            <footer className="dashboard-footer">
                Gerenciador de tarefas
            </footer>
        </main>
        
    )
}
