import { useMemo  } from "react"
import { useNavigate } from 'react-router-dom'
import { getData, formatarData } from "../utils/date"

import { getToken, removeToken } from "../utils/auth"

import TaskForm from "../components/TaskForm"
import DayTasksPanel from "../components/DayTasksPanel"
import ConfirmBox from "../components/ConfirmBox"

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
    const token = getToken()
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
        confirmacao,
        solicitarRemocao,
        confirmarRemocao,
        fecharConfirmacao,
        salvarTarefa,
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
                <div className="dashboard-brand-block">
                    <div className="dashboard-brand">
                        <strong>GManager</strong>
                        <p>Visão geral da sua rotina</p>
                    </div>
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
                        removeToken()
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
                    onRemover={solicitarRemocao}
                    onEditar={abrirEdicao}
                    emptyMessage="Você ainda não tem tarefas para hoje. Que tal adicionar a primeira?"
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

                <ConfirmBox
                    open={confirmacao.open}
                    title={confirmacao.title}
                    message={confirmacao.message}
                    confirmLabel={confirmacao.confirmLabel}
                    cancelLabel={confirmacao.cancelLabel}
                    variant={confirmacao.variant}
                    loading={confirmacao.loading}
                    onConfirm={confirmarRemocao}
                    onCancel={fecharConfirmacao}
                />

                {addTarefa && (
                    <div className="task-modal-overlay" onClick={fecharModal}>
                        <div className="task-modal" onClick={(e) => e.stopPropagation()}>
                            <TaskForm
                                key={editando ? `editar-${editando.id}` : `criar-${hoje}`}
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
                    <p className="dashboard-panel-label">Planejamento</p>
                    <h2>Veja o mês e ajuste os próximos dias</h2>
                    <p className="dashboard-panel-text">
                        Acesse o calendário para revisar compromissos, navegar entre datas e manter a semana sob controle.
                    </p>
                    <button type="button" className="calendario" onClick={() => navigate("/calendario")}>
                        Calendário
                    </button>
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
                        <p className="dashboard-notes-lead">
                            Espaço reservado para notas gerais, lembretes e ideias rápidas.
                        </p>
                        <p className="dashboard-notes-subtext">
                            Aqui entram observações do dia a dia, pontos de atenção e tudo o que não precisa virar tarefa agora.
                        </p>
                    </div>
                </div>
              
            </section>

            <footer className="dashboard-footer">
                Gerenciador de tarefas
            </footer>
        </main>
    )
}
