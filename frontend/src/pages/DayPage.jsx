import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import useTasks from '../hooks/useTasks'
import useProgress from '../hooks/useProgress'

import { formatarDataBR, getData } from '../utils/date'
import { getToken } from '../utils/auth'
import { ordenarTarefas } from '../utils/taskOrder'

import TaskForm from '../components/TaskForm'
import DayTasksPanel from '../components/DayTasksPanel'
import ConfirmBox from '../components/ConfirmBox'
import './DayPage.css'
import AddIcon from '../assets/icons/add.png'
import Next from '../assets/icons/next.png'
import Preview from '../assets/icons/preview.png'


export default function DayPage(){
  const { data } = useParams() // pega parâmetros da requisição
  const navigate = useNavigate()
  const token = getToken()
  
  const {
      tarefas,
      loading,
      erroPagina,
      erroForm,
      sucesso,
      addTarefa,
      salvarTarefa,
      editando,
      confirmacao,
      solicitarRemocao,
      confirmarRemocao,
      fecharConfirmacao,
      finalizarTarefa,
      abrirCriacao,
      abrirEdicao,
      fecharModal
  }  = useTasks({
    token,
    inicio: data,
    fim: data,
    navigate
  })

  const {
    quantidadeConcluidas,
    progresso,
  } = useProgress(tarefas)

  const dataFormatada = useMemo(() => {
      return formatarDataBR(data)
  }, [data])

  const tarefasOrdenadas = useMemo(() => {
    return ordenarTarefas(tarefas)
  }, [tarefas])
    
  function navegarDia(indice){
    const novaData = new Date(`${data}T00:00:00`)
    novaData.setDate(novaData.getDate() + indice)
    navigate(`/dia/${getData(novaData)}`, {replace: true}) // Voltar do navegador não empilha coisas, troca a rota atual
  }

  return(
    <main className='day-page'>
      <section className='day-hero'>
        <div className='day-topbar'>
          <button 
            type="button" 
            className='day-back' 
            onClick={() => navigate("/calendario")}
          >
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

        <div className="day-hero-content">
          <p className="day-hero-label">Planejamento diário</p>
          <h1 className="day-hero-title">{dataFormatada}</h1>
          <p className="day-hero-text">
            Organize as tarefas deste dia, acompanhe seu progresso e ajuste o que
            for preciso com rapidez.
          </p>
        </div>
      </section>

      {addTarefa && (
        <div className='task-modal-overlay' onClick={fecharModal}> 
          <div className='task-modal' onClick={(e) => e.stopPropagation()}> {/* Impedir que o clique suba para o elemento pai */}
            <TaskForm
              key={editando ? `editar-${editando.id}` : `criar-${data}`}
              criar={salvarTarefa}
              cancelar={fecharModal}
              hoje={data}
              erro={erroForm}
              tarefaInicial={editando}
            />
          </div>
        </div>
      )}

      <ConfirmBox 
        open={confirmacao.open}
        title={confirmacao.title}
        message={confirmacao.message}
        confirmLabel={confirmacao.confirmLabel}
        cancelLabel={confirmacao.cancelLabel}
        variant={confirmacao.variant}
        loading={confirmacao.loading}
        onConfirm={confirmarRemocao}
        onCancel={fecharConfirmacao}
      />

      <DayTasksPanel
        subtitulo="Agenda do dia"
        titulo="Tarefas"
        erro={erroPagina}
        sucesso={sucesso}
        loading={loading}
        tarefas={tarefasOrdenadas}
        tarefasConcluidas={quantidadeConcluidas}
        progresso={progresso}
        onConcluir={finalizarTarefa}
        onRemover={solicitarRemocao}
        onEditar={abrirEdicao}
        botaoAcao={
          <button
            type="button"
            className="dashboard-add-task"
            onClick={abrirCriacao}
        >
            <img src={AddIcon} alt="Adicionar tarefas" className="day-icons"/>
            Nova tarefa
        </button>
        }
        emptyMessage="Nenhuma tarefa para este dia. Adicione a primeira para iniciar seu planejamento."
      />
    </main>
  )
}
