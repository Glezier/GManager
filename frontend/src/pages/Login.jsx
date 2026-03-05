import { useState } from 'react'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'

export default function Login(){
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const navigate = useNavigate()

    const handleLogin = async(e) => {
        e.preventDefault()
        try{
            const response = await api.post("/auth/login",{
                email, 
                senha
            })

            localStorage.setItem("token", response.data.token)

            navigate("/dashboard")

        }catch(error){
            alert("Erro ao fazer login")
            console.log(error)
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