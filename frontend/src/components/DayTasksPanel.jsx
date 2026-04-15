import TaskCard from "./TaskCard"
import LoadingState from "./ui/LoadingState"

export default function DayTasksPanel({
    titulo,
    subtitulo, 
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
                    {botaoAcao}

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
                    <LoadingState message="Carregano tarefas..."/>
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