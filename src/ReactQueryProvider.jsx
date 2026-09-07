import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import React from 'react'

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      // staleTime: 30000,
      // refetchInterval:2000,
      refetchOnWindowFocus:false,
      refetchOnReconnect: true,
      refetchOnMount: false,
      gcTime: 0,
      
      // gcTime: 50000,
    },
    mutations: {},
  },
})

const ReactQueryProvider = ({children}) => {
  const activeReactQueryDevtools = import.meta.env.VITE_REACT_QUERY_DEVTOOLS_ACTIVE ? import.meta.env.VITE_REACT_QUERY_DEVTOOLS_ACTIVE?.toLowerCase?.() === 'true' : false
  return (
    <QueryClientProvider client={client}>
      {children}
      {activeReactQueryDevtools && <ReactQueryDevtools initialIsOpen={false} className={'invisible'} />}
    </QueryClientProvider>
  )
}

export default ReactQueryProvider

