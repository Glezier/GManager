import { useEffect, useState } from "react"
import { listarTarefas } from "../api/api"

export default function Dashboard(){
    const [tarefas, setTarefas] = useState([])

    useEffect(()=>{
        async function carregarTarefas() {
            const token = localStorage.getItem("token")

            const data = await listarTarefas(token)

            setTarefas(data)
        }
        carregarTarefas()
    }, [])


    return(
        <>
            <h1>Minhas tarefas</h1>
            <ul>
                {tarefas.map(tarefa => (
                    <li key={tarefa.id}>
                        {tarefa.titulo} - {tarefa.status}
                    </li>
                ))}
            </ul>

        </>
    )
}