import { API_URL, fetchAutenticado, fetchComTratamento } from './client'
import { getApiError } from './errors'

// Informações do usuário
export async function infosUser(){
    const response = await fetchAutenticado(`${API_URL}/profile/me`)

    return response.json()
}

// Atualizar perfil
export async function atualizarNome(dados){
    const response = await fetchAutenticado(`${API_URL}/profile/nome`, {
        method: "PATCH",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(dados)
    })

    return response.json()
}

// Atualizar email
export async function atualizarEmail(dados){
    const response = await fetchAutenticado(`${API_URL}/profile/email`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })

    return response.json()
}

// Atualizar senha
export async function atualizarSenha(dados){
    const response = await fetchAutenticado(`${API_URL}/profile/senha`,{
        method: "PATCH",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(dados)
    })

    return response.json()
}

// Atualizar preferencias
export async function atualizarTema(dados){
    const response = await fetchAutenticado(`${API_URL}/profile/tema`, {
        method: "PATCH",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(dados)
    })

    return response.json()
}

// Excluir conta
export async function solicitarExclusaoConta() {
    const response = await fetchAutenticado(`${API_URL}/profile/exclusao/solicitar`, {
        method: 'POST'
    }
    )

    return response.json()
}

export async function confirmarExclusaoConta(token) {
    const response = await fetchComTratamento(`${API_URL}/profile/exclusao/confirmar`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    })

    if (!response.ok) {
        throw await getApiError(response)
    }

    return response.json()
}