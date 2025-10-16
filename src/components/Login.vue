<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <div class="w-full max-w-5xl">
      <div class="login-container bg-white rounded-custom shadow-custom-xl overflow-hidden">
        <div class="grid md:grid-cols-2 gap-0">
          
          <!-- Imagen/Branding - Lado Izquierdo -->
          <div class="login-image flex flex-col justify-center p-12 text-white" style="background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); min-height: 100%;">
            <div class="text-center">
              <!-- Brand Logo -->
              <div class="brand-logo inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <font-awesome-icon icon="clipboard-list" class="w-12 h-12 text-white" />
              </div>
              
              <h2 class="text-4xl font-display font-bold mb-3">Portal Mecánicos</h2>
              <p class="text-lg text-white/90 mb-8">Sistema de Gestión para Taller Mecánico</p>
              
              <hr class="my-8 border-white/20">
              
              <!-- Características -->
              <div class="grid grid-cols-3 gap-6 text-center">
                <div class="feature-item">
                  <div class="flex justify-center mb-3">
                    <font-awesome-icon icon="users" class="w-10 h-10 text-white/90" />
                  </div>
                  <p class="text-sm text-white/80">Clientes</p>
                </div>
                
                <div class="feature-item">
                  <div class="flex justify-center mb-3">
                    <font-awesome-icon icon="file-alt" class="w-10 h-10 text-white/90" />
                  </div>
                  <p class="text-sm text-white/80">Proyectos</p>
                </div>
                
                <div class="feature-item">
                  <div class="flex justify-center mb-3">
                    <font-awesome-icon icon="clipboard-list" class="w-10 h-10 text-white/90" />
                  </div>
                  <p class="text-sm text-white/80">Órdenes</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Formulario - Lado Derecho -->
          <div class="login-form p-12 flex flex-col justify-center">
            <div class="text-center mb-8">
              <h3 class="text-3xl font-display font-bold text-primary-700 mb-2">Iniciar Sesión</h3>
              <p class="text-neutral-600">Ingrese sus credenciales para acceder</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-6">
              
              <!-- Usuario Field -->
              <div>
                <label for="usuario" class="block text-sm font-medium text-neutral-700 mb-2">
                  <font-awesome-icon icon="user" class="inline-block w-4 h-4 mr-2 text-primary-600" />
                  Usuario o Email
                </label>
                <input
                  id="usuario"
                  v-model="usuario"
                  type="text"
                  required
                  maxlength="30"
                  class="appearance-none block w-full px-4 py-3 border border-neutral-300 rounded-lg placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Ingrese su usuario o email"
                >
              </div>

              <!-- Password Field -->
              <div>
                <label for="password" class="block text-sm font-medium text-neutral-700 mb-2">
                  <font-awesome-icon icon="lock" class="inline-block w-4 h-4 mr-2 text-primary-600" />
                  Contraseña
                </label>
                <div class="relative">
                  <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    minlength="6"
                    class="appearance-none block w-full px-4 py-3 pr-12 border border-neutral-300 rounded-lg placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Ingrese su contraseña"
                  >
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-primary-600 transition-colors"
                  >
                    <font-awesome-icon v-if="showPassword" icon="eye-slash" class="h-5 w-5" />
                    <font-awesome-icon v-else icon="eye" class="h-5 w-5" />
                  </button>
                </div>
              </div>

              <!-- Remember Me -->
              <div class="flex items-center">
                <input
                  id="remember"
                  v-model="rememberMe"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded transition-colors"
                >
                <label for="remember" class="ml-2 block text-sm text-neutral-700">
                  Recordar sesión
                </label>
              </div>

              <!-- Submit Button -->
              <div>
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <span v-if="!isLoading" class="flex items-center">
                    <font-awesome-icon icon="sign-in-alt" class="w-5 h-5 mr-2" />
                    Iniciar Sesión
                  </span>
                  <span v-else class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </span>
                </button>
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="rounded-lg bg-red-50 border border-red-200 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <font-awesome-icon icon="times" class="h-5 w-5 text-red-500" />
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">
                      Error de autenticación
                    </h3>
                    <div class="mt-1 text-sm text-red-700">
                      {{ errorMessage }}
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <!-- Forgot Password -->
            <div class="text-center mt-6">
              <a href="#" class="text-sm font-medium text-primary-600 hover:text-secondary-600 transition-colors inline-flex items-center">
                <font-awesome-icon icon="question-circle" class="w-4 h-4 mr-1" />
                ¿Olvidó su contraseña?
              </a>
            </div>
          </div>
          
        </div>
      </div>
      
      <!-- Footer -->
      <div class="mt-8 text-center">
        <p class="text-sm text-neutral-50">
          © 2025 Portal Mecánicos. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// State - cambiamos email por usuario según API
const usuario = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// Verificar si ya está autenticado al cargar el componente
onMounted(async () => {
  // Esperar un poco para que se inicialice el store
  await new Promise(resolve => setTimeout(resolve, 100))
  
  if (authStore.isLoggedIn) {
    router.push('/dashboard')
  }
})

// Methods
const handleLogin = async () => {
  if (!usuario.value || !password.value) {
    errorMessage.value = 'Por favor completa todos los campos'
    return
  }

  // Validación básica
  if (usuario.value.length > 30) {
    errorMessage.value = 'El usuario no puede tener más de 30 caracteres'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await authStore.login({
      usuario: usuario.value,
      password: password.value
    })

    console.log('Resultado del login:', result) // Debug

    if (result.success) {
      console.log('Login exitoso, redirigiendo...') // Debug
      console.log('Estado auth después del login:', authStore.isLoggedIn) // Debug adicional
      
      // Pequeña pausa para asegurar que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // Login exitoso - redireccionar al dashboard
      await router.push('/dashboard')
      console.log('Redirección completada') // Debug adicional
    } else {
      console.log('Login falló:', result.error) // Debug
      errorMessage.value = result.error || 'Error de autenticación'
    }
  } catch (error) {
    console.error('Error en login:', error)
    errorMessage.value = 'Error de conexión. Intenta nuevamente.'
  } finally {
    isLoading.value = false
  }
}
</script>