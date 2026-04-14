import { Navigate } from "react-router-dom"
import { hasToken } from "../utils/auth"

export default function PrivateRoute({ children }){
    if (!hasToken()){
        return <Navigate to="/" replace/>
    }

    // children é o elemento colocado dentro de um componente
    return children 
}