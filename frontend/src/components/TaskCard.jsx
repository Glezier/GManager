export default function TaskCard({tarefa, concluir, remover}){
    return(
        <>
            <h3>{tarefa.titulo}</h3>
            <p>{tarefa.descricao}</p>
            <span>{tarefa.status}</span> 
            <p>{tarefa.data_tarefa}</p>
            {tarefa.hora_tarefa && (
                <p>{tarefa.hora_tarefa.split("T")[0]}</p>
            )}

            {tarefa.status === "pendente" && (
                <button onClick={() => concluir(tarefa.id)}>
                    Concluir
                </button>
            )}

            <button onClick={()=>remover(tarefa.id)}>
                Deletar tarefa
            </button>
        </>
    )
}