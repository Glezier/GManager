import { useState } from 'react'
import { login } from '../api/api'

export default function Login(){
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    const handleLogin = async(e) => {
        e.preventDefault()

        const data = await login(email, senha)

        if (data.token){
            localStorage.setItem("token", data.token)
            window.location.href = "/dashboard"
        }
        else{
            alert("Erro ao realizar login")
        }
    }

    return(
        <>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type='email'
                    placeholder='Digite seu email'
                    onChange={(e) => setEmail(e.target.value)}  
                />

                <input 
                    type="password"
                    placeholder='Digite sua senha'
                    onChange={(e) => setSenha(e.target.value)}
                />

                <button type='submit'>Entrar</button>

            </form>
        </>
    )
}