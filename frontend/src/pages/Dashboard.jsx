import { useEffect, useState, useCallback, useMemo  } from "react"
import { useNavigate } from 'react-router-dom'
import { listarTarefas, criarTarefa, deletarTarefa, concluirTarefa } from "../api/api"

import TaskForm from "../components/TaskForm"
import TaskCard from "../components/TaskCard"

export default function Dashboard(){
    const [tarefas, setTarefas] = useState([])
    const [addTarefa, setAddTarefa ] = useState(false)

    const navigate = useNavigate()

    const token = localStorage.getItem("token") || ""

    const carregarTarefas = useCallback(async () => {
        try {
            const data = await listarTarefas(token);
            setTarefas(data);
        } catch (error) {
            console.error("Erro ao carregar tarefas:", error);
            navigate("/");
        }
    }, [token, navigate]);

    // const carregarTarefas = useCallback(async () => {// Evitar re-renderização desnecessária
    //     const data = await listarTarefas(token)
    //     setTarefas(data)
    // }, [token])

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

    const hoje = new Date().toLocaleDateString("en-CA")

    const tarefasDeHoje = useMemo(() => {
        return tarefas.filter((tarefas) => tarefas.data.toString().split("T")[0] === hoje)
    }, [tarefas, hoje])

    const tarefasAgrupadas = useMemo(()=>{ // não recaulcular sempre os grupos
        const grupos = {} // cria um grupo

        tarefas.forEach((tarefa) => { // percorre todas as tarefas
            const data = tarefa.data // pega a data da tarefa
            if (!grupos[data]){ // se não existe um grupo para essa data
                grupos[data] = [] // cria o grupo com a data
            }

            grupos[data].push(tarefa) // adiciona a tarefa na data dela
        })

        
        return grupos
    }, [tarefas])

    useEffect(()=>{
        if(!token){
            navigate('/')
            return
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        carregarTarefas()
       
    }, [token, navigate, carregarTarefas])


    return(
        <>
            <section>
                <h2>
                    Tarefas de hoje
                </h2>

                {tarefasDeHoje.length > 0 ? (
                    tarefasDeHoje.map((tarefa) => (
                        <TaskCard 
                            key={tarefa.id}
                            tarefa={tarefa}
                            concluir={finalizarTarefa}
                            remover={removerTarefa}
                        />
                    ))
                ) : (
                    <p>
                        Nenhuma tarefa para hoje
                    </p>
                )}
            </section>

            <button onClick={()=>setAddTarefa(true)}>
                Adicionar tarefa
            </button>

            {(addTarefa && (
                <TaskForm
                    criar={novaTarefa}
                    cancelar={()=>setAddTarefa(false)}
                />
            ))}
            

            <section>
                <h2>
                    Todas as tarefas
                </h2>

                {Object.entries(tarefasAgrupadas).map(([data, tarefasDoDia]) => (
                    <div key={data}>
                        <h2>
                            {new Date(data).toLocaleDateString("pt-BR")}
                        </h2>

                        {tarefasDoDia.map((tarefa) => (
                            <TaskCard
                                key={tarefa.id}
                                tarefa={tarefa}
                                concluir={finalizarTarefa}
                                remover={removerTarefa}
                            />
                        ))}
                    </div>
                ))}
            </section>
        </>
    )
}