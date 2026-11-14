import { useState, useEffect, useRef } from 'react'
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
    const dialogRef = useRef(null)
    const tituloRef = useRef(null)

    useEffect(() => {
        const dialog = dialogRef.current
        const focoAnterior = document.activeElement
        const focoEraVisivel = focoAnterior?.matches(':focus-visible')
        const overflowAnterior = document.body.style.overflow

        dialog.showModal()
        tituloRef.current.focus({ preventScroll: true })
        document.body.style.overflow = 'hidden'

        return () => {
            dialog.close()
            document.body.style.overflow = overflowAnterior
            queueMicrotask(() => {
                if (focoAnterior?.isConnected) {
                    if (focoEraVisivel) {
                        focoAnterior.focus({ preventScroll: true })
                    } else if (document.activeElement === focoAnterior) {
                        // Evita deixar o botão destacado após uma abertura pelo mouse.
                        focoAnterior.blur()
                    }
                }
            })
        }
    }, [])

    useEffect(() => {
        if (confirmandoDescarte) {
            dialogRef.current.querySelector('.confirm-dialog-cancel')?.focus()
        }
    }, [confirmandoDescarte])

    const emEdicao = Boolean(notaInicial)
    const temAlteracoes = titulo !== (notaInicial?.titulo || '') ||
    conteudo !== (notaInicial?.conteudo || '')

    // Prevenir saida sem salvar nota
    useEffect(() => {
        if (!temAlteracoes && !salvando) {
            return
        }

        function avisarAntesDeSair(e) {
            e.preventDefault()

            // Compatibilidade com navegadores que exigem returnValue.
            e.returnValue = true
        }

        window.addEventListener('beforeunload', avisarAntesDeSair)

        return () => {
            window.removeEventListener('beforeunload', avisarAntesDeSair)
        }
    }, [temAlteracoes, salvando])

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

    function continuarEdicao() {
        setConfirmandoDescarte(false)
        requestAnimationFrame(() => tituloRef.current?.focus({ preventScroll: true }))
    }

    function tratarEscape(event) {
        event.preventDefault()

        if (confirmandoDescarte) {
            continuarEdicao()
            return
        }

        solicitarCancelamento()
    }

    return (
        <dialog
            ref={dialogRef}
            className="note-editor-dialog"
            aria-labelledby="note-form-title"
            onCancel={tratarEscape}
        >
            <form className="note-form page-panel" onSubmit={handleSubmit} noValidate>
                <h2 id="note-form-title">{emEdicao ? 'Editar nota' : 'Nova nota'}</h2>

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
                            ref={tituloRef}
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
                            {salvando ? 'Salvando...' : emEdicao ? 'Salvar alterações' : 'Salvar nota'}
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
                onCancel={continuarEdicao}
            />
        </dialog>
    )
}
