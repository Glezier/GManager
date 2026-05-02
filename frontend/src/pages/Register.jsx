import { useState } from "react"
import { useNavigate, Link } from 'react-router-dom'
import { registrar } from "../api/api"
import './Auth.css'
import FullLogo from '../assets/icons/full_logo.png'
import EyeClosed from '../assets/icons/eye-closed.png'
import EyeOpen from '../assets/icons/eye-open.png'

export default function Register(){
    const [nome, setNome ] = useState("")
    const [email, setEmail ] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [mostrarSenha1, setMostrarSenha1] = useState(false)
    const [mostrarSenha2, setMostrarSenha2] = useState(false)
    const [erro, setErro] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        setErro("")

        if(senha !== confirmarSenha){
            setErro('As senhas devem ser iguais')
            return
        }

        setLoading(true)

        try{
            const data = await registrar(nome, email, senha)
            navigate("/validar-email", {
                state: {
                    email, 
                    mensagem: data.message
                }
            })
        }catch(error){
            setErro(error.message)
        } finally{
            setLoading(false)
        }
    }

    function limparErro(){
        if (erro){
            setErro('')
        }
    }

    return (
        <main className="auth-page" onClick={limparErro}>
            <section className="auth-card">
                <aside className="auth-hero">
                    <div>
                        <span className="auth-brand">
                            <img src={FullLogo} alt="Logo My GManager" className='auth-logo'/>
                        </span>
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
                        <p>Preencha seus dados para começar a usar o My GManager.</p>
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
                                maxLength={100}
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
                                maxLength={120}
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="register-password">Senha</label>
                            <div className="auth-password-wrap">
                                <input 
                                    id="register-password"
                                    type={mostrarSenha1 ? 'text' : "password"}
                                    placeholder="Digite sua senha (mínimo 8 caracteres)"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                    minLength={8}
                                    maxLength={50}
                                />
                                <button className="auth-password-toggle"
                                    type='button'  
                                    onClick={() => setMostrarSenha1((valorAtual) => !valorAtual)}
                                    aria-label={mostrarSenha1 ? "Ocultar senha" : "Mostrar senha"}
                                >
                                    {mostrarSenha1 ? (
                                        <img className='eye-icon' src={EyeClosed} alt="Mostrar senha" title='Ocultar senha'/>
                                    ) : (
                                        <img className='eye-icon' src={EyeOpen} alt="Ocultar senha" title='Mostrar senha' />
                                    )}
                                </button>

                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="register-confirm-password">Confirmar senha</label>
                            <div className="auth-password-wrap">
                                <input 
                                    id="register-confirm-password"
                                    type={mostrarSenha2 ? 'text' : "password"}
                                    placeholder="Confirme sua senha (igual a anterior)"
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    required
                                    minLength={8}
                                    maxLength={50}
                                />
                                <button className="auth-password-toggle"
                                    type='button'  
                                    onClick={() => setMostrarSenha2((valorAtual) => !valorAtual)}
                                    aria-label={mostrarSenha2 ? "Ocultar senha" : "Mostrar senha"}
                                >
                                    {mostrarSenha2 ? (
                                        <img className='eye-icon' src={EyeClosed} alt="Mostrar senha" title='Ocultar senha'/>
                                    ) : (
                                        <img className='eye-icon' src={EyeOpen} alt="Ocultar senha" title='Mostrar senha' />
                                    )}
                                </button>

                            </div>
                        </div>

                        <button className="auth-submit" type="submit" disabled={loading}>
                            {loading ? "Criando conta..." : "Criar conta"}
                        </button>
                    </form>

                    <p className="auth-alt">
                        Já tem conta? <Link to="/">Fazer login</Link>
                    </p>
                </div>
            </section>
        </main>
    )
}