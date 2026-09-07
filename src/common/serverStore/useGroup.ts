import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../util/axiosConfig.ts'

// Query keys
export const GROUPS_QUERY_KEY = 'groups'
export const GROUP_QUERY_KEY = 'group'

export const useGroups = (userId: number) => {
  return useQuery({
    queryKey: [GROUPS_QUERY_KEY,userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/groups?userId=${userId}`)
      if (response.status === 200) {
        return response.data
      }
      throw new Error(response.data)
    },
  })
}

export const useGroup = (id?: number) => {
  return useQuery({
    queryKey: [GROUP_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/groups/${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    enabled: !!id,
  })
}

export const useCreateGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (group: any) => {
      const response = await axiosInstance.post('/api/groups', group)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY] })
    },
  })
}

export const useUpdateGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, group }: { id: number; group: any }) => {
      const response = await axiosInstance.put(`/api/groups/${id}`, group)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [GROUP_QUERY_KEY, id] })
    },
  })
}

export const useDeleteGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/api/groups/${id}`)
      if (response.status === 204) return response.data
      throw new Error(response.data)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [GROUP_QUERY_KEY, id] })
    },
  })
}
