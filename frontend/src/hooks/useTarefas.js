import { useQuery } from "@tanstack/react-query"
import { listarTarefas } from "../api/api"

export function useTarefas({ token, inicio, fim, enabled = true }) {
    return useQuery({
        queryKey: ['tarefas', inicio, fim],
        queryFn: () => listarTarefas(inicio, fim),
        enabled: Boolean(enabled && token && inicio && fim),
        staleTime: 1000 * 60 * 15
    })
}