<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
    <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-5xl relative border border-gray-200 overflow-y-auto max-h-[90vh]">
      <button @click="$emit('close')" class="close-button absolute top-4 right-4">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <h2 class="text-2xl font-bold mb-6 text-blue-600 text-center">Solicitud de Refacciones</h2>
      
      <!-- Información del diagnóstico -->
      <div v-if="solicitudData" class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 class="font-semibold text-lg mb-2 text-gray-800">Información del Diagnóstico</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-600">Folio:</span>
            <span class="ml-2 font-semibold">{{ solicitudData.folio_diagnostico }}</span>
          </div>
          <div>
            <span class="text-gray-600">Vehículo:</span>
            <span class="ml-2 font-semibold">{{ solicitudData.diagnostico?.vehiculo_placa || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Loading state mientras se cargan las refacciones -->
        <div v-if="isLoadingRefacciones" class="flex items-center justify-center p-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span class="ml-3 text-gray-600">Cargando catálogo de refacciones...</span>
        </div>

        <!-- Mostrar error si no se pueden cargar las refacciones -->
        <div v-else-if="errorRefacciones" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
          {{ errorRefacciones }}
        </div>

        <!-- Contenido del formulario -->
        <div v-else>
          <!-- Tabs para los diferentes tipos -->
          <div class="mb-6">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8">
                <button
                  v-for="tipo in tiposDisponibles"
                  :key="tipo"
                  type="button"
                  @click="tipoActivo = tipo"
                  :class="[
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                    tipoActivo === tipo
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  {{ tipo }}
                  <span 
                    v-if="getSelectedCountByTipo(tipo) > 0"
                    class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ getSelectedCountByTipo(tipo) }}
                  </span>
                </button>
              </nav>
            </div>
          </div>

          <!-- Contenido por tipo -->
          <div class="mb-6">
            <!-- Refacciones -->
            <div v-show="tipoActivo === 'REFACCION'" class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">Refacciones</h3>
              <div v-if="refaccionesPorTipo.REFACCION && refaccionesPorTipo.REFACCION.length > 0">
                <!-- Agrupar por sistema -->
                <div v-for="(items, sistema) in agruparPorSistema(refaccionesPorTipo.REFACCION)" :key="sistema" class="mb-4">
                  <div class="bg-blue-50 p-3 rounded-t-lg border-l-4 border-blue-500">
                    <h4 class="font-bold text-gray-800">{{ sistema }}</h4>
                  </div>
                  <div class="border border-t-0 rounded-b-lg p-4 bg-white">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div v-for="refaccion in items" :key="refaccion.id" class="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          :id="`refaccion-${refaccion.id}`"
                          v-model="refaccionesSeleccionadas"
                          :value="refaccion.id"
                          class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label :for="`refaccion-${refaccion.id}`" class="flex-1 cursor-pointer">
                          <p class="font-medium text-gray-900">{{ refaccion.nombre }}</p>
                          <p v-if="refaccion.descripcion" class="text-sm text-gray-600">{{ refaccion.descripcion }}</p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-gray-500 py-8">
                No hay refacciones disponibles para este diagnóstico
              </div>
            </div>

            <!-- Insumos -->
            <div v-show="tipoActivo === 'INSUMO'" class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">Insumos</h3>
              <div v-if="refaccionesPorTipo.INSUMO && refaccionesPorTipo.INSUMO.length > 0">
                <!-- Agrupar por sistema -->
                <div v-for="(items, sistema) in agruparPorSistema(refaccionesPorTipo.INSUMO)" :key="sistema" class="mb-4">
                  <div class="bg-green-50 p-3 rounded-t-lg border-l-4 border-green-500">
                    <h4 class="font-bold text-gray-800">{{ sistema }}</h4>
                  </div>
                  <div class="border border-t-0 rounded-b-lg p-4 bg-white">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div v-for="refaccion in items" :key="refaccion.id" class="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          :id="`insumo-${refaccion.id}`"
                          v-model="refaccionesSeleccionadas"
                          :value="refaccion.id"
                          class="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label :for="`insumo-${refaccion.id}`" class="flex-1 cursor-pointer">
                          <p class="font-medium text-gray-900">{{ refaccion.nombre }}</p>
                          <p v-if="refaccion.descripcion" class="text-sm text-gray-600">{{ refaccion.descripcion }}</p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-gray-500 py-8">
                No hay insumos disponibles para este diagnóstico
              </div>
            </div>

            <!-- Herramientas -->
            <div v-show="tipoActivo === 'HERRAMIENTA'" class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">Herramientas</h3>
              <div v-if="refaccionesPorTipo.HERRAMIENTA && refaccionesPorTipo.HERRAMIENTA.length > 0">
                <!-- Agrupar por sistema -->
                <div v-for="(items, sistema) in agruparPorSistema(refaccionesPorTipo.HERRAMIENTA)" :key="sistema" class="mb-4">
                  <div class="bg-yellow-50 p-3 rounded-t-lg border-l-4 border-yellow-500">
                    <h4 class="font-bold text-gray-800">{{ sistema }}</h4>
                  </div>
                  <div class="border border-t-0 rounded-b-lg p-4 bg-white">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div v-for="refaccion in items" :key="refaccion.id" class="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          :id="`herramienta-${refaccion.id}`"
                          v-model="refaccionesSeleccionadas"
                          :value="refaccion.id"
                          class="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                        />
                        <label :for="`herramienta-${refaccion.id}`" class="flex-1 cursor-pointer">
                          <p class="font-medium text-gray-900">{{ refaccion.nombre }}</p>
                          <p v-if="refaccion.descripcion" class="text-sm text-gray-600">{{ refaccion.descripcion }}</p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-gray-500 py-8">
                No hay herramientas disponibles para este diagnóstico
              </div>
            </div>

            <!-- Servicios -->
            <div v-show="tipoActivo === 'SERVICIO'" class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-800 mb-3">Servicios</h3>
              <div v-if="refaccionesPorTipo.SERVICIO && refaccionesPorTipo.SERVICIO.length > 0">
                <!-- Agrupar por sistema -->
                <div v-for="(items, sistema) in agruparPorSistema(refaccionesPorTipo.SERVICIO)" :key="sistema" class="mb-4">
                  <div class="bg-purple-50 p-3 rounded-t-lg border-l-4 border-purple-500">
                    <h4 class="font-bold text-gray-800">{{ sistema }}</h4>
                  </div>
                  <div class="border border-t-0 rounded-b-lg p-4 bg-white">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div v-for="refaccion in items" :key="refaccion.id" class="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          :id="`servicio-${refaccion.id}`"
                          v-model="refaccionesSeleccionadas"
                          :value="refaccion.id"
                          class="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label :for="`servicio-${refaccion.id}`" class="flex-1 cursor-pointer">
                          <p class="font-medium text-gray-900">{{ refaccion.nombre }}</p>
                          <p v-if="refaccion.descripcion" class="text-sm text-gray-600">{{ refaccion.descripcion }}</p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-gray-500 py-8">
                No hay servicios disponibles para este diagnóstico
              </div>
            </div>
          </div>

          <!-- Resumen de selección -->
          <div v-if="refaccionesSeleccionadas.length > 0" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-2">Resumen de Selección</h4>
            <p class="text-sm text-gray-700">
              Has seleccionado <span class="font-bold text-green-700">{{ refaccionesSeleccionadas.length }}</span> items para solicitar
            </p>
          </div>

          <!-- Botones de acción -->
          <div class="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              @click="$emit('close')"
              class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <BaseButton
              type="submit"
              :disabled="refaccionesSeleccionadas.length === 0 || isSubmitting"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {{ isSubmitting ? 'Guardando...' : 'Guardar Solicitud' }}
            </BaseButton>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import BaseButton from '../global/BaseButton.vue'
