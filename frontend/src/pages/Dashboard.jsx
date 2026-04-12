import { useMemo  } from "react"
import { useNavigate } from 'react-router-dom'
import { getData, formatarData } from "../utils/date"

import TaskForm from "../components/TaskForm"
import DayTasksPanel from "../components/DayTasksPanel"

import useTasks from "../hooks/useTasks"
import useProgress from "../hooks/useProgress"
import useSemana from "../hooks/useSemana"

import "./Dashboard.css"
import CalendarIcon from '../assets/icons/calendar.png'
import NotesIcon from '../assets/icons/notes.png'
import LogoutIcon from '../assets/icons/logout.png'
import AddIcon from '../assets/icons/add.png'


export default function Dashboard(){
    const navigate = useNavigate()
    const token = localStorage.getItem("token") || ""
    const hoje = getData()

    const dataFim = (() => {
        const data = new Date(`${hoje}T00:00:00`)
        data.setDate(data.getDate() + 5)
        return getData(data)
    })()

    const {
        tarefas, 
        loading,
        erroPagina,
        erroForm,
        sucesso,
        addTarefa,
        editando,
        salvarTarefa,
        removerTarefa,
        finalizarTarefa,
        abrirCriacao,
        abrirEdicao,
        fecharModal,
    } = useTasks({
        token,
        inicio: hoje,
        fim: dataFim,
        navigate,
    })

    const tarefasDeHoje = useMemo(() => {
        return tarefas.filter((tarefa) => formatarData(tarefa.data) === hoje)
    }, [tarefas, hoje])

    const {
        quantidadeConcluidas: tarefasConcluidasHoje,
        progresso: progressoHoje
    } = useProgress(tarefasDeHoje)

    const semana = useSemana(hoje, tarefas)   

    return(
        <main className="dashboard">
            <header className="dashboard-topbar">
                <div className="dashboard-brand">
                    GManager
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
                <DayTasksPanel
                    subtitulo="Hoje"
                    titulo="Tarefas do dia"
                    erro={erroPagina}
                    sucesso={sucesso}
                    loading={loading}
                    tarefas={tarefasDeHoje}
                    tarefasConcluidas={tarefasConcluidasHoje}
                    progresso={progressoHoje}
                    onConcluir={finalizarTarefa}
                    onRemover={removerTarefa}
                    onEditar={abrirEdicao}
                    botaoAcao={
                        <button
                            type="button"
                            className="dashboard-add-task"
                            onClick={abrirCriacao}
                        >
                            <img src={AddIcon} alt="Adicionar tarefas" className="day-icons"/>
                            Nova tarefa
                        </button>
                    }
                />

                {addTarefa && (
                    <div className="task-modal-overlay" onClick={fecharModal}>
                        <div className="task-modal" onClick={(e) => e.stopPropagation()}>
                            <TaskForm
                                criar={salvarTarefa}
                                cancelar={fecharModal}
                                hoje={hoje}
                                erro={erroForm}
                                tarefaInicial={editando}
                            />
                        </div>
                    </div>
                )}

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