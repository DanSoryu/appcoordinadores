import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import BaseButton from './components/global/BaseButton.vue'
import './main.css'

// Font Awesome imports
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faLock, 
  faUser, 
  faEye, 
  faEyeSlash, 
  faSignInAlt, 
  faQuestionCircle, 
  faClipboardList, 
  faUsers, 
  faFileAlt, 
  faShield,
  faKey,
  faFileContract,
  faCar,
  faIdCard,
  faWrench,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faSignOutAlt,
  faTimes,
  faTachometerAlt,
  faCarSide,
  faDoorClosed,
  faChair,
  faLifeRing,
  faWindowMaximize,
  faGasPump,
  faSmog,
  faCircle,
  faMicrochip,
  faCommentAlt,
  faStethoscope,
  faClock,
  faCamera
} from '@fortawesome/free-solid-svg-icons'

// Agregar iconos a la librería
library.add(
  faLock, 
  faUser, 
  faEye, 
  faEyeSlash, 
  faSignInAlt, 
  faQuestionCircle, 
  faClipboardList, 
  faUsers, 
  faFileAlt, 
  faShield,
  faKey,
  faFileContract,
  faCar,
  faIdCard,
  faWrench,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faSignOutAlt,
  faTimes,
  faTachometerAlt,
  faCarSide,
  faDoorClosed,
  faChair,
  faLifeRing,
  faWindowMaximize,
  faGasPump,
  faSmog,
  faCircle,
  faMicrochip,
  faCommentAlt,
  faStethoscope,
  faClock,
  faCamera
)

const app = createApp(App)
const pinia = createPinia()

// Registrar BaseButton globalmente
app.component('BaseButton', BaseButton)

// Registrar Font Awesome globalmente
app.component('font-awesome-icon', FontAwesomeIcon)

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
