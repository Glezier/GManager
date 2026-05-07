import { useState, useRef, useEffect } from 'react'
import './TaskForm.css'  
import { formatarData, formatarHora, getDataLimiteAnos, getDataMinimaAnos } from '../utils/date'

export default function TaskForm ({ criar, cancelar, hoje, erro='', tarefaInicial = null }){

    const [titulo, setTitulo ] = useState(tarefaInicial?.titulo || "")
    const [descricao, setDescricao ] = useState(tarefaInicial?.descricao || "") 
    const [data, setData] = useState(formatarData(tarefaInicial?.data) || hoje)
    const [hora, setHora] = useState(formatarHora(tarefaInicial?.hora) || "")
    const [status, setStatus] = useState(tarefaInicial?.status || 'pendente')
    const [erroForm, setErroForm] = useState('')
    const tituloRef = useRef(null)
    const emEdicao = Boolean(tarefaInicial)

    const dataMinima = getDataMinimaAnos(1) // Adicionar/editar tarefa no máximo 1 ano antes
    const dataMaxima = getDataLimiteAnos(3) // Adicionar/editar tarefa no máximo 3 anos a frente

    function handleSubmit(e){
        e.preventDefault() // React controlar a execução do formulário

        criar({
            titulo,
            descricao, 
            data,
            hora,
            status
        })

        if(!emEdicao){
            setTitulo("")
            setDescricao("")
            setData(hoje)
            setHora("")
        }
    }

    useEffect(()=>{
        if (tituloRef.current){
            tituloRef.current.focus()
        }
    }, [tarefaInicial])

    return(
        <form className="task-form" onSubmit={handleSubmit}>
            <div className="task-form-head">
                <h3>{emEdicao ? "Editar tarefa": "Nova tarefa"}</h3>
                <p>{emEdicao 
                    ? "Revise os dados abaixo e salve as alterações."
                    : "Preencha os dados para adicionar uma nova atividade."}
                </p>
            </div>

            {(erro || erroForm) && <p className='error'>{erro || erroForm}</p>}

            <div className="task-form-fields">
                <div className="task-title-wrap">
                    <input 
                        className="task-form-input"
                        type="text"
                        placeholder="Título da tarefa"
                        value={titulo}
                        onChange={(e)=>{setTitulo(e.target.value)}} 
                        onInvalid={() => setErroForm('Título é obrigatório')}
                        ref={tituloRef}
                        maxLength={60}
                        required
                    />
                    <p className='task-title-counter'>{titulo.length} / 60</p>

                </div>

                <input 
                    className="task-form-input"
                    type="text"
                    placeholder="Descrição da tarefa" 
                    value={descricao}
                    maxLength={120}
                    onChange={(e)=>{setDescricao(e.target.value)}}
                />

                <div className="task-form-row">
                    <input 
                        className="task-form-input"
                        type="date"
                        value={data}
                        onChange={(e)=>{setData(e.target.value)}}
                        onInvalid={(e) => {
                            const valor = e.target.value
                            if (valor<dataMinima){
                                setErroForm('Só é permitido adicionar tarefa retroativas num período de até 1 ano.')
                            }
                            if (valor>dataMaxima){
                                setErroForm('Use a aba de tarefas sem data definida para datas distantes.')
                            }
                        }}
                        min={dataMinima}
                        max={dataMaxima}
                        required
                    />

                    <input 
                        className="task-form-input"
                        type="time" 
                        value={hora}
                        onChange={(e)=>{setHora(e.target.value)}}
                    />

                    {emEdicao && (
                        <div className='task-form-status-group'>
                            <label htmlFor="task-status" className='task-form-status-label'>
                                Status
                            </label>

                            <select
                                id='task-status'
                                className='task-form-input'
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="pendente">Pendente</option>
                                <option value="concluida">Concluida</option>
                            </select>

                        </div>
                    )}
                </div>
            </div>

            <div className="task-form-actions">
                <button className="task-form-save" type="submit">
                    {emEdicao ? "Salvar alterações": "Salvar tarefa"}
                </button>

                <button
                    className="task-form-cancel"
                    type="button"
                    onClick={cancelar}
                >
                    {emEdicao ? "Descartar edição" : "Cancelar"}
                </button>
            </div>
        </form>
    )
}
