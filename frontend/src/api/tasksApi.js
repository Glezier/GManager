import { API_URL, fetchAutenticado } from "./client"

// Criar tarefa
export async function criarTarefa(tarefa){
    const response = await fetchAutenticado(`${API_URL}/tarefas`,{
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(tarefa)
    })

    return response.json()
}

// Listar tarefas
export async function listarTarefas( inicio, fim){
    const response = await fetchAutenticado(`${API_URL}/tarefas?inicio=${inicio}&fim=${fim}`)

    return response.json()
}

// Atualizar tarefa
export async function atualizarTarefa(id, tarefa){
    const response = await fetchAutenticado(`${API_URL}/tarefas/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(tarefa)
    })

    return response.json()
}

// Concluir tarefa
export async function concluirTarefa(id){
    const response = await fetchAutenticado(`${API_URL}/tarefas/${id}/concluir`,{
        method: "PATCH"
    })
        
    return response.json()
}

// Deletar tarefa
export async function deletarTarefa(id){
    const response = await fetchAutenticado(`${API_URL}/tarefas/${id}`,{
        method : 'DELETE'
    })

    return response.json()
}