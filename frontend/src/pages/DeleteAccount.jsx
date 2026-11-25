import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { confirmarExclusaoConta } from "../api/profileApi"
import { removeToken } from "../utils/auth"
import AppFooter from '../components/AppFooter'
import FullLogo from '../assets/icons/full_logo.png'

export default function DeleteAccount() {
    const [searchParams] = useSearchParams()
    const queryClient = useQueryClient()

    const token = searchParams.get('token') || ''
    const tokenValido = /^[a-f0-9]{64}$/.test(token)

    const [confirmado, setConfirmado] = useState(false)
    const [loading, setLoading] = useState(false)
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        if (loading || sucesso || !tokenValido || !confirmado) {
            return
        }

        setErro('')
        setLoading(true)

        try {
            await confirmarExclusaoConta(token)

            removeToken()
            queryClient.clear()
            setSucesso(true)
        } catch (error) {
            setErro(error.message || 'Não foi possível excluir sua conta')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="auth-page">
            <div className="auth-page-content">
                <section className="auth-card">
                    <aside className="auth-hero">
                        <div>
                            <span className="auth-brand">
                                <img
                                    src={FullLogo}
                                    alt="My GManager"
                                    className="auth-logo"
                                />
                            </span>
                        </div>

                        <div>
                            <h1>Exclusão de conta</h1>
                            <p>
                                Revise as informações antes de confirmar.
                                Abrir esta página não exclui sua conta.
                            </p>
                        </div>
                    </aside>

                    <div className="auth-form-wrap">
                        {sucesso ? (
                            <div role="status">
                                <div className="auth-form-head">
                                    <h2>Conta excluída</h2>
                                    <p>
                                        Sua conta e os dados vinculados
                                        foram removidos do banco ativo.
                                    </p>
                                </div>

                                <p className="auth-alt">
                                    <Link
                                        to="/"
                                        replace
                                        state={{ skipSessionCheck: true }}
                                    >
                                        Voltar para login
                                    </Link>
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="auth-form-head">
                                    <h2>Confirmar exclusão</h2>
                                    <p>
                                        Sua conta, tarefas e notas serão
                                        excluídas. Essa ação não poderá
                                        ser desfeita pelo aplicativo.
                                    </p>
                                </div>

                                {!tokenValido && (
                                    <p
                                        className="auth-feedback auth-feedback-error"
                                        role="alert"
                                    >
                                        Link inválido ou incompleto.
                                        Solicite um novo link pelo perfil.
                                    </p>
                                )}

                                {erro && (
                                    <p
                                        className="auth-feedback auth-feedback-error"
                                        role="alert"
                                    >
                                        {erro}
                                    </p>
                                )}

                                <form
                                    className="auth-form"
                                    onSubmit={handleSubmit}
                                    aria-busy={loading}
                                >
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={confirmado}
                                            onChange={(event) => {
                                                setConfirmado(event.target.checked)
                                            }}
                                            disabled={loading || !tokenValido}
                                            required
                                        />
                                        {' '}Entendo que minha conta,
                                        tarefas e notas serão excluídas.
                                    </label>

                                    <button
                                        className="btn-danger"
                                        type="submit"
                                        disabled={
                                            loading ||
                                            !tokenValido ||
                                            !confirmado
                                        }
                                    >
                                        {loading
                                            ? 'Excluindo...'
                                            : 'Excluir definitivamente'}
                                    </button>
                                </form>

                                {!loading && (
                                    <p className="auth-alt">
                                        <Link to="/" replace>
                                            Cancelar e voltar para login
                                        </Link>
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </section>

                <AppFooter />
            </div>
        </main>
    )
}