import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axiosInstance from '../util/axiosConfig.ts'
import {MAINTENANCES_QUERY_KEY} from './useMaintenance.ts'

// Query keys
export const DRIVERS_QUERY_KEY = 'drivers'
export const DRIVER_QUERY_KEY = 'driver'

export const useDrivers = (userId: number, enabled = true) => {
  return useQuery({
    queryKey: [DRIVERS_QUERY_KEY, userId],
    enabled,
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/drivers?userId=${userId}`)
      if (response.status === 200) {
        return response.data
      }
      throw new Error(response.data)
    },
  })
}

export const useDriversByGroupId = (id?: number) => {
  return useQuery({
    queryKey: [DRIVERS_QUERY_KEY, 'group', id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/drivers?groupId=${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    staleTime: 0,
    gcTime: 0,
    enabled: !!id,
  })
}

export const useDriversByDeviceId = (id?: number) => {
  return useQuery({
    queryKey: [DRIVERS_QUERY_KEY, 'device', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/drivers?deviceId=${id}`)
      if (response.status === 200) {
        return response.data
      }
      throw new Error(response.data)
    },
    staleTime: 0,
    gcTime: 0,
    enabled: !!id,
  })
}

export const useDriver = (id?: number) => {
  return useQuery({
    queryKey: [DRIVER_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/drivers/${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    enabled: !!id,
  })
}

export const useCreateDriver = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (driver: any) => {
      const response = await axiosInstance.post('/api/drivers', driver)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: [DRIVERS_QUERY_KEY]})
    },
  })
}

export const useUpdateDriver = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({id, driver}: {id: number; driver: any}) => {
      const response = await axiosInstance.put(`/api/drivers/${id}`, driver)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data, {id}) => {
      queryClient.invalidateQueries({queryKey: [DRIVERS_QUERY_KEY]})
      queryClient.invalidateQueries({queryKey: [DRIVER_QUERY_KEY, id]})
    },
  })
}

export const useDeleteDriver = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/api/drivers/${id}`)
      if (response.status === 204) return response.data
      throw new Error(response.data)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: [DRIVERS_QUERY_KEY]})
      queryClient.invalidateQueries({queryKey: [DRIVER_QUERY_KEY, id]})
    },
  })
}
