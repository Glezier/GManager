import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { login, reenviarVerificacao } from '../api/api'
import { setToken } from '../utils/auth'
import './Auth.css'
import EyeClosed from '../assets/icons/eye-closed.png'
import EyeOpen from '../assets/icons/eye-open.png'

export default function Login(){
    const navigate = useNavigate()
    const location = useLocation()

    const [email, setEmail] = useState(location.state?.emailPreenchido || '')
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState("")
    const [bloqueado, setBloqueado] = useState(false)
    const [loading, setLoading] = useState(false)
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const userRef = useRef(null)

    const[emailNaoVerificado, setEmailNaoVerificado] = useState(false)
    const[mensagemSucesso, setMensagemSucesso] = useState(location.state?.mensagemSucesso || '')

    useEffect(()=>{
        if(userRef.current){
            userRef.current.focus()
        }
    }, [])

    const handleLogin = async(e) => {
        e.preventDefault()
        setErro("")
        setLoading(true)
        setMensagemSucesso('')
        setEmailNaoVerificado(false)

        try{
            const data = await login(email, senha)
            
            if (data.token){
                setToken(data.token)
                navigate("/dashboard")
                return
            }
        } catch(error){
            setErro(error.message)

            setBloqueado(
                error.message === 'Muitas tentativas de login. Tente novamente em 15 minutos.'
            )

            // Só coloca email como não verificaso se esse for o caso
            setEmailNaoVerificado(
                error.message === 'Verifique seu email antes de entrar na conta'
            )        
        } finally{
            setLoading(false)
        }
    }

    async function handleReenviar(){
        try{
            setErro('')
            setMensagemSucesso('')
            setLoading(true)

            const data = await reenviarVerificacao(email)
            setMensagemSucesso(data.message)
        } catch(error){
            setErro(error.message)
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!bloqueado) {
            return
        }

        const timer = setTimeout(() => {
            setBloqueado(false)
            setErro('')
        }, 15 * 60 * 1000)

        return () => clearTimeout(timer)
    }, [bloqueado])

    function limparErro(){
        if (erro && !bloqueado){
            setErro('')
        }
    }

    return(   
        <main className='auth-page' onClick={limparErro}>
            <section className='auth-card'>
                <aside className='auth-hero'>
                    <div>
                        <span className='auth-brand'>My GManager</span>
                    </div>
                    <div>
                        <h1>Organize seu dia a dia com clareza</h1>
                        <p>
                            Centralize tarefas, acompanhe sua semana e mês, faça anotações,
                            organize suas finanças e muito mais...
                        </p>
                    </div>

                    <div className="auth-highlights">
                        <div className="auth-highlight">Tarefas por dia</div>
                        <div className="auth-highlight">Calendário mensal interativo</div>
                        <div className='auth-highlight'>Registro de gastos</div>
                        <div className='auth-highlight'>Anotações gerais</div>
                    </div>
                </aside>

                <div className='auth-form-wrap'>
                    <div className='auth-form-head'>
                        <h2>Entrar</h2>
                        <p>Acesse sua rotina e continue de onde parou.</p>
                    </div>

                    {erro && 
                        <p className='auth-feedback auth-feedback-error'>{erro}</p>
                    }

                    {emailNaoVerificado && (
                        <button
                            type='button'
                            className='auth-submit'
                            onClick={handleReenviar}
                            disabled={loading}
                        >
                            Reenviar email de verificação
                        </button>
                    )}

                    {mensagemSucesso && (
                        <p className='auth-feedback dashboard-feedback-success'>{mensagemSucesso}</p>
                    )}

                    <form className='auth-form' onSubmit={handleLogin}>
                        <div className='auth-field'>
                            <label htmlFor="login-email">Email</label>
                            <input
                                id='login-email'
                                type="email"
                                placeholder='Digite seu email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}  
                                ref={userRef}
                                disabled={bloqueado} 
                                required
                            />
                        </div>

                        <div className='auth-field'>
                            <label htmlFor="login-password">Senha</label>
                            <div className='auth-password-wrap'>
                                <input 
                                    id='login-password'
                                    type={mostrarSenha ? "text" : "password"}
                                    placeholder='Digite sua senha'
                                    value={senha}
                                    disabled={bloqueado} 
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                />
                                <button className="auth-password-toggle"
                                        type='button'  
                                        onClick={() => setMostrarSenha((valorAtual) => !valorAtual)}
                                        aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                    >
                                    {mostrarSenha ? (
                                        <img className='eye-icon' src={EyeClosed} alt="Mostrar senha" title='Ocultar senha'/>
                                    ) : (
                                        <img className='eye-icon' src={EyeOpen} alt="Ocultar senha" title='Mostrar senha' />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button className='auth-submit' type='submit' disabled={loading || bloqueado}>
                            {loading ? "Entrando" : "Entrar"}
                        </button>
                    </form>

                    <p className='auth-alt'>
                        Não tem conta? <Link to='/register'>Clique aqui</Link>
                    </p>

                    <p className='auth-alt'>
                        Recuperação de senha disponível em breve...
                    </p>

                </div>
            </section>
        </main>        
    )
}