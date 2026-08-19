// Classe para erros de API
export class ApiError extends Error {
    constructor(message, code = "UNKNOWN_ERROR", status = null){
        super(message)
        this.name = "ApiError"
        this.code = code
        this.status = status
    }
}

// Verificação e erro de autenticação
export function isAuthError(code){
    return(
        code === 'TOKEN_INVALID' ||
        code === 'TOKEN_MISSING' ||
        code === 'TOKEN_EXPIRED'
    )
}

// Retornar a mensagem de erro apropriada da requisição
export async function getApiError(response){
    try{
        const data = await response.json()
        return new ApiError(
            data?.error?.message || "Erro na requisição",
            data?.error?.code || "REQUEST_ERROR",
            response.status
        )
    } catch{
        return new ApiError(
            "Erro na requisição",
            "REQUEST_ERROR",
            response.status
        )
    }
}

// Falha em conexão com servidor
export function getNetworkError(){
    return new ApiError(
        'Não foi possível conectar ao servidor.',
        "NETWORK_ERROR"
    
    )
}