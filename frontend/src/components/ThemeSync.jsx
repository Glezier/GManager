import { useLayoutEffect } from "react"
import { useMe } from "../hooks/useMe"
import LoadingState from "./ui/LoadingState"

export default function ThemeSync({ children }){
    const { data: usuario, isLoading } = useMe()

    useLayoutEffect(() => {
        if (usuario?.tema) {
            document.documentElement.dataset.theme = usuario.tema
        }
    }, [usuario?.tema])

    if (isLoading) {
        return <LoadingState message="Carregando preferências..." />
    }

    return children
}
