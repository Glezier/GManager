import './NoteCard.css'

export default function NoteCard({ nota }) {
    const ultimaAlteracao = new Date(nota.updated_at).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
    })

    return (
        <article className="note-card">
            <h3 className="note-card-title">
                {nota.titulo?.trim() || 'Sem título'}
            </h3>

            <p className="note-card-preview">{nota.conteudo}</p>

            <p className="note-card-updated">
                Atualizada em{' '}
                <time dateTime={nota.updated_at}>
                    {ultimaAlteracao}
                </time>
            </p>
        </article>
    )
}