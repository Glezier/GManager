import { useState } from 'react'
import { validarNota } from '../../validators/noteValidators'
import ConfirmBox from '../ConfirmBox'
import './NoteForm.css'

export default function NoteForm({
    salvar,
    cancelar,
    salvando = false,
    erro = '',
    notaInicial = null
}) {
    const [titulo, setTitulo] = useState(notaInicial?.titulo || '')
    const [conteudo, setConteudo] = useState(notaInicial?.conteudo || '')
    const [erroValidacao, setErroValidacao] = useState('')
    const [confirmandoDescarte, setConfirmandoDescarte] = useState(false)

    const emEdicao = Boolean(notaInicial)
    const temAlteracoes = titulo !== (notaInicial?.titulo || '') ||
    conteudo !== (notaInicial?.conteudo || '')

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

    function solicitarCancelamento() {
        if (salvando) {
            return
        }

        if (temAlteracoes) {
            setConfirmandoDescarte(true)
            return
        }

        cancelar()
    }

    return (
        <>
            <form className="note-form page-panel" onSubmit={handleSubmit} noValidate>
                <h2>{emEdicao ? 'Editar nota' : 'Nova nota'}</h2>

                {(erroValidacao || erro) && (
                    <p className="feedback feedback-error" role="alert">
                        {erroValidacao || erro}
                    </p>
                )}

                <fieldset className="note-form-fields" disabled={salvando || confirmandoDescarte}>
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
                            {salvando ? 'Salvando' : 'Salvar nota' }
                        </button>

                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={solicitarCancelamento}
                            >
                            Cancelar
                        </button>
                    </div>
                </fieldset>
            </form>

            <ConfirmBox 
                open={confirmandoDescarte}
                title='Deseja descartar alterações?'
                message='O texto não salvo será perdido'
                confirmLabel='Descartar'
                cancelLabel='Continuar escrevendo'
                variant='danger'
                onConfirm={cancelar}
                onCancel={() => setConfirmandoDescarte(false)}
            />
        </>
    )
}