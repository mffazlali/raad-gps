import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../util/axiosConfig.ts'

// Query keys
export const PREFERENCES_QUERY_KEY = 'preferences'

export const usePreference = (userId: number) => {
  return useQuery({
    queryKey: [PREFERENCES_QUERY_KEY, userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/users/public/${userId}`)
      return response.data
    },
    enabled: !!userId
  })
}

export const useUpdatePreference = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, preferences }: { userId: number, preferences: any }) => {
      const response = await axiosInstance.put(`/api/users/${userId}`, preferences)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData([PREFERENCES_QUERY_KEY, variables.userId], (oldData: any) => {
        return data
      })
    }
  })
}
