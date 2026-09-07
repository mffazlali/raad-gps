import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axiosInstance from '../util/axiosConfig.ts'
import {COMMANDS_QUERY_KEY} from './useCommand.ts'

// Query keys
export const MAINTENANCES_QUERY_KEY = 'maintenances'
export const MAINTENANCE_QUERY_KEY = 'maintenance'

export const useMaintenances = (userId: number, enabled = true) => {
  return useQuery({
    queryKey: [MAINTENANCES_QUERY_KEY, userId],
    enabled,
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/maintenance?userId=${userId}`)
      if (response.status === 200) {
        return response.data
      }
      throw new Error(response.data)
    },
  })
}

export const useMaintenancesByDeviceId = (id?: number) => {
  return useQuery({
    queryKey: [MAINTENANCE_QUERY_KEY, 'device', id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/maintenance?deviceId=${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    staleTime: 0,
    gcTime: 0,
    enabled: !!id,
  })
}

export const useMaintenancesByGroupId = (id?: number) => {
  return useQuery({
    queryKey: [MAINTENANCES_QUERY_KEY, 'group', id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/maintenance?groupId=${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    staleTime: 0,
    gcTime: 0,
    enabled: !!id,
  })
}

export const useMaintenance = (id?: number) => {
  return useQuery({
    queryKey: [MAINTENANCE_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/maintenance/${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    enabled: !!id,
  })
}

export const useCreateMaintenance = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (maintenance: any) => {
      const response = await axiosInstance.post('/api/maintenance', maintenance)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: [MAINTENANCES_QUERY_KEY]})
    },
  })
}

export const useUpdateMaintenance = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({id, maintenance}: {id: number; maintenance: any}) => {
      const response = await axiosInstance.put(`/api/maintenance/${id}`, maintenance)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data, {id}) => {
      queryClient.invalidateQueries({queryKey: [MAINTENANCES_QUERY_KEY]})
      queryClient.invalidateQueries({queryKey: [MAINTENANCE_QUERY_KEY, id]})
    },
  })
}

export const useDeleteMaintenance = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/api/maintenance/${id}`)
      if (response.status === 204) return response.data
      throw new Error(response.data)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: [MAINTENANCES_QUERY_KEY]})
      queryClient.invalidateQueries({queryKey: [MAINTENANCE_QUERY_KEY, id]})
    },
  })
}
