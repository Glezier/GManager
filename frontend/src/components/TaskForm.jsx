import { useState } from 'react'
import './TaskForm.css'

export default function TaskForm ({ criar, cancelar, hoje, erro='' }){

    const [titulo, setTitulo ] = useState("")
    const [descricao, setDescricao ] = useState("") 
    const [data, setData] = useState(hoje)
    const [hora, setHora] = useState("")

    function handleSubmit(e){
        e.preventDefault() // React controlar a execução do formulário

        criar({
            titulo,
            descricao, 
            data,
            hora
        })

        setTitulo("")
        setDescricao("")
        setData(hoje)
        setHora("")
    }

    return(
    <form className="task-form" onSubmit={handleSubmit}>
        <div className="task-form-head">
            <h3>Nova tarefa</h3>
            <p>Preencha os dados para adicionar uma nova atividade.</p>
        </div>

        {erro && <p className='error'>{erro}</p>}

        <div className="task-form-fields">
            <input 
                className="task-form-input"
                type="text"
                placeholder="Título da tarefa"
                value={titulo}
                onChange={(e)=>{setTitulo(e.target.value)}} 
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
            </div>
        </div>

        <div className="task-form-actions">
            <button className="task-form-save" type="submit">
                Salvar tarefa
            </button>

            <button
                className="task-form-cancel"
                type="button"
                onClick={cancelar}
            >
                Cancelar
            </button>
        </div>
    </form>
)
}