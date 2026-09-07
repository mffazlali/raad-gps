import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../util/axiosConfig.ts'
import {COMMANDS_QUERY_KEY} from './useCommand.ts'
import {MAINTENANCES_QUERY_KEY} from './useMaintenance.ts'

// Query keys
export const NOTIFICATIONS_QUERY_KEY = 'notifications'
export const NOTIFICATION_QUERY_KEY = 'notification'

export const useNotifications = (userId: number) => {
  return useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY, userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/notifications?userId=${userId}`)
      if (response.status === 200) {
        return response.data
      }
      throw new Error(response.data)
    },
  })
}

export const useNotificationsByDeviceId = (id?: number) => {
  return useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY, 'device', id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/notifications?deviceId=${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    staleTime:0,
    gcTime:0,
    enabled: !!id,
  })
}

export const useNotificationsByGroupId = (id?: number) => {
  return useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY, 'group', id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/notifications?groupId=${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    staleTime:0,
    gcTime:0,
    enabled: !!id,
  })
}

export const useNotification = (id?: number) => {
  return useQuery({
    queryKey: [NOTIFICATION_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/notifications/${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    enabled: !!id,
  })
}

export const useCreateNotification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (notification: any) => {
      const response = await axiosInstance.post('/api/notifications', notification)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] })
    },
  })
}

export const useUpdateNotification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, notification }: { id: number; notification: any }) => {
      const response = await axiosInstance.put(`/api/notifications/${id}`, notification)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_QUERY_KEY, id] })
    },
  })
}

export const useDeleteNotification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/api/notifications/${id}`)
      if (response.status === 204) return response.data
      throw new Error(response.data)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_QUERY_KEY, id] })
    },
  })
}
