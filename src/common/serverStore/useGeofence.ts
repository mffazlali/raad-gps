import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axiosInstance from '../util/axiosConfig.ts'
import {NOTIFICATIONS_QUERY_KEY} from './useNotification.ts'

// Query keys
export const GEOFENCES_QUERY_KEY = 'geofences'
export const GEOFENCE_QUERY_KEY = 'geofence'

export const useGeofences = (userId: number) => {
  return useQuery({
    queryKey: [GEOFENCES_QUERY_KEY, userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/geofences?userId=${userId}`)
      if (response.status === 200) {
        return response.data
      }
      throw new Error(response.data)
    },
  })
}

export const useGeofencesByDeviceId = (id?: number) => {
  return useQuery({
    queryKey: [GEOFENCE_QUERY_KEY, 'device', id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/geofences?deviceId=${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    staleTime:0,
    gcTime:0,
    enabled: !!id,
  })
}

export const useGeofencesByGroupId = (id?: number) => {
  return useQuery({
    queryKey: [GEOFENCE_QUERY_KEY, 'group', id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/geofences?groupId=${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    staleTime:0,
    gcTime:0,
    enabled: !!id,
  })
}

export const useGeofence = (id?: number) => {
  return useQuery({
    queryKey: [GEOFENCE_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/geofences/${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    enabled: !!id,
  })
}

export const useCreateGeofence = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (geofence: any) => {
      const response = await axiosInstance.post('/api/geofences', geofence)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: [GEOFENCES_QUERY_KEY]})
    },
  })
}

export const useUpdateGeofence = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({id, geofence}: {id: number; geofence: any}) => {
      const response = await axiosInstance.put(`/api/geofences/${id}`, geofence)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data, {id}) => {
      queryClient.invalidateQueries({queryKey: [GEOFENCES_QUERY_KEY]})
      queryClient.invalidateQueries({queryKey: [GEOFENCE_QUERY_KEY, id]})
    },
  })
}

export const useDeleteGeofence = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/api/geofences/${id}`)
      if (response.status === 204) return response.data
      throw new Error(response.data)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: [GEOFENCES_QUERY_KEY]})
      queryClient.invalidateQueries({queryKey: [GEOFENCE_QUERY_KEY, id]})
    },
  })
}
