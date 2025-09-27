<template>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Ordenes Coordinadores</h2>
          <button 
            @click="exportToExcel"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Exportar a Excel</span>
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
                  :max="dateTo.value || currentDate"
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
                  :min="dateFrom.value || minDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                <span class="text-xs text-gray-500 mt-1 block">
                  Máximo fecha actual
                </span>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select 
                  v-model="statusFilter"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los estados</option>
                  <option value="COMPLETADA">Completada</option>
                  <option value="INCOMPLETA">Incompleta</option>
                  <option value="OBJETADA">Objetada</option>
                  <option value="VACIO">Vacío</option>
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
                  <!-- Columnas para Órdenes -->
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-r border-gray-200">Folio Pisa</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ONT</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Expediente</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contratista</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Técnico</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COPE</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">División</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distrito</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tecnología</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Tarea</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Instalación</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metraje</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terminal</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puerto</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paso</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordenadas</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coord. Terminal</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-gray-50 divide-x divide-gray-200">                  
                  <!-- Datos para Órdenes -->
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-l border-r border-gray-200">{{ item.Folio_Pisa }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Telefono }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Ont }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.NExpediente }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.nombre_completo_cliente }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Direccion_Cliente }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.nombre_completo_contratista }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.nombre_completo_tecnico }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.COPE }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.area }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Division }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Distrito }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Tecnologia }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Tipo_Tarea }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Tipo_Instalacion }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Metraje }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Terminal }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Puerto }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Step_Registro }}/5</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.Latitud }}, {{ item.Longitud }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.Latitud_Terminal }}, {{ item.Longitud_Terminal }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Fecha_Coordiapp }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusClass(item.Step_Registro === 5 ? 'COMPLETADA' : 'INCOMPLETA')" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ item.Step_Registro === 5 ? 'COMPLETADA' : 'INCOMPLETA' }}
                      </span>
                    </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button 
                        @click="viewMap(item)"
                        class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 transition-colors"
                        title="Ver Mapa"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </button>
                      <button 
                        @click="viewPhotos(item)"
                        class="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100 transition-colors"
                        title="Ver Fotos"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </button>
                      <button 
                        @click="openPDF(item)"
                        class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition-colors"
                        title="Ver PDF"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                      </button>
                    </div>
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
                      page === currentPage 
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

      <!-- Modal de Fotos -->
    <div v-if="showPhotoModal" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white w-[90%] max-h-[90vh] rounded-lg shadow-xl">
        <!-- Encabezado del modal -->
        <div class="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h3 class="text-xl font-semibold">Fotografías Orden: {{ currentPhotoItem?.Folio_Pisa }}</h3>
          <button @click="showPhotoModal = false" class="text-white hover:text-gray-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Contenido del modal -->
        <div class="p-6 overflow-y-auto" style="max-height: calc(90vh - 80px);">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Foto ONT -->
            <div class="space-y-2">
              <h4 class="font-semibold text-gray-700">Foto ONT</h4>
              <p class="text-sm text-gray-500 mb-2">Una fotografía de la parte frontal de la ONT</p>
              <div class="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  :src="currentPhotoItem?.Foto_Ont ? 'https://api.ed-intra.com/' + currentPhotoItem.Foto_Ont.replace('../', '') : noImage" 
                  class="object-contain w-full h-full"
                  alt="Foto ONT"
                  @error="$event.target.src = noImage"
                />
              </div>
            </div>

            <!-- Foto Casa Cliente -->
            <div class="space-y-2">
              <h4 class="font-semibold text-gray-700">Foto Casa Cliente</h4>
              <p class="text-sm text-gray-500 mb-2">Una fotografía de la casa del cliente</p>
              <div class="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  :src="currentPhotoItem?.Foto_Casa_Cliente ? 'https://api.ed-intra.com/' + currentPhotoItem.Foto_Casa_Cliente.replace('../', '') : noImage" 
                  class="object-contain w-full h-full"
                  alt="Foto Casa Cliente"
                  @error="$event.target.src = noImage"
                />
              </div>
            </div>

            <!-- Foto No. Serie ONT -->
            <div class="space-y-2">
              <h4 class="font-semibold text-gray-700">No. Serie ONT</h4>
              <p class="text-sm text-gray-500 mb-2">Una fotografía de la parte trasera de la ONT</p>
              <div class="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  :src="currentPhotoItem?.No_Serie_ONT ? 'https://api.ed-intra.com/' + currentPhotoItem.No_Serie_ONT.replace('../', '') : noImage" 
                  class="object-contain w-full h-full"
                  alt="No. Serie ONT"
                  @error="$event.target.src = noImage"
                />
              </div>
            </div>

            <!-- Foto Puerto -->
            <div class="space-y-2">
              <h4 class="font-semibold text-gray-700">Foto Terminal</h4>
              <p class="text-sm text-gray-500 mb-2">Una fotografía de la terminal</p>
              <div class="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  :src="currentPhotoItem?.Foto_Puerto ? 'https://api.ed-intra.com/' + currentPhotoItem.Foto_Puerto.replace('../', '') : noImage" 
                  class="object-contain w-full h-full"
                  alt="Foto Puerto"
                  @error="$event.target.src = noImage"
                />
              </div>
            </div>

            <!-- Foto INE -->
            <div class="space-y-2">
              <h4 class="font-semibold text-gray-700">Foto SO</h4>
              <p class="text-sm text-gray-500 mb-2">Una fotografía de la hoja de servicio</p>
              <div class="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  :src="currentPhotoItem?.Foto_INE ? 'https://api.ed-intra.com/' + currentPhotoItem.Foto_INE.replace('../', '') : noImage" 
                  class="object-contain w-full h-full"
                  alt="Foto INE"
                  @error="$event.target.src = noImage"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import apiClient from '@/services/api'
