import { Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { hasToken, removeToken, setToken } from "../utils/auth"
import { refreshToken } from "../api/api"
import ThemeSync from "../components/ThemeSync"

export default function PrivateRoute({ children }){
    const [status, setStatus] = useState(hasToken() ? 'authenticated' : 'checking')

    useEffect(() => {
        async function tentarRefresh(){
            if(hasToken()){
                setStatus('authenticated')
                return
            }

            try{
                // Pega novo token
                const data = await refreshToken()
                
                // Se token válido
                if (data.token){
                    setToken(data.token)
                    setStatus('authenticated')
                    return
                }

                // Token não válido
                removeToken()
                setStatus('unauthenticated')

            } catch{
                removeToken()
                setStatus('unauthenticated')
            }
        }

        tentarRefresh()
    }, [])
    
    if (status === 'checking'){
        return <p>Carregando sessão...</p>
    }

    if (status === 'unauthenticated'){
        return <Navigate to='/' replace />
    }

    // children é o elemento colocado dentro de um componente
    return (
        <ThemeSync>
            {children}
        </ThemeSync> 
    )
}