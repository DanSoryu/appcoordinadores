<template>
  <div>
    <!-- Header -->
    <header class="bg-primary-500 text-primary-50 shadow-custom">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Top row: Logo and User Menu -->
        <div class="flex justify-between items-center h-16">
          <h1 class="text-xl font-bold">MecaSoft</h1>

          <!-- User Menu -->
          <div class="relative">
            <button 
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-3 hover:bg-primary-600 px-3 py-2 rounded-custom transition-colors"
            >
              <font-awesome-icon icon="user" class="w-6 h-6" />
              <span class="font-medium">{{ user.usuario }}</span>
              <font-awesome-icon icon="chevron-down" class="w-4 h-4" />
            </button>
            
            <!-- Dropdown Menu -->
            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-custom shadow-custom-lg py-1 z-50">
              <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-secondary-100/60 hover:text-secondary-700 transition-colors">
                <font-awesome-icon icon="sign-out-alt" class="w-4 h-4 inline mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        <!-- Main Navigation -->
        <nav class="border-t border-primary-400">
          <div class="flex space-x-8 -mb-px">
            <router-link
              v-for="route in mainRoutes" 
              :key="route.path"
              :to="route.path"
              :class="[
                'py-3 px-1 border-b-2 font-medium text-sm transition-colors',
                $route.path === route.path 
                  ? 'border-primary-200 text-primary-100' 
                  : 'border-transparent text-primary-200 hover:text-primary-100 hover:border-primary-300'
              ]"
            >
              <font-awesome-icon :icon="route.icon" class="w-4 h-4 inline mr-2" />
              {{ route.name }}
            </router-link>
          </div>
        </nav>
      </div>
    </header>

    <!-- Sub Navigation (Tabs) -->
    <nav v-if="tabs.length > 0" class="bg-white shadow-custom border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="emit('update:activeTab', tab.id)"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// State
const showUserMenu = ref(false)

// All available routes
const allRoutes = [
  { path: '/dashboard', name: 'Dashboard', icon: 'tachometer-alt', roles: ['admin'] },
  { path: '/recepciones', name: 'Recepciones', icon: 'clipboard-list', roles: ['admin', 'mecanico'] },
  { path: '/diagnosticos', name: 'Diagnósticos', icon: 'stethoscope', roles: ['admin'] },
  { path: '/vehiculos', name: 'Vehículos', icon: 'car', roles: ['admin'] },
  { path: '/clientes', name: 'Clientes', icon: 'id-card', roles: ['admin'] },
  { path: '/usuarios', name: 'Usuarios', icon: 'users', roles: ['admin'] }
]

// Main routes configuration based on user role
const mainRoutes = computed(() => {
  const userRole = authStore.userRole
  return allRoutes.filter(route => route.roles.includes(userRole))
})

// Tabs configuration based on current route
const tabs = computed(() => {
  switch (route.path) {
    case '/dashboard':
      return [
        { id: 'dashboard', name: 'Resumen General' }
      ]
    case '/recepciones':
      return [
        { id: 'datosrecepcion', name: 'Datos Recepción' },
        { id: 'checklistrecepcion', name: 'CheckList Recepción' }
      ]
    case '/vehiculos':
      return [
        { id: 'vehiculos', name: 'Gestión de Vehículos' }
      ]
    case '/clientes':
      return [
        { id: 'clientes', name: 'Gestión de Clientes' }
      ]
    case '/usuarios':
      return [
        { id: 'usuarios', name: 'Gestión de Usuarios' }
      ]
    case '/diagnosticos':
      return [
        { id: 'diagnosticos', name: 'Lista de Diagnósticos' }
      ]
    default:
      return []
  }
})

// Props
const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  activeTab: {
    type: String,
    required: true
  }
})

// Emits
const emit = defineEmits(['update:activeTab'])

// Methods
const handleLogout = () => {
  authStore.logout()
  window.location.reload()
  showUserMenu.value = false
}

const getCurrentTabName = () => {
  const tab = tabs.find(t => t.id === props.activeTab)
  return tab ? tab.name : ''
}

const handleTabChange = (tabId) => {
  emit('update:activeTab', tabId)
}

// Click outside handler
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showUserMenu.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>