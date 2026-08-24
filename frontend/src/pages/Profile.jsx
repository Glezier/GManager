import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useMe } from "../hooks/useMe"
import { atualizarNome, atualizarEmail, atualizarSenha, atualizarTema } from "../api/profileApi"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { getTemaSalvo, salvarTemaLocal } from "../utils/theme"
import { removeToken } from "../utils/auth"
import { validarNomePerfil, validarSenhaPerfil, validarEmailPerfil } from "../validators/profileValidators"
import { VALIDATION_LIMITS } from "../validators/validationRules"
import "./Profile.css"
import LoadingState from "../components/ui/LoadingState"
import ConfirmBox from "../components/ConfirmBox"
import EditIcon from "../assets/icons/edit.png"
import EyeClosed from '../assets/icons/eye-closed.png'
import EyeOpen from '../assets/icons/eye-open.png'
import Sun from '../assets/icons/sun.png'
import Moon from '../assets/icons/moon.png'
import AppFooter from "../components/AppFooter"

export default function Profile(){
    const navigate = useNavigate()
    const { data: usuario, isLoading, error } = useMe()
    const [secaoAtiva, setSecaoAtiva] = useState("perfil")

    const queryClient = useQueryClient()
    const [erroForm, setErroForm] = useState("")
    const [sucesso, setSucesso] = useState("")
    const [feedbackFixo, setFeedbackFixo] = useState(false)

    const [editando, setEditando] = useState(null)
    const [nomeEditado, setNomeEditado] = useState("")

    const [senhaAtual, setSenhaAtual] = useState("")
    const [novaSenha, setNovaSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")
    const [mostrarSenhaPerfil1, setMostrarSenhaPerfil1] = useState(false)
    const [mostrarSenhaPerfil2, setMostrarSenhaPerfil2] = useState(false)
    const [mostrarSenhaPerfil3, setMostrarSenhaPerfil3] = useState(false)

    const [emailEditado, setEmailEditado] = useState("")
    const [senhaEmail, setSenhaEmail] = useState("")
    const [mostrarSenhaEmail, setMostrarSenhaEmail] = useState(false)

    const [confirmacaoSenha, setConfirmacaoSenha] = useState({
        open: false,
        loading: false,
    })

    const [confirmacaoEmail, setConfirmacaoEmail] = useState({
        open: false,
        loading: false,
    })

    const tema = usuario?.tema || getTemaSalvo()

    function abrirEdicaoNome(){
        setNomeEditado(usuario.nome)
        setEditando("nome")
    }

    function abrirEdicaoEmail(){
        setSenhaEmail("")
        setMostrarSenhaEmail(false)
        setErroForm("")
        setSucesso("")
        setEditando("email")
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
        setEmailEditado("")
        setSenhaEmail("")
        setMostrarSenhaEmail(false)
        setConfirmacaoEmail({
            open: false,
            loading: false,
        })
        limparCampoSenha()
    }

    function salvarNome(event){
        event.preventDefault()

        const nomeCorrigido = nomeEditado.trim()

        const erroValidacao = validarNomePerfil({ nome: nomeCorrigido })

        if (erroValidacao){
            setErroForm(erroValidacao)
            return
        }

        if (nomeCorrigido === usuario.nome){
            cancelarEdicao()
            return
        }
        
        atualizarPerfilMutation.mutate({ nome: nomeCorrigido})
    }

    function salvarEmail(event){
        event.preventDefault()

        const emailCorrigido = emailEditado.trim().toLowerCase()

        const erroValidacao = validarEmailPerfil({
            email: emailCorrigido,
            senha: senhaEmail
        })

        if (erroValidacao){
            setErroForm(erroValidacao)
            return
        }

        if (emailCorrigido === usuario.email){
            cancelarEdicao()
            return
        }

        setEmailEditado(emailCorrigido)

        setConfirmacaoEmail({
            open: true,
            loading: false,
        })
    }

    function salvarSenha(event){
        event.preventDefault()

        const erroValidacao = validarSenhaPerfil({
            senhaAtual,
            novaSenha, 
            confirmarSenha
        })

        if (erroValidacao){
            setErroForm(erroValidacao)
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

    function cancelarConfirmacaoEmail(){
        setConfirmacaoEmail({
            open: false,
            loading: false,
        })
    }

    function confirmarTrocaEmail(){
        setConfirmacaoEmail({
            open: true,
            loading: true,
        })

        atualizarEmailMutation.mutate({
            email: emailEditado,
            senhaAtual: senhaEmail
        })
    }

    function alternarTema(){
        const novoTema = tema === "dark" ? "light" : "dark"

        salvarTemaLocal(novoTema)

        queryClient.setQueryData(["me"], (usuarioAtual) => {
            if (!usuarioAtual) {
                return usuarioAtual
            }
            return { ...usuarioAtual, tema: novoTema }
        })

        atualizarTemaMutation.mutate({
            tema: novoTema
        })
    }

    const atualizarPerfilMutation = useMutation({
        mutationFn: atualizarNome,
        onSuccess:(usuarioAtualizado) => {
            queryClient.setQueryData(["me"], usuarioAtualizado)
            setEditando(null)
            setNomeEditado("")
            setErroForm("")
            setFeedbackFixo(false)
            setSucesso("Perfil atualizado com sucesso")
        },
        onError: (error) => {
            setSucesso("")
            setErroForm(error.message)
        }
    })

    const atualizarEmailMutation = useMutation({
        mutationFn: atualizarEmail,
        onSuccess: (data) => {
            setConfirmacaoEmail({ open: false, loading: false })
            setEditando(null)
            setEmailEditado("")
            setSenhaEmail("")
            setMostrarSenhaEmail(false)
            setErroForm("")
            setFeedbackFixo(true)
            setSucesso(data.message || "Verifique o novo email para concluir a troca.")
        },
        onError: (error) => {
            setConfirmacaoEmail({ open: false, loading: false })
            setSucesso("")
            setErroForm(error.message)
        }
    })

    const atualizarSenhaMutation = useMutation({
        mutationFn: atualizarSenha,
        onSuccess: () => {
            removeToken()
            setConfirmacaoSenha({ open: false, loading:false})
            setEditando(null)
            limparCampoSenha()
            setErroForm("")
            setFeedbackFixo(false)
            setSucesso("Senha alterada com sucesso")
        },
        onError: (error) => {
            setConfirmacaoSenha({ open: false, loading:false})
            setSucesso("")
            setErroForm(error.message)
        }
    })

    const atualizarTemaMutation = useMutation({
        mutationFn: atualizarTema,
        onSuccess: (usuarioAtualizado) => {
            salvarTemaLocal(usuarioAtualizado.tema)
            queryClient.setQueryData(["me"], usuarioAtualizado)
            setErroForm("")
        },
        onError: () => {
            setSucesso("")
            setErroForm("Tema alterado neste dispositivo, mas não foi salvo para outros acessos.")
        }
    })

    useEffect(() => {
        if (feedbackFixo){
            return
        }

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
    }, [feedbackFixo, sucesso, erroForm])

    function limparFeedbackFixo(){
        if (feedbackFixo && sucesso){
        setSucesso("")
        setFeedbackFixo(false)
        }
    }
    
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
        <main className="profile-page" onClick={limparFeedbackFixo}>

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
                                                <form className="profile-edit-form" onSubmit={salvarNome} noValidate>
                                                    <input 
                                                        type="text"
                                                        value={nomeEditado}
                                                        onChange={(e) => setNomeEditado(e.target.value)}
                                                        maxLength={VALIDATION_LIMITS.nomeMax} 
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

                                            {editando === "email" ? (
                                                <>
                                                    <form className="profile-edit-form" onSubmit={salvarEmail} noValidate>
                                                        <input
                                                            type="email"
                                                            value={emailEditado}
                                                            onChange={(e) => setEmailEditado(e.target.value)}
                                                            maxLength={VALIDATION_LIMITS.emailMax}
                                                            placeholder="Digite seu novo email"
                                                            autoFocus
                                                            required
                                                        />

                                                        <div className="profile-password-field">
                                                            <input
                                                                type={mostrarSenhaEmail ? "text" : "password"}
                                                                placeholder="Senha atual"
                                                                value={senhaEmail}
                                                                onChange={(e) => setSenhaEmail(e.target.value)}
                                                                minLength={VALIDATION_LIMITS.senhaMin}
                                                                required
                                                            />

                                                            <button
                                                                type="button"
                                                                className="profile-password-toggle"
                                                                onClick={() => setMostrarSenhaEmail((valor) => !valor)}
                                                                title={mostrarSenhaEmail ? "Ocultar senha" : "Mostrar senha"}
                                                            >
                                                                <img src={mostrarSenhaEmail ? EyeClosed : EyeOpen} alt="" />
                                                            </button>
                                                        </div>

                                                        <div className="profile-edit-actions">
                                                            <button
                                                                type="submit"
                                                                className="btn-primary"
                                                                disabled={atualizarEmailMutation.isPending}
                                                            >
                                                                {atualizarEmailMutation.isPending ? "Enviando..." : "Enviar verificação"}
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
                                                        open={confirmacaoEmail.open}
                                                        title="Alterar email?"
                                                        message={`Vamos enviar um link de verificação para ${emailEditado}. O email da conta só será alterado depois da confirmação.`}
                                                        confirmLabel="Enviar verificação"
                                                        cancelLabel="Cancelar"
                                                        variant="warning"
                                                        loading={confirmacaoEmail.loading}
                                                        onConfirm={confirmarTrocaEmail}
                                                        onCancel={cancelarConfirmacaoEmail}
                                                    />
                                                </>
                                            ) : (
                                                <strong>{usuario.email}</strong>
                                            )}
                                        </div>

                                        {editando !== "email" && (
                                            <button
                                                type="button"
                                                className="profile-edit-button"
                                                title="Editar email"
                                                onClick={abrirEdicaoEmail}
                                            >
                                                <img src={EditIcon} alt="" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="profile-info-row">
                                        <div className="profile-info-content">
                                            <span>Senha</span>

                                            {editando === "senha" ? (
                                                <>
                                                    <form className="profile-edit-form" onSubmit={salvarSenha} noValidate>
                                                        <div className="profile-password-field">
                                                            <input
                                                                type={mostrarSenhaPerfil1 ? "text" : "password"}
                                                                placeholder="Senha atual"
                                                                value={senhaAtual}
                                                                onChange={(e) => setSenhaAtual(e.target.value)}
                                                                autoFocus
                                                                minLength={VALIDATION_LIMITS.senhaMin}
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
                                                                minLength={VALIDATION_LIMITS.senhaMin}
                                                                maxLength={VALIDATION_LIMITS.senhaMax}
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
                                                                minLength={VALIDATION_LIMITS.senhaMin}
                                                                maxLength={VALIDATION_LIMITS.senhaMax}
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
                                        disabled={atualizarTemaMutation.isPending}
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

            <AppFooter minimal />

        </main>
    )
}