import noImage from '../assets/nodisponible.webp'
import * as XLSX from 'xlsx'

const authStore = useAuthStore()
const toastStore = useToastStore()
const isLoading = ref(false)
const error = ref(null)
const ordersCompleteData = ref([])

// Filtros que hacen petición a la API
const dateFrom = ref('')
const dateTo = ref('')
const statusFilter = ref('')

// Filtro local de búsqueda
const searchQuery = ref('')

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

const currentPage = ref(1)
const itemsPerPage = 20
const totalItems = ref(0)
const totalPages = ref(1)

// Función para obtener datos de la API
const fetchOrdersData = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const params = {
      page: currentPage.value
    }
    
    // Agregar filtros API
    if (dateFrom.value && dateTo.value) {
      params.fecha_inicio = dateFrom.value
      params.fecha_fin = dateTo.value
    }
    if (statusFilter.value) params.estatus_orden = statusFilter.value
    
    const response = await apiClient.get('/coordiapp-todas-division', { params })
    ordersCompleteData.value = response.data.data
    
    // Actualizar paginación con los valores del servidor
    totalPages.value = response.data.last_page
    totalItems.value = response.data.total
    
  } catch (err) {
    console.error('Error fetching orders:', err)
    error.value = 'Error al cargar los datos. Por favor, intente nuevamente.'
  } finally {
    isLoading.value = false
  }
}

// Método para abrir el PDF en una nueva pestaña
const openPDF = (item) => {
  if (item?.Folio_Pisa) {
    const pdfUrl = `https://erp.ed-intra.com/Operaciones/modal/R20.php?Folio_Pisa=${item.Folio_Pisa}`
    window.open(pdfUrl, '_blank')
  }
}

