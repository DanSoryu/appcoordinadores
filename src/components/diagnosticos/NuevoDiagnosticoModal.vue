<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white w-full max-w-md max-h-[90vh] rounded-lg shadow-xl">
      <!-- Encabezado del modal -->
      <div class="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
        <h3 class="text-xl font-semibold">Nuevo Diagnóstico</h3>
        <button @click="$emit('close')" class="text-white hover:text-gray-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Contenido del modal -->
      <div class="p-6">
        <form @submit.prevent="guardarDiagnostico">
          <!-- Select de Mecánico -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Mecánico <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.mecanico_id"
              :disabled="isLoadingMecanicos"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Seleccionar mecánico...</option>
              <option 
                v-for="mecanico in mecanicos" 
                :key="mecanico.id" 
                :value="mecanico.id"
              >
                {{ mecanico.nombre }}
              </option>
            </select>
            <div v-if="isLoadingMecanicos" class="text-sm text-gray-500 mt-1">
              Cargando mecánicos...
            </div>
          </div>

          <!-- Select de Folio de Orden -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Folio de Orden <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.folio_recepcion"
              :disabled="isLoadingRecepciones"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Seleccionar folio...</option>
              <option 
                v-for="recepcion in recepciones" 
                :key="recepcion.id" 
                :value="recepcion.id"
              >
                {{ recepcion.id }} - {{ recepcion.numero_economico }} ({{ recepcion.placas }})
              </option>
            </select>
            <div v-if="isLoadingRecepciones" class="text-sm text-gray-500 mt-1">
              Cargando recepciones...
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSubmitting || !formData.mecanico_id || !formData.folio_recepcion"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ isSubmitting ? 'Guardando...' : 'Crear Diagnóstico' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useToastStore } from '../../stores/toast.js'
import apiClient from '../../services/api.js'

export default {
  name: 'NuevoDiagnosticoModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'diagnostico-creado'],
  setup(props, { emit }) {
    const toastStore = useToastStore()
    
    // Estados del formulario
    const formData = ref({
      mecanico_id: '',
      folio_recepcion: ''
    })
    
    // Estados de carga
    const isSubmitting = ref(false)
    const isLoadingMecanicos = ref(false)
    const isLoadingRecepciones = ref(false)
    
    // Datos para los selects
    const mecanicos = ref([])
    const recepciones = ref([])
    
    // Cargar mecánicos desde la API
    const cargarMecanicos = async () => {
      isLoadingMecanicos.value = true
      
      try {
        // Primero obtener los usuarios con rol de mecánico
        const usuariosResponse = await apiClient.get('/users')
        const usuariosMecanicos = usuariosResponse.data.filter(user => user.rol === 'mecanico')
        
        // Luego obtener los detalles de cada mecánico
        const mecanicosConDetalles = []
        
        for (const usuario of usuariosMecanicos) {
          try {
            const detalleResponse = await apiClient.get(`/detalle-mecanico/${usuario.id}`)
            mecanicosConDetalles.push({
              id: usuario.id,
              usuario: usuario.usuario,
              nombre: detalleResponse.data.nombre || usuario.usuario
            })
          } catch (error) {
            // Si no tiene detalles, usar el nombre de usuario
            console.log(`No hay detalles para mecánico ${usuario.id}, usando nombre de usuario`)
            mecanicosConDetalles.push({
              id: usuario.id,
              usuario: usuario.usuario,
              nombre: usuario.usuario
            })
          }
        }
        
        mecanicos.value = mecanicosConDetalles
        console.log('Mecánicos cargados:', mecanicos.value)
      } catch (error) {
        console.error('Error al cargar mecánicos:', error)
        toastStore.addToast({
          message: 'Error al cargar la lista de mecánicos',
          type: 'error',
          duration: 5000
        })
      } finally {
        isLoadingMecanicos.value = false
      }
    }
    
    // Cargar recepciones desde la API
    const cargarRecepciones = async () => {
      isLoadingRecepciones.value = true
      
      try {
        let recepcionesData = []
        let vehiculosData = []
        
        // Cargar recepciones
        try {
          const recepcionResponse = await apiClient.get('/recepcion')
          recepcionesData = recepcionResponse.data
        } catch (recepcionError) {
          if (recepcionError.response?.status === 404) {
            console.log('No hay recepciones disponibles')
            recepcionesData = []
          } else {
            throw recepcionError
          }
        }
        
        // Cargar vehículos si hay recepciones
        if (recepcionesData.length > 0) {
          try {
            const vehiculosResponse = await apiClient.get('/vehiculos')
            vehiculosData = vehiculosResponse.data
          } catch (vehiculosError) {
            console.error('Error al cargar vehículos:', vehiculosError)
            vehiculosData = []
          }
        }
        
        // Combinar datos de recepción con datos de vehículos
        recepciones.value = recepcionesData.map(recepcion => {
          const vehiculo = vehiculosData.find(v => v.id === recepcion.vehiculo_id)
          return {
            id: recepcion.id,
            numero_economico: vehiculo?.numero_economico || 'N/A',
            placas: vehiculo?.placas || 'N/A'
          }
        })
        
        console.log('Recepciones cargadas:', recepciones.value)
      } catch (error) {
        console.error('Error al cargar recepciones:', error)
        toastStore.addToast({
          message: 'Error al cargar la lista de recepciones',
          type: 'error',
          duration: 5000
        })
      } finally {
        isLoadingRecepciones.value = false
      }
    }
    
    // Guardar diagnóstico
    const guardarDiagnostico = async () => {
      isSubmitting.value = true
      
      try {
        // Crear el nuevo diagnóstico con los datos del formulario
        const nuevoDiagnostico = {
          id: Math.max(...(recepciones.value.map(r => r.id))) + Math.floor(Math.random() * 1000), // ID temporal para datos de prueba
          folioRecepcion: formData.value.folio_recepcion,
          estado: 'pendiente',
          fechaCreacion: new Date().toISOString(),
          fechaCompletado: null,
          diagnosticos: [],
          observaciones: 'Diagnóstico pendiente de realizar'
        }
        
        // TODO: Aquí se haría la llamada real a la API para crear el diagnóstico
        // const response = await apiClient.post('/diagnosticos', {
        //   mecanico_id: formData.value.mecanico_id,
        //   folio_recepcion: formData.value.folio_recepcion
        // })
        
        // Simular delay de la API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Emitir evento de diagnóstico creado
        emit('diagnostico-creado', nuevoDiagnostico)
        
        // Limpiar formulario
        resetForm()
        
      } catch (error) {
        console.error('Error al crear diagnóstico:', error)
        toastStore.addToast({
          message: 'Error al crear el diagnóstico',
          type: 'error',
          duration: 5000
        })
      } finally {
        isSubmitting.value = false
      }
    }
    
    // Limpiar formulario
    const resetForm = () => {
      formData.value = {
        mecanico_id: '',
        folio_recepcion: ''
      }
    }
    
    // Cargar datos cuando se abre el modal
    watch(() => props.show, (newValue) => {
      if (newValue) {
        cargarMecanicos()
        cargarRecepciones()
        resetForm()
      }
    })
    
    return {
      formData,
      isSubmitting,
      isLoadingMecanicos,
      isLoadingRecepciones,
      mecanicos,
      recepciones,
      guardarDiagnostico,
      resetForm
    }
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>