import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../util/axiosConfig.ts'

// Query keys
export const COMPUTED_ATTRIBUTES_QUERY_KEY = 'computedAttributes'
export const COMPUTED_ATTRIBUTE_QUERY_KEY = 'computedAttribute'

export const useComputedAttributes = (userId: number) => {
  return useQuery({
    queryKey: [COMPUTED_ATTRIBUTES_QUERY_KEY, userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/computed-attributes?userId=${userId}`)
      if (response.status === 200) {
        return response.data
      }
      throw new Error(response.data)
    },
  })
}

export const useComputedAttribute = (id?: number) => {
  return useQuery({
    queryKey: [COMPUTED_ATTRIBUTE_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/computed-attributes/${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    enabled: !!id,
  })
}

export const useCreateComputedAttribute = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (computedAttribute: any) => {
      const response = await axiosInstance.post('/api/computed-attributes', computedAttribute)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [COMPUTED_ATTRIBUTES_QUERY_KEY] })
    },
  })
}

export const useUpdateComputedAttribute = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, computedAttribute }: { id: number; computedAttribute: any }) => {
      const response = await axiosInstance.put(`/api/computed-attributes/${id}`, computedAttribute)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: [COMPUTED_ATTRIBUTES_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [COMPUTED_ATTRIBUTE_QUERY_KEY, id] })
    },
  })
}

export const useDeleteComputedAttribute = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/api/computed-attributes/${id}`)
      if (response.status === 204) return response.data
      throw new Error(response.data)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [COMPUTED_ATTRIBUTES_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [COMPUTED_ATTRIBUTE_QUERY_KEY, id] })
    },
  })
}
