import { useEffect, useState } from "react"
import { listarTarefas, criarTarefa, deletarTarefa } from "../api/api"

export default function Dashboard(){
    const [tarefas, setTarefas] = useState([])
    const [titulo, setTitulo ] = useState("")
    const [descricao, setDescricao ] = useState("") 
    const [addTarefa, setAddTarefa ] = useState(false)

    async function carregarTarefas(token){
        const data = await listarTarefas(token)
        setTarefas(data)
    }

    async function adicionarTarefa(e){
        e.preventDefault()

        const token = localStorage.getItem("token")

        const novaTarefa = {
            titulo, 
            descricao
        }

        await criarTarefa(token, novaTarefa)

        setTitulo("")
        setDescricao("")
        setAddTarefa(false)

        carregarTarefas(token)
    }

    async function removerTarefa(id){
        const token = localStorage.getItem("token")

        await deletarTarefa(token, id)

        carregarTarefas(token)
    }

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

            <button onClick={()=>setAddTarefa(true)}>
                Adicionar tarefa
            </button>

            {(addTarefa &&
            
                <form onSubmit={adicionarTarefa}>

                    <input 
                        type="text"
                        placeholder="Título da tarefa"
                        value={titulo}
                        onChange={(e)=>{setTitulo(e.target.value)}} 
                    />

                    <input 
                        type="text"
                        placeholder="Descrição da tarefa" 
                        value={descricao}
                        onChange={(e)=>{setDescricao(e.target.value)}}
                    />

                    <button type="submit">
                        Salvar tarefa
                    </button>

                    <button
                    type="button"
                    onClick={() => setAddTarefa(false)}>
                    Cancelar
                    </button>
                </form>
            )}
            
            {tarefas.map(tarefa => (
                <div key={tarefa.id}>
                    <h3>{tarefa.titulo}</h3>
                    <p>{tarefa.descricao}</p>
                    <span>{tarefa.status}</span> 

                    <button onClick={()=>removerTarefa(tarefa.id)}>
                        Deletar tarefa
                    </button>
                </div>
            ))}
            

        </>
    )
}