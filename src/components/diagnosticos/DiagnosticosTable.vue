<template>
  <div>
    <!-- Encabezado con título -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Diagnósticos</h2>
    </div>

    <!-- Filtros de búsqueda -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Búsqueda General</label>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar folio de recepción..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select 
            v-model="estadoFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="completado">Completados</option>
            <option value="pendiente">Pendientes</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabla de Diagnósticos -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-gray-600">Cargando diagnósticos...</span>
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
        <button v-if="error !== 'No hay datos disponibles'" @click="cargarDiagnosticos()" class="ml-2 text-blue-600 hover:text-blue-800 underline">
          Reintentar
        </button>
      </div>
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse table-fixed">
            <thead class="bg-gray-50">
              <tr class="divide-x divide-gray-200">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Folio Recepción</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Mecánico</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Estado</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="diagnostico in paginatedData" :key="diagnostico.id" 
                  :class="[
                    'hover:bg-gray-50 divide-x divide-gray-200',
                    diagnostico.estado === 'completado' ? 'bg-green-50' : ''
                  ]">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div class="flex items-center space-x-2">
                    <span>{{ diagnostico.folioRecepcion }}</span>
                    <span v-if="diagnostico.estado === 'completado'" 
                          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      ✓ Completado
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ diagnostico.mecanicoNombre || 'No asignado' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                    diagnostico.estado === 'completado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ diagnostico.estado === 'completado' ? 'Completado' : 'Pendiente' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <div class="flex justify-center space-x-2">
                    <!-- Botón Ver - Siempre visible -->
                    <button 
                      @click="verDetalles(diagnostico)"
                      class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      title="Ver detalles del diagnóstico"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      Ver
                    </button>
                    
                    <!-- Botón Terminar - Solo cuando está pendiente -->
                    <button 
                      v-if="diagnostico.estado !== 'completado'"
                      @click="abrirModalDiagnostico(diagnostico)"
                      class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      title="Terminar diagnóstico"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Terminar
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Mensaje cuando no hay datos -->
              <tr v-if="paginatedData.length === 0 && !isLoading">
                <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                  No se encontraron diagnósticos.
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
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Anterior</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles de Diagnóstico -->
    <div v-if="showDetallesModal" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white w-[90%] max-w-2xl max-h-[90vh] rounded-lg shadow-xl">
        <!-- Encabezado del modal -->
        <div class="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h3 class="text-xl font-semibold">Detalles del Diagnóstico</h3>
          <button @click="showDetallesModal = false" class="text-white hover:text-gray-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Contenido del modal -->
        <div class="p-6 overflow-y-auto" style="max-height: calc(90vh - 80px);">
          <div v-if="currentDiagnostico" class="space-y-6">
            
            <!-- Información General -->
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="text-lg font-semibold text-blue-800 mb-3">Información General</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-500">ID Diagnóstico</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentDiagnostico.id }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Folio de Recepción</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentDiagnostico.folioRecepcion }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Mecánico Asignado</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentDiagnostico.mecanicoNombre || 'No asignado' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Estado</label>
                  <span :class="[
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                    currentDiagnostico.estado === 'completado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ currentDiagnostico.estado === 'completado' ? 'Completado' : 'Pendiente' }}
                  </span>
                </div>
                <div v-if="currentDiagnostico.fechaCreacion">
                  <label class="text-sm font-medium text-gray-500">Fecha de Creación</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ formatDate(currentDiagnostico.fechaCreacion) }}</p>
                </div>
                <div v-if="currentDiagnostico.fechaCompletado && currentDiagnostico.estado === 'completado'">
                  <label class="text-sm font-medium text-gray-500">Fecha de Completado</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ formatDate(currentDiagnostico.fechaCompletado) }}</p>
                </div>
              </div>
            </div>

            <!-- Diagnósticos Realizados -->
            <div v-if="currentDiagnostico.diagnosticos && currentDiagnostico.diagnosticos.length > 0" class="bg-gray-50 p-4 rounded-lg">
              <h4 class="text-lg font-semibold text-gray-800 mb-3">Diagnósticos Realizados por Sección</h4>
              <div class="space-y-4">
                <div v-for="(diagnostico, index) in currentDiagnostico.diagnosticos" :key="index" 
                     class="bg-white p-4 rounded-lg border shadow-sm">
                  <!-- Encabezado de la sección -->
                  <div class="flex items-center mb-3">
                    <div class="flex-shrink-0 w-3 h-3 rounded-full mr-3"
                         :class="getSectionColor(diagnostico.seccion)"></div>
                    <h5 class="text-base font-semibold text-gray-800">{{ diagnostico.seccion }}</h5>
                  </div>
                  
                  <!-- Fallas encontradas como lista -->
                  <div class="mb-3">
                    <label class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                      Fallas Identificadas
                    </label>
                    <div class="bg-red-50 p-3 rounded border-l-4 border-red-400">
                      <ul class="space-y-1">
                        <li v-for="falla in parseFallasFromDescription(diagnostico.descripcion)" :key="falla" 
                            class="flex items-center text-sm text-gray-700">
                          <svg class="w-3 h-3 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                          </svg>
                          {{ falla }}
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <!-- Comentarios técnicos -->
                  <div v-if="diagnostico.comentarios" class="mt-4">
                    <label class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                      Observaciones Técnicas
                    </label>
                    <div class="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                      <p class="text-sm text-gray-700 leading-relaxed">
                        {{ diagnostico.comentarios }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Observaciones -->
            <div v-if="currentDiagnostico.observaciones" class="bg-yellow-50 p-4 rounded-lg">
              <h4 class="text-lg font-semibold text-yellow-800 mb-3">Observaciones Generales</h4>
              <p class="text-sm text-gray-900">{{ currentDiagnostico.observaciones }}</p>
            </div>

            <!-- Mensaje para diagnósticos pendientes -->
            <div v-if="currentDiagnostico.estado !== 'completado'" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-blue-800">Diagnóstico Pendiente</h3>
                  <div class="mt-2 text-sm text-blue-700">
                    <p>Este diagnóstico aún no ha sido completado. Use el botón "Terminar" en la tabla para completarlo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Formulario de Diagnóstico -->
    <DiagnosticosFormModal
      :show="showDiagnosticoModal"
      :diagnosticoData="diagnosticoParaCompletar"
      @close="cerrarModalDiagnostico"
      @diagnostico-guardado="onDiagnosticoGuardado"
    />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useToastStore } from '../../stores/toast.js'
