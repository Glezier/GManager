import { API_URL, fetchAutenticado } from "./client";

export async function criarNota (nota) {
    const response = await fetchAutenticado(`${API_URL}/notas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nota)
    })
    return response.json()
}

export async function atualizarNota (id, nota) {
    const response = await fetchAutenticado(`${API_URL}/notas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nota)
    })
    return response.json()
}

export async function listarNotas () {
    const response = await fetchAutenticado(`${API_URL}/notas`)
    return response.json()
}

export async function buscarNotaPorId (id) {
    const response = await fetchAutenticado(`${API_URL}/notas/${id}`)
    return response.json()
}

export async function deletarNota (id) {
    const response = await fetchAutenticado(`${API_URL}/notas/${id}`, {
        method: 'DELETE'
    })
    return response.json()
}