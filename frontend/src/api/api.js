import { getToken, removeToken, setToken } from "../utils/auth"

const API_URL = import.meta.env.VITE_API_URL // URL para busca da API

// Verificação e erro de autenticação
export function isAuthError(message){
    return(
        message === 'Token inválido' ||
        message === 'Token não fornecido' ||
        message === 'Token expirado' ||
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

// Falha em conexão com servidor
function getNetworkError(){
    return new Error('Não foi possível conectar ao servidor.')
}

// Garante que apenas uma requisição de refresh token aconteça por vez
let refreshPromise = null

async function requestRefreshToken(){
    const response = await fetchComTratamento(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
    })

    if(!response.ok){
        throw new Error(await getError(response))
    }

    return response.json()
}

export async function refreshToken(){
    if(!refreshPromise){
        refreshPromise = requestRefreshToken().finally(() => {
            refreshPromise = null
        })
    }

    return refreshPromise
}

// O usuário deve estar autenticado para todas as ações
// Essa função protege as rotas de fetch contra usuarios nao autenticados
async function fetchAutenticado(url, options = {}){
    const token = getToken()

    let response

    try {
        response = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`
            }
        })
    } catch(error) {
        if (error.name === 'TypeError'){
            throw getNetworkError()
        }

        throw error
    }

    if (response.ok){
        return response
    }

    const errorMessage = await getError(response)

    // Se nao for problema de autenticacao, ja sai
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

        // Tenta requisicao com esse novo token
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
    } catch(error){
        if (error.name === 'TypeError'){
            throw getNetworkError()
        }

        removeToken()
        throw new Error('Sessão expirada. Faça login novamente.')
    }
}

// Tratamento fetch para buscar com problema no servidor para funções não de tarefas
async function fetchComTratamento(url, options = {}){
    try{
        return await fetch(url, options)
    } catch(error){
        if (error.name === 'TypeError'){
            throw getNetworkError()
        }

        throw error
    }
}

// Infosmações do usuário
export async function infosUser(){
    const response = await fetchAutenticado(`${API_URL}/auth/me`)

    return response.json()
}

// Atualizar perfil
export async function atualizarPerfil(dados){
    const response = await fetchAutenticado(`${API_URL}/auth/me`, {
        method: "PATCH",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(dados)
    })

    return response.json()
}

// Atualizar senha
export async function atualizarSenha(dados){
    const response = await fetchAutenticado(`${API_URL}/auth/me/senha`,{
        method: "PATCH",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(dados)
    })

    return response.json()
}

// Registrar
export async function registrar(nome, email, senha){
    const response = await fetchComTratamento(`${API_URL}/auth/register`,{
        method : "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({ nome, email, senha })
    })

    if(!response.ok){
        throw new Error(await getError(response))
    }
    
    return response.json()
}

// Verificar Email
export async function verificarEmail(token){
    const response = await fetchComTratamento(`${API_URL}/auth/verificar-email?token=${token}`)

    if(!response.ok){
        throw new Error(await getError(response))
    }

    return response.json()
}

// Reenviar email
export async function reenviarVerificacao(email){
    const response = await fetchComTratamento(`${API_URL}/auth/reenviar-verificacao`,{
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
    const response = await fetchComTratamento(`${API_URL}/auth/login`,{
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

// Logout
export async function logout(){
    const response = await fetchComTratamento(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    })

    if(!response.ok){
        throw new Error(await getError(response))
    }

    return response.json()
}

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