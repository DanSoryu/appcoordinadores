<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
      <button 
        @click="abrirModalNuevoUsuario"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>Nuevo Usuario</span>
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Buscar Usuario
          </label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por usuario..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Rol
          </label>
          <select
            v-model="rolFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="mecanico">Mecánico</option>
            <option value="tecnico">Técnico</option>
          </select>
        </div>


      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-gray-600">Cargando usuarios...</span>
      </div>
      <div v-else-if="error" class="p-4 text-red-600 bg-red-50 text-center">
        {{ error }}
      </div>
      <div v-else>
        <!-- Tabla con scroll -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="usuario in paginatedData" :key="usuario.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <span class="text-white text-sm font-medium">
                          {{ usuario.usuario.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">
                        {{ usuario.usuario }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getRoleBadgeClass(usuario.rol)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getRoleDisplayName(usuario.rol) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div class="flex justify-center space-x-2">
                    <button
                      @click="verDetalles(usuario)"
                      class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition-colors"
                      title="Ver detalles"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    <button
                      @click="editarUsuario(usuario)"
                      class="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition-colors"
                      title="Editar usuario"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      @click="cambiarContrasena(usuario)"
                      class="text-orange-600 hover:text-orange-900 p-1 rounded-full hover:bg-orange-100 transition-colors"
                      title="Cambiar contraseña"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </button>
                    <button
                      @click="eliminarUsuario(usuario)"
                      class="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors"
                      title="Eliminar usuario"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando <span class="font-medium">{{ startRecord }}</span> a <span class="font-medium">{{ endRecord }}</span> de <span class="font-medium">{{ totalItems }}</span> resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Anterior</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    currentPage === page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Siguiente</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Nuevo/Editar Usuario -->
    <UsuariosFormModal
      v-if="showUsuarioModal"
      :show="showUsuarioModal"
      :usuarioData="usuarioToEdit"
      :isEdit="!!usuarioToEdit"
      @close="showUsuarioModal = false"
      @usuario-guardado="handleUsuarioGuardado"
    />

    <!-- Modal de Detalles de Usuario -->
    <div v-if="showDetallesModal" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white w-[90%] max-w-2xl max-h-[90vh] rounded-lg shadow-xl">
        <!-- Encabezado del modal -->
        <div class="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h3 class="text-lg font-semibold">Detalles del Usuario</h3>
          <button @click="showDetallesModal = false" class="text-white hover:text-gray-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Contenido del modal -->
        <div class="p-6 overflow-y-auto" style="max-height: calc(90vh - 80px);">
          <div v-if="currentUsuario" class="space-y-4">
            <div class="text-center mb-6">
              <div class="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-3">
                <span class="text-white text-2xl font-bold">
                  {{ currentUsuario.usuario.charAt(0).toUpperCase() }}
                </span>
              </div>
              <h4 class="text-xl font-bold text-gray-900">{{ currentUsuario.usuario }}</h4>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-500">ID</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentUsuario.id }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Usuario</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentUsuario.usuario }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Rol: </label>
                  <span :class="getRoleBadgeClass(currentUsuario.rol)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getRoleDisplayName(currentUsuario.rol) }}
                  </span>
                </div>
                
                <!-- Información adicional para mecánicos -->
                <div v-if="currentUsuario.rol === 'mecanico'" class="mt-4 pt-4 border-t border-gray-200">
                  <h5 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    Información del Mecánico
                  </h5>
                  
                  <!-- Indicador de carga -->
                  <div v-if="loadingDetalles" class="bg-blue-50 p-3 rounded-md flex items-center justify-center">
                    <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                    <span class="text-sm text-gray-600">Cargando detalles...</span>
                  </div>
                  
                  <!-- Información completa del mecánico -->
                  <div v-else class="space-y-4">
                    <!-- Información básica -->
                    <div class="bg-blue-50 p-4 rounded-lg">
                      <h6 class="text-sm font-semibold text-blue-800 mb-3">Datos Básicos</h6>
                      <div class="grid grid-cols-1 gap-3">
                        <div v-if="currentUsuario.detalleMecanico?.nombre">
                          <label class="text-xs font-medium text-gray-500">Nombre Completo</label>
                          <p class="text-sm text-gray-900 font-semibold">{{ currentUsuario.detalleMecanico.nombre }}</p>
                        </div>
                        <div>
                          <label class="text-xs font-medium text-gray-500">Taller Asignado</label>
                          <p class="text-sm text-gray-900 font-semibold">
                            {{ currentUsuario.taller || 'No asignado' }}
                          </p>
                        </div>
                        <div v-if="currentUsuario.detalleMecanico?.telefono">
                          <label class="text-xs font-medium text-gray-500">Teléfono</label>
                          <p class="text-sm text-gray-900 font-semibold">{{ currentUsuario.detalleMecanico.telefono }}</p>
                        </div>
                        <div v-if="currentUsuario.detalleMecanico?.domicilio">
                          <label class="text-xs font-medium text-gray-500">Domicilio</label>
                          <p class="text-sm text-gray-900 bg-white p-2 rounded border">{{ currentUsuario.detalleMecanico.domicilio }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Documentos -->
                    <div class="bg-green-50 p-4 rounded-lg">
                      <h6 class="text-sm font-semibold text-green-800 mb-3">Documentos</h6>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Licencia de Conducir -->
                        <div>
                          <label class="text-xs font-medium text-gray-500 mb-2 block">Licencia de Conducir</label>
                          <div v-if="currentUsuario.detalleMecanico?.licencia" class="text-center">
                            <div @click="openImageModal(getImageUrl(currentUsuario.detalleMecanico.licencia))" class="block cursor-pointer">
                              <img 
                                :src="getImageUrl(currentUsuario.detalleMecanico.licencia)" 
                                alt="Licencia de Conducir" 
                                class="w-full h-24 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer"
                                @error="handleImageError"
                              >
                            </div>
                            <p class="text-xs text-gray-500 mt-1">Click para ver en tamaño completo</p>
                          </div>
                          <div v-else class="text-center py-4">
                            <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <p class="text-xs text-gray-500">No disponible</p>
                          </div>
                        </div>

                        <!-- INE -->
                        <div>
                          <label class="text-xs font-medium text-gray-500 mb-2 block">INE/Credencial</label>
                          <div v-if="currentUsuario.detalleMecanico?.ine" class="text-center">
                            <div @click="openImageModal(getImageUrl(currentUsuario.detalleMecanico.ine))" class="block cursor-pointer">
                              <img 
                                :src="getImageUrl(currentUsuario.detalleMecanico.ine)" 
                                alt="INE/Credencial" 
                                class="w-full h-24 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer"
                                @error="handleImageError"
                              >
                            </div>
                            <p class="text-xs text-gray-500 mt-1">Click para ver en tamaño completo</p>
                          </div>
                          <div v-else class="text-center py-4">
                            <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                            </svg>
                            <p class="text-xs text-gray-500">No disponible</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Mensaje cuando no hay detalles -->
                    <div v-if="!currentUsuario.detalleMecanico" class="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                      <div class="flex items-center">
                        <svg class="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                        <p class="text-sm text-yellow-800">
                          Este mecánico no tiene información adicional registrada. 
                          <br><span class="text-xs">Puede editarlo para agregar sus datos completos.</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Eliminar Usuario -->
    <UsuariosDeleteModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :usuario="usuarioToDelete"
      @close="showDeleteModal = false"
      @usuario-eliminado="handleUsuarioEliminado"
    />

    <!-- Modal de Cambiar Contraseña -->
    <UsuariosChangePasswordModal
      v-if="showChangePasswordModal"
      :show="showChangePasswordModal"
      :usuario="usuarioToChangePassword"
      @close="showChangePasswordModal = false"
      @password-changed="handlePasswordChanged"
    />

    <!-- Modal de Imagen -->
    <ImageModal
      :show="showImageModal"
      :imageUrl="currentImageUrl"
      @close="closeImageModal"
    />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useToastStore } from '../../stores/toast.js'
import apiClient from '../../services/api.js'
import UsuariosFormModal from './UsuariosFormModal.vue'
import UsuariosDeleteModal from './UsuariosDeleteModal.vue'
import UsuariosChangePasswordModal from './UsuariosChangePasswordModal.vue'
import ImageModal from '../global/ImageModal.vue'

export default {
  name: 'UsuariosTable',
  components: {
    UsuariosFormModal,
    UsuariosDeleteModal,
    UsuariosChangePasswordModal,
    ImageModal
  },
  setup() {
    const toastStore = useToastStore()
    const isLoading = ref(false)
    const error = ref(null)
    
    // Datos de usuarios
    const usuarios = ref([])

    // Modales
    const showUsuarioModal = ref(false)
    const showDetallesModal = ref(false)
    const showDeleteModal = ref(false)
    const showChangePasswordModal = ref(false)
    const showImageModal = ref(false)
    const currentImageUrl = ref(null)
    const loadingDetalles = ref(false)
    const currentUsuario = ref(null)
    const usuarioToEdit = ref(null)
    const usuarioToDelete = ref(null)
    const usuarioToChangePassword = ref(null)

    // Filtros
    const searchQuery = ref('')
    const rolFilter = ref('')

    // Paginación
    const currentPage = ref(1)
    const itemsPerPage = 10
    const totalItems = ref(0)
    const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))

    // Filtrar datos
    const filteredData = computed(() => {
      let result = usuarios.value

      // Filtrar por rol
      if (rolFilter.value) {
        result = result.filter(item => item.rol === rolFilter.value)
      }

      // Filtrar por búsqueda general
      if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase()
        result = result.filter(item => {
          return item.usuario.toLowerCase().includes(search) ||
                 item.rol.toLowerCase().includes(search)
        })
      }

      totalItems.value = result.length
      return result
    })

    // Paginar datos
    const paginatedData = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage
      return filteredData.value.slice(startIndex, startIndex + itemsPerPage)
    })

    const startRecord = computed(() => {
      if (filteredData.value.length === 0) return 0
      return ((currentPage.value - 1) * itemsPerPage) + 1
    })

    const endRecord = computed(() => {
      if (filteredData.value.length === 0) return 0
      return Math.min(currentPage.value * itemsPerPage, totalItems.value)
    })

    // Páginas visibles para navegación
    const visiblePages = computed(() => {
      const pages = []
      
      // Always add page 1
      pages.push(1)
      
      // Add page before current if it exists and is not 1
      if (currentPage.value > 2) {
        pages.push(currentPage.value - 1)
      }
      
      // Add current page if it's not 1
      if (currentPage.value > 1) {
        pages.push(currentPage.value)
      }
      
      // Add page after current if it exists and is not the last page
      if (currentPage.value + 1 < totalPages.value) {
        pages.push(currentPage.value + 1)
      }
      
      // Add last page if it's not already added
      if (totalPages.value > 1 && !pages.includes(totalPages.value)) {
        pages.push(totalPages.value)
      }
      
      // Remove duplicates and sort
      return [...new Set(pages)].sort((a, b) => a - b)
    })

    // Navegación de páginas
    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const goToPage = (page) => {
      currentPage.value = page
    }

    // Funciones de utilidad
    const getRoleDisplayName = (rol) => {
      const roles = {
        'admin': 'Administrador',
        'mecanico': 'Mecánico',
        'tecnico': 'Técnico'
      }
      return roles[rol] || rol
    }

    const getRoleBadgeClass = (rol) => {
      const classes = {
        'admin': 'bg-red-100 text-red-800',
        'mecanico': 'bg-blue-100 text-blue-800',
        'tecnico': 'bg-green-100 text-green-800'
      }
      return classes[rol] || 'bg-gray-100 text-gray-800'
    }

    // Cargar usuarios desde la API
    const cargarUsuarios = async () => {
      isLoading.value = true
      error.value = null
      
      try {
        const response = await apiClient.get('/users')
        // Filtrar el usuario 'root' para que no aparezca en la tabla
        usuarios.value = response.data.filter(usuario => usuario.usuario.toLowerCase() !== 'root')
      } catch (err) {
        error.value = 'Error al cargar los usuarios'
        console.error('Error al cargar usuarios:', err)
        toastStore.addToast({
          message: 'Error al cargar los usuarios',
          type: 'error',
          duration: 5000
        })
      } finally {
        isLoading.value = false
      }
    }

    // Acciones de la tabla
    const abrirModalNuevoUsuario = () => {
      usuarioToEdit.value = null
      showUsuarioModal.value = true
    }

    const verDetalles = async (usuario) => {
      currentUsuario.value = { ...usuario }
      showDetallesModal.value = true
      
      // Si el usuario es mecánico, cargar también los detalles del taller
      if (usuario.rol === 'mecanico') {
        loadingDetalles.value = true
        try {
          console.log('Cargando detalles del mecánico para usuario ID:', usuario.id)
          const response = await apiClient.get(`/detalle-mecanico/${usuario.id}`)
          console.log('Detalles del mecánico obtenidos:', response.data)
          
          // Agregar información del taller al usuario actual
          currentUsuario.value.detalleMecanico = response.data
          currentUsuario.value.taller = response.data.taller?.nombre || 'No asignado'
        } catch (error) {
          console.error('Error al cargar detalles del mecánico:', error)
          // Si no se encuentra el detalle, agregar información de que no está disponible
          currentUsuario.value.detalleMecanico = null
          currentUsuario.value.taller = 'No asignado'
          
          toastStore.addToast({
            message: 'No se pudieron cargar los detalles del taller para este mecánico',
            type: 'warning',
            duration: 3000
          })
        } finally {
          loadingDetalles.value = false
        }
      }
    }

    const editarUsuario = async (usuario) => {
      // Crear copia del usuario con datos básicos
      usuarioToEdit.value = { ...usuario }
      
      // Si el usuario es mecánico, cargar también los detalles del mecánico
      if (usuario.rol === 'mecanico') {
        try {
          console.log('Cargando detalles del mecánico para edición, usuario ID:', usuario.id)
          const response = await apiClient.get(`/detalle-mecanico/${usuario.id}`)
          console.log('Detalles del mecánico obtenidos para edición:', response.data)
          
          // Agregar los datos del detalle mecánico al objeto usuario
          usuarioToEdit.value = {
            ...usuarioToEdit.value,
            // Datos del detalle mecánico
            taller: response.data.taller_id || '',
            nombre: response.data.nombre || '',
            domicilio: response.data.domicilio || '',
            telefono: response.data.telefono || '',
            // Nombres de archivos para mostrar en el FileUploadPreview
            licenciaArchivo: response.data.licencia || '',
            ineArchivo: response.data.ine || ''
          }
        } catch (error) {
          console.error('Error al cargar detalles del mecánico para edición:', error)
          
          // Si no se encuentra el detalle, continuar con los datos básicos
          if (error.response?.status === 404) {
            console.log('No existe detalle mecánico, continuando con datos básicos')
          } else {
            toastStore.addToast({
              message: 'Error al cargar los detalles del mecánico. Se editará solo la información básica.',
              type: 'warning',
              duration: 5000
            })
          }
        }
      }
      
      showUsuarioModal.value = true
    }

    const eliminarUsuario = (usuario) => {
      usuarioToDelete.value = usuario
      showDeleteModal.value = true
    }

    const cambiarContrasena = (usuario) => {
      usuarioToChangePassword.value = usuario
      showChangePasswordModal.value = true
    }

    const handleUsuarioGuardado = async (usuario) => {
      if (usuarioToEdit.value) {
        // Actualizar usuario existente
        const index = usuarios.value.findIndex(u => u.id === usuario.id)
        if (index !== -1) {
          usuarios.value[index] = usuario
        }
        toastStore.addToast({
          message: 'Usuario actualizado exitosamente',
          type: 'success',
          duration: 3000
        })
      } else {
        // Para usuarios nuevos, recargar la lista desde el servidor para obtener datos actualizados
        await cargarUsuarios()
        toastStore.addToast({
          message: 'Usuario creado exitosamente',
          type: 'success',
          duration: 3000
        })
      }
      
      usuarioToEdit.value = null
      showUsuarioModal.value = false
    }

    const handleUsuarioEliminado = (usuarioId) => {
      usuarios.value = usuarios.value.filter(u => u.id !== usuarioId)
      showDeleteModal.value = false
      usuarioToDelete.value = null
      
      toastStore.addToast({
        message: 'Usuario eliminado exitosamente',
        type: 'success',
        duration: 3000
      })
    }

    const handlePasswordChanged = () => {
      showChangePasswordModal.value = false
      usuarioToChangePassword.value = null
      
      toastStore.addToast({
        message: 'Contraseña cambiada exitosamente',
        type: 'success',
        duration: 3000
      })
    }

    // Helper para obtener la URL completa de una imagen del detalle mecánico
    const getImageUrl = (imageName) => {
      if (!imageName) return null
      // Usar la misma URL base que el CheckListRecepcionTable
      return `https://api.ed-intra.com/Mecasoft/documentos_mecanico/${imageName}`
    }

    // Función para abrir el modal de imagen
    const openImageModal = (imageUrl) => {
      currentImageUrl.value = imageUrl
      showImageModal.value = true
    }

    // Función para cerrar el modal de imagen
    const closeImageModal = () => {
      showImageModal.value = false
      currentImageUrl.value = null
    }

    // Helper para manejar errores de carga de imágenes
    const handleImageError = (event) => {
      console.error('Error al cargar imagen:', event.target.src)
      // Reemplazar con imagen de placeholder o ocultar
      event.target.style.display = 'none'
      
      // Mostrar mensaje de error
      const parent = event.target.parentElement
      if (parent) {
        const errorDiv = document.createElement('div')
        errorDiv.className = 'text-center py-4'
        errorDiv.innerHTML = `
          <svg class="w-8 h-8 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <p class="text-xs text-red-500">Error al cargar imagen</p>
        `
        parent.appendChild(errorDiv)
      }
    }



    // Watchers para filtros
    watch([searchQuery, rolFilter], () => {
      currentPage.value = 1
    })

    // Cargar datos al montar el componente
    onMounted(() => {
      cargarUsuarios()
    })

    return {
      usuarios,
      isLoading,
      error,
      searchQuery,
      rolFilter,
      currentPage,
      totalItems,
      totalPages,
      paginatedData,
      startRecord,
      endRecord,
      visiblePages,
      showUsuarioModal,
      showDetallesModal,
      showDeleteModal,
      showChangePasswordModal,
      showImageModal,
      currentImageUrl,
      loadingDetalles,
      currentUsuario,
      usuarioToEdit,
      usuarioToDelete,
      usuarioToChangePassword,
      previousPage,
      nextPage,
      goToPage,
      abrirModalNuevoUsuario,
      verDetalles,
      editarUsuario,
      eliminarUsuario,
      cambiarContrasena,
      handleUsuarioGuardado,
      handleUsuarioEliminado,
      handlePasswordChanged,
      getRoleDisplayName,
      getRoleBadgeClass,
      cargarUsuarios,
      getImageUrl,
      handleImageError,
      openImageModal,
      closeImageModal
    }
  }
}
</script>
