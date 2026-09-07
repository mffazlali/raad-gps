import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axiosInstance from '../util/axiosConfig.ts'

// Query keys
export const USERS_QUERY_KEY = 'users'
export const USER_QUERY_KEY = 'user'

export const useUsers = (userId: number) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/api/users?userId=${userId}`)
      if (response.status === 200) {
        return response.data
      }
      throw new Error(response.data)
    },
    select: (data: any[]) => {
      return [...data].length > 0 ? [...data].filter(user => user.id != userId && user.deleted==false) : []
    },
  })
}

export const useUser = (id?: number) => {
  return useQuery({
    queryKey: [USER_QUERY_KEY, id],
    queryFn: async () => {
      if (!id) return null
      const [responseUser, responseRoles, responseDevices] = await Promise.all([
        axiosInstance.get(`/api/users/public/${id}`),
        axiosInstance.get(`/api/role/userRoles/${id}`),
        axiosInstance.get(`/api/devices/sessionDevices?userId=${id}`),
      ])
      if (responseUser.status === 200 && responseRoles.status === 200) {
        const resultUser = responseUser.data
        const resultRoles = responseRoles.data
        const resultDevices = responseDevices.data
        const roles = resultRoles.map((role) => role['id'])
        const deviceIds = resultDevices.map((device) => device['id'])
        return {...resultUser, roles, deviceIds}
      }
      throw new Error(responseUser.data)
    },
    staleTime: 0,
    gcTime: 0,
    enabled: !!id,
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (user: any) => {
      const response = await axiosInstance.post('/api/users/add-with-roles', user)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: [USERS_QUERY_KEY]})
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({id, user}: {id: number; user: any}) => {
      const response = await axiosInstance.post(`/api/users/add-with-roles`, user)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data, {id}) => {
      queryClient.invalidateQueries({queryKey: [USERS_QUERY_KEY]})
      queryClient.invalidateQueries({queryKey: [USER_QUERY_KEY, id]})
    },
  })
}

export const useUpdateUserWithoutRoles = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({id, user}: {id: number; user: any}) => {
      const response = await axiosInstance.put(`/api/users/${id}`, user)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data, {id}) => {
      queryClient.invalidateQueries({queryKey: [USERS_QUERY_KEY]})
      queryClient.invalidateQueries({queryKey: [USER_QUERY_KEY, id]})
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/api/users/${id}`)
      if (response.status === 204) return response.data
      throw new Error(response.data)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: [USERS_QUERY_KEY]})
      queryClient.invalidateQueries({queryKey: [USER_QUERY_KEY, id]})
    },
  })
}
