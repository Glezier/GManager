import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useMe } from "../hooks/useMe"
import { atualizarPerfil, atualizarSenha } from "../api/api"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import "./Profile.css"
import LoadingState from "../components/ui/LoadingState"
import EditIcon from "../assets/icons/edit.png"

export default function Profile(){
    const navigate = useNavigate()
    const { data: usuario, isLoading, error } = useMe()
    const [secaoAtiva, setSecaoAtiva] = useState("perfil")

    const queryClient = useQueryClient()
    const [erroForm, setErroForm] = useState("")
    const [sucesso, setSucesso] = useState("")

    const [editando, setEditando] = useState(null)
    const [nomeEditado, setNomeEditado] = useState("")

    const [senhaAtual, setSenhaAtual] = useState("")
    const [novaSenha, setNovaSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")

    function abrirEdicaoNome(){
        setNomeEditado(usuario.nome)
        setEditando("nome")
    }

    function limparCampoSenha(){
        setSenhaAtual("")
        setNovaSenha("")
        setConfirmarSenha("")
    }

    function cancelarEdicao(){
        setEditando(null)
        setNomeEditado("")
        limparCampoSenha()
    }

    function salvarNome(event){
        event.preventDefault()

        const nomeCorrigido = nomeEditado.trim()

        if (!nomeCorrigido){
            setErroForm("Nome é obrigatório")
            return
        }

        if(nomeCorrigido === usuario.nome){
            cancelarEdicao()
            return
        }
        
        atualizarPerfilMutation.mutate({ nome: nomeCorrigido})
    }

    function salvarSenha(event){
        event.preventDefault()

        if (!senhaAtual || !novaSenha || !confirmarSenha){
            setErroForm("Preencha todos os campos de senha")
            return
        }

        atualizarSenhaMutation.mutate({
            senhaAtual,
            novaSenha,
            confirmarSenha
        })
    }

    const atualizarPerfilMutation = useMutation({
        mutationFn: atualizarPerfil,
        onSuccess:(usuarioAtualizado) => {
            queryClient.setQueryData(["me"], usuarioAtualizado)
            setEditando(null)
            setNomeEditado("")
            setErroForm("")
            setSucesso("Perfil atualizado com sucesso")
        },
        onError: (error) => {
            setSucesso("")
            setErroForm(error.message)
        }
    })

    const atualizarSenhaMutation = useMutation({
        mutationFn: atualizarSenha,
        onSuccess: (resposta) => {
            setEditando(null)
            limparCampoSenha()
            setErroForm("")
            setSucesso(resposta.message || "Senha atualizada com sucesso")
        },
        onError: (error) => {
            setSucesso("")
            setErroForm(error.message)
        }
    })

    useEffect(() => {
        if (sucesso){
            const timer = setTimeout(() => {
                setSucesso('')
            }, 2500)
            return () => clearTimeout(timer)
        }
        else if (erroForm){
            const timer = setTimeout(() => {
                setErroForm('')
            }, 2500)
            return () => clearTimeout(timer)

        }
        return
    }, [sucesso, erroForm])

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

            {(erroForm || sucesso) && (
                <div className="profile-shell">
                    {erroForm && (
                        <div className="profile-feedback-area">
                            <p className="dashboard-feedback dashboard-feedback-error">
                                {erroForm}
                            </p>
                        </div>
                    )}

                    {sucesso && (
                        <div className="profile-feedback-area">
                            <p className="dashboard-feedback dashboard-feedback-success">
                                {sucesso}
                            </p>
                        </div>
                    )}
                </div>
            )}


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

                    <button 
                        type="button" 
                        className={`profile-menu-item ${secaoAtiva === "perfil" ? "active" : ""}`}
                        onClick={() => setSecaoAtiva("perfil")}
                        >
                        Meu perfil
                    </button>

                    <button 
                        type="button" 
                        className={`profile-menu-item ${secaoAtiva === "config" ? "active" : ""}`}                    
                        onClick={() => setSecaoAtiva("config")}
                        >
                        Configurações
                    </button>

                    <button 
                        type="button" 
                        className={`profile-menu-item ${secaoAtiva === "pagamentos" ? "active" : ""}`}
                        onClick={() => setSecaoAtiva("pagamentos")}
                        >
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
                        {secaoAtiva === "perfil" && (
                            <>
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

                                            {editando === "nome" ? (
                                                <form className="profile-edit-form" onSubmit={salvarNome}>
                                                    <input 
                                                        type="text"
                                                        value={nomeEditado}
                                                        onChange={(e) => setNomeEditado(e.target.value)}
                                                        minLength={2}
                                                        maxLength={100} 
                                                        autoFocus
                                                    />

                                                    <div className="profile-edit-actions">
                                                        <button type="submit" className="btn-primary" disabled={atualizarPerfilMutation.isPending}>
                                                            {atualizarPerfilMutation.isPending ? "Salvando..." : "Salvar"}
                                                        </button>
                                                        <button type="button" className="btn-secondary" onClick={cancelarEdicao}>
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : 
                                                <strong>{usuario.nome}</strong>}
                                        </div>

                                        {editando !== "nome" && (
                                            <button 
                                                type="button" 
                                                className="profile-edit-button" 
                                                title="Editar nome"
                                                onClick={() => {abrirEdicaoNome()}}
                                            >
                                                <img src={EditIcon} alt="" />
                                            </button>
                                        )}

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
                                        <div className="profile-info-content">
                                            <span>Senha</span>

                                            {editando === "senha" ? (
                                                <form className="profile-edit-form" onSubmit={salvarSenha}>
                                                    <input
                                                        type="password"
                                                        placeholder="Senha atual"
                                                        value={senhaAtual}
                                                        onChange={(e) => setSenhaAtual(e.target.value)}
                                                        autoFocus
                                                    />

                                                    <input
                                                        type="password"
                                                        placeholder="Nova senha"
                                                        value={novaSenha}
                                                        onChange={(e) => setNovaSenha(e.target.value)}
                                                        minLength={8}
                                                        maxLength={50}
                                                    />

                                                    <input
                                                        type="password"
                                                        placeholder="Confirmar nova senha"
                                                        value={confirmarSenha}
                                                        onChange={(e) => setConfirmarSenha(e.target.value)}
                                                        minLength={8}
                                                        maxLength={50}
                                                    />

                                                    <div className="profile-edit-actions">
                                                        <button
                                                            type="submit"
                                                            className="btn-primary"
                                                            disabled={atualizarSenhaMutation.isPending}
                                                        >
                                                            {atualizarSenhaMutation.isPending ? "Salvando..." : "Salvar"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="btn-secondary"
                                                            onClick={cancelarEdicao}
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <strong>Alterar senha da conta</strong>
                                            )}
                                        </div>

                                        {editando !== "senha" && (
                                            <button
                                                type="button"
                                                className="profile-edit-button"
                                                title="Alterar senha"
                                                onClick={() => setEditando("senha")}
                                            >
                                                <img src={EditIcon} alt="" />
                                            </button>
                                        )}
                                    </div>


                                    <div className="profile-info-row">
                                        <span>Conta criada em</span>
                                        <strong>{new Date(usuario.created_at).toLocaleDateString("pt-BR")}</strong>
                                    </div>
                                </div>
                                
                            </>
                        )}
        
                        {secaoAtiva === "config" && (
                            <>
                                <header className="profile-card-header">
                                    <div>
                                        <h1>Configurações</h1>
                                        <p>Gerencie segurança, senha e preferências da conta.</p>
                                    </div>
                                </header>
        
                                <div className="profile-info-list">
                                    
        
                                    <div className="profile-info-row">
                                        <div className="profile-info-content">
                                            <span>Tema</span>
                                            <strong>Escuro</strong>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
        
                        {secaoAtiva === "pagamentos" && (
                            <>
                                <header className="profile-card-header">
                                    <div>
                                        <h1>Pagamentos</h1>
                                        <p>Gerencie formas de pagamento e preferências financeiras.</p>
                                    </div>
                                </header>
        
                                <div className="profile-info-list">
                                    <div className="profile-info-row">
                                        <div className="profile-info-content">
                                            <span>Formas de pagamento</span>
                                            <strong>Nenhuma forma cadastrada</strong>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                </section>

            </section>

        </main>
    )
}