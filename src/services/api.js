import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// Configuración base de Axios
const apiClient = axios.create({
  // baseURL local
  baseURL: 'http://localhost:8000/api/mecasoft',
  // baseURL producción
  // baseURL: 'https://api.ed-intra.com/api/mecasoft',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor para requests - añadir token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    
    // Añadir token si existe
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para responses - manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const authStore = useAuthStore()
    const originalRequest = error.config

    // Si el error es 401 o 403, el token es inválido
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Evitar bucle infinito
      if (!originalRequest._retry) {
        originalRequest._retry = true
        
        // Limpiar autenticación y redireccionar al login
        authStore.logout()
        
        // Solo redireccionar si no estamos ya en login
        if (router.currentRoute.value.path !== '/login') {
          router.push('/login')
        }
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient