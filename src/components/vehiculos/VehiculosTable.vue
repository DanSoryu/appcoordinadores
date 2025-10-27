<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Gestión de Vehículos</h2>
      <button 
        @click="abrirModalNuevoVehiculo"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>Nuevo Vehículo</span>
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Buscar Vehículo
          </label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por marca, modelo, placa..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Marca
          </label>
          <select
            v-model="marcaFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las marcas</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="Ford">Ford</option>
            <option value="Chevrolet">Chevrolet</option>
            <option value="Nissan">Nissan</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Año
          </label>
          <select
            v-model="anioFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los años</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-gray-600">Cargando vehículos...</span>
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
                  Numero Económico
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehículo
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente Supervisor
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Año
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Placas
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="vehiculo in paginatedData" :key="vehiculo.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ vehiculo.numero_economico }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <font-awesome-icon icon="car" class="text-white text-sm" />
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">
                        {{ vehiculo.marca }} {{ vehiculo.modelo }}
                      </div>
                      <div class="text-sm text-gray-500">
                        VIN: {{ vehiculo.numero_serie }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ vehiculo.cliente_responsable_automotriz }} - {{ vehiculo.cliente_supervisor }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ vehiculo.año }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {{ vehiculo.placas }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div class="flex justify-center space-x-2">
                    <button
                      @click="verDetalles(vehiculo)"
                      class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition-colors"
                      title="Ver detalles"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    <button
                      @click="editarVehiculo(vehiculo)"
                      class="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition-colors"
                      title="Editar vehículo"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      @click="eliminarVehiculo(vehiculo)"
                      class="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors"
                      title="Eliminar vehículo"
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

    <!-- Modal de Nuevo/Editar Vehículo -->
    <VehiculosFormModal
      v-if="showVehiculoModal"
      :show="showVehiculoModal"
      :vehiculoData="vehiculoToEdit"
      @close="showVehiculoModal = false"
      @vehiculo-guardado="handleVehiculoGuardado"
    />

    <!-- Modal de Detalles de Vehículo -->
    <div v-if="showDetallesModal" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white w-[90%] max-w-lg max-h-[90vh] rounded-lg shadow-xl">
        <!-- Encabezado del modal -->
        <div class="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h3 class="text-lg font-semibold">Detalles del Vehículo</h3>
          <button @click="showDetallesModal = false" class="text-white hover:text-gray-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Contenido del modal -->
        <div class="p-6 overflow-y-auto" style="max-height: calc(90vh - 80px);">
          <div v-if="currentVehiculo" class="space-y-4">
            <div class="text-center mb-6">
              <div class="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-3">
                <font-awesome-icon icon="car" class="text-white text-2xl" />
              </div>
              <h4 class="text-xl font-bold text-gray-900">{{ currentVehiculo.marca }} {{ currentVehiculo.modelo }}</h4>
              <p class="text-gray-600">{{ currentVehiculo.numero_economico }}</p>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-500">Número Económico</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentVehiculo.numero_economico }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Marca y Modelo</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentVehiculo.marca }} {{ currentVehiculo.modelo }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Cliente</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentVehiculo.cliente_nombre }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Año</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentVehiculo.año }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Placas</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentVehiculo.placas }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">VIN</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentVehiculo.numero_serie }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Eliminar Vehículo -->
    <VehiculosDeleteModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :vehiculo="vehiculoToDelete"
      @close="showDeleteModal = false"
      @vehiculo-eliminado="handleVehiculoEliminado"
    />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useToastStore } from '../../stores/toast.js'
import apiClient from '../../services/api.js'
import VehiculosFormModal from './VehiculosFormModal.vue'
import VehiculosDeleteModal from './VehiculosDeleteModal.vue'

export default {
  name: 'VehiculosTable',
  components: {
    VehiculosFormModal,
    VehiculosDeleteModal
  },
  setup() {
    const toastStore = useToastStore()
    const isLoading = ref(false)
    const error = ref(null)
    
    // Datos de vehículos desde API
    const vehiculos = ref([])

    // Modales
    const showVehiculoModal = ref(false)
    const showDetallesModal = ref(false)
    const showDeleteModal = ref(false)
    const currentVehiculo = ref(null)
    const vehiculoToEdit = ref(null)
    const vehiculoToDelete = ref(null)

    // Filtros
    const searchQuery = ref('')
    const marcaFilter = ref('')
    const anioFilter = ref('')

    // Paginación
    const currentPage = ref(1)
    const itemsPerPage = 10
    const totalItems = ref(0)
    const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))

    // Filtrar datos
    const filteredData = computed(() => {
      let result = vehiculos.value

      // Filtrar por marca
      if (marcaFilter.value) {
        result = result.filter(item => item.marca === marcaFilter.value)
      }

      // Filtrar por año
      if (anioFilter.value) {
        result = result.filter(item => item.año === anioFilter.value)
      }

      // Filtrar por búsqueda general
      if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase()
        result = result.filter(item => {
          return item.marca.toLowerCase().includes(search) ||
                 item.modelo.toLowerCase().includes(search) ||
                 item.numero_economico.toLowerCase().includes(search) ||
                 item.cliente_nombre.toLowerCase().includes(search) ||
                 item.placas.toLowerCase().includes(search) ||
                 item.numero_serie.toLowerCase().includes(search)
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

    // Cargar vehículos desde la API
    const cargarVehiculos = async () => {
      isLoading.value = true
      error.value = null
      
      try {
        const response = await apiClient.get('/vehiculos')
        vehiculos.value = response.data
      } catch (err) {
        error.value = 'Error al cargar los vehículos'
        console.error('Error al cargar vehículos:', err)
        toastStore.addToast({
          message: 'Error al cargar los vehículos',
          type: 'error',
          duration: 5000
        })
      } finally {
        isLoading.value = false
      }
    }

    // Acciones de la tabla
    const abrirModalNuevoVehiculo = () => {
      vehiculoToEdit.value = null
      showVehiculoModal.value = true
    }

    const verDetalles = (vehiculo) => {
      currentVehiculo.value = vehiculo
      showDetallesModal.value = true
    }

    const editarVehiculo = (vehiculo) => {
      vehiculoToEdit.value = { ...vehiculo }
      showVehiculoModal.value = true
    }

    const eliminarVehiculo = (vehiculo) => {
      vehiculoToDelete.value = vehiculo
      showDeleteModal.value = true
    }

    const handleVehiculoGuardado = async (vehiculo) => {
      if (vehiculoToEdit.value) {
        // Actualizar vehículo existente
        const index = vehiculos.value.findIndex(v => v.id === vehiculo.id)
        if (index !== -1) {
          vehiculos.value[index] = vehiculo
        }
        toastStore.addToast({
          message: 'Vehículo actualizado exitosamente',
          type: 'success',
          duration: 3000
        })
      } else {
        // Para vehículos nuevos, recargar la lista desde el servidor para obtener datos actualizados
        await cargarVehiculos()
        toastStore.addToast({
          message: 'Vehículo creado exitosamente',
          type: 'success',
          duration: 3000
        })
      }
      
      vehiculoToEdit.value = null
      showVehiculoModal.value = false
    }

    const handleVehiculoEliminado = (vehiculoId) => {
      vehiculos.value = vehiculos.value.filter(v => v.id !== vehiculoId)
      showDeleteModal.value = false
      vehiculoToDelete.value = null
      
      toastStore.addToast({
        message: 'Vehículo eliminado exitosamente',
        type: 'success',
        duration: 3000
      })
    }

    // Watchers para filtros
    watch([searchQuery, marcaFilter, anioFilter], () => {
      currentPage.value = 1
    })

    // Cargar datos al montar el componente
    onMounted(() => {
      cargarVehiculos()
    })

    return {
      vehiculos,
      isLoading,
      error,
      searchQuery,
      marcaFilter,
      anioFilter,
      currentPage,
      totalItems,
      totalPages,
      paginatedData,
      startRecord,
      endRecord,
      visiblePages,
      showVehiculoModal,
      showDetallesModal,
      showDeleteModal,
      currentVehiculo,
      vehiculoToEdit,
      vehiculoToDelete,
      previousPage,
      nextPage,
      goToPage,
      abrirModalNuevoVehiculo,
      verDetalles,
      editarVehiculo,
      eliminarVehiculo,
      handleVehiculoGuardado,
      handleVehiculoEliminado,
      cargarVehiculos
    }
  }
}
</script>