const viewMap = (item) => {
  if (item.Latitud && item.Longitud) {
    let mapsUrl;
    if (item.Latitud_Terminal && item.Longitud_Terminal) {
      mapsUrl = `https://www.google.com/maps/dir/${item.Latitud},${item.Longitud}/${item.Latitud_Terminal},${item.Longitud_Terminal}`
    } else {
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${item.Latitud},${item.Longitud}`
    }
    window.open(mapsUrl, '_blank')
  } else {
    alert('No hay coordenadas disponibles para este registro')
  }
}

const showPhotoModal = ref(false)
const currentPhotoItem = ref(null)

const viewPhotos = (item) => {
  currentPhotoItem.value = item
  showPhotoModal.value = true
}

const getStatusClass = (status) => {
  switch (status) {
    case 'COMPLETADA':
      return 'bg-green-100 text-green-800'
    case 'INCOMPLETA':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const currentData = computed(() => {
  return ordersCompleteData.value
})

const filteredData = computed(() => {
  // Asegurarse de que currentData.value es un array
  const dataArray = Array.isArray(currentData.value) ? currentData.value : []
  
  // Si no hay datos, retornar array vacío
  if (!dataArray.length) return []
  
  // Si no hay término de búsqueda, retornar todos los datos
  if (!searchQuery.value) return dataArray

  const search = searchQuery.value.toLowerCase()
  
  // Filtrar por todos los campos
  return dataArray.filter(item => {
    return Object.values(item).some(value => {
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(search)
    })
  })
})

const paginatedData = computed(() => {
  // Si hay término de búsqueda, usamos los datos filtrados
  if (searchQuery.value) {
    return filteredData.value
  }
  // Si no hay búsqueda, usamos los datos directamente de la API
  return currentData.value
})

const startRecord = computed(() => ((currentPage.value - 1) * itemsPerPage) + 1)
const endRecord = computed(() => Math.min(currentPage.value * itemsPerPage, totalItems.value))

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

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await fetchOrdersData()
  }
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    await fetchOrdersData()
  }
}

const goToPage = async (page) => {
  currentPage.value = page
  await fetchOrdersData()
}

const exportToExcel = async () => {
  try {
    // Crear toast con barra de progreso
    const toastId = toastStore.addToast({
      message: 'Exportando datos...',
      type: 'info',
      progress: 0
    });
    
    // Recopilamos todos los datos mediante peticiones paginadas
    let allData = [];
    let currentPage = 1;
    let hasMoreData = true;
    
    while (hasMoreData) {
      const response = await apiClient.get('/coordiapp-todas-division', {
        params: {
          page: currentPage,
          per_page: 100, // Aumentamos registros por página para reducir número de peticiones
          ...(dateFrom.value && dateTo.value ? { fecha_inicio: dateFrom.value, fecha_fin: dateTo.value } : {}),
          ...(statusFilter.value ? { estatus_orden: statusFilter.value } : {})
        }
      });
      
      allData = [...allData, ...response.data.data];
      
      // Verificar si hay más páginas
      hasMoreData = currentPage < response.data.last_page;
      currentPage++;
      
      // Actualizar la barra de progreso del toast
      const progress = Math.round((currentPage - 1) / response.data.last_page * 100);
      toastStore.updateToastProgress(toastId, progress);
    }

    const dataToExport = allData.map(item => ({
      'Folio Pisa': item.Folio_Pisa,
      'Teléfono': item.Telefono,
      'ONT': item.Ont,
      'N° Expediente': item.NExpediente,
      'Cliente': item.nombre_completo_cliente,
      'Dirección': item.Direccion_Cliente,
      'Contratista': item.nombre_completo_contratista,
      'Técnico': item.nombre_completo_tecnico,
      'COPE': item.COPE,
      'Área': item.area,
      'División': item.Division,
      'Distrito': item.Distrito,
      'Tecnología': item.Tecnologia,
      'Tipo Tarea': item.Tipo_Tarea,
      'Tipo Instalación': item.Tipo_Instalacion,
      'Metraje': item.Metraje,
      'Terminal': item.Terminal,
      'Puerto': item.Puerto,
      'Paso': `${item.Step_Registro}/5`,
      'Coordenadas': `${item.Latitud}, ${item.Longitud}`,
      'Coordenadas Terminal': `${item.Latitud_Terminal}, ${item.Longitud_Terminal}`,
      'Fecha': item.Fecha_Coordiapp,
      'Estado': item.Step_Registro === 5 ? 'COMPLETADA' : 'INCOMPLETA'
    }))

    // Crear libro de Excel
    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ordenes')

    // Generar archivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    // Crear link de descarga
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(data)
    link.download = `ordenes_${new Date().toISOString().split('T')[0]}.xlsx`
    link.click()
    
    // Asegurarnos de que el progreso llegue al 100%
    toastStore.updateToastProgress(toastId, 100)
    
  } catch (error) {
    console.error('Error al exportar a Excel:', error)
    toastStore.addToast({
      message: 'Error al exportar a Excel. Por favor, intente nuevamente.',
      type: 'error',
      duration: 5000
    })
  } finally {
    isLoading.value = false
  }
}

// Watches para filtros
watch(statusFilter, () => {
  currentPage.value = 1
  fetchOrdersData()
}, { debounce: 300 })

watch([dateFrom, dateTo], ([newDateFrom, newDateTo]) => {
  if (newDateFrom && newDateTo) {
    currentPage.value = 1
    fetchOrdersData()
  }
}, { debounce: 300 })

watch(searchQuery, (newValue) => {
  if (!newValue) {
    fetchOrdersData()
  }
  currentPage.value = 1
}, { debounce: 300 })

// Cargar datos iniciales
fetchOrdersData()
</script>