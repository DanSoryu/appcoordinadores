<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
    <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative border border-gray-200 overflow-y-auto max-h-[90vh]">
      <button @click="$emit('close')" class="close-button absolute top-4 right-4">
        <font-awesome-icon icon="times" />
      </button>
      <h2 class="text-2xl font-bold mb-6 text-blue-600 text-center">Nuevo Diagnóstico</h2>
      <form @submit.prevent="handleFinalSubmit">
        <div>
          <!-- SECCIÓN ÚNICA: DATOS DEL DIAGNÓSTICO -->
          <div class="mb-8 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border-l-4 border-primary-500">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center mr-3">
                <font-awesome-icon icon="clipboard-list" class="w-4 h-4" />
              </div>
              <h3 class="text-xl font-bold text-primary-700">Información del Diagnóstico</h3>
            </div>
            <div class="space-y-4">
              <!-- Select de Mecánico -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <label class="block mb-2 font-semibold text-gray-700">Mecánico *</label>
                <select
                  v-model="formData.mecanico_id"
                  :disabled="isLoadingMecanicos"
                  :class="[
                    'input mb-2 w-full transition-colors',
                    formData.mecanico_id ? (mecanicoValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
                  ]"
                  required
                >
                  <option value="">
                    {{ isLoadingMecanicos ? 'Cargando mecánicos...' : 'Seleccionar mecánico...' }}
                  </option>
                  <option 
                    v-for="mecanico in mecanicos" 
                    :key="mecanico.id" 
                    :value="mecanico.id"
                  >
                    {{ mecanico.nombre }}
                  </option>
                </select>
                <div v-if="formData.mecanico_id && !mecanicoValid" class="text-red-500 text-xs mt-1">
                  Debe seleccionar un mecánico
                </div>
              </div>

              <!-- Select de Folio de Orden -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <label class="block mb-2 font-semibold text-gray-700">Folio de Orden *</label>
                <select
                  v-model="formData.folio_recepcion"
                  :disabled="isLoadingRecepciones"
                  :class="[
                    'input mb-2 w-full transition-colors',
                    formData.folio_recepcion ? (folioValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
                  ]"
                  required
                >
                  <option value="">
                    {{ isLoadingRecepciones ? 'Cargando órdenes...' : 'Seleccionar folio...' }}
                  </option>
                  <option 
                    v-for="recepcion in recepciones" 
                    :key="recepcion.id" 
                    :value="recepcion.id"
                  >
                    Folio: {{ recepcion.id }} - {{ recepcion.numero_economico }} ({{ recepcion.placas }})
                  </option>
                </select>
                <div v-if="formData.folio_recepcion && !folioValid" class="text-red-500 text-xs mt-1">
                  Debe seleccionar un folio de orden
                </div>
                <div v-if="recepciones.length === 0 && !isLoadingRecepciones" class="text-yellow-600 text-xs mt-1">
                  No hay órdenes sin diagnóstico disponibles
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-8">
          <BaseButton 
            type="submit" 
            variant="success"
            :disabled="!isStepValid"
            :onClick="handleFinalSubmit"
            custom-loading-text="Procesando"
            :min-delay="1500"
          >
            Crear Diagnóstico
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useToastStore } from '../../stores/toast.js'
import { useSubmitButton } from '../../composables/useSubmitButton.js'
import BaseButton from '../global/BaseButton.vue'
import apiClient from '../../services/api.js'

