import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../util/axiosConfig.ts'
import {MAINTENANCE_QUERY_KEY} from './useMaintenance.ts'

// Query keys
export const COMMANDS_QUERY_KEY = 'commands'
export const COMMAND_QUERY_KEY = 'command'

export const useCommands = (userId: number) => {
  return useQuery({
    queryKey: [COMMANDS_QUERY_KEY, userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/commands?userId=${userId}`)
      if (response.status === 200) {
        return response.data
      }
      throw new Error(response.data)
    },
  })
}

export const useCommandsByDeviceId = (id?: number) => {
  return useQuery({
    queryKey: [COMMANDS_QUERY_KEY, 'device', id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/commands?deviceId=${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    staleTime:0,
    gcTime:0,
    enabled: !!id,
  })
}

export const useCommandsByGroupId = (id?: number) => {
  return useQuery({
    queryKey: [COMMANDS_QUERY_KEY, 'group', id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/commands?groupId=${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    staleTime:0,
    gcTime:0,
    enabled: !!id,
  })
}

export const useCommand = (id?: number) => {
  return useQuery({
    queryKey: [COMMAND_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/commands/${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    enabled: !!id,
  })
}

export const useCreateCommand = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (command: any) => {
      const response = await axiosInstance.post('/api/commands', command)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [COMMANDS_QUERY_KEY] })
    },
  })
}

export const useUpdateCommand = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, command }: { id: number; command: any }) => {
      const response = await axiosInstance.put(`/api/commands/${id}`, command)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: [COMMANDS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [COMMAND_QUERY_KEY, id] })
    },
  })
}

export const useDeleteCommand = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/api/commands/${id}`)
      if (response.status === 204) return response.data
      throw new Error(response.data)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [COMMANDS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [COMMAND_QUERY_KEY, id] })
    },
  })
}
