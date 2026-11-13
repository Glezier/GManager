import { Link } from 'react-router-dom'
import { useMe } from '../hooks/useMe'
import useNotes, { useNotasMutation } from '../hooks/useNotes'

import NoteCard from '../components/notes/NoteCard'
import NoteForm from '../components/notes/NoteForm'
import LoadingState from '../components/ui/LoadingState'
import AppFooter from '../components/AppFooter'
import MobileNav from '../components/mobile/MobileNav'

import './Notes.css'
import { useState } from 'react'

export default function Notes () {
    const {
        data: usuario,
        isPending: carregandoUsuario,
        error: erroUsuario
    } = useMe()

    const {
        data: notas = [],
        isLoading: carregandoNotas,
        isFetching: atualizandoNotas,
        error: erroNotas
    } = useNotes({ usuarioId: usuario?.id })

    const [criandoNota, setCriandoNota] = useState(false)
    const [sucesso, setSucesso] = useState('')

    const { criacao } = useNotasMutation({ usuarioId: usuario?.id })

    function abrirCriacao () {
        criacao.reset()
        setSucesso('')
        setCriandoNota(true)
    }

    function cancelarCriacao () {
        if (criacao.isPending){
            return
        }

        criacao.reset()
        setCriandoNota(false)
    }

    async function salvarNota (nota) {
        if (criacao.isPending){
            return
        }

        try{
            await criacao.mutateAsync(nota)
            setCriandoNota(false)
            setSucesso('Nota criada com sucesso')
        } catch {
            // Mutation já guarda o erro
        }
    }

    const loading = carregandoUsuario || carregandoNotas
    const error = erroUsuario || erroNotas

    return (
        <main className="notes-page page-shell">
            <header className="notes-hero page-hero">
                <Link to="/dashboard" className="btn-secondary notes-back">
                    Voltar para dashboard
                </Link>

                <p className="page-eyebrow">Seu espaço de ideias</p>
                <h1 className="page-title">Notas</h1>
                <p className="page-text">
                    Guarde ideias, lembretes e anotações em um só lugar.
                </p>

                <button
                    type="button"
                    className="btn-primary notes-new"
                    onClick={abrirCriacao}
                    disabled={!usuario || Boolean(erroUsuario) || criandoNota}
                >
                    Nova nota
                </button>
            </header>

            {sucesso && (
                <p className="feedback feedback-success" role="status">
                    {sucesso}
                </p>
            )}

            {criandoNota && (
                <NoteForm
                    salvar={salvarNota}
                    cancelar={cancelarCriacao}
                    salvando={criacao.isPending}
                    erro={criacao.error?.message || ''}
                />
            )}

            <section
                className="notes-panel page-panel"
                aria-labelledby="notes-list-title"
                aria-busy={loading || atualizandoNotas}
            >
                <div className="notes-panel-head">
                    <h2 id="notes-list-title">Suas notas</h2>

                    {usuario && !carregandoNotas && !error && (
                        <span className="notes-count">
                            {notas.length}{' '}
                            {notas.length === 1 ? 'nota' : 'notas'}
                        </span>
                    )}
                </div>

                {loading && (
                    <LoadingState message="Carregando notas..." />
                )}

                {error && (
                    <p className="feedback feedback-error" role="alert">
                        {error.message}
                    </p>
                )}

                {!loading && !error && notas.length === 0 && (
                    <div className="empty-state">
                        <h3 className="empty-title">Nenhuma nota por aqui</h3>
                        <p className="empty-message">
                            Suas ideias e lembretes aparecerão neste espaço.
                        </p>
                    </div>
                )}

                {!loading && notas.length > 0 && (
                    <div className="notes-grid">
                        {notas.map((nota) => (
                            <NoteCard key={nota.id} nota={nota} />
                        ))}
                    </div>
                )}
            </section>

            <AppFooter minimal />
            <MobileNav />
        </main>
    )
}