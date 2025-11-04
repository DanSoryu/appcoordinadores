<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Recepciones de Vehículos</h2>
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kilometraje</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taller</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entregado por</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-gray-50 divide-x divide-gray-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.fecha_recepcion }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.kilometraje?.toLocaleString() }} km</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.taller_recepcion }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.numero_serie }} - {{ item.marca }} {{ item.modelo }} {{ item.año }}
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
                <td colspan="6" class="px-6 py-8 text-center text-gray-500">
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
                <p class="text-sm font-medium text-gray-500">ID</p>
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
                <p class="font-semibold">{{ currentRecepcion.taller_recepcion }}</p>
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
import apiClient from '../../services/api.js'
import DatosRecepcionFormModal from './DatosRecepcionFormModal.vue'

export default {
  name: 'RecepcionTable',
  components: {
    DatosRecepcionFormModal
  },
  setup() {
    const toastStore = useToastStore()
    const isLoading = ref(false)
    const error = ref(null)
    
    // Datos de recepción desde API
    const recepciones = ref([])

    // Modales
    const showRecepcionModal = ref(false)
    const showDetallesModal = ref(false)
    const currentRecepcion = ref(null)
    const recepcionToEdit = ref(null)

    // Filtros
    const searchQuery = ref('')
    const dateFrom = ref('')
    const dateTo = ref('')

    // Paginación
    const currentPage = ref(1)
    const itemsPerPage = 10
    const totalItems = ref(0)
    const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))

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
          return (
            item.id.toString().includes(search) ||
            item.fecha_recepcion.toLowerCase().includes(search) ||
            item.taller_recepcion.toLowerCase().includes(search) ||
            item.numero_economico.toLowerCase().includes(search) ||
            item.numero_serie.toLowerCase().includes(search) ||
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
            marca: vehiculo?.marca || 'N/A',
            modelo: vehiculo?.modelo || 'N/A',
            año: vehiculo?.año || 'N/A'
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
        taller_recepcion: item.taller_recepcion,
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
    })

    return {
      recepciones,
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
      previousPage,
      nextPage,
      goToPage,
      abrirModalNuevaRecepcion,
      verDetalles,
      editarRecepcion,
      handleRecepcionGuardada,
      resetFiltros,
      cargarRecepciones
    }
  }
}
</script>
