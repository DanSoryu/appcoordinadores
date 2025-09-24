import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import Login from '../components/Login.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegación global
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Inicializar autenticación si no se ha hecho y hay un token
  const storedToken = authStore.getStoredToken()
  if (storedToken && !authStore.isAuthenticated) {
    await authStore.initAuth()
  }

  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!authStore.isLoggedIn) {
      // Redireccionar al login si no está autenticado
      next('/login')
      return
    }
  }

  // Verificar si la ruta es solo para invitados (como login)
  if (to.meta.requiresGuest) {
    if (authStore.isLoggedIn) {
      // Redireccionar al dashboard si ya está autenticado
      next('/dashboard')
      return
    }
  }

  next()
})

export default router