<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Recepciones de Vehículos</h2>
      <div class="flex space-x-3">
        <button 
          @click="exportarExcel"
          :disabled="exportandoExcel || recepciones.length === 0"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="!exportandoExcel" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <div v-else class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
          <span>{{ exportandoExcel ? 'Exportando...' : 'Exportar Excel' }}</span>
        </button>
        <button 
          @click="abrirModalNuevaRecepcion"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>Nueva Recepción</span>
        </button>
      </div>
    </div>

    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Búsqueda General</label>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar en cualquier campo..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
          <input 
            v-model="dateFrom"
            type="date"
            :max="dateTo || currentDate"
            :min="minDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          <span class="text-xs text-gray-500 mt-1 block">
            Máximo 2 años atrás
          </span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
          <input 
            v-model="dateTo"
            type="date"
            :max="currentDate"
            :min="dateFrom || minDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
          <span class="text-xs text-gray-500 mt-1 block">
            Máximo fecha actual
          </span>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-gray-600">Cargando datos...</span>
      </div>
      <div v-else-if="error" :class="[
        'p-4 text-center',
        error === 'No hay datos disponibles' ? 'text-gray-600 bg-gray-50' : 'text-red-600 bg-red-50'
      ]">
        <div class="flex items-center justify-center space-x-2">
          <svg v-if="error === 'No hay datos disponibles'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{{ error }}</span>
        </div>
      </div>
      <div v-else>
        <!-- Tabla con scroll -->
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse table-fixed">
            <thead class="bg-gray-50">
              <tr class="divide-x divide-gray-200">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kilometraje</th>
                <th v-if="isAdmin" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taller</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entregado por</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-gray-50 divide-x divide-gray-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.folio }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.fecha_recepcion }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.kilometraje?.toLocaleString() }} km</td>
                <td v-if="isAdmin" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getTallerNombre(item.taller_id) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.numero_economico }} - {{ item.placas }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.entregado_por }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                  <!-- Botones de acciones -->
                  <button 
                    @click="verDetalles(item)" 
                    class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ver
                  </button>
                  <button 
                    @click="editarRecepcion(item)" 
                    class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Editar
                  </button>
                </td>
              </tr>
              <!-- Mensaje cuando no hay datos -->
              <tr v-if="paginatedData.length === 0">
                <td :colspan="isAdmin ? 7 : 6" class="px-6 py-8 text-center text-gray-500">
                  No se encontraron registros de recepción.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
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
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Anterior</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    currentPage === page ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
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
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Nueva/Editar Recepción -->
    <DatosRecepcionFormModal
      v-if="showRecepcionModal"
      :show="showRecepcionModal"
      :recepcionData="recepcionToEdit"
      @close="showRecepcionModal = false"
      @recepcion-guardada="handleRecepcionGuardada"
    />

    <!-- Modal de Detalles de Recepción -->
    <div v-if="showDetallesModal" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white w-[90%] max-w-2xl max-h-[90vh] rounded-lg shadow-xl">
        <!-- Encabezado del modal -->
        <div class="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h3 class="text-xl font-semibold">Detalles de Recepción</h3>
          <button @click="showDetallesModal = false" class="text-white hover:text-gray-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Contenido del modal -->
        <div class="p-6 overflow-y-auto" style="max-height: calc(90vh - 80px);">
          <div v-if="currentRecepcion" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500">Folio</p>
                <p class="font-semibold">{{ currentRecepcion.id }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500">Fecha de Recepción</p>
                <p class="font-semibold">{{ currentRecepcion.fecha_recepcion }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500">Kilometraje</p>
                <p class="font-semibold">{{ currentRecepcion.kilometraje?.toLocaleString() }} km</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500">Taller de Recepción</p>
                <p class="font-semibold">{{ getTallerNombre(currentRecepcion.taller_id) }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500">Entregado por</p>
                <p class="font-semibold">{{ currentRecepcion.entregado_por }}</p>
              </div>
            </div>
            
            <div class="mt-6">
              <h4 class="text-lg font-bold text-gray-800 mb-3">Información del Vehículo</h4>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-500">Número Económico</p>
                    <p class="font-semibold">{{ currentRecepcion.numero_economico }}</p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-500">Número de Serie</p>
                    <p class="font-semibold">{{ currentRecepcion.numero_serie }}</p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-500">Cliente</p>
                    <p class="font-semibold">{{ currentRecepcion.cliente_responsable_automotriz }} - {{ currentRecepcion.cliente_supervisor }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useToastStore } from '../../stores/toast.js'
import { useAuthStore } from '../../stores/auth.js'
import apiClient from '../../services/api.js'
import DatosRecepcionFormModal from './DatosRecepcionFormModal.vue'
import ExcelJS from 'exceljs'

export default {
  name: 'RecepcionTable',
  components: {
    DatosRecepcionFormModal
  },
  setup() {
    const toastStore = useToastStore()
    const authStore = useAuthStore()
    const isLoading = ref(false)
    const error = ref(null)
    
    // Datos de recepción desde API
    const recepciones = ref([])
    const talleres = ref([])

    // Modales
    const showRecepcionModal = ref(false)
    const showDetallesModal = ref(false)
    const currentRecepcion = ref(null)
    const recepcionToEdit = ref(null)
    const exportandoExcel = ref(false)

    // Filtros
    const searchQuery = ref('')
    const dateFrom = ref('')
    const dateTo = ref('')

    // Paginación
    const currentPage = ref(1)
    const itemsPerPage = 10
    const totalItems = ref(0)
    const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))

    // Computed para verificar si el usuario es admin
    const isAdmin = computed(() => {
      return authStore.user?.rol === 'admin'
    })

    // Fechas límite
    const currentDate = computed(() => {
      const today = new Date()
      return today.toISOString().split('T')[0]
    })

    const minDate = computed(() => {
      const date = new Date()
      date.setFullYear(date.getFullYear() - 2)
      return date.toISOString().split('T')[0]
    })

    // Watch para validar fechas
    watch(dateFrom, (newValue) => {
      if (newValue && dateTo.value && newValue > dateTo.value) {
        dateFrom.value = dateTo.value
      }
    })

    watch(dateTo, (newValue) => {
      if (newValue && dateFrom.value && newValue < dateFrom.value) {
        dateTo.value = dateFrom.value
      }
    })

    // Filtrar datos
    const filteredData = computed(() => {
      let result = recepciones.value

      // Filtrar por fecha desde
      if (dateFrom.value) {
        result = result.filter(item => item.fecha_recepcion >= dateFrom.value)
      }

      // Filtrar por fecha hasta
      if (dateTo.value) {
        result = result.filter(item => item.fecha_recepcion <= dateTo.value)
      }

      // Filtrar por búsqueda general
      if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase()
        result = result.filter(item => {
          const tallerNombre = getTallerNombre(item.taller_id).toLowerCase()
          return (
            item.id.toString().includes(search) ||
            item.fecha_recepcion.toLowerCase().includes(search) ||
            tallerNombre.includes(search) ||
            item.numero_economico.toLowerCase().includes(search) ||
            item.placas.toLowerCase().includes(search) ||
            item.cliente_nombre.toLowerCase().includes(search) ||
            item.entregado_por.toLowerCase().includes(search)
          )
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

    // Cargar recepciones desde la API
    const cargarRecepciones = async () => {
      isLoading.value = true
      error.value = null
      
      try {
        let recepcionesData = []
        let vehiculosData = []
        
        // Intentar cargar recepciones
        try {
          const recepcionResponse = await apiClient.get('/recepcion')
          recepcionesData = recepcionResponse.data
        } catch (recepcionError) {
          if (recepcionError.response?.status === 404) {
            // No hay recepciones, pero no es un error real
            console.log('No hay recepciones disponibles (404)')
            recepcionesData = []
          } else {
            // Error real al cargar recepciones
            throw recepcionError
          }
        }
        
        // Intentar cargar vehículos solo si hay recepciones
        if (recepcionesData.length > 0) {
          try {
            const vehiculosResponse = await apiClient.get('/vehiculos')
            vehiculosData = vehiculosResponse.data
          } catch (vehiculosError) {
            console.error('Error al cargar vehículos:', vehiculosError)
            // Si falla la carga de vehículos, continuar sin ellos
            vehiculosData = []
          }
        }
        
        // Si no hay recepciones, mostrar mensaje apropiado
        if (recepcionesData.length === 0) {
          error.value = 'No hay datos disponibles'
          recepciones.value = []
          return
        }
        
        // Helper: convertir 'YYYY-MM-DD HH:mm:ss' a 'YYYY-MM-DD'
        const formatFecha = (fechaStr) => {
          if (!fechaStr) return ''
          // Si ya está en formato 'YYYY-MM-DD' devolverla tal cual
          if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) return fechaStr
          // Extraer la parte de fecha antes del espacio
          const match = fechaStr.match(/^(\d{4}-\d{2}-\d{2})/)
          return match ? match[1] : fechaStr
        }

        // Combinar datos de recepción con datos de vehículos y formatear fecha
        recepciones.value = recepcionesData.map(recepcion => {
          const vehiculo = vehiculosData.find(v => v.id === recepcion.vehiculo_id)
          return {
            ...recepcion,
            fecha_recepcion: formatFecha(recepcion.fecha_recepcion),
            numero_economico: vehiculo?.numero_economico || 'N/A',
            placas: vehiculo?.placas || 'N/A'
          }
        })
        
        console.log('Recepciones con datos de vehículos:', recepciones.value)
      } catch (err) {
        console.error('Error al cargar recepciones:', err)
        
        // Para errores que no son 404 (500, 401, etc.)
        error.value = 'Error al cargar las recepciones'
        recepciones.value = []
        toastStore.addToast({
          message: 'Error al cargar las recepciones',
          type: 'error',
          duration: 5000
        })
      } finally {
        isLoading.value = false
      }
    }

    // Cargar talleres desde la API
    const cargarTalleres = async () => {
      try {
        console.log('Cargando talleres...')
        const response = await apiClient.get('/talleres')
        talleres.value = response.data
        console.log('Talleres cargados:', talleres.value.length)
      } catch (error) {
        console.error('Error al cargar talleres:', error)
        toastStore.addToast({
          message: 'Error al cargar la lista de talleres',
          type: 'error',
          duration: 5000
        })
      }
    }

    // Función para obtener el nombre del taller por ID
    const getTallerNombre = (tallerId) => {
      if (!tallerId) return 'N/A'
      const taller = talleres.value.find(t => t.id === tallerId)
      return taller ? taller.nombre : `Taller ID: ${tallerId}`
    }

    // Acciones de la tabla
    const abrirModalNuevaRecepcion = () => {
      recepcionToEdit.value = null
      showRecepcionModal.value = true
    }

    const verDetalles = (item) => {
      currentRecepcion.value = item
      showDetallesModal.value = true
    }

    const editarRecepcion = (item) => {
      // Preparar el objeto para edición
      const recepcionForEdit = {
        id: item.id,
        fecha_recepcion: item.fecha_recepcion,
        kilometraje: item.kilometraje,
        taller_id: item.taller_id,
        entregado_por: item.entregado_por,
        vehiculo_id: item.vehiculo_id
      }
      
      // Asignar datos al objeto de edición
      recepcionToEdit.value = recepcionForEdit
      
      // Mostrar el modal de edición
      showRecepcionModal.value = true
    }

    const handleRecepcionGuardada = async (nuevaRecepcion) => {
      // Asegurarse de mantener el formato de fecha correcto cuando se actualiza/guarda
      const formatFecha = (fechaStr) => {
        if (!fechaStr) return ''
        if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) return fechaStr
        const match = fechaStr.match(/^(\d{4}-\d{2}-\d{2})/)
        return match ? match[1] : fechaStr
      }

      // Normalizar la fecha de la nueva recepción
      if (nuevaRecepcion.fecha_recepcion) {
        nuevaRecepcion.fecha_recepcion = formatFecha(nuevaRecepcion.fecha_recepcion)
      }

      if (recepcionToEdit.value) {
        // Actualizar recepción existente
        const index = recepciones.value.findIndex(r => r.id === nuevaRecepcion.id)
        if (index !== -1) {
          recepciones.value[index] = nuevaRecepcion
        }
        toastStore.addToast({
          message: 'Recepción actualizada correctamente',
          type: 'success',
          duration: 3000
        })
      } else {
        // Para recepciones nuevas, recargar la lista desde el servidor
        await cargarRecepciones()
        toastStore.addToast({
          message: 'Recepción guardada correctamente',
          type: 'success',
          duration: 3000
        })
      }
      
      // Limpiar y cerrar el modal
      recepcionToEdit.value = null
      showRecepcionModal.value = false
    }

    // Función para exportar a Excel con imágenes
    const exportarExcel = async () => {
      if (recepciones.value.length === 0) {
        toastStore.addToast({
          message: 'No hay datos para exportar',
          type: 'warning',
          duration: 3000
        })
        return
      }

      exportandoExcel.value = true
      
      try {
        // Crear un nuevo libro de Excel
        const workbook = new ExcelJS.Workbook()
        workbook.creator = 'Sistema de Recepciones'
        workbook.created = new Date()
        
        // Crear una hoja por cada recepción
        for (const recepcion of recepciones.value) {
          const nombreHoja = `Recep_${recepcion.id}`.substring(0, 31) // Límite de Excel
          const worksheet = workbook.addWorksheet(nombreHoja)
          
          // Configurar ancho de columnas
          worksheet.columns = [
            { width: 25 },
            { width: 40 }
          ]
          
          let filaActual = 1
          
          // ENCABEZADO PRINCIPAL
          worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
          const headerCell = worksheet.getCell(`A${filaActual}`)
          headerCell.value = `RECEPCIÓN DE VEHÍCULO - FOLIO ${recepcion.id}`
          headerCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } }
          headerCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF2563EB' }
          }
          headerCell.alignment = { vertical: 'middle', horizontal: 'center' }
          worksheet.getRow(filaActual).height = 30
          filaActual += 2
          
          // SECCIÓN: DATOS DE RECEPCIÓN
          worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
          const seccionRecepcion = worksheet.getCell(`A${filaActual}`)
          seccionRecepcion.value = 'DATOS DE RECEPCIÓN'
          seccionRecepcion.font = { size: 12, bold: true, color: { argb: 'FFFFFFFF' } }
          seccionRecepcion.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF059669' }
          }
          seccionRecepcion.alignment = { vertical: 'middle', horizontal: 'center' }
          filaActual++
          
          // Datos de recepción
          const datosRecepcion = [
            ['Fecha de Recepción:', recepcion.fecha_recepcion],
            ['Kilometraje:', `${recepcion.kilometraje?.toLocaleString()} km`],
            ['Taller:', getTallerNombre(recepcion.taller_id)],
            ['Entregado por:', recepcion.entregado_por],
            ['Número Económico:', recepcion.numero_economico],
            ['Placas:', recepcion.placas]
          ]
          
          for (const [label, value] of datosRecepcion) {
            const labelCell = worksheet.getCell(`A${filaActual}`)
            labelCell.value = label
            labelCell.font = { bold: true }
            labelCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFE5E7EB' }
            }
            
            const valueCell = worksheet.getCell(`B${filaActual}`)
            valueCell.value = value || 'N/A'
            filaActual++
          }
          
          filaActual++
          
          // Obtener datos del checklist
          try {
            // Obtener todos los checklists y buscar el que corresponde a esta recepción
            const checklistResponse = await apiClient.get('/detalle-recepcion?per_page=1000')
            
            // Buscar el checklist que corresponde a esta recepción
            let checklist = null
            if (checklistResponse.data.success && checklistResponse.data.data.data) {
              checklist = checklistResponse.data.data.data.find(cl => cl.recepcion_id === recepcion.id)
            }
            
            if (checklist) {
              // SECCIÓN: DATOS DEL CHECKLIST
              worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
              const seccionChecklist = worksheet.getCell(`A${filaActual}`)
              seccionChecklist.value = 'DATOS DEL CHECKLIST'
              seccionChecklist.font = { size: 12, bold: true, color: { argb: 'FFFFFFFF' } }
              seccionChecklist.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF3B82F6' }
              }
              seccionChecklist.alignment = { vertical: 'middle', horizontal: 'center' }
              filaActual++
              
              // Datos del checklist
              const datosChecklist = [
                ['Estado:', checklist.estado || 'PENDIENTE'],
                ['Cantidad de Llaves:', checklist.cantidadLlaves || 'N/A'],
                ['Tarjeta de Circulación:', checklist.tarjetaCirculacion ? 'SÍ' : 'NO'],
                ['Nivel de Combustible:', checklist.nivelCombustible || 'N/A'],
                ['Estéreo:', checklist.estereo || 'N/A'],
                ['Cantidad de Bocinas:', checklist.cantidadBocinas || 'N/A'],
                ['Estado de Manijas:', checklist.manijas || 'N/A'],
                ['Estado de Seguros:', checklist.estadoSeguros || 'N/A'],
                ['Estado de Cristales:', checklist.estadoCristales || 'N/A'],
                ['Estado de Vestiduras:', checklist.estadoVestiduras || 'N/A'],
                ['Estado de Cabeceras:', checklist.estadoCabeceras || 'N/A']
              ]
              
              if (checklist.descripcionAccesorios) {
                datosChecklist.push(['Descripción de Accesorios:', checklist.descripcionAccesorios])
              }
              
              if (checklist.comentarioGeneral) {
                datosChecklist.push(['Comentario General:', checklist.comentarioGeneral])
              }
              
              for (const [label, value] of datosChecklist) {
                const labelCell = worksheet.getCell(`A${filaActual}`)
                labelCell.value = label
                labelCell.font = { bold: true }
                labelCell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFE5E7EB' }
                }
                
                const valueCell = worksheet.getCell(`B${filaActual}`)
                valueCell.value = value
                filaActual++
              }
              
              filaActual++
              
              // SECCIÓN: IMÁGENES DEL CHECKLIST
              worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
              const seccionImagenes = worksheet.getCell(`A${filaActual}`)
              seccionImagenes.value = 'IMÁGENES DEL CHECKLIST'
              seccionImagenes.font = { size: 12, bold: true, color: { argb: 'FFFFFFFF' } }
              seccionImagenes.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF8B5CF6' }
              }
              seccionImagenes.alignment = { vertical: 'middle', horizontal: 'center' }
              filaActual++
              
              // Mapeo de campos de imagen con sus nombres
              const imagenesChecklist = [
                { campo: 'polizaSeguroImagen', nombre: 'Póliza de Seguro' },
                { campo: 'accesoriosHerramientaImagen', nombre: 'Accesorios y Herramientas' },
                { campo: 'odometroImagen', nombre: 'Odómetro' },
                { campo: 'combustibleImagen', nombre: 'Combustible' },
                { campo: 'testigosImagen', nombre: 'Testigos' },
                { campo: 'segurosImagen', nombre: 'Seguros' },
                { campo: 'cristalesImagen', nombre: 'Cristales' },
                { campo: 'vestidurasImagen', nombre: 'Vestiduras' },
                { campo: 'cabecerasImagen', nombre: 'Cabeceras' },
                { campo: 'carroceriaLadoDerechoImagen', nombre: 'Carrocería Lado Derecho' },
                { campo: 'carroceriaLadoIzquierdoImagen', nombre: 'Carrocería Lado Izquierdo' },
                { campo: 'carroceriaFrenteImagen', nombre: 'Carrocería Frente' },
                { campo: 'carroceriaTraseraImagen', nombre: 'Carrocería Trasera' },
                { campo: 'luzFaroDerechoImagen', nombre: 'Luz Faro Derecho' },
                { campo: 'luzFaroIzquierdoImagen', nombre: 'Luz Faro Izquierdo' },
                { campo: 'tableroInstrumentosImagen', nombre: 'Tablero de Instrumentos' },
                { campo: 'espejoRetrovisorImagen', nombre: 'Espejo Retrovisor' },
                { campo: 'tapaBaulesImagen', nombre: 'Tapa Baúles' },
                { campo: 'llantasImagen', nombre: 'Llantas' },
                { campo: 'paraChoqueDelanteImagen', nombre: 'Parachoque Delante' },
                { campo: 'paraChoqueTraseraImagen', nombre: 'Parachoque Trasera' },
                { campo: 'sistemaEscapeImagen', nombre: 'Sistema de Escape' },
                { campo: 'escapeCatalizadorImagen', nombre: 'Escape Catalizador' }
              ]
              
              let imagenAgregada = false
              
              for (const { campo, nombre } of imagenesChecklist) {
                const imagenUrl = checklist[campo]
                
                if (imagenUrl) {
                  try {
                    // Construir URL completa
                    let urlCompleta = imagenUrl
                    if (!imagenUrl.startsWith('http')) {
                      // Usar la base URL de la API
                      const baseURL = apiClient.defaults.baseURL || 'http://localhost:8000'
                      urlCompleta = `${baseURL}${imagenUrl.startsWith('/') ? imagenUrl : '/' + imagenUrl}`
                    }
                    
                    // Descargar la imagen
                    const imageResponse = await fetch(urlCompleta)
                    
                    if (imageResponse.ok) {
                      const imageBlob = await imageResponse.blob()
                      const arrayBuffer = await imageBlob.arrayBuffer()
                      
                      // Determinar la extensión de la imagen
                      let extension = 'jpeg'
                      const contentType = imageResponse.headers.get('content-type')
                      if (contentType) {
                        if (contentType.includes('png')) extension = 'png'
                        else if (contentType.includes('jpg') || contentType.includes('jpeg')) extension = 'jpeg'
                        else if (contentType.includes('gif')) extension = 'gif'
                      }
                      
                      // Agregar la imagen al workbook
                      const imageId = workbook.addImage({
                        buffer: arrayBuffer,
                        extension: extension
                      })
                      
                      // Escribir el nombre de la imagen
                      const labelCell = worksheet.getCell(`A${filaActual}`)
                      labelCell.value = nombre
                      labelCell.font = { bold: true }
                      labelCell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFF3F4F6' }
                      }
                      
                      // Aumentar altura de fila para la imagen
                      worksheet.getRow(filaActual).height = 120
                      
                      // Insertar imagen en la celda B
                      worksheet.addImage(imageId, {
                        tl: { col: 1, row: filaActual - 1 },
                        ext: { width: 200, height: 150 }
                      })
                      
                      filaActual++
                      imagenAgregada = true
                    } else {
                      // Si no se puede descargar, mostrar mensaje
                      const labelCell = worksheet.getCell(`A${filaActual}`)
                      labelCell.value = nombre
                      labelCell.font = { bold: true }
                      
                      const valueCell = worksheet.getCell(`B${filaActual}`)
                      valueCell.value = 'Imagen no disponible'
                      valueCell.font = { italic: true, color: { argb: 'FFEF4444' } }
                      filaActual++
                    }
                  } catch (imageError) {
                    console.error(`Error al procesar imagen ${nombre}:`, imageError)
                    // Si hay error, mostrar mensaje
                    const labelCell = worksheet.getCell(`A${filaActual}`)
                    labelCell.value = nombre
                    labelCell.font = { bold: true }
                    
                    const valueCell = worksheet.getCell(`B${filaActual}`)
                    valueCell.value = 'Error al cargar imagen'
                    valueCell.font = { italic: true, color: { argb: 'FFEF4444' } }
                    filaActual++
                  }
                }
              }
              
              if (!imagenAgregada) {
                const noImagenesCell = worksheet.getCell(`A${filaActual}`)
                noImagenesCell.value = 'No hay imágenes disponibles'
                noImagenesCell.font = { italic: true, color: { argb: 'FF6B7280' } }
                worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
                filaActual++
              }
            } else {
              // No hay checklist
              worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
              const noChecklistCell = worksheet.getCell(`A${filaActual}`)
              noChecklistCell.value = 'No hay checklist asociado a esta recepción'
              noChecklistCell.font = { italic: true, color: { argb: 'FF6B7280' } }
              noChecklistCell.alignment = { horizontal: 'center' }
              filaActual++
            }
          } catch (checklistError) {
            console.error(`Error al obtener checklist para recepción ${recepcion.id}:`, checklistError)
            // Si hay error al obtener el checklist
            worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
            const errorCell = worksheet.getCell(`A${filaActual}`)
            errorCell.value = 'Error al cargar datos del checklist'
            errorCell.font = { italic: true, color: { argb: 'FFEF4444' } }
            errorCell.alignment = { horizontal: 'center' }
            filaActual++
          }
        }
        
        // Generar el archivo Excel
        const buffer = await workbook.xlsx.writeBuffer()
        
        // Crear blob y descargar
        const blob = new Blob([buffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        })
        
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        
        // Nombre del archivo con fecha
        const fecha = new Date().toISOString().split('T')[0]
        link.download = `Recepciones_${fecha}.xlsx`
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        toastStore.addToast({
          message: 'Excel exportado correctamente',
          type: 'success',
          duration: 3000
        })
      } catch (error) {
        console.error('Error al exportar Excel:', error)
        toastStore.addToast({
          message: 'Error al exportar el archivo Excel',
          type: 'error',
          duration: 5000
        })
      } finally {
        exportandoExcel.value = false
      }
    }

    // Reset de filtros
    const resetFiltros = () => {
      searchQuery.value = ''
      dateFrom.value = ''
      dateTo.value = ''
      currentPage.value = 1
    }

    // Watchers para filtros
    watch([searchQuery], () => {
      currentPage.value = 1
    })

    // Cargar datos al montar el componente
    onMounted(() => {
      cargarRecepciones()
      cargarTalleres()
    })

    return {
      recepciones,
      talleres,
      isLoading,
      error,
      searchQuery,
      dateFrom,
      dateTo,
      currentPage,
      totalItems,
      totalPages,
      paginatedData,
      currentDate,
      minDate,
      startRecord,
      endRecord,
      visiblePages,
      showRecepcionModal,
      showDetallesModal,
      currentRecepcion,
      recepcionToEdit,
      isAdmin,
      exportandoExcel,
      previousPage,
      nextPage,
      goToPage,
      abrirModalNuevaRecepcion,
      verDetalles,
      editarRecepcion,
      handleRecepcionGuardada,
      resetFiltros,
      cargarRecepciones,
      cargarTalleres,
      getTallerNombre,
      exportarExcel
    }
  }
}
</script>
