import { useEffect } from "react"
import { useMe } from "../hooks/useMe"
import { getTemaSalvo, salvarTemaLocal, temaValido } from "../utils/theme"

export default function ThemeSync({ children }){
    const { data: usuario } = useMe()

    useEffect(() => {
        if (!temaValido(usuario?.tema)) {
            return
        }

        if(usuario.tema !== getTemaSalvo()){
            salvarTemaLocal(usuario.tema)
        }
    }, [usuario?.tema])

    return children
}