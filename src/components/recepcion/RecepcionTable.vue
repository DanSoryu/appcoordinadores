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
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Taller</label>
          <select 
            v-model="tallerFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los talleres</option>
            <option value="Taller Principal">Taller Principal</option>
            <option value="Taller Norte">Taller Norte</option>
            <option value="Taller Sur">Taller Sur</option>
            <option value="Taller Este">Taller Este</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-gray-600">Cargando datos...</span>
      </div>
      <div v-else-if="error" class="p-4 text-red-600 bg-red-50 text-center">
        {{ error }}
      </div>
      <div v-else>
        <!-- Tabla con scroll -->
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse table-fixed">
            <thead class="bg-gray-50">
              <tr class="divide-x divide-gray-200">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lugar</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taller</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehículo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-gray-50 divide-x divide-gray-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.fechaRecepcion }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.lugarRecepcion }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.tallerRecepcion }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.vehiculo.numeroControl }} - {{ item.vehiculo.nombre }}
                </td>
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
                  <button 
                    @click="eliminarRecepcion(item)" 
                    class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Eliminar
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
                <p class="font-semibold">{{ currentRecepcion.fechaRecepcion }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500">Lugar de Recepción</p>
                <p class="font-semibold">{{ currentRecepcion.lugarRecepcion }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500">Taller de Recepción</p>
                <p class="font-semibold">{{ currentRecepcion.tallerRecepcion }}</p>
              </div>
            </div>
            
            <div class="mt-6">
              <h4 class="text-lg font-bold text-gray-800 mb-3">Información del Vehículo</h4>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-500">Número de Control</p>
                    <p class="font-semibold">{{ currentRecepcion.vehiculo.numeroControl }}</p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-500">Nombre del Vehículo</p>
                    <p class="font-semibold">{{ currentRecepcion.vehiculo.nombre }}</p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-500">VIN</p>
                    <p class="font-semibold text-xs">{{ currentRecepcion.vehiculo.vin }}</p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-500">Marca</p>
                    <p class="font-semibold">{{ currentRecepcion.vehiculo.marca }}</p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-500">Modelo</p>
                    <p class="font-semibold">{{ currentRecepcion.vehiculo.modelo }}</p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-500">Año</p>
                    <p class="font-semibold">{{ currentRecepcion.vehiculo.anio }}</p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-500">Placas</p>
                    <p class="font-semibold">{{ currentRecepcion.vehiculo.placas }}</p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-500">Kilometraje</p>
                    <p class="font-semibold">{{ currentRecepcion.vehiculo.kilometraje?.toLocaleString() }} km</p>
                  </div>
                </div>
                
                <!-- Últimos Servicios -->
                <div class="mt-4">
                  <h5 class="text-md font-semibold text-gray-700 mb-2">Últimos Servicios</h5>
                  <div v-if="currentRecepcion.vehiculo.ultimosServicios && currentRecepcion.vehiculo.ultimosServicios.length > 0" class="space-y-2">
                    <div 
                      v-for="(servicio, index) in currentRecepcion.vehiculo.ultimosServicios" 
                      :key="index"
                      class="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                    >
                      <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <div>
                          <p class="font-medium text-gray-900">{{ servicio.fecha }}</p>
                          <p class="text-sm text-gray-500">{{ servicio.descripcion }}</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {{ servicio.kilometraje?.toLocaleString() }} km
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-sm text-gray-500 bg-gray-100 p-3 rounded">
                    No hay registros de servicios disponibles
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-6">
              <h4 class="text-lg font-bold text-gray-800 mb-3">Asignaciones de Personal</h4>
              <div class="bg-blue-50 p-4 rounded-lg">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-blue-600">Persona Asignación Anterior</p>
                    <p class="font-semibold text-blue-800">{{ currentRecepcion.vehiculo.personaAsignacionAnterior }}</p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-green-600">Persona Asignación Actual</p>
                    <p class="font-semibold text-green-800">{{ currentRecepcion.vehiculo.personaAsignacionActual }}</p>
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
import { ref, computed, watch } from 'vue'
import { useToastStore } from '../../stores/toast.js'
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
    
    // Datos de recepción con información completa del vehículo
    const recepciones = ref([
      {
        id: 1,
        fechaRecepcion: '2025-09-15',
        lugarRecepcion: 'Sucursal Centro',
        tallerRecepcion: 'Taller Principal',
        vehiculo: {
          numeroControl: 'ECO001',
          nombre: 'Honda Civic',
          vin: '1HGBH41JXMN109186',
          marca: 'Honda',
          modelo: 'Civic',
          anio: '2021',
          placas: 'ABC-123',
          kilometraje: 45000,
          personaAsignacionAnterior: 'Carlos Mendoza',
          personaAsignacionActual: 'Ana López',
          ultimosServicios: [
            { fecha: '2025-08-15', descripcion: 'Mantenimiento preventivo completo', kilometraje: 43500 },
            { fecha: '2025-06-20', descripcion: 'Cambio de aceite y filtros', kilometraje: 41200 },
            { fecha: '2025-04-10', descripcion: 'Revisión de frenos y suspension', kilometraje: 38800 }
          ]
        }
      },
      {
        id: 2,
        fechaRecepcion: '2025-09-16',
        lugarRecepcion: 'Sucursal Norte',
        tallerRecepcion: 'Taller Norte',
        vehiculo: {
          numeroControl: 'ECO002',
          nombre: 'Chevrolet Malibu',
          vin: '1G1JC524817123456',
          marca: 'Chevrolet',
          modelo: 'Malibu',
          anio: '2020',
          placas: 'DEF-456',
          kilometraje: 38500,
          personaAsignacionAnterior: 'María González',
          personaAsignacionActual: 'Roberto Díaz',
          ultimosServicios: [
            { fecha: '2025-09-05', descripcion: 'Inspección anual completa', kilometraje: 38000 },
            { fecha: '2025-07-12', descripcion: 'Cambio de llantas delanteras', kilometraje: 36200 },
            { fecha: '2025-05-18', descripcion: 'Reparación sistema eléctrico', kilometraje: 34500 }
          ]
        }
      },
      {
        id: 3,
        fechaRecepcion: '2025-09-17',
        lugarRecepcion: 'Sucursal Sur',
        tallerRecepcion: 'Taller Sur',
        vehiculo: {
          numeroControl: 'ECO003',
          nombre: 'Mercedes-Benz C-Class',
          vin: 'WDBRF40J03A123456',
          marca: 'Mercedes-Benz',
          modelo: 'C-Class',
          anio: '2019',
          placas: 'GHI-789',
          kilometraje: 52000,
          personaAsignacionAnterior: 'Luis Martínez',
          personaAsignacionActual: 'Sandra Pérez',
          ultimosServicios: [
            { fecha: '2025-09-01', descripcion: 'Servicio Mercedes-Benz Premium', kilometraje: 51500 },
            { fecha: '2025-06-15', descripcion: 'Cambio de aceite sintético', kilometraje: 49200 },
            { fecha: '2025-04-05', descripcion: 'Revisión de transmisión automática', kilometraje: 47800 },
            { fecha: '2025-01-20', descripcion: 'Mantenimiento de aire acondicionado', kilometraje: 45600 }
          ]
        }
      },
      {
        id: 4,
        fechaRecepcion: '2025-09-18',
        lugarRecepcion: 'Sucursal Este',
        tallerRecepcion: 'Taller Este',
        vehiculo: {
          numeroControl: 'ECO004',
          nombre: 'Honda Odyssey',
          vin: '5FNRL38779B123456',
          marca: 'Honda',
          modelo: 'Odyssey',
          anio: '2022',
          placas: 'JKL-012',
          kilometraje: 25000,
          personaAsignacionAnterior: 'Pedro Ruiz',
          personaAsignacionActual: 'Carmen Vega',
          ultimosServicios: [
            { fecha: '2025-08-30', descripcion: 'Primer servicio de garantía', kilometraje: 24500 },
            { fecha: '2025-05-22', descripcion: 'Inspección de 20,000 km', kilometraje: 20000 }
          ]
        }
      },
      {
        id: 5,
        fechaRecepcion: '2025-09-19',
        lugarRecepcion: 'Sucursal Oeste',
        tallerRecepcion: 'Taller Principal',
        vehiculo: {
          numeroControl: 'ECO005',
          nombre: 'Ford Escape',
          vin: '1FMCU0F75KUA12345',
          marca: 'Ford',
          modelo: 'Escape',
          anio: '2023',
          placas: 'MNO-345',
          kilometraje: 15000,
          personaAsignacionAnterior: 'José Ramírez',
          personaAsignacionActual: 'Elena Castro',
          ultimosServicios: [
            { fecha: '2025-09-10', descripcion: 'Servicio de 15,000 km', kilometraje: 15000 },
            { fecha: '2025-06-01', descripción: 'Primer cambio de aceite', kilometraje: 10000 }
          ]
        }
      }
    ])

    // Modales
    const showRecepcionModal = ref(false)
    const showDetallesModal = ref(false)
    const currentRecepcion = ref(null)
    const recepcionToEdit = ref(null)

    // Filtros
    const searchQuery = ref('')
    const dateFrom = ref('')
    const dateTo = ref('')
    const tallerFilter = ref('')

    // Paginación
    const currentPage = ref(1)
    const itemsPerPage = 10
    const totalItems = ref(recepciones.value.length)
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
        result = result.filter(item => item.fechaRecepcion >= dateFrom.value)
      }

      // Filtrar por fecha hasta
      if (dateTo.value) {
        result = result.filter(item => item.fechaRecepcion <= dateTo.value)
      }

      // Filtrar por taller
      if (tallerFilter.value) {
        result = result.filter(item => item.tallerRecepcion === tallerFilter.value)
      }

      // Filtrar por búsqueda general
      if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase()
        result = result.filter(item => {
          return (
            item.id.toString().includes(search) ||
            item.fechaRecepcion.toLowerCase().includes(search) ||
            item.lugarRecepcion.toLowerCase().includes(search) ||
            item.tallerRecepcion.toLowerCase().includes(search) ||
            item.vehiculo.numeroControl.toLowerCase().includes(search) ||
            item.vehiculo.nombre.toLowerCase().includes(search)
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
        fechaRecepcion: item.fechaRecepcion,
        lugarRecepcion: item.lugarRecepcion,
        tallerRecepcion: item.tallerRecepcion,
        vehiculo: item.vehiculo?.numeroControl || ''
      }
      
      // Asignar datos al objeto de edición
      recepcionToEdit.value = recepcionForEdit
      
      // Mostrar el modal de edición
      showRecepcionModal.value = true
    }

    const eliminarRecepcion = (item) => {
      // Aquí se puede implementar la eliminación
      if (confirm(`¿Estás seguro de eliminar la recepción #${item.id}?`)) {
        recepciones.value = recepciones.value.filter(recepcion => recepcion.id !== item.id)
        
        toastStore.addToast({
          message: 'Recepción eliminada correctamente',
          type: 'success',
          duration: 3000
        })
      }
    }

    const handleRecepcionGuardada = (nuevaRecepcion) => {
      // Encontrar el vehículo seleccionado
      const vehiculoSeleccionado = {
        numeroControl: nuevaRecepcion.vehiculo,
        nombre: nuevaRecepcion.nombreVehiculo || 'Vehículo sin especificar'
      }
      
      // Verificar si es una edición o una nueva recepción
      if (recepcionToEdit.value) {
        // Edición: buscar la recepción existente por fecha, lugar y taller
        const index = recepciones.value.findIndex(r => 
          r.fechaRecepcion === recepcionToEdit.value.fechaRecepcion && 
          r.lugarRecepcion === recepcionToEdit.value.lugarRecepcion &&
          r.tallerRecepcion === recepcionToEdit.value.tallerRecepcion
        );
        
        if (index !== -1) {
          // Actualizar la recepción existente
          recepciones.value[index] = {
            ...recepciones.value[index],
            fechaRecepcion: nuevaRecepcion.fechaRecepcion,
            lugarRecepcion: nuevaRecepcion.lugarRecepcion,
            tallerRecepcion: nuevaRecepcion.tallerRecepcion,
            vehiculo: vehiculoSeleccionado
          };
          
          toastStore.addToast({
            message: 'Recepción actualizada correctamente',
            type: 'success',
            duration: 3000
          });
        }
      } else {
        // Nueva recepción: crear un nuevo ID
        const newId = recepciones.value.length > 0 ? Math.max(...recepciones.value.map(r => r.id)) + 1 : 1;
        
        // Agregar la nueva recepción
        recepciones.value.push({
          id: newId,
          fechaRecepcion: nuevaRecepcion.fechaRecepcion,
          lugarRecepcion: nuevaRecepcion.lugarRecepcion,
          tallerRecepcion: nuevaRecepcion.tallerRecepcion,
          vehiculo: vehiculoSeleccionado
        });
        
        toastStore.addToast({
          message: 'Recepción guardada correctamente',
          type: 'success',
          duration: 3000
        });
      }
      
      // Limpiar y cerrar el modal
      recepcionToEdit.value = null;
      showRecepcionModal.value = false;
    }

    // Reset de filtros
    const resetFiltros = () => {
      searchQuery.value = ''
      dateFrom.value = ''
      dateTo.value = ''
      tallerFilter.value = ''
      currentPage.value = 1
    }

    // Watchers para filtros
    watch([searchQuery, tallerFilter], () => {
      currentPage.value = 1
    })

    return {
      recepciones,
      isLoading,
      error,
      searchQuery,
      dateFrom,
      dateTo,
      tallerFilter,
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
      eliminarRecepcion,
      handleRecepcionGuardada,
      resetFiltros
    }
  }
}
</script>
