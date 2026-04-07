import { useState, useCallback, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { listarTarefas, criarTarefa, deletarTarefa, concluirTarefa } from '../api/api'
import { formatarDataBR } from '../utils/date'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'


export default function DayPage(){
    const [tarefas, setTarefas] = useState([])
    const [addTarefa, setAddTarefa] = useState(false)
    const [erro, setErro] = useState('')
    const [loading, setLoading] = useState(true)

    const { data } = useParams() // pega parâmetros da requisição
    const navigate = useNavigate()
    const token = localStorage.getItem("token") || ""

    const carregarTarefas =  useCallback(async() => {
        try{
            setErro('')
            setLoading(true)

            const result = await listarTarefas(token, data, data)
            setTarefas(result)
        }catch(error){
            setErro(error.message)

            if(
              error.message === "Token inválido" ||
              error.message === "Token não fornecido"
            ) {
              localStorage.removeItem("token")
              navigate("/")
            }
        } finally{
          setLoading(false)
        }
    }, [token, navigate, data])

    async function novaTarefa(tarefa){
      try{
        setErro("")
        await criarTarefa(token, tarefa)
        setAddTarefa(false)
        await carregarTarefas()
      } catch(error){
        setErro(error.message)
      }
    }

    async function removerTarefa(id) {
      try{
        setErro('')
        await deletarTarefa(token, id);
        await carregarTarefas();
      } catch(error){
        setErro(error.message)
      }
    }

    async function finalizarTarefa(id) {
      try{
        setErro('')
        await concluirTarefa(token, id);
        await carregarTarefas();
      } catch(error){
        setErro(error.message)
      }
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
        return formatarDataBR(data)
    }, [data])

    return(
      <main>
        <button type="button" onClick={() => navigate("/calendario")}>
          Voltar para calendário
        </button>

        <h1>{dataFormatada}</h1>

        {erro && <p>{erro}</p>}

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
          {loading ? (
            <p>Carregando tarefas...</p>
          ) : tarefas.length > 0 ? (
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