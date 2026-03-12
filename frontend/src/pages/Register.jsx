import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { registrar } from "../api/api"

export default function Register(){
    const [nome, setNome ] = useState("")
    const [email, setEmail ] = useState("")
    const [senha, setSenha] = useState("")

    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()

        try{
            const data = await registrar(nome, email, senha)
            if (data.error){
                alert(data.error)
                return
            }
            alert("Usuário criado com sucesso")
            navigate("/")

        }catch(error){
            alert("Erro ao registrar usuário")
            console.error(error)
        }

    }

    return (
        <>
            <h2>Criar conta</h2>

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
                />

                <button type="submit">
                    Registrar usuário
                </button>

            </form>
        </>
    )
}