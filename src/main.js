import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import './main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Inicializar autenticación al cargar la app
const authStore = useAuthStore()

// Función async para inicializar la app
async function initApp() {
  try {
    await authStore.initAuth()
  } catch (error) {
    console.warn('Error al inicializar autenticación:', error)
  }
  
  app.mount('#app')
}

// Inicializar la aplicación
initApp()
