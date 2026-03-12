export default function TaskCard({tarefa, concluir, remover}){
    const dataFormatada = new Date(tarefa.data).toLocaleDateString("pt-BR")

    return(
        <>
            <h3>{tarefa.titulo}</h3>
            <p>{tarefa.descricao}</p>
            <span>{tarefa.status}</span> 
            <p>{dataFormatada}</p>
            <p>{tarefa.hora}</p>

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