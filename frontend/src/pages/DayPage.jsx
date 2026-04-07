import { useState, useCallback, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { listarTarefas, criarTarefa, deletarTarefa, concluirTarefa } from '../api/api'
import { formatarDataBR } from '../utils/date'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import './DayPage.css'


export default function DayPage(){
    const [tarefas, setTarefas] = useState([])
    const [addTarefa, setAddTarefa] = useState(false)
    const [erroPagina, setErroPagina] = useState('')
    const [erroForm, setErroForm] = useState('')
    const [loading, setLoading] = useState(true)
    const [sucesso, setSucesso] = useState('')

    const { data } = useParams() // pega parâmetros da requisição
    const navigate = useNavigate()
    const token = localStorage.getItem("token") || ""

    const carregarTarefas =  useCallback(async() => {
        try{
            setErroPagina('')
            setLoading(true)

            const result = await listarTarefas(token, data, data)
            setTarefas(result)
        }catch(error){
            setErroPagina(error.message)

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
        setErroForm("")
        setSucesso('')
        await criarTarefa(token, tarefa)
        setAddTarefa(false)
        await carregarTarefas()
        setSucesso("Tarefa criada com sucesso")
      } catch(error){
        setErroForm(error.message)
      }
    }

    async function removerTarefa(id) {
      try{
        setErroPagina('')
        setSucesso('')
        await deletarTarefa(token, id);
        await carregarTarefas();
        setSucesso('Tarefa removida com sucesso')
      } catch(error){
        setErroPagina(error.message)
      }
    }

    async function finalizarTarefa(id) {
      try{
        setErroPagina('')
        setSucesso('')
        await concluirTarefa(token, id);
        await carregarTarefas();
        setSucesso('Tarefa concluída com sucesso')
      } catch(error){
        setErroPagina(error.message)
      }
    }

    useEffect(() => {
        if (!token){
            navigate("/")
            return
        }

        carregarTarefas()
    }, [token, navigate, carregarTarefas])

    // Controle do tempo de exibição das mensagens de sucesso de ações do usuário
    useEffect(()=>{
        if (sucesso){
            const timer = setTimeout(() => {
                setSucesso('')
            }, 2500)

            return () => clearTimeout(timer)
        }
        return
    }, [sucesso])

    const dataFormatada = useMemo(() => {
        return formatarDataBR(data)
    }, [data])

    return(
      <main className='day-page'>
        <button type="button" onClick={() => navigate("/calendario")}>
          Voltar para calendário
        </button>

        <h1>{dataFormatada}</h1>

        {erroPagina && <p className="day-feedback day-feedback-error">{erroPagina}</p>}
        {sucesso && <p className="day-feedback day-feedback-success">{sucesso}</p>}

        <button type="button" onClick={() => {
            setAddTarefa(true)
            setErroForm('')
          }}>
          Nova tarefa
        </button>

        {addTarefa && (
          <div style={{ margin: "20px 0" }}>
            <TaskForm
              criar={novaTarefa}
              cancelar={() => setAddTarefa(false)}
              hoje={data}
              erro={erroForm}
            />
          </div>
        )}

        <section className='day-list'>
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
