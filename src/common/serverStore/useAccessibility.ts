import {useQuery} from '@tanstack/react-query'
import axiosInstance from '../util/axiosConfig.ts'
import {ACCESSIBILITIES_BY_NAME} from '../util/constants'

type accessibilityTypeByName = {
  'id': number,
  'name': string,
  'persianTitle': string,
  'enabled': boolean
}

export type accessibilityType = {
  'id': number,
  'name': string,
  'enable': boolean,
  'title': string,
}

// Query keys
export const ACCESSIBILITY_QUERY_KEY = 'accessibility'

export const useAccessibility = () => {
  return useQuery({
    queryKey: [ACCESSIBILITY_QUERY_KEY],
    queryFn: async () => {
      const response = await axiosInstance.get<accessibilityTypeByName[]>('/api/accessibility/bulk')
      if (response.status === 200) {
        const data = response.data
        const accessibilityByName = {...ACCESSIBILITIES_BY_NAME}
        data.forEach(item => {
          if (accessibilityByName[item.name]) {
            accessibilityByName[item.name].id = item.id
          }
        })
        const accessibility: Record<number, accessibilityType> = {}
        Object.values(accessibilityByName).filter(item => !!item.id).forEach(item => {
          accessibility[String(item.id)] = item
        })
        return accessibility
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    gcTime: Infinity,
    staleTime: Infinity,
  })
}