import { useSubmitButton } from '../../composables/useSubmitButton.js'
import { useToastStore } from '../../stores/toast.js'
import apiClient from '../../services/api.js'

export default {
  name: 'SolicitudRefaccionesFormModal',
  components: {
    BaseButton
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    solicitudData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['close', 'solicitud-guardada'],
  setup() {
    const { executeSubmit } = useSubmitButton()
    const toastStore = useToastStore()
    return {
      executeSubmit,
      toastStore
    }
  },
  data() {
    return {
      tipoActivo: 'REFACCION',
      tiposDisponibles: ['REFACCION', 'INSUMO', 'HERRAMIENTA', 'SERVICIO'],
      refaccionesSeleccionadas: [],
      catalogoRefacciones: [],
      isLoadingRefacciones: false,
      errorRefacciones: null,
      isSubmitting: false
    }
  },
  computed: {
    // Agrupar refacciones por tipo
    refaccionesPorTipo() {
      return this.catalogoRefacciones.reduce((grupos, refaccion) => {
        const tipo = refaccion.tipo || 'OTRO'
        if (!grupos[tipo]) {
          grupos[tipo] = []
        }
        grupos[tipo].push(refaccion)
        return grupos
      }, {})
    }
  },
  watch: {
    show(newVal) {
      if (newVal && this.solicitudData?.folio_diagnostico) {
        this.cargarRefaccionesPorDiagnostico()
      }
    }
  },
  methods: {
    // Cargar refacciones basadas en el diagnóstico
    async cargarRefaccionesPorDiagnostico() {
      if (!this.solicitudData?.folio_diagnostico) {
        this.errorRefacciones = 'No se encontró el folio del diagnóstico'
        return
      }

      this.isLoadingRefacciones = true
      this.errorRefacciones = null

      try {
        const response = await apiClient.get(`/catalogo-refacciones/diagnostico/${this.solicitudData.folio_diagnostico}`)
        
        if (response.data && response.data.data) {
          this.catalogoRefacciones = response.data.data
          console.log('Refacciones cargadas:', this.catalogoRefacciones.length)
        } else {
          this.errorRefacciones = 'No se encontraron refacciones para este diagnóstico'
        }
      } catch (error) {
        console.error('Error al cargar refacciones:', error)
        this.errorRefacciones = error.response?.data?.message || 'Error al cargar las refacciones disponibles'
        this.toastStore.addToast({
          type: 'error',
          message: this.errorRefacciones,
          duration: 5000
        })
      } finally {
        this.isLoadingRefacciones = false
      }
    },

    // Agrupar items por sistema
    agruparPorSistema(items) {
      if (!items || !Array.isArray(items)) return {}
      
      return items.reduce((grupos, item) => {
        const sistema = item.sistema || 'OTROS'
        if (!grupos[sistema]) {
          grupos[sistema] = []
        }
        grupos[sistema].push(item)
        return grupos
      }, {})
    },

    // Obtener cantidad de items seleccionados por tipo
    getSelectedCountByTipo(tipo) {
      if (!this.refaccionesPorTipo[tipo]) return 0
      
      const idsDelTipo = this.refaccionesPorTipo[tipo].map(r => r.id)
      return this.refaccionesSeleccionadas.filter(id => idsDelTipo.includes(id)).length
    },

    // Enviar formulario
    async handleSubmit() {
      if (this.refaccionesSeleccionadas.length === 0) {
        this.toastStore.addToast({
          type: 'warning',
          message: 'Debes seleccionar al menos un item',
          duration: 3000
        })
        return
      }

      this.isSubmitting = true

      try {
        // Primero verificar si ya existe una solicitud para este diagnóstico
        let solicitudId = this.solicitudData?.id

        if (!solicitudId) {
          // Crear nueva solicitud
          const createResponse = await apiClient.post('/solicitudes-refacciones', {
            folio_diagnostico: this.solicitudData.folio_diagnostico
          })
          
          if (createResponse.data && createResponse.data.data) {
            solicitudId = createResponse.data.data.id
            console.log('Solicitud creada con ID:', solicitudId)
          }
        }

        // Agregar las refacciones a la solicitud
        if (solicitudId) {
          await apiClient.post(`/solicitudes-refacciones/${solicitudId}/detalle`, {
            refacciones: this.refaccionesSeleccionadas
          })

          this.toastStore.addToast({
            type: 'success',
            message: `Se agregaron ${this.refaccionesSeleccionadas.length} items a la solicitud`,
            duration: 3000
          })

          this.$emit('solicitud-guardada')
        }
      } catch (error) {
        console.error('Error al guardar solicitud:', error)
        this.toastStore.addToast({
          type: 'error',
          message: error.response?.data?.message || 'Error al guardar la solicitud',
          duration: 5000
        })
      } finally {
        this.isSubmitting = false
      }
    },

    // Resetear formulario
    resetForm() {
      this.refaccionesSeleccionadas = []
      this.tipoActivo = 'REFACCION'
      this.catalogoRefacciones = []
      this.errorRefacciones = null
    }
  }
}
</script>

<style scoped>
.close-button {
  background-color: #f87171;
  color: white;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #ef4444;
}

/* Estilos para los checkboxes */
input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
}

/* Animación suave */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
