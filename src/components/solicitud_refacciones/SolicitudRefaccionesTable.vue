<template>
  <div>
    <!-- Encabezado con título -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Solicitudes de Refacciones</h2>
    </div>

    <!-- Filtros de búsqueda -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por folio de orden..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <!-- Tabla de Solicitudes -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-gray-600">Cargando solicitudes...</span>
      </div>
      <div v-else-if="error" :class="[
        'p-4 text-center',
        error === 'No hay datos disponibles' ? 'text-gray-600 bg-gray-50' : 'text-red-600 bg-red-50'
      ]">
        <div class="flex items-center justify-center space-x-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <span>{{ error }}</span>
        </div>
        <button v-if="error !== 'No hay datos disponibles'" @click="cargarSolicitudes()" class="ml-2 text-blue-600 hover:text-blue-800 underline">
          Reintentar
        </button>
      </div>
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio Diagnóstico</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Refacciones</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="solicitud in paginatedData" :key="solicitud.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{{ solicitud.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span class="font-semibold">{{ solicitud.folio_diagnostico }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ solicitud.diagnostico?.vehiculo_placa || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ formatDate(solicitud.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ solicitud.total_refacciones || 0 }} items
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div class="flex items-center justify-center space-x-2">
                    <button
                      @click="verDetalles(solicitud)"
                      class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      title="Ver detalles"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      Ver
                    </button>
                    <button
                      @click="abrirModalSolicitud(solicitud)"
                      class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      title="Agregar refacciones"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      Solicitar
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
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Anterior
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando
                <span class="font-medium">{{ startRecord }}</span>
                a
                <span class="font-medium">{{ endRecord }}</span>
                de
                <span class="font-medium">{{ totalItems }}</span>
                resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span class="sr-only">Anterior</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
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
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span class="sr-only">Siguiente</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles de Solicitud -->
    <div v-if="showDetallesModal" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white w-[90%] max-w-3xl max-h-[90vh] rounded-lg shadow-xl">
        <!-- Encabezado del modal -->
        <div class="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h3 class="text-xl font-bold">Detalles de Solicitud #{{ currentSolicitud?.id }}</h3>
          <button @click="showDetallesModal = false" class="text-white hover:text-gray-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <!-- Contenido del modal -->
        <div class="p-6 overflow-y-auto" style="max-height: calc(90vh - 80px);">
          <div v-if="currentSolicitud">
            <!-- Información general -->
            <div class="mb-6 bg-gray-50 p-4 rounded-lg">
              <h4 class="font-semibold text-lg mb-3 text-gray-800">Información General</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span class="text-sm text-gray-600">Folio Diagnóstico:</span>
                  <p class="font-semibold text-gray-900">{{ currentSolicitud.folio_diagnostico }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-600">Vehículo:</span>
                  <p class="font-semibold text-gray-900">{{ currentSolicitud.diagnostico?.vehiculo_placa || 'N/A' }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-600">Fecha de Solicitud:</span>
                  <p class="font-semibold text-gray-900">{{ formatDate(currentSolicitud.created_at) }}</p>
                </div>
                <div>
                  <span class="text-sm text-gray-600">Total de Items:</span>
                  <p class="font-semibold text-gray-900">{{ currentSolicitud.refacciones?.length || 0 }} items</p>
                </div>
              </div>
            </div>

            <!-- Lista de refacciones agrupadas por tipo -->
            <div class="mb-6">
              <h4 class="font-semibold text-lg mb-3 text-gray-800">Refacciones Solicitadas</h4>
              <div v-if="currentSolicitud.refacciones && currentSolicitud.refacciones.length > 0">
                <div v-for="(items, tipo) in refaccionesAgrupadasPorTipo" :key="tipo" class="mb-4">
                  <div class="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-t-lg border-l-4" :class="getTipoColor(tipo)">
                    <h5 class="font-bold text-gray-800">{{ tipo }}</h5>
                  </div>
                  <div class="border border-t-0 rounded-b-lg p-4">
                    <ul class="space-y-2">
                      <li v-for="refaccion in items" :key="refaccion.id" class="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                        <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        <div class="flex-1">
                          <p class="font-semibold text-gray-900">{{ refaccion.nombre }}</p>
                          <p v-if="refaccion.descripcion" class="text-sm text-gray-600">{{ refaccion.descripcion }}</p>
                          <p class="text-xs text-gray-500 mt-1">Sistema: {{ refaccion.sistema }}</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-gray-500 py-4">
                No hay refacciones en esta solicitud
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Formulario de Solicitud -->
    <SolicitudRefaccionesFormModal
      :show="showSolicitudModal"
      :solicitudData="solicitudParaEditar"
      @close="cerrarModalSolicitud"
      @solicitud-guardada="onSolicitudGuardada"
    />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useToastStore } from '../../stores/toast.js'
import { useAuthStore } from '../../stores/auth.js'
import SolicitudRefaccionesFormModal from './SolicitudRefaccionesFormModal.vue'
import apiClient from '../../services/api.js'

export default {
  name: 'SolicitudRefaccionesTable',
  components: {
    SolicitudRefaccionesFormModal
  },
  setup() {
    const toastStore = useToastStore()
    const authStore = useAuthStore()
    
    // Estados reactivos
    const isLoading = ref(false)
    const error = ref(null)
    const solicitudesData = ref([])
    const currentSolicitud = ref(null)
    const showDetallesModal = ref(false)
    
    // Estados para el modal de solicitud
    const showSolicitudModal = ref(false)
    const solicitudParaEditar = ref(null)
    
    // Filtros
    const searchQuery = ref('')
    
    // Paginación
    const currentPage = ref(1)
    const itemsPerPage = 10
    const totalItems = ref(0)
    const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))

    // Computed properties para filtrado
    const filteredData = computed(() => {
      let result = solicitudesData.value

      // Filtrar por búsqueda general
      if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase()
        result = result.filter(item => {
          const folio = item.folio_diagnostico?.toString().toLowerCase() || ''
          const placa = item.diagnostico?.vehiculo_placa?.toLowerCase() || ''
          return folio.includes(search) || placa.includes(search)
        })
      }

      totalItems.value = result.length
      return result
    })

    // Paginar datos filtrados
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
      const totalPagesValue = Math.ceil(filteredData.value.length / itemsPerPage)
      
      pages.push(1)
      
      if (currentPage.value > 2) {
        pages.push(currentPage.value - 1)
      }
      
      if (currentPage.value > 1) {
        pages.push(currentPage.value)
      }
      
      if (currentPage.value + 1 < totalPagesValue) {
        pages.push(currentPage.value + 1)
      }
      
      if (totalPagesValue > 1 && !pages.includes(totalPagesValue)) {
        pages.push(totalPagesValue)
      }
      
      return [...new Set(pages)].sort((a, b) => a - b)
    })

    // Computed para agrupar refacciones por tipo
    const refaccionesAgrupadasPorTipo = computed(() => {
      if (!currentSolicitud.value?.refacciones) return {}
      
      return currentSolicitud.value.refacciones.reduce((grupos, refaccion) => {
        const tipo = refaccion.tipo || 'OTRO'
        if (!grupos[tipo]) {
          grupos[tipo] = []
        }
        grupos[tipo].push(refaccion)
        return grupos
      }, {})
    })

    // Métodos de paginación
    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      const totalPagesValue = Math.ceil(filteredData.value.length / itemsPerPage)
      if (currentPage.value < totalPagesValue) {
        currentPage.value++
      }
    }

    const goToPage = (page) => {
      currentPage.value = page
    }

    // Métodos para cargar datos
    const cargarSolicitudes = async () => {
      isLoading.value = true
      error.value = null
      
      try {
        const response = await apiClient.get('/solicitudes-refacciones')
        
        if (!response.data || !Array.isArray(response.data.data)) {
          throw new Error('Formato de respuesta inválido')
        }
        
        solicitudesData.value = response.data.data.map(solicitud => ({
          id: solicitud.id,
          folio_diagnostico: solicitud.folio_diagnostico,
          created_at: solicitud.created_at,
          updated_at: solicitud.updated_at,
          diagnostico: solicitud.diagnostico,
          refacciones: solicitud.refacciones || [],
          total_refacciones: solicitud.refacciones?.length || 0,
          _original: solicitud
        }))
        
        console.log('Datos de solicitudes cargados:', solicitudesData.value.length, 'registros')
      } catch (err) {
        console.error('Error al cargar solicitudes:', err)
        error.value = err.response?.data?.message || 'Error al cargar las solicitudes'
        toastStore.addToast({
          type: 'error',
          message: error.value,
          duration: 5000
        })
      } finally {
        isLoading.value = false
      }
    }

    // Métodos de acciones
    const verDetalles = async (solicitud) => {
      try {
        // Cargar los detalles completos de la solicitud
        const response = await apiClient.get(`/solicitudes-refacciones/${solicitud.id}`)
        
        if (response.data && response.data.data) {
          currentSolicitud.value = response.data.data
          showDetallesModal.value = true
        }
      } catch (err) {
        console.error('Error al cargar detalles:', err)
        toastStore.addToast({
          type: 'error',
          message: 'Error al cargar los detalles de la solicitud',
          duration: 5000
        })
      }
    }

    const abrirModalSolicitud = (solicitud) => {
      solicitudParaEditar.value = { ...solicitud }
      showSolicitudModal.value = true
    }

    const cerrarModalSolicitud = () => {
      showSolicitudModal.value = false
      solicitudParaEditar.value = null
    }

    const onSolicitudGuardada = async () => {
      try {
        await cargarSolicitudes()
        cerrarModalSolicitud()
        toastStore.addToast({
          type: 'success',
          message: 'Solicitud guardada exitosamente',
          duration: 3000
        })
      } catch (err) {
        console.error('Error al recargar solicitudes:', err)
      }
    }

    // Utilidades
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getTipoColor = (tipo) => {
      const colores = {
        'REFACCION': 'border-blue-500',
        'INSUMO': 'border-green-500',
        'HERRAMIENTA': 'border-yellow-500',
        'SERVICIO': 'border-purple-500'
      }
      return colores[tipo] || 'border-gray-500'
    }

    // Watchers para reiniciar paginación cuando cambian los filtros
    watch([searchQuery], () => {
      currentPage.value = 1
    })

    // Cargar datos al montar el componente
    onMounted(() => {
      cargarSolicitudes()
    })

    return {
      // Estados
      isLoading,
      error,
      solicitudesData,
      currentSolicitud,
      showDetallesModal,
      
      // Estados del modal de solicitud
      showSolicitudModal,
      solicitudParaEditar,
      
      // Filtros
      searchQuery,
      
      // Paginación
      currentPage,
      totalItems,
      totalPages,
      paginatedData,
      startRecord,
      endRecord,
      visiblePages,
      
      // Computed
      refaccionesAgrupadasPorTipo,
      
      // Métodos
      cargarSolicitudes,
      verDetalles,
      abrirModalSolicitud,
      cerrarModalSolicitud,
      onSolicitudGuardada,
      previousPage,
      nextPage,
      goToPage,
      formatDate,
      getTipoColor
    }
  }
}
</script>

<style scoped>
.table-fixed {
  table-layout: fixed;
}
</style>
