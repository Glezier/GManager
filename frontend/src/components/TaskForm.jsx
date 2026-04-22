import { useState, useRef, useEffect } from 'react'
import './TaskForm.css'  
import { formatarData, formatarHora } from '../utils/date'

export default function TaskForm ({ criar, cancelar, hoje, erro='', tarefaInicial = null }){

    const [titulo, setTitulo ] = useState(tarefaInicial?.titulo || "")
    const [descricao, setDescricao ] = useState(tarefaInicial?.descricao || "") 
    const [data, setData] = useState(formatarData(tarefaInicial?.data) || hoje)
    const [hora, setHora] = useState(formatarHora(tarefaInicial?.hora) || "")
    const [status, setStatus] = useState(tarefaInicial?.status || 'pendente')
    const tituloRef = useRef(null)
    const emEdicao = Boolean(tarefaInicial)

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

            {erro && <p className='error'>{erro}</p>}

            <div className="task-form-fields">
                <input 
                    className="task-form-input"
                    type="text"
                    placeholder="Título da tarefa"
                    value={titulo}
                    onChange={(e)=>{setTitulo(e.target.value)}} 
                    ref={tituloRef}
                />

                <input 
                    className="task-form-input"
                    type="text"
                    placeholder="Descrição da tarefa" 
                    value={descricao}
                    onChange={(e)=>{setDescricao(e.target.value)}}
                />

                <div className="task-form-row">
                    <input 
                        className="task-form-input"
                        type="date"
                        value={data}
                        onChange={(e)=>{setData(e.target.value)}}
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