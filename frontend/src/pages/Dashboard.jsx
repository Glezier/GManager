import { useEffect, useState, useCallback  } from "react"
import { listarTarefas, criarTarefa, deletarTarefa, concluirTarefa } from "../api/api"

import TaskForm from "../components/TaskForm"
import TaskCard from "../components/TaskCard"

export default function Dashboard(){
    const [tarefas, setTarefas] = useState([])
    const [addTarefa, setAddTarefa ] = useState(false)

    const token = localStorage.getItem("token")

    const carregarTarefas = useCallback(async () => {// Evitar re-renderização desnecessária
        const data = await listarTarefas(token)
        setTarefas(data)
    }, [token])

    async function novaTarefa(tarefa){
        await criarTarefa(token, tarefa)
        setAddTarefa(false)
        carregarTarefas()
    }

    async function removerTarefa(id){
        await deletarTarefa(token, id)
        carregarTarefas()
    }

    async function finalizarTarefa(id){
        await concluirTarefa(token, id)
        carregarTarefas()
    }

    useEffect(()=>{
        if(!token){
            window.location.href = '/'
            return
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        carregarTarefas()
       
    }, [token, carregarTarefas])


    return(
        <>
            <h1>Minhas tarefas</h1>

            <button onClick={()=>setAddTarefa(true)}>
                Adicionar tarefa
            </button>

            {(addTarefa && (
                <TaskForm
                    criar={novaTarefa}
                    cancelar={()=>setAddTarefa(false)}
                />
            ))}

            {tarefas.map(tarefa => (
                <TaskCard
                    key={tarefa.id}
                    tarefa ={tarefa}
                    concluir={finalizarTarefa}
                    remover={removerTarefa}
                />
            ))}
        </>
    )
}