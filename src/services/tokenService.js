// Servicio para manejo seguro de tokens
class TokenService {
  constructor() {
    this.TOKEN_KEY = 'auth_token'
    this.TOKEN_EXPIRY_KEY = 'auth_token_expiry'
  }

  // Guardar token con tiempo de expiración opcional
  setToken(token, expiryHours = 24) {
    try {
      localStorage.setItem(this.TOKEN_KEY, token)
      
      // Calcular tiempo de expiración
      const expiryTime = new Date().getTime() + (expiryHours * 60 * 60 * 1000)
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString())
      
      return true
    } catch (error) {
      console.error('Error al guardar token:', error)
      return false
    }
  }

  // Obtener token si es válido
  getToken() {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY)
      
      if (!token) {
        return null
      }

      // Verificar si el token ha expirado
      if (this.isTokenExpired()) {
        this.clearToken()
        return null
      }

      return token
    } catch (error) {
      console.error('Error al obtener token:', error)
      return null
    }
  }

  // Verificar si el token ha expirado
  isTokenExpired() {
    try {
      const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY)
      
      if (!expiryTime) {
        return false // Si no hay tiempo de expiración, asumir que es válido
      }

      const currentTime = new Date().getTime()
      return currentTime > parseInt(expiryTime)
    } catch (error) {
      console.error('Error al verificar expiración:', error)
      return true // En caso de error, asumir que expiró
    }
  }

  // Limpiar token del almacenamiento
  clearToken() {
    try {
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY)
      return true
    } catch (error) {
      console.error('Error al limpiar token:', error)
      return false
    }
  }

  // Verificar si hay un token válido almacenado
  hasValidToken() {
    const token = this.getToken()
    return !!token && !this.isTokenExpired()
  }

  // Decodificar payload del JWT (sin verificar firma)
  decodeToken(token = null) {
    try {
      const tokenToDecod = token || this.getToken()
      
      if (!tokenToDecod) {
        return null
      }

      const payload = tokenToDecod.split('.')[1]
      const decodedPayload = JSON.parse(atob(payload))
      
      return decodedPayload
    } catch (error) {
      console.error('Error al decodificar token:', error)
      return null
    }
  }

  // Obtener tiempo restante del token en minutos
  getTokenTimeRemaining() {
    try {
      const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY)
      
      if (!expiryTime) {
        return null
      }

      const currentTime = new Date().getTime()
      const timeRemaining = parseInt(expiryTime) - currentTime
      
      return Math.max(0, Math.floor(timeRemaining / (1000 * 60))) // Convertir a minutos
    } catch (error) {
      console.error('Error al calcular tiempo restante:', error)
      return null
    }
  }

  // Refrescar tiempo de expiración del token actual
  refreshTokenExpiry(expiryHours = 24) {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY)
      
      if (!token) {
        return false
      }

      const expiryTime = new Date().getTime() + (expiryHours * 60 * 60 * 1000)
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString())
      
      return true
    } catch (error) {
      console.error('Error al refrescar expiración:', error)
      return false
    }
  }
}

// Exportar instancia singleton
export default new TokenService()