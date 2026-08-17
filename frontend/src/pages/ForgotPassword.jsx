import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { solicitarRecuperacaoSenha } from '../api/api'
import FullLogo from '../assets/icons/full_logo.png'
import './Auth.css'

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [erro, setErro] = useState("")
    const [sucesso, setSucesso] = useState("")
    const [loading, setLoading] = useState(false)
    const emailRef = useRef(null)
    
    useEffect(() => {
        emailRef.current?.focus()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        setErro("")
        setSucesso("")
        setLoading(true)

        try{
            const data = await solicitarRecuperacaoSenha(email)
            setSucesso(data.message)
        } catch(error){
            setErro(error.message)
        } finally{
            setLoading(false)
        }
    }

    return(
        <main className='auth-page'>
            <section className='auth-card'>
                <aside className='auth-hero'>
                    <div>
                        <span className='auth-brand'>
                            <img src={FullLogo} alt="Logo My GManager" className='auth-logo'/>
                        </span>
                    </div>

                    <div>
                        <h1>Recuperar senha</h1>
                        <p>Informe seu email para receber um link seguro de redefinição.</p>
                    </div>
                </aside>

                <div className='auth-form-wrap'>
                    <div className='auth-form-head'>
                        <h2>Esqueci minha senha</h2>
                        <p>Enviaremos as instruções caso o email esteja cadastrado.</p>
                    </div>

                    {erro && (
                        <p className='auth-feedback auth-feedback-error'>{erro}</p>
                    )}

                    {sucesso && (
                        <p className='auth-feedback dashboard-feedback-success'>{sucesso}</p>
                    )}

                    <form className='auth-form' onSubmit={handleSubmit}>
                        <div className='auth-field'>
                            <label htmlFor="forgot-email">Email</label>
                            <input
                                id='forgot-email'
                                type="email"
                                placeholder='Digite seu email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                ref={emailRef}
                                disabled={loading}
                                maxLength={120}
                                required
                            />
                        </div>

                        <button className='auth-submit' type='submit' disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar link'}
                        </button>
                    </form>

                    <p className='auth-alt'>
                        <Link to='/'>Voltar para login</Link>
                    </p>
                </div>
            </section>
        </main>
    )
} 