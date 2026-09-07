import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import axiosInstance from '../util/axiosConfig.ts'
import {ACCESSIBILITY_QUERY_KEY, accessibilityType} from './useAccessibility.ts'

// Query keys
export const ROLES_QUERY_KEY = 'roles'
export const ROLE_QUERY_KEY = 'role'

export const useRoles = () => {
  return useQuery({
    queryKey: [ROLES_QUERY_KEY],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/role/bulk')
      if (response.status === 200) {
        return response.data
      }
      throw new Error(response.data)
    },
  })
}

export const useRole = (id?: number) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: [ROLE_QUERY_KEY, id],
    queryFn: async () => {
      const [response, responsePermissions] = await Promise.all([
        axiosInstance.get(`/api/role/${id}`),
        axiosInstance.get(`/api/accessibility/rolePermissions/${id}`),
      ])
      if (response.status === 200 && responsePermissions.status === 200) {
        const result = response.data
        const resultPermissions = responsePermissions.data
        const accessibilities = queryClient.getQueryData<Record<number, accessibilityType>>([ACCESSIBILITY_QUERY_KEY]) || {}
        const accessibilityIds = [...resultPermissions]
          .filter((item: any) => accessibilities[String(item.id)]?.enable == true)
          .map((item: any) => String(item.id))
        return {...result, accessibilityIds}
      }
    },
    enabled: !!id,
  })
}

export const useCreateRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (role: any) => {
      const response = await axiosInstance.post('/api/role/add-with-permissions', role)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: [ROLES_QUERY_KEY]})
    },
  })
}

export const useUpdateRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({id, role}: {id: number, role: any}) => {
      const response = await axiosInstance.post('/api/role/add-with-permissions', role)
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
    onSuccess: (data, {id}) => {
      queryClient.invalidateQueries({queryKey: [ROLES_QUERY_KEY]})
      queryClient.invalidateQueries({queryKey: [ROLE_QUERY_KEY, id]})
    },
  })
}

export const useDeleteRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/api/role/${id}`)
      if (response.status === 204) return response.data
      throw new Error(response.data)
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: [ROLES_QUERY_KEY]})
      queryClient.invalidateQueries({queryKey: [ROLE_QUERY_KEY, id]})
    },
  })
}
