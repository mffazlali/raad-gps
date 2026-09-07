import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../util/axiosConfig.ts'

// Query keys
export const IDENTIFIERS_QUERY_KEY = 'identifiers'
export const IDENTIFIER_QUERY_KEY = 'identifier'

export const useIdentifiers = () => {
  return useQuery({
    queryKey: [IDENTIFIERS_QUERY_KEY],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/imei/bulk')
      if (response.status === 200) {
        return response.data
      }
      throw new Error(response.data)
    },
  })
}

export const useIdentifier = (id?: number) => {
  return useQuery({
    queryKey: [IDENTIFIER_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/imei/${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    enabled: !!id,
  })
}

export const useCreateIdentifier = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (identifier: any) => {
      const response = await axiosInstance.post('/api/imei', identifier)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [IDENTIFIERS_QUERY_KEY] })
    },
  })
}

export const useUpdateIdentifier = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, identifier }: { id: number; identifier: any }) => {
      const response = await axiosInstance.put(`/api/imei`, identifier)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: [IDENTIFIERS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [IDENTIFIER_QUERY_KEY, id] })
    },
  })
}

export const useDeleteIdentifier = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/api/imei/${id}`)
      if (response.status === 204) return response.data
      throw new Error(response.data)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [IDENTIFIERS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [IDENTIFIER_QUERY_KEY, id] })
    },
  })
}
