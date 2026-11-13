import { useState } from 'react'
import { validarNota } from '../../validators/noteValidators'
import './NoteForm.css'

export default function NoteForm({
    salvar,
    cancelar,
    salvando = false,
    erro = ''
}) {
    const [titulo, setTitulo] = useState('')
    const [conteudo, setConteudo] = useState('')
    const [erroValidacao, setErroValidacao] = useState('')

    function handleSubmit(e) {
        e.preventDefault()

        if (salvando) {
            return
        }

        const mensagem = validarNota({ titulo, conteudo })
        setErroValidacao(mensagem || '')

        if (mensagem) {
            return
        }

        // Preserva os espaços e as quebras de linha do conteúdo.
        salvar({ titulo: titulo.trim(), conteudo })
    }

    return (
        <form className="note-form page-panel" onSubmit={handleSubmit} noValidate>
            <h2>Nova nota</h2>

            {(erroValidacao || erro) && (
                <p className="feedback feedback-error" role="alert">
                    {erroValidacao || erro}
                </p>
            )}

            <fieldset className="note-form-fields" disabled={salvando}>
                <legend className="note-form-legend">Dados da nota</legend>

                <div className="note-form-field">
                    <label htmlFor="note-title">Título (opcional)</label>
                    <input
                        id="note-title"
                        type="text"
                        value={titulo}
                        onChange={(event) => {
                            setTitulo(event.target.value)
                            setErroValidacao('')
                        }}
                        placeholder="Sem título"
                    />
                </div>

                <div className="note-form-field">
                    <label htmlFor="note-content">Conteúdo</label>
                    <textarea
                        id="note-content"
                        value={conteudo}
                        onChange={(event) => {
                            setConteudo(event.target.value)
                            setErroValidacao('')
                        }}
                        placeholder="Escreva sua nota..."
                        rows={10}
                        required
                    />
                </div>

                <div className="note-form-actions">
                    <button type="submit" className="btn-primary">
                        {salvando ? 'Salvando...' : 'Salvar nota'}
                    </button>

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={cancelar}
                    >
                        Cancelar
                    </button>
                </div>
            </fieldset>
        </form>
    )
}