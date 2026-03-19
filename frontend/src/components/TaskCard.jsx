import "./TaskCard.css"
export default function TaskCard({tarefa, concluir, remover}){


    return (
  <article className="task-card">
    <div className="task-card-info">
      <h3 className="task-card-title">{tarefa.titulo}</h3>
      {tarefa.descricao && (
        <p className="task-card-description">{tarefa.descricao}</p>
      )}
    </div>

    <div className="task-card-center">
      {tarefa.hora && (
        <span className="task-card-time">{tarefa.hora.slice(0,5)}</span>
      )}

      <span className={`task-card-status task-card-status-${tarefa.status}`}>
        {tarefa.status}
      </span>
    </div>

    <div className="task-card-actions">
      {tarefa.status === "pendente" && (
        <button
          type="button"
          className="task-card-icon"
          onClick={() => concluir(tarefa.id)}
          title="Concluir tarefa"
        >
          ✓
        </button>
      )}

      <button
        type="button"
        className="task-card-icon"
        onClick={() => remover(tarefa.id)}
        title="Excluir tarefa"
      >
        🗑
      </button>
    </div>
  </article>
)
}
