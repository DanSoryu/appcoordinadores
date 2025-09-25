<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Órdenes</p>
            <p class="text-2xl font-semibold text-gray-900">{{ dashboardData.total_ordenes }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Completas</p>
            <p class="text-2xl font-semibold text-gray-900">{{ dashboardData.ordenes_completadas }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pendientes</p>
            <p class="text-2xl font-semibold text-gray-900">{{ dashboardData.ordenes_incompletas }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Bar Chart -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Órdenes por Mes</h3>
        <div class="h-64 flex items-end justify-between space-x-2">
          <template v-if="dashboardData.ordenes_por_meses.length">
            <div v-for="item in dashboardData.ordenes_por_meses" :key="item.mes" 
                 class="flex flex-col items-center group relative">
              <div 
                class="bg-blue-500 w-8 rounded-t transition-all duration-300 hover:bg-blue-600"
                :style="{ height: item.total ? `${(item.total / Math.max(...dashboardData.ordenes_por_meses.map(m => m.total))) * 180}px` : '2px' }"
              >
                <!-- Tooltip -->
                <div class="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                  {{ item.total }} órdenes
                </div>
              </div>
              <span class="text-xs text-gray-600 mt-2">{{ getMesNombre(item.mes) }}</span>
            </div>
          </template>
          <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
            No hay datos disponibles
          </div>
        </div>
      </div>

      <!-- Pie Chart -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Estado de Órdenes</h3>
        <div class="flex items-center justify-center h-64">
          <div class="relative w-48 h-48">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" stroke-width="10"/>
              <!-- Círculo base para el perímetro total -->
              <circle 
                cx="50" cy="50" r="40" 
                fill="none" 
                stroke="#3b82f6" 
                stroke-width="10"
                :stroke-dasharray="getCircleLength(1)"
                stroke-dashoffset="0"
              />
              <!-- Círculo para órdenes completas -->
              <circle 
                cx="50" cy="50" r="40" 
                fill="none" 
                stroke="#10b981" 
                stroke-width="10"
                :stroke-dasharray="getCircleLength(dashboardData.ordenes_completadas / (dashboardData.total_ordenes || 1))"
                stroke-dashoffset="0"
              />
              <!-- Círculo para órdenes pendientes -->
              <circle 
                cx="50" cy="50" r="40" 
                fill="none" 
                stroke="#f59e0b" 
                stroke-width="10"
                :stroke-dasharray="getCircleLength(dashboardData.ordenes_incompletas / (dashboardData.total_ordenes || 1))"
                :stroke-dashoffset="-getCircleLength(dashboardData.ordenes_completadas / (dashboardData.total_ordenes || 1))"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">{{ dashboardData.total_ordenes }}</div>
                <div class="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 space-y-2">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span class="text-sm text-gray-600">
              Completas ({{ getPercentage(dashboardData.ordenes_completadas, dashboardData.total_ordenes) }}%)
            </span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span class="text-sm text-gray-600">
              En Proceso (20%)
            </span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span class="text-sm text-gray-600">
              Pendientes ({{ getPercentage(dashboardData.ordenes_incompletas, dashboardData.total_ordenes) }}%)
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Top Técnicos -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Top 5 Técnicos con Más Órdenes de Hoy</h3>
          <div class="space-y-4">
              <div v-for="(tecnico, index) in dashboardData.tecnicos_con_mas_ordenes" :key="index" 
                   class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex items-center space-x-4">
                  <span class="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-semibold">
                    #{{ index + 1 }}
                  </span>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ dashboardData.nombres_tecnicos[index] || 'Técnico ' + tecnico.FK_Tecnico_apps }}</h4>
                    <p class="text-sm text-gray-600">
                      {{ tecnico.total_ordenes }} órdenes
                    </p>
                  </div>
                </div>
                <div class="w-32 bg-gray-200 rounded-full h-2 relative group">
                  <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                       :style="{ width: (tecnico.total_ordenes / dashboardData.tecnicos_con_mas_ordenes[0].total_ordenes * 100) + '%' }">
                  </div>
                  <!-- Tooltip -->
                  <div class="opacity-0 group-hover:opacity-100 absolute right-0 bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                    {{ Math.round((tecnico.total_ordenes / dashboardData.tecnicos_con_mas_ordenes[0].total_ordenes) * 100) }}% del máximo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Folios Faltantes -->
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="border-b border-gray-200 mb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Folios Faltantes de Hoy</h3>
            <p class="text-sm text-gray-500 mb-4">
              Total: {{ dashboardData.folios_faltantes_hoy?.length || 0 }} registros
            </p>
          </div>
          <div class="p-6">
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Folio Pisa
                    </th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Técnico
                    </th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expediente
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="folio in paginatedFolios" :key="folio.Folio_Pisa" class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-900">
                      {{ folio.Folio_Pisa }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900">
                      {{ folio.Tecnico }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900">
                      {{ folio.Expediente }}
                    </td>
                  </tr>
                  <tr v-if="!dashboardData.folios_faltantes_hoy?.length">
                    <td colspan="3" class="px-4 py-3 text-sm text-gray-500 text-center">
                      No hay folios faltantes hoy
                    </td>
                  </tr>
                </tbody>
                <tfoot v-if="dashboardData.folios_faltantes_hoy?.length > itemsPerPageFolios">
                  <tr>
                    <td colspan="6">
                      <div class="px-4 py-3 flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                          <button 
                            @click="previousPageFolios"
                            :disabled="currentPageFolios === 1"
                            class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                          >
                            Anterior
                          </button>
                          <span class="text-sm text-gray-700">
                            Página {{ currentPageFolios }} de {{ totalPagesFolios }}
                          </span>
                          <button 
                            @click="nextPageFolios"
                            :disabled="currentPageFolios >= totalPagesFolios"
                            class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                          >
                            Siguiente
                          </button>
                        </div>
                        <div class="text-sm text-gray-700">
                          Mostrando {{ startRecordFolios }} - {{ endRecordFolios }} de {{ dashboardData.folios_faltantes_hoy?.length || 0 }} registros
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiClient from '@/services/api'

// Estado del dashboard
const dashboardData = ref({
  total_ordenes: 0,
  ordenes_completadas: 0,
  ordenes_incompletas: 0,
  ordenes_por_meses: [],
  tecnicos_con_mas_ordenes: [],
  nombres_tecnicos: [],
  folios_faltantes_hoy: []
})

const isLoading = ref(false)
const error = ref(null)

// Folios pagination
const currentPageFolios = ref(1)
const itemsPerPageFolios = ref(5)

const totalPagesFolios = computed(() => {
  return Math.ceil((dashboardData.value.folios_faltantes_hoy?.length || 0) / itemsPerPageFolios.value)
})

const startRecordFolios = computed(() => {
  return (currentPageFolios.value - 1) * itemsPerPageFolios.value + 1
})

const endRecordFolios = computed(() => {
  const end = currentPageFolios.value * itemsPerPageFolios.value
  return Math.min(end, dashboardData.value.folios_faltantes_hoy?.length || 0)
})

const paginatedFolios = computed(() => {
  const start = (currentPageFolios.value - 1) * itemsPerPageFolios.value
  const end = start + itemsPerPageFolios.value
  return dashboardData.value.folios_faltantes_hoy?.slice(start, end) || []
})

// Methods
const previousPageFolios = () => {
  if (currentPageFolios.value > 1) {
    currentPageFolios.value--
  }
}

const nextPageFolios = () => {
  if (currentPageFolios.value < totalPagesFolios.value) {
    currentPageFolios.value++
  }
}

const getMesNombre = (mes) => {
  const meses = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ]
  return meses[mes - 1] || ''
}

const getPercentage = (value, total) => {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

const getCircleLength = (percentage) => {
  const circumference = 2 * Math.PI * 40
  return `${circumference * percentage} ${circumference}`
}

// Función para obtener datos del dashboard
const fetchDashboardData = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const userData = JSON.parse(localStorage.getItem('user_data'))
    if (!userData || !userData.division_id) {
      throw new Error('No se encontró el ID de división en los datos del usuario')
    }
    
    const response = await apiClient.get(`/coordiapp-dashboard/${userData.division_id}`)
    
    // Procesar órdenes por mes para asegurar que tenemos todos los meses
    const ordenesPorMes = new Array(12).fill(0)
    if (Array.isArray(response.data.ordenes_por_meses)) {
      response.data.ordenes_por_meses.forEach(item => {
        if (item.mes >= 1 && item.mes <= 12) {
          ordenesPorMes[item.mes - 1] = parseInt(item.total) || 0
        }
      })
      // Convertir el array a formato esperado
      response.data.ordenes_por_meses = Array.from({ length: 12 }, (_, index) => ({
        mes: index + 1,
        total: ordenesPorMes[index]
      }))
    }
    
    // Asegurarse de que todos los valores numéricos sean números
    response.data.total_ordenes = parseInt(response.data.total_ordenes) || 0
    response.data.ordenes_completadas = parseInt(response.data.ordenes_completadas) || 0
    response.data.ordenes_incompletas = parseInt(response.data.ordenes_incompletas) || 0

    // Procesar folios_faltantes_hoy
    if (response.data.folios_faltantes_hoy) {
      let foliosFaltantes = response.data.folios_faltantes_hoy;
      if (!Array.isArray(foliosFaltantes)) {
        foliosFaltantes = Object.values(foliosFaltantes);
      }
      response.data.folios_faltantes_hoy = foliosFaltantes.map(folio => ({
        Folio_Pisa: folio.Folio_Pisa || '',
        Tecnico: folio.Tecnico || '',
        Expediente: folio.Expediente || ''
      }));
    } else {
      response.data.folios_faltantes_hoy = [];
    }

    dashboardData.value = response.data
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
    if (err.response?.data?.message) {
      error.value = `Error del servidor: ${err.response.data.message}`
    } else if (err.message) {
      error.value = err.message
    } else {
      error.value = 'Error al cargar los datos del dashboard.'
    }
    // Inicializar datos vacíos para evitar errores en la UI
    dashboardData.value = {
      total_ordenes: 0,
      ordenes_completadas: 0,
      ordenes_incompletas: 0,
      ordenes_por_meses: [],
      tecnicos_con_mas_ordenes: [],
      nombres_tecnicos: [],
      folios_faltantes_hoy: []
    }
  } finally {
    isLoading.value = false
  }
}

// Cargar datos al montar el componente
onMounted(() => {
  fetchDashboardData()
})
</script>
