import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { verificarEmail } from '../api/api'
import './Auth.css'

export default function VerifyEmail(){
    // Lê os parâmetros da Url
    const [searchParams] = useSearchParams() 
    const [status, setStatus] = useState('loading')
    const [mensagem, setMensagem] = useState('Verificando seu email...')
    const jaExecutou = useRef(false) // StrictMode executa 2 vezes
    const navigate = useNavigate()
    const email = searchParams.get('email') || ''

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
    return(
        <main className='auth-page'>
            <section className='auth-card'>
                <aside className='auth-hero'>
                    <div>
                        <span className='auth-brand'>My GManager</span>
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

                    <p className='auth-alt'>
                        {status === 'success' ? (
                            <button
                                type='button'
                                className='auth-submit'
                                onClick={()=>{
                                    navigate('/', {
                                        state:{
                                            emailPreenchido: email,
                                            mensagemSucesso: 'Email verificado com sucesso.'
                                        }
                                    })
                                }}
                            >
                                Ir para o login
                            </button>
                        ) : (
                            <Link to='/'>Voltar para login</Link>
                        )}
                    </p>
                </div>
            </section>
        </main>
    )
}