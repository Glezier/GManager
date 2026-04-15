import { useState } from "react"
import { useNavigate, Link } from 'react-router-dom'
import { registrar } from "../api/api"
import './Auth.css'
import LoadingState from "../components/ui/LoadingState"

export default function Register(){
    const [nome, setNome ] = useState("")
    const [email, setEmail ] = useState("")
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        setErro("")
        setLoading(true)

        try{
            await registrar(nome, email, senha)
            navigate("/")
        }catch(error){
            setErro(error.message)
        } finally{
            setLoading(false)
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <aside className="auth-hero">
                    <div>
                        <span className="auth-brand">GManager</span>
                    </div>

                    <div>
                        <h1>Crie seu espaço de organização</h1>
                        <p>
                            Monte uma base simples para planejar seu dia, acompanhar tarefas
                            e manter constância no desenvolvimento do projeto.
                        </p>
                    </div>

                    <div className="auth-highlights">
                        <div className="auth-highlight">Cadastro rápido</div>
                        <div className="auth-highlight">Fluxo simples e direto</div>
                        <div className="auth-highlight">Base pronta para crescer</div>
                    </div>
                </aside>

                <div className="auth-form-wrap">
                    <div className="auth-form-head">
                        <h2>Criar conta</h2>
                        <p>Preencha seus dados para começar a usar o GManager.</p>
                    </div>

                    {erro && (
                        <p className="auth-feedback auth-feedback-error">{erro}</p>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label htmlFor="register-name">Nome</label>
                            <input 
                                id="register-name"
                                type="text"
                                placeholder="Digite seu nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="register-email">Email</label>
                            <input 
                                id="register-email"
                                type="email"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="register-password">Senha</label>
                            <input 
                                id="register-password"
                                type="password"
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>

                        <button className="auth-submit" type="submit" disabled={loading}>
                            {loading ? "Criando conta..." : "Registrar usuário"}
                        </button>

                        {loading && 
                            <LoadingState message="Criando conta..."/>    
                        }
                    </form>

                    <p className="auth-alt">
                        Já tem conta? <Link to="/">Fazer login</Link>
                    </p>
                </div>
            </section>
        </main>
    )
}