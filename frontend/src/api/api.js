import { getToken, removeToken, setToken } from "../utils/auth"

const API_URL = import.meta.env.VITE_API_URL // URL para busca da API

// Verificação e erro de autenticação
export function isAuthError(message){
    return(
        message === 'Token inválido' ||
        message === 'Token não fornecido' ||
        // Mensagens que vem do arquivo verify da pasta jsonwebtoken
        message === 'jwt expired' || 
        message === 'invalid token'
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

// O usuário deve estar autenticado para todas as ações
// Essa função protege as rotas de fetch contra usuarios nao autenticados
async function fetchAutenticado(url, options = {}){
    const token = getToken()

    // Tenta fetch com token atual
    let response = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`
        }
    })

    if (response.ok){
        return response
    }

    const errorMessage = await getError(response)

    // Se der problema de autenticação, já sai
    if(!isAuthError(errorMessage)){
        throw new Error(errorMessage)
    }

    try{
        // Pega um novo refresh token
        const refreshData = await refreshToken()

        if (!refreshData.token){
            removeToken()
            throw new Error('Sessão expirada. Faça login novamente.')
        }

        setToken(refreshData.token)

        // Tenta requisição com esse novo token
        response = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${refreshData.token}`
            }
        })

        if (!response.ok){
            throw new Error(await getError(response))
        }

        return response
    } catch{
        removeToken()
        throw new Error('Sessão expirada. Faça login novamente.')
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

// Verificar Email
export async function verificarEmail(token){
    const response = await fetch(`${API_URL}/auth/verificar-email?token=${token}`)

    if(!response.ok){
        throw new Error(await getError(response))
    }

    return response.json()
}

// Reenviar email
export async function reenviarVerificacao(email){
    const response = await fetch(`${API_URL}/auth/reenviar-verificacao`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })

    if(!response.ok){
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
        credentials: 'include',
        body: JSON.stringify({ email,senha })
    })

    if(!response.ok){
        throw new Error(await getError(response))
    }

    return response.json()
}

// Refresh token
export async function refreshToken(){
    const response = await fetch(`${API_URL}/auth/refresh`,{
        method: 'POST',
        credentials: 'include'
    })

    if(!response.ok){
        throw new Error(await getError(response))
    }

    return response.json()
}

// Logout
export async function logout(){
    const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    })

    if(!response.ok){
        throw new Error(await getError(response))
    }

    return response.json()
}

// Criar tarefa
export async function criarTarefa(token, tarefa){
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
export async function listarTarefas(token, inicio, fim){
    const response = await fetchAutenticado(`${API_URL}/tarefas?inicio=${inicio}&fim=${fim}`)

    return response.json()
}

// Atualizar tarefa
export async function atualizarTarefa(token, id, tarefa){
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
export async function concluirTarefa(token, id){
    const response = await fetchAutenticado(`${API_URL}/tarefas/${id}/concluir`,{
        method: "PATCH"
    })
        
    return response.json()
}

// Deletar tarefa
export async function deletarTarefa(token, id){
    const response = await fetchAutenticado(`${API_URL}/tarefas/${id}`,{
        method : 'DELETE'
    })

    return response.json()
}