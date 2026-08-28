import { API_URL, fetchAutenticado } from './client'

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