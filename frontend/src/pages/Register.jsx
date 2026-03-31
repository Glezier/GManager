import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { registrar } from "../api/api"

export default function Register(){
    const [nome, setNome ] = useState("")
    const [email, setEmail ] = useState("")
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState("")

    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        setErro("")

        try{
            await registrar(nome, email, senha)
            navigate("/")
        }catch(error){
            setErro(error.message)
            console.error(error)
        }
    }

    return (
        <>
            <h2>Criar conta</h2>

            {erro && <p>{erro}</p>}

            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    placeholder="Digite seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />

                <input 
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input 
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    minLength={8}
                />

                <button type="submit">
                    Registrar usuário
                </button>

            </form>
        </>
    )
}