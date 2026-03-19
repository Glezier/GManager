import { useState } from 'react'

export default function TaskForm ({ criar, cancelar, hoje }){

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
        setData("")
        setHora("")
    }

    return(
        <form onSubmit={handleSubmit}>
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

            <input 
                type="date"
                placeholder="Data da tarefa" 
                value={data}
                onChange={(e)=>{setData(e.target.value)}}
                required
            />

            <input 
                type="time" 
                placeholder="Hora da tarefa"
                value={hora}
                onChange={(e)=>{setHora(e.target.value)}}
            />

            <button type="submit">
                Salvar tarefa
            </button>

            <button
                type="button"
                onClick={cancelar}>
                    Cancelar
            </button>
        </form>
    )
}