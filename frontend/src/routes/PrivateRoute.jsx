import { Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { hasToken, removeToken, setToken } from "../utils/auth"
import { refreshToken } from "../api/client"
import ThemeSync from "../components/ThemeSync"
import LoadingState from "../components/ui/LoadingState"

export default function PrivateRoute({ children }){
    const [status, setStatus] = useState('checking')

    useEffect(() => {
        async function tentarRefresh(){
            const tinhaToken = hasToken()

            try{
                const data = await refreshToken()

                if (data.token){
                    setToken(data.token)
                    setStatus('authenticated')
                    return
                }

                if (tinhaToken){
                    setStatus('authenticated')
                    return
                }

                removeToken()
                setStatus('unauthenticated')
            } catch{
                if (tinhaToken){
                    setStatus('authenticated')
                    return
                }

                removeToken()
                setStatus('unauthenticated')
            }
        }

        tentarRefresh()
    }, [])
    
    if (status === 'checking'){
        return (
            <LoadingState
                variant="page"
                message="Carregando sessão..."
                detail="Preparando sua rotina."
            />
        )
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
