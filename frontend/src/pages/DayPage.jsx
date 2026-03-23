import { useState, useCallback, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { listarTarefas, criarTarefa, deletarTarefa, concluirTarefa } from '../api/api'

import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'


export default function DayPage(){
    const [tarefas, setTarefas] = useState([])
    const [addTarefa, setAddTarefa] = useState(false)

    const { data } = useParams() // pega parâmetros da requisição
    const navigate = useNavigate()
    const token = localStorage.getItem("token") || ""

    const carregarTarefas =  useCallback(async() => {
        try{
            const result = await listarTarefas(token, data, data)
            setTarefas(result)
        }catch(error){
            console.error("Erro ao carregar tarefas" + error)
            navigate("/")
        }
    }, [token, navigate, data])

    async function novaTarefa(tarefa){
        await criarTarefa(token, tarefa)
        setAddTarefa(false)
        carregarTarefas()
    }

    async function removerTarefa(id) {
        await deletarTarefa(token, id);
        carregarTarefas();
    }

    async function finalizarTarefa(id) {
        await concluirTarefa(token, id);
        carregarTarefas();
    }

    useEffect(() => {
        if (!token){
            navigate("/")
            return
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        carregarTarefas()
    }, [token, navigate, carregarTarefas])

    const dataFormatada = useMemo(() => {
        return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR",{
            weekday: "long",
            day: "2-digit",
        });
    }, [data])

    return(
        <main>
            <button type="button" onClick={() => navigate("/calendario")}>
        Voltar para calendário
      </button>

      <h1>{dataFormatada}</h1>

      <button type="button" onClick={() => setAddTarefa(true)}>
        Nova tarefa
      </button>

      {addTarefa && (
        <div style={{ margin: "20px 0" }}>
          <TaskForm
            criar={novaTarefa}
            cancelar={() => setAddTarefa(false)}
            hoje={data}
          />
        </div>
      )}

      <section style={{ display: "grid", gap: "12px", marginTop: "20px" }}>
        {tarefas.length > 0 ? (
          tarefas.map((tarefa) => (
            <TaskCard
              key={tarefa.id}
              tarefa={tarefa}
              concluir={finalizarTarefa}
              remover={removerTarefa}
            />
          ))
        ) : (
          <p>Nenhuma tarefa para este dia.</p>
        )}
      </section>
        </main>
    )
}