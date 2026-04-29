import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { verificarEmail, reenviarVerificacao } from '../api/api'
import './Auth.css'
import FullLogo from '../assets/icons/full_logo.png'

export default function VerifyEmail(){
    // Lê os parâmetros da Url
    const [searchParams] = useSearchParams() 
    const [status, setStatus] = useState('loading')
    const [mensagem, setMensagem] = useState('Verificando seu email...')
    const [emailReenvio, setEmailReenvio] = useState('')
    const [loadingReenvio, setLoadingReenvio] = useState(false)
    const [mensagemReenvio, setMensagemReenvio] = useState('')
    const [bloqueado, setBloqueado] = useState(false)
    const jaExecutou = useRef(false) // StrictMode executa 2 vezes
    const navigate = useNavigate()

    async function handleReenviar(){
        if (!emailReenvio.trim()){
            setStatus('error')
            setMensagem('Informe seu email para reenviar verificação.')
            return
        }

        try{
            setLoadingReenvio(true)
            setMensagemReenvio('')

            const data = await reenviarVerificacao(emailReenvio.trim())
            setMensagemReenvio(data.message)
        } catch(error){
            setMensagemReenvio('')
            setStatus('error')
            setMensagem(error.message)

            if(error.message === 'Muitas tentativas. Tente novamente em 15 minutos.'){
                setBloqueado(true)
            }
        } finally{
            setLoadingReenvio(false)
        }
    }

    useEffect(()=>{
        // Evitar erro de dupla validação
        if (jaExecutou.current){
            return
        }

        jaExecutou.current = true

        async function validar(){
            // Recupera token
            const token = searchParams.get('token')

            if(!token){
                setStatus('error')
                setMensagem('Token de verificação não informado')
                return
            }

            try{
                // Valida email pela API
                const data = await verificarEmail(token)
                setStatus('success')
                setMensagem(data.message)
            } catch(error){
                setStatus('error')
                setMensagem(error.message)
            }
        }

        validar()
    }, [searchParams])

    useEffect(() => {
        if (!bloqueado) {
            return
        }

        const timer = setTimeout(() => {
            setBloqueado(false)
            setMensagem('')
        }, 15 * 60 * 1000)

        return () => clearTimeout(timer)
    }, [bloqueado])

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
                        <h1>Verificação de email</h1>
                        <p>Confirme seu acesso para começar a usar o My GManager</p>
                    </div>
                </aside>

                <div className='auth-form-wrap'>
                    <div className='auth-form-head'>
                        <h2>
                            {status === 'loading' && 'Verificando...'}
                            {status === 'success' && 'Tudo certo'}
                            {status === 'error' && 'Não foi possível verificar'}
                        </h2>
                        <p>{mensagem}</p>
                    </div>

                    <div className='auth-actions'>
                        {status === 'success' ? (
                            <button
                                type='button'
                                className='auth-submit'
                                onClick={()=>{
                                    navigate('/', {
                                        state:{
                                            mensagemSucesso: 'Email verificado com sucesso.'
                                        }
                                    })
                                }}
                            >
                                Ir para o login
                            </button>
                        ) : (
                            <>
                                {status === 'error' && (
                                    <div className='auth-field'>
                                        <p style={{margin : '0', marginBottom: '4px'
                                        }}>Informe seu email novamente para reenvio</p>

                                        <label htmlFor="verify-email-resend">Email</label>

                                        <input 
                                            id='verify-email-resend'
                                            type="email"
                                            placeholder='Confirme seu email'
                                            value={emailReenvio}
                                            disabled={bloqueado}
                                            onChange={(e) => setEmailReenvio(e.target.value)}
                                            required 
                                        />
                                    </div>
                                )}

                                <button
                                    type='button'
                                    className='auth-submit'
                                    onClick={handleReenviar}
                                    disabled={loadingReenvio || !emailReenvio.trim() || bloqueado}
                                >
                                    {loadingReenvio ? 'Reenviando...' : 'Reenviar email de verificação'}
                                </button>

                                {mensagemReenvio && (
                                    <p className='auth-feedback dashboard-feedback-success'>
                                        {mensagemReenvio}
                                    </p>
                                )}

                                <p className='auth-alt'><Link to='/'>Voltar para login</Link></p>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}
