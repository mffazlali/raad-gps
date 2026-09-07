import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../util/axiosConfig.ts'
import {COMMANDS_QUERY_KEY} from './useCommand.ts'

// Query keys
export const CALENDARS_QUERY_KEY = 'calendars'
export const CALENDAR_QUERY_KEY = 'calendar'

export const useCalendars = (userId: number) => {
  return useQuery({
    queryKey: [CALENDARS_QUERY_KEY, userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/calendars?userId=${userId}`)
      if (response.status === 200) {
        return response.data
      }
      throw new Error(response.data)
    },
  })
}

export const useCalendar = (id?: number) => {
  return useQuery({
    queryKey: [CALENDAR_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/calendars/${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    enabled: !!id,
  })
}

export const useCreateCalendar = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (calendar: any) => {
      const response = await axiosInstance.post('/api/calendars', calendar)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [CALENDARS_QUERY_KEY] })
    },
  })
}

export const useUpdateCalendar = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, calendar }: { id: number; calendar: any }) => {
      const response = await axiosInstance.put(`/api/calendars/${id}`, calendar)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: [CALENDARS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [CALENDAR_QUERY_KEY, id] })
    },
  })
}

export const useDeleteCalendar = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/api/calendars/${id}`)
      if (response.status === 204) return response.data
      throw new Error(response.data)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [CALENDARS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [CALENDAR_QUERY_KEY, id] })
    },
  })
}
