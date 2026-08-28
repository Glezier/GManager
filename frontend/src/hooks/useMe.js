import { useQuery } from '@tanstack/react-query'
import { infosUser } from '../api/profileApi'

export function useMe(){
    return useQuery({
        queryKey: ['me'],
        queryFn: infosUser,
        staleTime: 1000 * 60 * 15,
        gcTime: 1000 * 60 * 30
    })
}