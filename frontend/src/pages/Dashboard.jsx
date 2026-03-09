import { useEffect, useState } from "react"
import { listarTarefas } from "../api/api"

export default function Dashboard(){
    const [tarefas, setTarefas] = useState([])



    useEffect(()=>{
        
        const token = localStorage.getItem("token")

        if(!token){
            window.location.href = '/'
            return
        }
        
        async function carregarTarefas(token){
            const data = await listarTarefas(token)
            setTarefas(data)
        }

        carregarTarefas(token)
    }, [])


    return(
        <>
            <h1>Minhas tarefas</h1>
            
            {tarefas.map(tarefa => (
                <div key={tarefa.id}>
                    <h3>{tarefa.titulo}</h3>
                    <p>{tarefa.descricao}</p>
                    <span>{tarefa.status}</span> 
                </div>
            ))}
            

        </>
    )
}