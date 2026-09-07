import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axiosInstance from '../util/axiosConfig.ts'

// Query keys
export const DEVICES_QUERY_KEY = 'devices'
export const DEVICE_QUERY_KEY = 'device'

export const useDevices = (userId: number) => {
  return useQuery({
    queryKey: [DEVICES_QUERY_KEY, userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/devices/sessionDevices?userId=${userId}`)
      if (response.status === 200) {
        return response.data
      }
      throw new Error(response.data)
    },
  })
}

export const useDevice = (id?: number) => {
  return useQuery({
    queryKey: [DEVICE_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/devices/${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    enabled: !!id,
  })
}

export const useCreateDevice = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (device: any) => {
      const response = await axiosInstance.post('/api/devices', device)
      if (response.status === 200) {
        if (typeof (response.data) !== 'string') {
          return response.data
        } else {
          throw new Error(response.data)
        }
      }
      throw new Error(response.data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: [DEVICES_QUERY_KEY]})
    },
  })
}

export const useUpdateDevice = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({id, device}: {id: number; device: any}) => {
      const response = await axiosInstance.put(`/api/devices/${id}`, device)
      if (response.status === 200) {
        if (typeof (response.data) !== 'string') {
          return response.data
        } else {
          throw new Error(response.data)
        }
      }
      throw new Error(response.data)
    },
    onSuccess: (data, {id}) => {
      queryClient.invalidateQueries({queryKey: [DEVICES_QUERY_KEY]})
      queryClient.invalidateQueries({queryKey: [DEVICE_QUERY_KEY, id]})
    },
  })
}

export const useDeleteDevice = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/api/devices/${id}`)
      if (response.status === 204) return response.data
      throw new Error(response.data)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: [DEVICES_QUERY_KEY]})
      queryClient.invalidateQueries({queryKey: [DEVICE_QUERY_KEY, id]})
    },
  })
}
