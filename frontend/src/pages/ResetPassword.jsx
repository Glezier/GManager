import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { redefinirSenha } from "../api/authApi"
import { validarRedefinicaoSenha } from "../validators/authValidators"
import { VALIDATION_LIMITS } from "../validators/validationRules"
import AppFooter from "../components/AppFooter"
import FullLogo from '../assets/icons/full_logo.png'
import './Auth.css'

export default function ResetPassword () {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    // Acessar o token de redefinição de senha enviado por email
    const token = searchParams.get('token') || ''

    const [novaSenha, setNovaSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")
    const [erro, setErro] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e){
        e.preventDefault()
        setErro('')

        const erroValidacao = validarRedefinicaoSenha({
            senha: novaSenha,
            confirmarSenha
        })

        if (erroValidacao) {
            setErro(erroValidacao)
            return
        }
        
        setLoading(true)

        try{
            await redefinirSenha({
                token, novaSenha, confirmarSenha
            })

            navigate('/', {
                state: {
                    mensagemSucesso: 'Senha redefinida com sucesso. Faça login novamente.'
                }
            })
        } catch(error){
            setErro(error.message)
        } finally{
            setLoading(false)
        }
    }

    return (
        <main className='auth-page'>
            <div className="auth-page-content">
                <section className='auth-card'>
                    <aside className='auth-hero'>
                        <div>
                            <span className='auth-brand'>
                                <img src={FullLogo} alt="Logo My GManager" className='auth-logo'/>
                            </span>
                        </div>

                        <div>
                            <h1>Nova senha</h1>
                            <p>Crie uma nova senha para voltar a acessar sua conta.</p>
                        </div>
                    </aside>

                    <div className='auth-form-wrap'>
                        <div className='auth-form-head'>
                            <h2>Redefinir senha</h2>
                            <p>Use uma senha segura, diferente da atual.</p>
                        </div>

                        {!token && (
                            <p className='auth-feedback auth-feedback-error'>
                                Link de recuperação inválido ou incompleto.
                            </p>
                        )}

                        {erro && (
                            <p className='auth-feedback auth-feedback-error'>{erro}</p>
                        )}

                        <form className='auth-form' onSubmit={handleSubmit} noValidate>
                            <div className='auth-field'>
                                <label htmlFor="reset-password">Nova senha</label>
                                <input
                                    id='reset-password'
                                    type="password"
                                    placeholder='Digite a nova senha'
                                    minLength={VALIDATION_LIMITS.senhaMin}
                                    maxLength={VALIDATION_LIMITS.senhaMax}
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                    disabled={loading || !token}
                                    required
                                />
                            </div>

                            <div className='auth-field'>
                                <label htmlFor="reset-confirm-password">Confirmar senha</label>
                                <input
                                    id='reset-confirm-password'
                                    type="password"
                                    placeholder='Confirme a nova senha'
                                    minLength={VALIDATION_LIMITS.senhaMin}
                                    maxLength={VALIDATION_LIMITS.senhaMax}
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    disabled={loading || !token}
                                    required
                                />
                            </div>

                            <button className='auth-submit' type='submit' disabled={loading || !token}>
                                {loading ? 'Salvando...' : 'Salvar nova senha'}
                            </button>
                        </form>

                        <p className='auth-alt'>
                            <Link to='/'>Voltar para login</Link>
                        </p>
                    </div>
                </section>

                <AppFooter />
            </div>
        </main>
    )
}
