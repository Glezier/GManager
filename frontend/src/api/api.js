const API_URL = import.meta.env.VITE_API_URL

export async function login(email,senha){
    const response = await fetch(`${API_URL}/auth/login`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email,senha })
    })
    if(!response.ok){
        throw new Error("Erro na requisição")
    }

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

    if(!response.ok){
        throw new Error("Erro na requisição")
    }
    
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

    if(!response.ok){
        throw new Error("Erro na requisição")
    }

    return response.json()
}

export async function listarTarefas(token, inicio, fim){
    const response = await fetch(`${API_URL}/tarefas?inicio=${inicio}&fim=${fim}`,{
        headers : {
            Authorization: `Bearer ${token}`
        }
    })

    if(!response.ok){
        throw new Error("Erro na requisição")
    }

    return response.json()
}

export async function deletarTarefa(token, id){
    const response = await fetch(`${API_URL}/tarefas/${id}`,{
        method : 'DELETE',
        headers :{
            Authorization: `Bearer ${token}`
        }
    })

    if(!response.ok){
        throw new Error("Erro na requisição")
    }

    return response.json()
}

export async function concluirTarefa(token, id){
    const response = await fetch(`${API_URL}/tarefas/${id}/concluir`,{
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            status: "concluida"
        })
        
    })

    if(!response.ok){
        throw new Error("Erro na requisição")
    }
    
    return response.json()
}