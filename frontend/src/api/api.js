const API_URL = import.meta.env.VITE_API_URL // URL para busca da API

// Verificação e erro de autenticação
export function isAuthError(message){
    return(
        message === 'Token inválido' ||
        message === 'Token não fornecido'
    )
}

// Retornar a mensagem de erro apropriada da requisição
async function getError(response){
    try{
        const data = await response.json()
        return data?.error?.message || "Erro na requisição"
    } catch{
        return "Erro na requisição"
    }
}

// Registrar
export async function registrar(nome, email, senha){
    const response = await fetch(`${API_URL}/auth/register`,{
        method : "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({ nome, email, senha })
    })
    
    if (!response.ok) {
        throw new Error(await getError(response))
    }
    
    return response.json()
}

// Login
export async function login(email,senha){
    const response = await fetch(`${API_URL}/auth/login`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email,senha })
    })

    if(!response.ok){
        throw new Error(await getError(response))
    }

    return response.json()
}

// Criar tarefa
export async function criarTarefa(token, tarefa){
    const response = await fetch(`${API_URL}/tarefas`,{
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(tarefa)
    })

    if(!response.ok){
        throw new Error(await getError(response))
    }

    return response.json()
}

// Listar tarefas
export async function listarTarefas(token, inicio, fim){
    const response = await fetch(`${API_URL}/tarefas?inicio=${inicio}&fim=${fim}`,{
        headers : {
            Authorization: `Bearer ${token}`
        }
    })

    if(!response.ok){
        throw new Error(await getError(response))
    }

    return response.json()
}

// Atualizar tarefa
export async function atualizarTarefa(token, id, tarefa){
    const response = await fetch (`${API_URL}/tarefas/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(tarefa)
    })

    if (!response.ok){
        throw new Error(await getError(response))
    }

    return response.json()
}

// Concluir tarefa
export async function concluirTarefa(token, id){
    const response = await fetch(`${API_URL}/tarefas/${id}/concluir`,{
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
    
    if(!response.ok){
        throw new Error(await getError(response))
    }
    
    return response.json()
}

// Deletar tarefa
export async function deletarTarefa(token, id){
    const response = await fetch(`${API_URL}/tarefas/${id}`,{
        method : 'DELETE',
        headers :{
            Authorization: `Bearer ${token}`
        }
    })

    if(!response.ok){
        throw new Error(await getError(response))
    }

    return response.json()
}