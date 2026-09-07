import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../util/axiosConfig.ts'

// Query keys
export const POSITIONS_QUERY_KEY = 'positions'

export const usePositions = () => {
  return useQuery({
    queryKey: [POSITIONS_QUERY_KEY],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/positions')
      if (response.status === 200) return response.data
      throw new Error(response.data)
    },
  })
} 