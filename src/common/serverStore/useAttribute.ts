import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../util/axiosConfig.ts'
import {COMMANDS_QUERY_KEY} from './useCommand.ts'
import {MAINTENANCES_QUERY_KEY} from './useMaintenance.ts'

// Query keys
export const ATTRIBUTES_QUERY_KEY = 'attributes'

export const useAttributes = (userId: number) => {
  return useQuery({
    queryKey: [ATTRIBUTES_QUERY_KEY, userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/attributes/computed`)
      if (response.status === 200) {
        return response.data
      }
      throw new Error(response.data)
    },
  })
}

export const useAttributesByDeviceId = (id?: number) => {
  return useQuery({
    queryKey: [ATTRIBUTES_QUERY_KEY, 'device', id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/attributes/computed?deviceId=${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    staleTime:0,
    gcTime:0,
    enabled: !!id,
  })
}

export const useAttributesByGroupId = (id?: number) => {
  return useQuery({
    queryKey: [ATTRIBUTES_QUERY_KEY, 'group', id],
    queryFn: async () => {
      if (!id) return null
      const response = await axiosInstance.get(`/api/attributes/computed?groupId=${id}`)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    staleTime:0,
    gcTime:0,
    enabled: !!id,
  })
}
