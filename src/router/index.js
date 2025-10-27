import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import Login from '../components/Login.vue'
import Recepciones from '../components/Recepciones.vue'
import Diagnosticos from '../components/Diagnosticos.vue'
import Vehiculos from '../components/Vehiculos.vue'
import Clientes from '../components/Clientes.vue'
import Usuarios from '../components/Usuarios.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { 
      requiresAuth: true,
      allowedRoles: ['admin', 'mecanico']
    }
  },
  {
    path: '/recepciones',
    component: Recepciones,
    meta: { 
      requiresAuth: true,
      allowedRoles: ['admin', 'mecanico']
    }
  },
  {
    path: '/diagnosticos',
    component: Diagnosticos,
    meta: { 
      requiresAuth: true,
      allowedRoles: ['admin', 'mecanico']
    }
  },
  {
    path: '/vehiculos',
    component: Vehiculos,
    meta: { 
      requiresAuth: true,
      allowedRoles: ['admin', 'mecanico']
    }
  },
  {
    path: '/clientes',
    component: Clientes,
    meta: { 
      requiresAuth: true,
      allowedRoles: ['admin', 'mecanico']
    }
  },
  {
    path: '/usuarios',
    component: Usuarios,
    meta: { 
      requiresAuth: true,
      allowedRoles: ['admin']
    }
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
        // Cerrar sesión y recargar la página para limpiar el estado y mostrar el login
        authStore.logout();
        window.location.reload();
        return;
      }

    // Verificar permisos de rol para rutas autenticadas
    if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(authStore.userRole)) {
      console.warn(`Acceso denegado a ${to.path} para el rol ${authStore.userRole}`)
      // Redireccionar al dashboard si no tiene permisos
      next('/dashboard')
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