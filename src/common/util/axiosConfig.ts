import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios'

// Create axios instance with default config
const axiosInstance = axios.create()

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('notificationToken')

    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    const method = response.config.method
    const url = response.config.url
    if (method === 'delete' && url === '/api/session' && response.status == 204) {
      window.location.replace('/login')
      // window.location.href='/login'
    }
    return response
  },
  (error: AxiosError) => {
    if (error?.response) {
      if (Object.keys((error?.response?.data) as any).includes('message')) {
        if (((error?.response?.data as any)['message']) === 'HTTP 401 Unauthorized' && window.location.href !== '/login') {
          window.location.replace('/login')
        }
      }
    }
    // Handle different error status codes
    // if (error.response) {
    //   switch (error.response.status) {
    //     case 401:
    //       // Handle unauthorized access
    //       localStorage.removeItem('notificationToken');
    //       window.location.href = '/login';
    //       break;
    //     case 403:
    //       // Handle forbidden access
    //       console.error('Access forbidden');
    //       break;
    //     case 404:
    //       // Handle not found
    //       console.error('Resource not found');
    //       break;
    //     case 500:
    //       // Handle server error
    //       console.error('Server error');
    //       break;
    //     default:
    //       console.error('An error occurred');
    //   }
    // }

    return Promise.reject(error)
  },
)

export default axiosInstance
