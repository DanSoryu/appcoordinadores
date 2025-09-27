import { defineStore } from 'pinia'
import apiClient from '@/services/api'
import tokenService from '@/services/tokenService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: tokenService.getToken() || null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    isLoggedIn: (state) => {
      // Si hay token y no ha expirado, considerar como logueado
      const hasValidToken = tokenService.hasValidToken()
      const result = hasValidToken && (state.isAuthenticated || !!state.token)
      console.log('isLoggedIn getter - hasValidToken:', hasValidToken, 'isAuthenticated:', state.isAuthenticated, 'token exists:', !!state.token, 'result:', result) // Debug
      return result
    },
    getAuthHeader: (state) => state.token ? `Bearer ${state.token}` : null
  },

  actions: {
    // Inicializar estado de autenticación al cargar la app
    async initAuth() {
      const token = tokenService.getToken()
      if (token) {
        this.token = token
        this.isAuthenticated = true // Marcar como autenticado inmediatamente
        
        // Cargar datos del usuario si no están disponibles
        if (!this.user) {
          this.loadUserData()
        }
      }
    },

    // Login del usuario
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await apiClient.post('/auth/login', {
          usuario: credentials.usuario,
          password: credentials.password
        })

        const { token } = response.data

        // Guardar token usando el servicio seguro
        this.setToken(token)
        this.isAuthenticated = true

        return { success: true }
      } catch (error) {
        this.error = this.handleAuthError(error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Logout del usuario
    logout() {
      this.clearToken()
      this.user = null
      this.isAuthenticated = false
      this.error = null
    },

    // Guardar token de forma segura
    setToken(token) {
      console.log('Guardando token...') // Debug
      this.token = token
      tokenService.setToken(token, 24) // 24 horas de expiración
      
      // Decodificar token una sola vez para obtener datos del usuario
      this.decodeAndStoreUserData(token)
      
      console.log('Token guardado, isAuthenticated:', this.isAuthenticated) // Debug
    },

    // Decodificar token y extraer información del usuario
    decodeAndStoreUserData(token) {
      try {
        const payload = tokenService.decodeToken(token)
        if (payload && payload.usuario) {
          // Crear objeto de usuario con datos del payload
          this.user = {
            id: payload.id_usuario || payload.sub,
            usuario: payload.usuario,
            copes: payload.copes || [],
          }
          
          // Guardar también en localStorage para persistencia
          localStorage.setItem('user_data', JSON.stringify(this.user))
          console.log('Datos de usuario extraídos del token:', this.user) // Debug
        }
      } catch (error) {
        console.warn('Error al decodificar token:', error)
      }
    },

    // Cargar datos del usuario desde localStorage
    loadUserData() {
      try {
        const userData = localStorage.getItem('user_data')
        if (userData) {
          this.user = JSON.parse(userData)
          console.log('Datos de usuario cargados desde localStorage:', this.user) // Debug
        }
      } catch (error) {
        console.warn('Error al cargar datos del usuario:', error)
      }
    },

    // Limpiar token
    clearToken() {
      this.token = null
      tokenService.clearToken()
      // Limpiar también datos del usuario
      localStorage.removeItem('user_data')
    },

    // Obtener token del almacenamiento seguro
    getStoredToken() {
      return tokenService.getToken()
    },

    // Manejar errores de autenticación
    handleAuthError(error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            return 'Credenciales no válidas'
          case 403:
            return 'Usuario no encontrado'
          case 422:
            return 'Datos de entrada inválidos'
          case 500:
            return 'Error interno del servidor'
          default:
            return 'Error de conexión'
        }
      }
      return 'Error de red. Verifica tu conexión a internet'
    }
  }
})