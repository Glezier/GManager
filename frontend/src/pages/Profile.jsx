import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useMe } from "../hooks/useMe"
import { atualizarPerfil, atualizarSenha, atualizarPreferencias } from "../api/api"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import "./Profile.css"
import LoadingState from "../components/ui/LoadingState"
import ConfirmBox from "../components/ConfirmBox"
import EditIcon from "../assets/icons/edit.png"
import EyeClosed from '../assets/icons/eye-closed.png'
import EyeOpen from '../assets/icons/eye-open.png'
import Sun from '../assets/icons/sun.png'
import Moon from '../assets/icons/moon.png'

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
    const [mostrarSenhaPerfil1, setMostrarSenhaPerfil1] = useState(false)
    const [mostrarSenhaPerfil2, setMostrarSenhaPerfil2] = useState(false)
    const [mostrarSenhaPerfil3, setMostrarSenhaPerfil3] = useState(false)

    const [confirmacaoSenha, setConfirmacaoSenha] = useState({
        open: false,
        loading: false,
    })

    const tema = usuario?.tema || "dark"

    function abrirEdicaoNome(){
        setNomeEditado(usuario.nome)
        setEditando("nome")
    }

    function limparCampoSenha(){
        setSenhaAtual("")
        setNovaSenha("")
        setConfirmarSenha("")
        setMostrarSenhaPerfil1(false)
        setMostrarSenhaPerfil2(false)
        setMostrarSenhaPerfil3(false)
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

        if (novaSenha.length < 8 || novaSenha.length > 50) {
            setErroForm("A nova senha deve possuir entre 8 e 50 caracteres")
            return
        }

        if (novaSenha !== confirmarSenha) {
            setErroForm("A confirmação de senha não confere")
            return
        }

        if (senhaAtual === novaSenha) {
            setErroForm("A nova senha deve ser diferente da senha atual")
            return
        }

        setConfirmacaoSenha({
            open: true,
            loading: false,
        })
    }

    // Funções para o confirm box
    function cancelarConfirmacaoSenha(){
        setConfirmacaoSenha({
            open: false,
            loading: false,
        })

        setEditando(null)
        limparCampoSenha()
    }

    function confirmarTrocaSenha(){
        setConfirmacaoSenha({
            open: true,
            loading: true,
        })

        atualizarSenhaMutation.mutate({
            senhaAtual,
            novaSenha,
            confirmarSenha
        })
    }

    function alternarTema(){
        const novoTema = tema === "dark" ? "light" : "dark"

        atualizarPreferenciasMutation.mutate({
            tema: novoTema
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
        onSuccess: () => {
            setConfirmacaoSenha({ open: false, loading:false})
            setEditando(null)
            limparCampoSenha()
            setErroForm("")
            setSucesso("Senha alterada com sucesso")
        },
        onError: (error) => {
            setConfirmacaoSenha({ open: false, loading:false})
            setSucesso("")
            setErroForm(error.message)
        }
    })

    const atualizarPreferenciasMutation = useMutation({
        mutationFn: atualizarPreferencias,
        onSuccess: (usuarioAtualizado) => {
            queryClient.setQueryData(["me"], usuarioAtualizado)
            setErroForm("")
        },
        onError: (error) => {
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
            <main className="profile-page">
                <LoadingState message="Carregando perfil..."/>  
            </main>
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

            <button
                type="button"
                className="profile-voltar"
                onClick={() => navigate("/dashboard", {replace: true})}
                >
                Voltar para dashboard
            </button>


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
                                                <>
                                                    <form className="profile-edit-form" onSubmit={salvarSenha}>
                                                        <div className="profile-password-field">
                                                            <input
                                                                type={mostrarSenhaPerfil1 ? "text" : "password"}
                                                                placeholder="Senha atual"
                                                                value={senhaAtual}
                                                                onChange={(e) => setSenhaAtual(e.target.value)}
                                                                autoFocus
                                                                minLength={8}
                                                                required
                                                            />

                                                            <button
                                                                type="button"
                                                                className="profile-password-toggle"
                                                                onClick={() => setMostrarSenhaPerfil1((valor) => !valor)}
                                                                title={mostrarSenhaPerfil1 ? "Ocultar senhas" : "Mostrar senhas"}
                                                            >
                                                                <img src={mostrarSenhaPerfil1 ? EyeClosed : EyeOpen } alt="" />
                                                            </button>
                                                        </div>

                                                        <div className="profile-password-field">
                                                            <input
                                                                type={mostrarSenhaPerfil2 ? "text" : "password"}
                                                                placeholder="Nova senha"
                                                                value={novaSenha}
                                                                onChange={(e) => setNovaSenha(e.target.value)}
                                                                minLength={8}
                                                                maxLength={50}
                                                                required
                                                            />

                                                            <button
                                                                type="button"
                                                                className="profile-password-toggle"
                                                                onClick={() => setMostrarSenhaPerfil2((valor) => !valor)}
                                                                title={mostrarSenhaPerfil2 ? "Ocultar senhas" : "Mostrar senhas"}
                                                            >
                                                                <img src={mostrarSenhaPerfil2 ? EyeClosed : EyeOpen } alt="" />
                                                            </button>
                                                        </div>

                                                        <div className="profile-password-field">
                                                            <input
                                                                type={mostrarSenhaPerfil3 ? "text" : "password"}
                                                                placeholder="Confirmar nova senha"
                                                                value={confirmarSenha}
                                                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                                                minLength={8}
                                                                maxLength={50}
                                                                required
                                                            />

                                                            <button
                                                                type="button"
                                                                className="profile-password-toggle"
                                                                onClick={() => setMostrarSenhaPerfil3((valor) => !valor)}
                                                                title={mostrarSenhaPerfil3 ? "Ocultar senhas" : "Mostrar senhas"}
                                                            >
                                                                <img src={mostrarSenhaPerfil3 ? EyeClosed : EyeOpen } alt="" />
                                                            </button>
                                                        </div>

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

                                                    <ConfirmBox
                                                        open={confirmacaoSenha.open}
                                                        title="Alterar senha?"
                                                        message="Tem certeza que deseja alterar senha?"
                                                        confirmLabel="Alterar senha"
                                                        cancelLabel="Cancelar"
                                                        variant="warning"
                                                        loading={confirmacaoSenha.loading}
                                                        onConfirm={confirmarTrocaSenha}
                                                        onCancel={cancelarConfirmacaoSenha}
                                                        
                                                    />
                                                </>
                                            ) : (
                                                <strong>Alterar senha da conta</strong>
                                            )}
                                        </div>

                                        {editando !== "senha" && (
                                            <button
                                                type="button"
                                                className="profile-edit-button"
                                                title="Alterar senha"
                                                onClick={() => {
                                                    setEditando("senha")
                                                    setErroForm("")
                                                    setSucesso("")

                                                    setConfirmacaoSenha({
                                                        open:false,
                                                        loading:false
                                                    })
                                                }}
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
                                        <p>Gerencie preferências da conta.</p>
                                    </div>
                                </header>
        
                                <div className="profile-info-list theme">
                                    
        
                                    <div className="profile-info-row">
                                        <div className="profile-info-content">
                                            <span>Tema</span>
                                            <strong>{tema === "dark" ? "Dark" : "Light"}</strong>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className={`theme-switch ${tema === "light" ? "theme-switch-light" : ""}`}
                                        onClick={alternarTema}
                                        aria-label={tema === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
                                        disabled={atualizarPreferenciasMutation.isPending}
                                    >
                                        <span className="theme-switch-thumb">
                                            {tema === "dark" ? (
                                                <img src={Moon} alt="" />
                                            ): (
                                                <img src={Sun} alt="" />
                                            )}
                                        </span>
                                    </button>
                                </div>
                            </>
                        )}
        
                        {secaoAtiva === "pagamentos" && (
                            <>
                                <header className="profile-card-header">
                                    <div>
                                        <h1>Pagamentos</h1>
                                        <p>Gerencie formas de pagamento da aba de finanças.</p>
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
