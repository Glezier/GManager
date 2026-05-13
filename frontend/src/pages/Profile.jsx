import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMe } from "../hooks/useMe"
import "./Profile.css"
import LoadingState from "../components/ui/LoadingState"
import EditIcon from "../assets/icons/edit.png"

export default function Profile(){
    const navigate = useNavigate()
    const { data: usuario, isLoading, error } = useMe()

    //const [nome, setNome] = useState(usuario.nome)
    //const [email, setEmail] = useState(usuario.email)

    const [editando, setEditando] = useState(null)

    if (isLoading){
        return(
            <LoadingState message="Carregando perfil..."/>  
        )
    }

    if (error){
        return(
            <main className="profile-page">
                <p className="dashboard-feedback dashboard-feedback-error">
                    {error.message}
                </p>
            </main>
        )
    }

    if (!usuario) {
        return null
    }

    return(
        <main className="profile-page">
            <section className="profile-layout">
                <aside className="profile-sidebar">
                    <div className="profile-summary">
                        <div className="profile-avatar">
                            {usuario.nome?.charAt(0).toUpperCase()}
                        </div>
                        
                        <div>
                            <strong>{usuario.nome}</strong>
                            <span>{usuario.email}</span>
                        </div>
                    </div>

                    <button type="button" className="profile-menu-item active">
                        Meu perfil
                    </button>

                    <button type="button" className="profile-menu-item">
                        Configurações
                    </button>

                    <button type="button" className="profile-menu-item">
                        Pagamentos
                    </button>

                    <button
                        type="button"
                        className="profile-menu-item"
                        onClick={() => navigate("/dashboard", {replace: true})}
                    >
                        Voltar
                    </button>

                </aside>

                <section className="profile-card">
                    <header className="profile-card-header">
                        <div>
                            <h1>Meu perfil</h1>
                            <p>Gerencie suas informações pessoais</p>
                        </div>
                    </header>

                    <div className="profile-info-list">
                        <div className="profile-info-row">
                            <div className="profile-info-content">
                                <span>Nome</span>
                                <strong>{usuario.nome}</strong>
                            </div>

                            <button 
                                type="button" 
                                className="profile-edit-button" 
                                title="Editar nome"
                                onClick={() => {setEditando("nome")}}
                            >
                                <img src={EditIcon} alt="" />
                            </button>
                        </div>

                        <div className="profile-info-row">
                            <div className="profile-info-content">
                                <span>Email</span>
                                <strong>{usuario.email}</strong>
                            </div>

                            <button
                                type="button"
                                className="profile-edit-button"
                                title="Editar email"
                                onClick={() => {setEditando("email")}}
                            >
                                <img src={EditIcon} alt="" />
                            </button>
                        </div>

                        <div className="profile-info-row">
                            <span>Conta criada em</span>
                            <strong>{new Date(usuario.created_at).toLocaleDateString("pt-BR")}</strong>
                        </div>
                    </div>

                </section>

            </section>

        </main>
    )
}