import { useAuthStore } from '../../stores/auth.js'
import DiagnosticosFormModal from './DiagnosticosFormModal.vue'
import apiClient from '../../services/api.js'

export default {
  name: 'DiagnosticosTable',
  components: {
    DiagnosticosFormModal
  },
  setup() {
    const toastStore = useToastStore()
    const authStore = useAuthStore()
    
    // Estados reactivos
    const isLoading = ref(false)
    const error = ref(null)
    const diagnosticosData = ref([])
    const currentDiagnostico = ref(null)
    const showDetallesModal = ref(false)
    
    // Estados para el modal de diagnóstico
    const showDiagnosticoModal = ref(false)
    const diagnosticoParaCompletar = ref(null)
    
    // Filtros
    const searchQuery = ref('')
    const estadoFilter = ref('')
    
    // Paginación
    const currentPage = ref(1)
    const itemsPerPage = 10
    const totalItems = ref(0)
    const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))

    // Computed properties para filtrado
    const filteredData = computed(() => {
      let result = diagnosticosData.value

      // Filtrar por estado
      if (estadoFilter.value) {
        result = result.filter(item => item.estado === estadoFilter.value)
      }

      // Filtrar por búsqueda general
      if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase()
        result = result.filter(item => {
          return item.folioRecepcion.toLowerCase().includes(search) ||
                 item.id.toString().includes(search)
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
      
      // Siempre agregar página 1
      pages.push(1)
      
      // Agregar página anterior a la actual si existe y no es 1
      if (currentPage.value > 2) {
        pages.push(currentPage.value - 1)
      }
      
      // Agregar página actual si no es 1
      if (currentPage.value > 1) {
        pages.push(currentPage.value)
      }
      
      // Agregar página siguiente si existe y no es la última
      if (currentPage.value + 1 < totalPagesValue) {
        pages.push(currentPage.value + 1)
      }
      
      // Agregar última página si no está ya agregada
      if (totalPagesValue > 1 && !pages.includes(totalPagesValue)) {
        pages.push(totalPagesValue)
      }
      
      // Remover duplicados y ordenar
      return [...new Set(pages)].sort((a, b) => a - b)
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
    const cargarDiagnosticos = async () => {
      isLoading.value = true
      error.value = null
      
      try {
        const response = await apiClient.get('/diagnosticos')
        
        if (!response.data || !Array.isArray(response.data.diagnosticos)) {
          throw new Error('Estructura de datos inválida')
        }
        
        // Mapear datos de la API al formato esperado por el frontend
        diagnosticosData.value = response.data.diagnosticos.map(diagnostico => ({
          id: diagnostico.id,
          folioRecepcion: `REC-${diagnostico.recepcion_id}`,
          estado: diagnostico.fecha_completado ? 'completado' : 'pendiente',
          fechaCreacion: diagnostico.created_at,
          fechaCompletado: diagnostico.fecha_completado,
          mecanicoNombre: diagnostico.mecanico_nombre,
          mecanicoId: diagnostico.mecanico_id,
          // Extraer diagnósticos de los campos JSON
          diagnosticos: extraerDiagnosticos(diagnostico),
          observaciones: generarObservaciones(diagnostico),
          // Guardar los datos originales para el modal de edición
          _original: diagnostico
        }))
        
        console.log('Datos de diagnósticos cargados:', diagnosticosData.value.length, 'registros')
      } catch (err) {
        console.error('Error al cargar diagnósticos:', err)
        error.value = err.response?.data?.message || 'Error al cargar los diagnósticos'
        toastStore.addToast({
          message: error.value,
          type: 'error',
          duration: 5000
        })
      } finally {
        isLoading.value = false
      }
    }

    // Función auxiliar para convertir nombres de campos a texto legible
    const convertirCampoATexto = (campo) => {
      const mapeoTextos = {
        // Motor
        motorEmpaques: 'Empaques dañados',
        motorSellos: 'Sellos desgastados',
        motorDesgasteAnillos: 'Desgaste de anillos',
        motorDesgasteValvulas: 'Desgaste de válvulas',
        motorFaltaLubricacion: 'Falta de lubricación',
        motorPiezasSueltas: 'Piezas sueltas',
        motorBujias: 'Bujías defectuosas',
        motorBateria: 'Problemas de batería',
        motorBombaGasolina: 'Bomba de gasolina',
        motorFallaRadiador: 'Falla en radiador',
        motorFallaTermostato: 'Falla en termostato',
        motorSoportes: 'Soportes dañados',
        
        // Transmisión
        transmisionRetenesDanados: 'Retenes dañados',
        transmisionJuntasDanadas: 'Juntas dañadas',
        transmisionNivelBajoFlujo: 'Nivel bajo de fluido',
        transmisionDesgasteInterno: 'Desgaste interno',
        transmisionDesgasteDiscos: 'Desgaste de discos',
        transmisionConvertidorTorque: 'Convertidor de torque',
        transmisionMantenimientoProgramado: 'Mantenimiento programado',
        
        // Frenos
        frenosAireEnSistema: 'Aire en el sistema',
        frenosFugaLiquido: 'Fuga de líquido',
        frenosBalatasDesgastadas: 'Balatas desgastadas',
        frenosDiscoDesgastado: 'Disco desgastado',
        frenosClipers: 'Calipers defectuosos',
        frenosManguerasDefectuosas: 'Mangueras defectuosas',
        frenosControlDesgastePeriodico: 'Control de desgaste periódico',
        
        // Sistema Eléctrico
        electricoCeldasDanadas: 'Celdas de batería dañadas',
        electricoAlternadorDefectuoso: 'Alternador defectuoso',
        electricoBandaSuelta: 'Banda suelta',
        electricoAlternadorDanado: 'Alternador dañado',
        electricoFocoFundido: 'Foco fundido',
        electricoConectoresSulfatados: 'Conectores sulfatados',
        electricoInspeccionPeriodica: 'Inspección periódica',
        
        // Suspensión y Dirección
        suspensionDesgaste: 'Desgaste en suspensión',
        suspensionRupturaRetenes: 'Ruptura de retenes',
        direccionTerminales: 'Terminales de dirección',
        direccionCremalleras: 'Cremalleras dañadas',
        suspensionBujesDanados: 'Bujes dañados',
        suspensionRotulasDanadas: 'Rótulas dañadas',
        suspensionAjusteProgramado: 'Ajuste programado',
        
        // Sistema de Enfriamiento
        enfriamientoManguerasPerforadas: 'Mangueras perforadas',
        enfriamientoNucleoPerforado: 'Núcleo perforado',
        enfriamientoDesgasteReten: 'Desgaste de retén',
        enfriamientoDesgasteRodamiento: 'Desgaste de rodamiento',
        enfriamientoTermostatoBloqueado: 'Termostato bloqueado',
        enfriamientoControlTemperatura: 'Control de temperatura',
        
        // Sistema de Escape
        escapeFugasPerforaciones: 'Fugas y perforaciones',
        escapeCorrosion: 'Corrosión',
        escapeImpacto: 'Daños por impacto',
        escapeRuidoExcesivo: 'Ruido excesivo',
        escapeSilenciadorRoto: 'Silenciador roto',
        escapeSilenciadorSuelto: 'Silenciador suelto',
        escapeCatalizadorObstruido: 'Catalizador obstruido',
        escapeMalaCombustion: 'Mala combustión',
        
        // Sistema de Climatización
        climatizacionAcNoEnfria: 'A/C no enfría',
        climatizacionFugaGas: 'Fuga de gas refrigerante',
        climatizacionCompresorDanado: 'Compresor dañado',
        climatizacionMalOlorVentilacion: 'Mal olor en ventilación',
        climatizacionFiltroCabinaSucio: 'Filtro de cabina sucio',
        climatizacionRevisionPresionesGas: 'Revisión de presiones de gas',
        climatizacionNoCalienta: 'No calienta',
        climatizacionFallaTermostato: 'Falla en termostato',
        climatizacionRadiadorInterior: 'Radiador interior',
        
        // Carrocería y Accesorios
        carroceriaRayonesAbolladuras: 'Rayones y abolladuras',
        carroceriaGolpes: 'Golpes en carrocería',
        carroceriaRoces: 'Roces',
        puertasCierreDeficiente: 'Cierre deficiente de puertas',
        puertasCerraduras: 'Cerraduras dañadas',
        puertasBisagraDesajustada: 'Bisagras desajustadas',
        cristalesGrietasAstilladuras: 'Grietas y astilladuras en cristales',
        cristalesImpactoCristal: 'Impacto en cristal',
        cristalesTensionTermica: 'Tensión térmica',
        limpiaParabrisasNoFunciona: 'Limpiaparabrisas no funciona',
        limpiaParabrisasMotorDanado: 'Motor de limpiaparabrisas dañado',
        limpiaParabrisasFusibleDanado: 'Fusible dañado',
        
        // Llantas y Rines
        llantasDesgasteIrregular: 'Desgaste irregular de llantas',
        llantasAlineacion: 'Problemas de alineación',
        llantasBalanceoDeficiente: 'Balanceo deficiente',
        llantasPresionIncorrecta: 'Presión incorrecta',
        llantasRevisionPeriodica: 'Revisión periódica',
        llantasRevisionFechaFabricacion: 'Revisión de fecha de fabricación',
        llantasControlVidaUtil: 'Control de vida útil',
        rinesGolpeadosDeformados: 'Rines golpeados o deformados',
        rinesImpactoBaches: 'Impacto por baches',
        rinesImpactoBanquetas: 'Impacto por banquetas'
      }
      
      return mapeoTextos[campo] || campo.replace(/_/g, ' ')
    }

    // Funciones auxiliares para procesar datos de la API
    const extraerDiagnosticos = (diagnostico) => {
      const diagnosticos = []
      
      // Mapear los campos JSON de la base de datos
      const campos = [
        { bd: 'detalle_motor', seccion: 'Motor' },
        { bd: 'detalle_transmision', seccion: 'Transmisión' },
        { bd: 'detalle_frenos', seccion: 'Frenos' },
        { bd: 'detalle_sistema_electrico', seccion: 'Sistema Eléctrico' },
        { bd: 'detalle_suspension_direccion', seccion: 'Suspensión y Dirección' },
        { bd: 'detalle_sistema_enfriamiento', seccion: 'Sistema de Enfriamiento' },
        { bd: 'detalle_sistema_escape', seccion: 'Sistema de Escape' },
        { bd: 'detalle_sistema_climatizacion', seccion: 'Sistema de Climatización' },
        { bd: 'detalle_carroceria_accesorios', seccion: 'Carrocería y Accesorios' },
        { bd: 'detalle_llantas_rines', seccion: 'Llantas y Rines' }
      ]
      
      campos.forEach(campo => {
        if (diagnostico[campo.bd]) {
          try {
            const detalles = typeof diagnostico[campo.bd] === 'string' 
              ? JSON.parse(diagnostico[campo.bd]) 
              : diagnostico[campo.bd]
            
            if (detalles && typeof detalles === 'object') {
              // Extraer fallas del objeto
              const fallas = []
              let comentarios = ''
              
              Object.keys(detalles).forEach(key => {
                if (key !== 'tipo_mantenimiento' && !key.includes('Comentarios') && detalles[key] === true) {
                  // Convertir nombres de campos a texto legible
                  const fallaTexto = convertirCampoATexto(key)
                  fallas.push(fallaTexto)
                } else if (key.includes('Comentarios') && detalles[key] && detalles[key].trim()) {
                  // Capturar comentarios (motorComentarios, transmisionComentarios, etc.)
                  comentarios = detalles[key].trim()
                }
              })
              
              if (fallas.length > 0 || comentarios) {
                let descripcion = ''
                if (fallas.length > 0) {
                  descripcion = `${campo.seccion}: ${fallas.join(', ')}.`
                } else {
                  descripcion = `${campo.seccion}: Revisión completada.`
                }
                
                // No agregar comentarios a la descripción, solo mantenerlos separados
                diagnosticos.push({
                  seccion: campo.seccion,
                  descripcion: descripcion,
                  comentarios: comentarios,
                  prioridad: 'media'
                })
              }
            }
          } catch (error) {
            console.error(`Error al procesar ${campo.bd}:`, error)
          }
        }
      })
      
      return diagnosticos
    }
    
    const generarObservaciones = (diagnostico) => {
      const observaciones = []
      
      // Campos de comentarios de cada sección
      const camposComentarios = [
        'detalle_motor',
        'detalle_transmision', 
        'detalle_frenos',
        'detalle_sistema_electrico',
        'detalle_suspension_direccion',
        'detalle_sistema_enfriamiento',
        'detalle_sistema_escape',
        'detalle_sistema_climatizacion',
        'detalle_carroceria_accesorios',
        'detalle_llantas_rines'
      ]
      
      camposComentarios.forEach(campo => {
        if (diagnostico[campo]) {
          try {
            const detalles = typeof diagnostico[campo] === 'string' 
              ? JSON.parse(diagnostico[campo]) 
              : diagnostico[campo]
            
            if (detalles && typeof detalles === 'object') {
              // Buscar el campo de comentarios específico para cada sección
              Object.keys(detalles).forEach(key => {
                if (key.includes('Comentarios') && detalles[key] && detalles[key].trim()) {
                  observaciones.push(detalles[key].trim())
                }
              })
            }
          } catch (error) {
            console.error(`Error al procesar comentarios de ${campo}:`, error)
          }
        }
      })
      
      return observaciones.length > 0 
        ? observaciones.join('. ')
        : (diagnostico.fecha_completado ? 'Diagnóstico completado sin observaciones adicionales' : 'Diagnóstico pendiente de realizar')
    }

    // Métodos de acciones
    const verDetalles = (diagnostico) => {
      currentDiagnostico.value = { ...diagnostico }
      showDetallesModal.value = true
    }

    const abrirModalDiagnostico = (diagnostico) => {
      diagnosticoParaCompletar.value = { ...diagnostico }
      showDiagnosticoModal.value = true
    }

    const cerrarModalDiagnostico = () => {
      showDiagnosticoModal.value = false
      diagnosticoParaCompletar.value = null
    }

    const onDiagnosticoGuardado = async (diagnosticoCompletado) => {
      try {
        // Recargar la lista completa desde la API para obtener datos actualizados
        await cargarDiagnosticos()
        
        toastStore.addToast({
          message: 'Diagnóstico guardado exitosamente',
          type: 'success',
          duration: 3000
        })
        
        cerrarModalDiagnostico()
      } catch (err) {
        console.error('Error al recargar diagnósticos:', err)
        toastStore.addToast({
          message: 'Error al actualizar la lista de diagnósticos',
          type: 'error',
          duration: 5000
        })
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

    const getSectionColor = (seccion) => {
      const colores = {
        'Motor': 'bg-red-500',
        'Transmisión': 'bg-blue-500',
        'Frenos': 'bg-yellow-500',
        'Sistema Eléctrico': 'bg-purple-500',
        'Suspensión y Dirección': 'bg-green-500',
        'Sistema de Enfriamiento': 'bg-cyan-500',
        'Sistema de Escape': 'bg-orange-500',
        'Sistema de Climatización': 'bg-indigo-500',
        'Carrocería y Accesorios': 'bg-pink-500',
        'Llantas y Rines': 'bg-gray-500'
      }
      return colores[seccion] || 'bg-gray-500'
    }

    const parseFallasFromDescription = (descripcion) => {
      if (!descripcion) return []
      
      // Extraer la parte después de los dos puntos y separar por comas
      const match = descripcion.match(/^[^:]+:\s*(.+)$/)
      if (!match) return [descripcion]
      
      const fallasText = match[1].trim()
      
      // Si termina con punto, removerlo antes de separar
      const cleanText = fallasText.endsWith('.') ? fallasText.slice(0, -1) : fallasText
      
      // Separar por comas y limpiar espacios
      return cleanText.split(',').map(falla => falla.trim()).filter(falla => falla.length > 0)
    }

    // Watchers para reiniciar paginación cuando cambian los filtros
    watch([searchQuery, estadoFilter], () => {
      currentPage.value = 1
    })

    // Cargar datos al montar el componente
    onMounted(() => {
      cargarDiagnosticos()
    })

    return {
      // Estados
      isLoading,
      error,
      diagnosticosData,
      currentDiagnostico,
      showDetallesModal,
      
      // Estados del modal de diagnóstico
      showDiagnosticoModal,
      diagnosticoParaCompletar,
      
      // Filtros
      searchQuery,
      estadoFilter,
      
      // Paginación
      currentPage,
      totalItems,
      totalPages,
      paginatedData,
      startRecord,
      endRecord,
      visiblePages,
      
      // Métodos
      cargarDiagnosticos,
      verDetalles,
      abrirModalDiagnostico,
      cerrarModalDiagnostico,
      onDiagnosticoGuardado,
      previousPage,
      nextPage,
      goToPage,
      formatDate,
      getSectionColor,
      parseFallasFromDescription
    }
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
.table-fixed {
  table-layout: fixed;
}
</style>