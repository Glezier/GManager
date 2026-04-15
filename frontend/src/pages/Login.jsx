import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/api'
import { setToken } from '../utils/auth'
import './Auth.css'
import LoadingState from '../components/ui/LoadingState'

export default function Login(){
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState("")
    const [loading, setLoading] = useState(false)
    const userRef = useRef(null)

    const navigate = useNavigate()

    useEffect(()=>{
        if(userRef.current){
            userRef.current.focus()
        }
    }, [])

    const handleLogin = async(e) => {
        e.preventDefault()
        setErro("")
        setLoading(true)

        try{
            const data = await login(email, senha)
            
            if (data.token){
                setToken(data.token)
                navigate("/dashboard")
                return
            }
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
                        <span className='auth-brand'>GManager</span>
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
                                required
                            />
                        </div>

                        <div className='auth-field'>
                            <label htmlFor="login-password">Senha</label>
                            <input 
                                id='login-password'
                                type="password"
                                placeholder='Digite sua senha'
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>

                        <button className='auth-submit' type='submit' disabled={loading}>
                            {loading ? "Entrando" : "Entrar"}
                        </button>

                        {loading && 
                            <LoadingState message="Realizando login..."/>    
                        }
                    </form>

                    <p className='auth-alt'>
                        Não tem conta? <Link to='/register'>Clique aqui</Link>
                    </p>

                </div>
            </section>
        </main>        
    )
}