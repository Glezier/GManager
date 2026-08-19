import { API_URL, fetchComTratamento } from "./client"
import { getApiError } from "./errors"

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
        throw await getApiError(response)
    }
    
    return response.json()
}

// Login com Google
export async function loginGoogle(credential){
    const response = await fetchComTratamento(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ credential })
    })

    if (!response.ok){
        throw await getApiError(response)
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
        throw await getApiError(response)
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
        throw await getApiError(response)
    }

    return response.json()
}

// Verificar Email
export async function verificarEmail(token){
    const response = await fetchComTratamento(`${API_URL}/auth/verificar-email?token=${token}`)

    if(!response.ok){
        throw await getApiError(response)
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
        throw await getApiError(response)
    }

    return response.json()
}

// Solicitar recuperação de senha
export async function solicitarRecuperacaoSenha(email){
    const response = await fetchComTratamento(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })

    if (!response.ok){
        throw await getApiError(response)
    }

    return response.json()
}

// Redefinir senha
export async function redefinirSenha(dados){
    const response = await fetchComTratamento(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(dados)
    })

    if (!response.ok){
        throw await getApiError(response)
    }

    return response.json()
}