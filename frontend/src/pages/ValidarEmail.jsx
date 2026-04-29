import { Link, useLocation } from "react-router-dom"
import './Auth.css'
import FullLogo from '../assets/icons/full_logo.png'

export default function ValidarEmail(){
    // Para acessar o state que é enviado ao registrar
    const location = useLocation()

    const email = location.state?.email || ''
    const mensagem = location.state?.mensagem ||
        "Enviamos um email de verificação para você. Abra sua caixa de entrada e clique no link para ativar a conta."
    return(
        <main className="auth-page">
            <section className="auth-card">
                <aside className="auth-hero">
                    <div>
                        <span className="auth-brand">
                            <img src={FullLogo} alt="Logo My GManager" className='auth-logo'/>
                        </span>
                    </div>

                    <div>
                        <h1>Confira seu email</h1>
                        <p>
                            Sua conta foi criada. Falta só confirmar 
                            o email para começar a usar.
                        </p>
                    </div>
                </aside>

                <div className="auth-form-wrap">
                    <div className="auth-form-head">
                        <h2>Email de verificação enviado</h2>
                        <p>{mensagem}</p>
                        {email && (
                            <p className="auth-feedback">
                                Email enviado para: <strong>{email}</strong>
                            </p>
                        )}
                    </div>

                    <p>
                        Depois de verificar, <Link to='/'>volte para o login</Link>.
                    </p>
                </div>
            </section>
        </main>
    )
}