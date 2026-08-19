import { getToken, removeToken, setToken } from "../utils/auth"
import { ApiError, getApiError, getNetworkError, isAuthError } from "./errors"

export const API_URL = import.meta.env.VITE_API_URL // URL para busca da API

// O usuário deve estar autenticado para todas as ações
// Essa função protege as rotas de fetch contra usuarios nao autenticados
export async function fetchAutenticado(url, options = {}){
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

    const apiError = await getApiError(response)

    // Se nao for problema de autenticacao, ja sai
    if(!isAuthError(apiError.code)){
        throw apiError
    }

    // Parte de refresh token
    // Tenta pegar um token novo e salvar
    // Tenta pegar token novo separado
    try{
        // Pega um novo refresh token
        const refreshData = await refreshToken()

        if (!refreshData.token){
            removeToken()
            throw new ApiError(
                'Sessão expirada. Faça login novamente.',
                "SESSION_EXPIRED",
                401
            )
        }

        setToken(refreshData.token)
    } catch(error){
        if (error.name === 'TypeError'){
            throw getNetworkError()
        }

        removeToken()
        throw new ApiError(
            'Sessão expirada. Faça login novamente.',
            "SESSION_EXPIRED",
            401
        )
    }
    try{
        // Tenta requisicao com esse novo token
        response = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${getToken()}`
            }
        })
    } catch(error){
        if (error.name === "TypeError"){
            throw getNetworkError()
        }
        throw error
    }

    if (!response.ok){
        throw await getApiError(response)
    }

    return response
}

// Tratamento fetch para buscar com problema no servidor para funções não de tarefas
export async function fetchComTratamento(url, options = {}){
    try{
        return await fetch(url, options)
    } catch(error){
        if (error.name === 'TypeError'){
            throw getNetworkError()
        }

        throw error
    }
}

// Garante que apenas uma requisição de refresh token aconteça por vez
let refreshPromise = null

async function requestRefreshToken(){
    const response = await fetchComTratamento(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
    })

    if(!response.ok){
        throw await getApiError(response)
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