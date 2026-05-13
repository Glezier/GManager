import { useMemo  } from "react"
import { useNavigate } from 'react-router-dom'

import { getData, formatarData } from "../utils/date"
import { getToken, removeToken } from "../utils/auth"
import { ordenarTarefas } from "../utils/taskOrder"

import { logout } from "../api/api"

import MiniCalendar from "../components/MiniCalendar"
import TaskForm from "../components/TaskForm"
import DayTasksPanel from "../components/DayTasksPanel"
import ConfirmBox from "../components/ConfirmBox"

import useTasks from "../hooks/useTasks"
import useProgress from "../hooks/useProgress"
import useSemana from "../hooks/useSemana"

import "./Dashboard.css"
import FullLogo from '../assets/icons/full_logo.png'
import CalendarIcon from '../assets/icons/calendar.png'
import NotesIcon from '../assets/icons/notes.png'
import ProfileIcon from './../assets/icons/profile.png'
import LogoutIcon from '../assets/icons/logout.png'
import AddIcon from '../assets/icons/add.png'


export default function Dashboard(){
    const navigate = useNavigate()
    const token = getToken()
    const hoje = getData()
    // Busca iniciando por mes
    const dataInicio = (() => {
        const data = new Date(`${hoje}T00:00:00`)
        data.setDate(1)
        return getData(data)
    }) ()
    // Busca com termino por mês ou + 5 dias para a aba de semana
    const dataFim = (() => {
        const fimMes = new Date(`${hoje}T00:00:00`)
        fimMes.setMonth(fimMes.getMonth() + 1)
        fimMes.setDate(0)

        const fimSemana = new Date(`${hoje}T00:00:00`)
        fimSemana.setDate(fimSemana.getDate() + 5)
        
        return getData(fimSemana > fimMes ? fimSemana : fimMes)
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
        inicio: dataInicio,
        fim: dataFim,
        navigate,
    })

    // Ordenação das tarefas usando o util
    const tarefasDeHoje = useMemo(() => {
        const tarefasFiltradas = tarefas.filter(
            (tarefa) => formatarData(tarefa.data) === hoje
        )
        return ordenarTarefas(tarefasFiltradas)
    }, [tarefas, hoje])

    const {
        quantidadeConcluidas: tarefasConcluidasHoje,
        progresso: progressoHoje
    } = useProgress(tarefasDeHoje)

    const semana = useSemana(hoje, tarefas)  
    
    async function handleLogout(){
        try{
            await logout()
        } catch(error){
            console.log('Erro ao fazer login' + error)
        } finally{
            removeToken()
            navigate('/', {state: { skipSessionCheck: true }})
        }
    }

    return(
        <main className="dashboard">
            <header className="dashboard-topbar">
                <div className="dashboard-brand-block">
                    <div className="dashboard-brand">
                        <img src={FullLogo} alt="Logo My GManager" className='auth-logo' />
                        <p>Visão geral da sua rotina</p>
                    </div>
                </div>

                <nav className="dashboard-nav">
                    <button type="button" onClick={() => navigate("/calendario")}>
                        <img src={CalendarIcon} alt="Calendário" className="bar-icons" title="Calendário"/>
                    </button>
                    {/*<button type="button">
                        <img src={NotesIcon} alt="Notas" className="bar-icons" title="Notas"/>
                    </button> */}
                    
                </nav>

                <div className="dashboard-brand-block"> 
                    <button type="button" onClick={() => navigate("/perfil")} >
                        <img src={ProfileIcon} alt="Profile" className="bar-icons" title="Profile"/>
                    </button>
                    <button
                        type="button"
                        className="dashboard-logout"
                        onClick={handleLogout}
                    >
                        <img src={LogoutIcon} className="bar-icons" alt="Sair" title="Sair" />
                    </button>
                </div>
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

                <MiniCalendar 
                    tarefas = {tarefas}
                    onOpen = {() => navigate("/calendario")}
                />
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
                            onClick={() => navigate(`/dia/${dia.id}`, {state: {from: 'dashboard'}})} 
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
                        <p>Em breve</p>
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
              
                <div className="dashboard-panel">
                    <div className="dashboard-head">
                        <p>Em breve</p>
                        <h2>Checklists</h2>
                    </div>

                    <div className="dashboard-notes-box">
                        <p className="dashboard-notes-lead">
                            Um espaço pensado para listas reutilizáveis e conferências rápidas do que precisa ser acompanhado.
                        </p>
                        <p className="dashboard-notes-subtext">
                            Aqui podem entrar checklists de rotina, compras, revisões, preparos...
                        </p>
                    </div>
                </div>
            </section>

            <section className="dashboard-stack">
                <div className="dashboard-panel dashboard-panel-wide">
                    <div className="dashboard-head">
                        <p>Em breve</p>
                        <h2>Gerenciamento de finanças</h2>
                    </div>

                    <div className="dashboard-notes-box">
                        <p className="dashboard-notes-lead">
                            Uma área para acompanhar entradas, saídas, metas financeiras e compromissos recorrentes dentro da sua organização pessoal.
                        </p>
                        <p className="dashboard-notes-subtext">
                            A proposta é centralizar visão mensal, controle de despesas e planejamento financeiro e vendo exatamente as contas batendo ao final do mês.
                        </p>
                    </div>
                </div>

                <div className="dashboard-bottom">
                    <div className="dashboard-panel">
                        <div className="dashboard-head">
                            <p>Em breve</p>
                            <h2>Eventos sem data definida</h2>
                        </div>

                        <div className="dashboard-notes-box">
                            <p className="dashboard-notes-lead">
                                Um lugar para guardar compromissos, ideias e planos que ainda não tem dia fechado, mas já merecem organização.
                            </p>
                            <p className="dashboard-notes-subtext">
                                Vai servir para metas futuras, viagens, encontros, projetos e lembretes maiores que estão no radar, mas ainda sem data no calendário.
                            </p>
                        </div>
                    </div>

                    <div className="dashboard-panel">
                        <div className="dashboard-head">
                            <p>Em breve</p>
                            <h2>Integração com futebol e implementação de IA</h2>
                        </div>

                        <div className="dashboard-notes-box">
                            <p className="dashboard-notes-lead">
                                Ideias mais fortes mas que devem sair do papel.
                            </p>
                            <p className="dashboard-notes-subtext">
                                No My GManager você poderá também acompanhar seu time do coração e conseguir algumas dicas com IA para realização de tarefas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="dashboard-footer">
                Gerenciador de tarefas
            </footer>
        </main>
    )
}
