import EditIcon from '../../assets/icons/edit.png'
import DeleteIcon from '../../assets/icons/delete.png'
import './NoteCard.css'

export default function NoteCard({ nota, editar, remover, desabilitado = false }) {
    const ultimaAlteracao = new Date(nota.updated_at).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
    })

    return (
        <article className="note-card">
            <h3 className="note-card-title">
                <button
                    type="button"
                    className="note-card-open"
                    onClick={() => editar(nota)}
                    disabled={desabilitado}
                    aria-label={`Abrir nota: ${nota.titulo?.trim() || 'Sem título'}`}
                >
                    {nota.titulo?.trim() || 'Sem título'}
                </button>
            </h3>

            <p className="note-card-preview">{nota.conteudo}</p>

            <p className="note-card-updated">
                Atualizada em{' '}
                <time dateTime={nota.updated_at}>
                    {ultimaAlteracao}
                </time>
            </p>

            <div className="note-card-actions">
                <button
                    type="button"
                    className="note-card-icon"
                    onClick={() => editar(nota)}
                    disabled={desabilitado}
                    aria-label={`Editar nota: ${nota.titulo?.trim() || 'Sem título'}`}
                    title="Editar nota"
                >
                    <img src={EditIcon} alt="" className="note-card-icon-image" />
                </button>

                <button
                    type="button"
                    className="note-card-icon"
                    onClick={() => remover(nota)}
                    disabled={desabilitado}
                    aria-label={`Excluir nota: ${nota.titulo?.trim() || 'Sem título'}`}
                    title="Excluir nota"
                >
                    <img src={DeleteIcon} alt="" className="note-card-icon-image" />
                </button>
            </div>
        </article>
    )
}
