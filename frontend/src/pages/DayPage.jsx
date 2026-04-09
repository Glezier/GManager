import { useState, useCallback, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { listarTarefas, criarTarefa, deletarTarefa, concluirTarefa } from '../api/api'
import { formatarDataBR, getData } from '../utils/date'
import TaskForm from '../components/TaskForm'
import DayTasksPanel from '../components/DayTasksPanel'
import './DayPage.css'
import AddIcon from '../assets/icons/add.png'
import Next from '../assets/icons/next.png'
import Preview from '../assets/icons/preview.png'


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

    const tarefasConcluidasDia = useMemo(() => {
        return tarefas.filter((tarefa) => tarefa.status === "concluida")
    }, [tarefas])

    const progressoDia = tarefasConcluidasDia.length / tarefas.length * 100 || 0 

    function navegarDia(indice){
      const novaData = new Date(`${data}T00:00:00`)
      novaData.setDate(novaData.getDate() + indice)
      navigate(`/dia/${getData(novaData)}`, {replace: true}) // Voltar do navegador não empilha coisas, troca a rota atual
    }

    // Bloqueio do scroll ao adicionar tarefa
    useEffect(() => {
        if (addTarefa) {
          document.body.style.overflow = 'hidden'
        } else {
          document.body.style.overflow = ''
        }

        return () => {
          document.body.style.overflow = ''
        }
    }, [addTarefa])

    return(
      <main className='day-page'>

        <div className='day-topbar'>
          <button type="button" className='day-back' onClick={() => navigate("/calendario")}>
            Voltar para Calendário
          </button>

          <div className='day-nav'>
            <button type='button' onClick={() => navegarDia(-1)}>
              <img src={Preview} alt="Retroceder um dia" className='icons' />
              Dia anterior
            </button>
            <button type='button' onClick={() => navegarDia(1)}>
              Próximo dia
              <img src={Next} alt="Avançar um dia" className='icons' />
            </button>
          </div>

        </div>

        {addTarefa && (
          <div className='task-modal-overlay' onClick={()=>{
            setErroForm('')
            setAddTarefa(false)
          }}> 
            <div className='task-modal' onClick={(e) => e.stopPropagation()}> {/* Impedir que o clique suba para o elemento pai */}
              <TaskForm
                criar={novaTarefa}
                cancelar={() => {
                  setAddTarefa(false)
                  setErroForm('')
                }}
                hoje={data}
                erro={erroForm}
              />
            </div>
          </div>
        )}

        <DayTasksPanel
          titulo={dataFormatada}
          erro={erroPagina}
          sucesso={sucesso}
          loading={loading}
          tarefas={tarefas}
          tarefasConcluidas={tarefasConcluidasDia.length}
          progresso={progressoDia}
          onConcluir={finalizarTarefa}
          onRemover={removerTarefa}
          botaoAcao={
            <button
              type="button"
              className="dashboard-add-task"
              onClick={() => {
                  setErroForm("")
                  setAddTarefa(true)
              }}
          >
              <img src={AddIcon} alt="Adicionar tarefas" className="day-icons"/>
              Nova tarefa
          </button>
          }
          emptyMessage="Nenhuma tarefa para este dia."
        />
      </main>
    )
}
