import { useEffect, useState, useCallback, useMemo  } from "react"
import { useNavigate } from 'react-router-dom'
import { listarTarefas, criarTarefa, deletarTarefa, concluirTarefa } from "../api/api"

import TaskForm from "../components/TaskForm"
import TaskCard from "../components/TaskCard"

import "./Dashboard.css"

export default function Dashboard(){
    const [tarefas, setTarefas] = useState([])
    const [addTarefa, setAddTarefa ] = useState(false)

    const navigate = useNavigate()
    const token = localStorage.getItem("token") || ""
    const hoje = new Date().toLocaleDateString("en-CA")

    const carregarTarefas = useCallback(async () => {
        try {
            const data = await listarTarefas(token);
            setTarefas(data);
        } catch (error) {
            console.error("Erro ao carregar tarefas:", error);
            navigate("/");
        }
    }, [token, navigate]);

    async function novaTarefa(tarefa){
        await criarTarefa(token, tarefa)
        setAddTarefa(false)
        carregarTarefas()
    }

    async function removerTarefa(id){
        await deletarTarefa(token, id)
        carregarTarefas()
    }

    async function finalizarTarefa(id){
        await concluirTarefa(token, id)
        carregarTarefas()
    }

    const tarefasDeHoje = useMemo(() => {
        return tarefas.filter((tarefa) => tarefa.data.toString().split("T")[0] === hoje)
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

            const dataFormatada = data.toLocaleDateString("en-CA")
            const tarefasDoDia = tarefas.filter(
                (tarefa) => tarefa.data.toString().split("T")[0] === dataFormatada
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

        // eslint-disable-next-line react-hooks/set-state-in-effect
        carregarTarefas()
       
    }, [token, navigate, carregarTarefas])


    return(
        <main className="dashboard">
            <header className="dashboard-topbar">
                <div className="dashboard-brand">
                    Gerenciador
                </div>

                <nav className="dashboard-nav">
                    <button type="button">Calendário</button>
                    <button type="button">Notas</button>
                </nav>

                <button
                    type="button"
                    className="dashboard-logout"
                    onClick={() =>{
                        localStorage.removeItem("token")
                        navigate("/")
                    }}
                >
                    Sair
                </button>
            </header>

            <section className="dashboard-top">
                <div className="dashboard-panel dashboard-panel-today">
                    <div className="dashboard-head">
                        <p>Hoje</p>
                        <h1>Tarefas do dia</h1>
                    </div>

                    <div className="dashboard-progress">
                        <button
                            type="button"
                            className="dashboard-add-task"
                            onClick={() => setAddTarefa(true)}
                        >
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
                        <div className="dashboard-form">
                            <TaskForm
                                criar={novaTarefa}
                                cancelar={()=>setAddTarefa(false)}
                                hoje={hoje}
                            />
                        </div>
                    )}

                    <div className="dashboard-task-list">
                        {tarefasDeHoje.length > 0 ? (
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
                    <button type="button" className="calendario" onClick={() => navigate("/calendario")}k>
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
                        <div key={dia.id} className="dashboard-day">
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
                        </div>
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
