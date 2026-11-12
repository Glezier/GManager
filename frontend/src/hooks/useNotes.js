import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listarNotas, criarNota, atualizarNota, deletarNota } from "../api/notesApi"

export function useNotas ({ usuarioId, enabled = true }) {
    return useQuery({
        queryKey: ['notas', usuarioId],
        queryFn: listarNotas,
        enabled: Boolean(enabled && usuarioId),
        staleTime: 1000 * 60
    })
}

export function useNotasMutation ({ usuarioId }) {
    const queryClient = useQueryClient()

    async function atualizarListagem () {
        await queryClient.invalidateQueries({
            queryKey: ['notas', usuarioId]
        })
    }

    const criacao = useMutation ({
        mutationFn: criarNota,
        onSuccess: atualizarListagem
    })

    const atualizacao = useMutation({
        mutationFn: ({ id, nota }) => atualizarNota(id, nota),
        onSuccess: atualizarListagem
    })

    const exclusao = useMutation({
        mutationFn: deletarNota,
        onSuccess: atualizarListagem
    })

    return {
        criacao,
        atualizacao,
        exclusao
    }
}