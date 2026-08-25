import { useState, useEffect, useRef } from "react"
import TaskCard from "./TaskCard"
import { compartilharTextoWhatsapp, formatarTarefasDoDiaParaTexto, baixarPdfTarefasDoDia } from "../utils/exportTasks"
import LoadingState from "./ui/LoadingState"
import SendIcon from "../assets/icons/send.png"
import WhatsappIcon from "../assets/icons/whatsapp.png"
import PDFIcon from "../assets/icons/download.png"

export default function DayTasksPanel({
    titulo,
    subtitulo, 
    data,
    erro='',
    sucesso = '',
    loading = false,
    tarefas = [],
    tarefasConcluidas = 0,
    progresso = null,
    botaoAcao = null,
    onConcluir,
    onRemover,
    onEditar,
    emptyMessage = 'Adicione uma nova tarefa para começar a organizar esse dia'
}){

    const [mostrarOpcoesCompartilhar, setMostrarOpcoesCompartilhar] = useState(false)

    function alternarOpcoesCompartilhar() {
        setMostrarOpcoesCompartilhar((atual) => !atual)
    }

    function handleCompartilharWhatsapp(){
        const texto = formatarTarefasDoDiaParaTexto({
            data, tarefas
        })

        compartilharTextoWhatsapp(texto)
        setMostrarOpcoesCompartilhar(false)
    }

    function handleCompartilharPDF() {
        baixarPdfTarefasDoDia({
            data, tarefas
        })

        setMostrarOpcoesCompartilhar(false)
    }

    const exportMenuRef = useRef(null)
    useEffect(()=>{
        if(!mostrarOpcoesCompartilhar){
            return
        }

        function handleClickFora(event) {
            if (
                exportMenuRef.current &&
                !exportMenuRef.current.contains(event.target)
            ) {
                setMostrarOpcoesCompartilhar(false)
            }
        }

        document.addEventListener('pointerdown', handleClickFora)

        return () => {
            document.removeEventListener('pointerdown', handleClickFora)
        }
    }, [mostrarOpcoesCompartilhar])

    return(
        <div className="dashboard-panel dashboard-panel-today">
            <div className="dashboard-head">
                {subtitulo && <p>{subtitulo}</p>}
                <h1>{titulo}</h1>
            </div>


            {erro && <p className="dashboard-feedback dashboard-feedback-error">{erro}</p>}
            {sucesso && <p className="dashboard-feedback dashboard-feedback-success">{sucesso}</p>}

            {(botaoAcao || progresso !== null) && (
                <div className="dashboard-progress">

                <div className="day-tasks-panel-actions">
                    {botaoAcao}
                    {tarefas.length !== 0 && (
                        <div className="task-export-menu" ref={exportMenuRef}>
                            <button
                                type="button"
                                className="btn-secondary task-export-trigger"
                                onClick={alternarOpcoesCompartilhar}
                                aria-expanded={mostrarOpcoesCompartilhar}
                                aria-haspopup="menu"
                            >
                                <img src={SendIcon} alt="Compartilhar tarefas" className="day-icons" />
                                Compartilhar
                            </button>

                            {mostrarOpcoesCompartilhar && (
                                <div className="task-export-options" role="menu">
                                    <button
                                        type="button"
                                        className="task-export-option task-export-option-whatsapp"
                                        role="menuitem"
                                        onClick={handleCompartilharWhatsapp}
                                    >
                                        <div className="button-options">
                                            WhatsApp
                                            <img src={WhatsappIcon} alt="" className="day-icons"/>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        className="task-export-option task-export-option-pdf"
                                        role="menuitem"
                                        onClick={handleCompartilharPDF}
                                    >
                                        <div className="button-options">
                                            PDF
                                            <img src={PDFIcon} alt="" className="day-icons"/>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>

                    )}
                </div>
                    {progresso !== null && (
                        <div className="dashboard-progress-info">
                            <div className="dashboard-progress-text">
                                <span>
                                    {tarefasConcluidas} de {tarefas.length} concluídas
                                </span>
                                <span>{Math.round(progresso)}%</span>
                            </div>

                            <div className="dashboard-progress-bar">
                                <div
                                    className="dashboard-progress-fill"
                                    style={{ width: `${progresso}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="dashboard-task-list">
                {loading ? (
                    <LoadingState message="Carregando tarefas..."/>
                ) : tarefas.length > 0 ? (
                    tarefas.map((tarefa) => (
                        <TaskCard
                            key={tarefa.id}
                            tarefa={tarefa}
                            concluir={onConcluir}
                            remover={onRemover}
                            editar={onEditar}
                        />
                    ))
                ) : (
                    <div className="dashboard-empty-state">
                        <p className="dashboard-empty-title">Nenhuma tarefa encontrada</p>
                        <p className="dashboard-empty-message">{emptyMessage}</p>
                    </div>
                )}
            </div>
        </div>
    )
}   