export default {
  name: 'NuevoDiagnosticoModal',
  components: {
    BaseButton
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'diagnostico-creado'],
  setup(props, { emit }) {
    const toastStore = useToastStore()
    const { executeSubmit } = useSubmitButton()
    
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
    
    // Computed properties para validaciones
    const mecanicoValid = computed(() => {
      return formData.value.mecanico_id && formData.value.mecanico_id !== ''
    })
    
    const folioValid = computed(() => {
      return formData.value.folio_recepcion && formData.value.folio_recepcion !== ''
    })
    
    const isStepValid = computed(() => {
      return mecanicoValid.value && folioValid.value
    })
    
    // Cargar mecánicos desde la API
    const cargarMecanicos = async () => {
      isLoadingMecanicos.value = true
      
      try {
        console.log('Cargando usuarios mecánicos...')
        
        // Usar la nueva ruta específica para usuarios mecánicos
        const response = await apiClient.get('/usuarios-mecanicos')
        
        // La respuesta viene con formato { usuarios_mecanicos: [...], total: X }
        const usuariosMecanicos = response.data.usuarios_mecanicos || []
        
        // Mapear los datos al formato esperado
        mecanicos.value = usuariosMecanicos.map(usuario => ({
          id: usuario.id,
          nombre: usuario.nombre
        }))
        
        console.log('Mecánicos cargados:', mecanicos.value)
      } catch (error) {
        console.error('Error al cargar mecánicos:', error)
        mecanicos.value = []
        toastStore.addToast({
          message: 'Error al cargar la lista de mecánicos',
          type: 'error',
          duration: 5000
        })
      } finally {
        isLoadingMecanicos.value = false
      }
    }
    
    // Cargar órdenes sin diagnóstico desde la API
    const cargarRecepciones = async () => {
      isLoadingRecepciones.value = true
      
      try {
        console.log('Cargando órdenes sin diagnóstico...')
        
        // Usar la nueva ruta específica para órdenes sin diagnóstico
        const ordenesSinDiagnosticoResponse = await apiClient.get('/ordenes-sin-diagnosticos')
        
        // La respuesta viene con formato { ordenes_sin_diagnostico: [1, 2, 3], total: X }
        const ordenesSinDiagnostico = ordenesSinDiagnosticoResponse.data.ordenes_sin_diagnostico || []
        
        console.log('Órdenes sin diagnóstico obtenidas:', ordenesSinDiagnostico)
        
        if (ordenesSinDiagnostico.length === 0) {
          recepciones.value = []
          console.log('No hay órdenes sin diagnóstico disponibles')
          return
        }
        
        // Ahora necesitamos obtener los detalles de estas recepciones específicas
        // Cargar recepciones y vehículos para mostrar la información completa
        let recepcionesData = []
        let vehiculosData = []
        
        try {
          const [recepcionResponse, vehiculosResponse] = await Promise.all([
            apiClient.get('/recepcion'),
            apiClient.get('/vehiculos')
          ])
          
          recepcionesData = recepcionResponse.data
          vehiculosData = vehiculosResponse.data
          
          console.log('Datos auxiliares cargados - Recepciones:', recepcionesData.length, 'Vehículos:', vehiculosData.length)
        } catch (auxiliarError) {
          console.error('Error al cargar datos auxiliares:', auxiliarError)
          // Continuar con arrays vacíos si falla
          recepcionesData = []
          vehiculosData = []
        }
        
        // Filtrar solo las recepciones que están en la lista de órdenes sin diagnóstico
        const recepcionesFiltradas = recepcionesData.filter(recepcion => 
          ordenesSinDiagnostico.includes(recepcion.id)
        )
        
        // Combinar datos de recepción con datos de vehículos
        recepciones.value = recepcionesFiltradas.map(recepcion => {
          const vehiculo = vehiculosData.find(v => v.id === recepcion.vehiculo_id)
          console.log(`Procesando recepción ID: ${recepcion.id}, vehiculo_id: ${recepcion.vehiculo_id}`, vehiculo)
          return {
            id: recepcion.id,
            numero_economico: vehiculo?.numero_economico || 'N/A',
            placas: vehiculo?.placas || 'N/A'
          }
        })
        
        console.log('Recepciones finales (sin diagnóstico) cargadas:', recepciones.value)
      } catch (error) {
        console.error('Error al cargar órdenes sin diagnóstico:', error)
        recepciones.value = []
        
        if (error.response?.status === 404) {
          // No hay órdenes sin diagnóstico, no es un error crítico
          console.log('No hay órdenes sin diagnóstico disponibles (404)')
        } else {
          toastStore.addToast({
            message: 'Error al cargar las órdenes disponibles',
            type: 'error',
            duration: 5000
          })
        }
      } finally {
        isLoadingRecepciones.value = false
      }
    }
    
    // Guardar diagnóstico
    const handleFinalSubmit = async () => {
      if (!isStepValid.value) return
      
      try {
        await executeSubmit(async () => {
          // Crear el nuevo diagnóstico con los datos del formulario
          const nuevoDiagnostico = {
            id: Math.max(...(recepciones.value.length > 0 ? recepciones.value.map(r => r.id) : [0])) + Math.floor(Math.random() * 1000), // ID temporal para datos de prueba
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
          
          toastStore.addToast({
            message: 'Diagnóstico creado exitosamente',
            type: 'success',
            duration: 3000
          })
          
          // Limpiar formulario y cerrar modal
          resetForm()
          emit('close')
        })
      } catch (error) {
        console.error('Error al crear diagnóstico:', error)
        toastStore.addToast({
          message: 'Error al crear el diagnóstico',
          type: 'error',
          duration: 5000
        })
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
      mecanicoValid,
      folioValid,
      isStepValid,
      handleFinalSubmit,
      resetForm,
      executeSubmit
    }
  }
}
</script>

<style scoped>
.input {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px;
  font-size: 1rem;
  transition: border-color 0.2s, background-color 0.2s;
}
.input:focus {
  border-color: #3b82f6;
  outline: none;
}
.input.border-green-500 {
  border-color: #10b981;
}
.input.border-red-500 {
  border-color: #ef4444;
}
.input.bg-green-50 {
  background-color: #f0fdf4;
}
.input.bg-red-50 {
  background-color: #fef2f2;
}
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
</style>