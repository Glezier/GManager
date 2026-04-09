import "./TaskCard.css"
import CheckIcon from '../assets/icons/check.png'
import DeleteIcon from '../assets/icons/delete.png'
import { formatarHora } from "../utils/date"

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
          <span className="task-card-time">{formatarHora(tarefa.hora)}</span>
        )}

        <span className={`task-card-status task-card-status-${tarefa.status}`}>
          {tarefa.status}
        </span>
      </div>

      <div className="task-card-actions">
        {tarefa.status === "pendente" ? (
          <button
            type="button"
            className="task-card-icon"
            onClick={() => concluir(tarefa.id)}
            title="Concluir tarefa"
          >
            <img src={CheckIcon} alt="" className="task-card-icon-image"/>
          </button>
        ) : (
          <div className="task-card-icon-placeholder"/>        )}

        <button
          type="button"
          className="task-card-icon"
          onClick={() => remover(tarefa.id)}
          title="Excluir tarefa"
        >
          <img src={DeleteIcon} className="task-card-icon-image" alt=""  />
        </button>
      </div>
    </article>
  )
}
