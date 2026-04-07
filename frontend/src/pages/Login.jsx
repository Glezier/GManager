import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/api'

export default function Login(){
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleLogin = async(e) => {
        e.preventDefault()
        setErro("")
        setLoading(true)

        try{
            const data = await login(email, senha)
            
            if (data.token){
                localStorage.setItem("token", data.token)
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
        <>
            <form onSubmit={handleLogin}>
                <h1>Login</h1>

                {erro && <p>{erro}</p>}

                <input
                    type="email"
                    placeholder='Digite seu email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}  
                    required
                />

                <input 
                    type="password"
                    placeholder='Digite sua senha'
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />

                <button type='submit' disabled={loading}>
                    {loading ? "Entrando": "Entrar"}
                </button>

            </form>

            <p>Não tem conta? <Link to='/register'>Clique aqui</Link></p>
        </>     
        
    )
}