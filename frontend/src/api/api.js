const API_URL = "http://localhost:3000"

export async function login(email,senha){
    const response = await fetch(`${API_URL}/auth/login`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email,senha })
    })
    return response.json()
}

export async function registrar(nome, email, senha){
    const response = await fetch(`${API_URL}/auth/register`,{
        method : "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({ nome, email, senha })
    })
    return response.json()
}

export async function criarTarefa(token, tarefa){
    const response = await fetch(`${API_URL}/tarefas`,{
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(tarefa)
    })

    return response.json()
}

export async function listarTarefas(token){
    const response = await fetch(`${API_URL}/tarefas`,{
        headers : {
            Authorization: `Bearer ${token}`
        }
    })

    return response.json()
}