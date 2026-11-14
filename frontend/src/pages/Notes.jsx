import { Link, useSearchParams } from 'react-router-dom'
import { useMe } from '../hooks/useMe'
import useNotes, { useNotasMutation } from '../hooks/useNotes'

import NoteCard from '../components/notes/NoteCard'
import NoteForm from '../components/notes/NoteForm'
import ConfirmBox from '../components/ConfirmBox'
import LoadingState from '../components/ui/LoadingState'
import AppFooter from '../components/AppFooter'
import MobileNav from '../components/mobile/MobileNav'
import AddIcon from '../assets/icons/add.png'

import './Notes.css'
import { useEffect, useState } from 'react'

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

    const [searchParams, setSearchParams] = useSearchParams()

    // Saber se está chegando na pagina a partir de criar uma nova nota pelo dashboard
    const [formularioAberto, setFormularioAberto] = useState(
        searchParams.get('nova') === '1'
    )
    const [sucesso, setSucesso] = useState('')

    useEffect(() => {
        if (!sucesso) {
            return
        }

        const timer = setTimeout(() => setSucesso(''), 2500)
        return () => clearTimeout(timer)
    }, [sucesso])

    const [editando, setEditando] = useState(null)
    const [excluir, setExcluir] = useState(null)

    const { criacao, atualizacao, exclusao } = useNotasMutation({
        usuarioId: usuario?.id
    })

    const salvando = criacao.isPending || atualizacao.isPending

    function abrirCriacao() {
        criacao.reset()
        atualizacao.reset()
        setSucesso('')
        setEditando(null)
        setFormularioAberto(true)
    }

    function abrirEdicao(nota) {
        if (formularioAberto) {
            return
        }

        criacao.reset()
        atualizacao.reset()
        setSucesso('')
        setEditando(nota)
        setFormularioAberto(true)
    }

    function fecharFormulario() {
        if (salvando) {
            return
        }

        criacao.reset()
        atualizacao.reset()
        setEditando(null)
        setSearchParams({}, { replace: true })
        setFormularioAberto(false)
    }

    async function salvarNota(nota) {
        if (salvando) {
            return
        }

        try {
            if (editando) {
                await atualizacao.mutateAsync({
                    id: editando.id,
                    nota
                })

                setSucesso('Nota atualizada com sucesso.')
            } else {
                await criacao.mutateAsync(nota)
                setSucesso('Nota criada com sucesso.')
            }

            setFormularioAberto(false)
            setEditando(null)
            setSearchParams({}, { replace: true })
        } catch {
            // A mutation disponibiliza o erro para o formulário.
        }
    }

    function solicitarExclusao(nota) {
        if (formularioAberto || excluir || exclusao.isPending) {
            return
        }

        exclusao.reset()
        setSucesso('')
        setExcluir(nota)
    }

    function cancelarExclusao() {
        if (exclusao.isPending) {
            return
        }

        setExcluir(null)
        exclusao.reset()
    }

    async function confirmarExclusao() {
        if (!excluir || exclusao.isPending) {
            return
        }

        try {
            await exclusao.mutateAsync(excluir.id)
            setExcluir(null)
            setSucesso('Nota excluída com sucesso.')
        } catch {
            // Mantém a confirmação aberta para exibir o erro e permitir nova tentativa.
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
                    disabled={!usuario || Boolean(erroUsuario) || formularioAberto || Boolean(excluir) || exclusao.isPending}
                >
                    <img src={AddIcon} alt="" className="notes-new-icon" />
                    Nova nota
                </button>
            </header>

            {sucesso && (
                <p className="feedback feedback-success" role="status">
                    {sucesso}
                </p>
            )}

            {formularioAberto && usuario && !erroUsuario && (
                <NoteForm
                    key={editando ? `editar-${editando.id}` : 'criar'}
                    notaInicial={editando}
                    salvar={salvarNota}
                    cancelar={fecharFormulario}
                    salvando={salvando}
                    erro={
                        editando
                            ? atualizacao.error?.message || ''
                            : criacao.error?.message || ''
                    }
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
                            <NoteCard 
                                key={nota.id} 
                                nota={nota} 
                                editar={abrirEdicao}
                                remover={solicitarExclusao}
                                desabilitado={formularioAberto || Boolean(excluir) || exclusao.isPending}
                            />
                        ))}
                    </div>
                )}
            </section>

            <ConfirmBox
                open={Boolean(excluir)}
                title="Excluir nota?"
                message={
                    exclusao.error
                        ? `Não foi possível excluir a nota: ${exclusao.error.message}`
                        : `Deseja excluir a nota "${excluir?.titulo?.trim() || 'Sem título'}"? Essa ação não poderá ser desfeita.`
                }
                confirmLabel="Excluir nota"
                cancelLabel="Cancelar"
                variant="danger"
                loading={exclusao.isPending}
                onConfirm={confirmarExclusao}
                onCancel={cancelarExclusao}
            />

            <AppFooter minimal />
            <MobileNav />
        </main>
    )
}
