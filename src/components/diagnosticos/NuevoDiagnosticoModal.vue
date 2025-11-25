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
                  v-model="formData.usuario_mecasoft_id"
                  :disabled="isLoadingMecanicos"
                  :class="[
                    'input mb-2 w-full transition-colors',
                    formData.usuario_mecasoft_id ? (mecanicoValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
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
                <div v-if="!isLoadingMecanicos && mecanicos.length === 0" class="text-yellow-600 text-xs mt-1">
                  No hay mecánicos disponibles
                </div>
                <div v-if="formData.usuario_mecasoft_id && !mecanicoValid" class="text-red-500 text-xs mt-1">
                  Debe seleccionar un mecánico
                </div>
              </div>

              <!-- Select de Folio de Orden -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <label class="block mb-2 font-semibold text-gray-700">Folio de Orden *</label>
                <select
                  v-model="formData.recepcion_id"
                  :disabled="isLoadingRecepciones"
                  :class="[
                    'input mb-2 w-full transition-colors',
                    formData.recepcion_id ? (folioValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
                  ]"
                  required
                >
                  <option value="">
                    {{ isLoadingRecepciones ? 'Cargando órdenes...' : 'Seleccionar orden...' }}
                  </option>
                  <option 
                    v-for="ordenId in recepciones" 
                    :key="ordenId" 
                    :value="ordenId"
                  >
                    Folio {{ ordenId }}
                  </option>
                </select>
                <div v-if="!isLoadingRecepciones && recepciones.length === 0" class="text-yellow-600 text-xs mt-1">
                  No hay órdenes sin diagnóstico disponibles
                </div>
                <div v-if="formData.recepcion_id && !folioValid" class="text-red-500 text-xs mt-1">
                  Debe seleccionar un folio de orden
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
      usuario_mecasoft_id: '',
      recepcion_id: ''
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
      return formData.value.usuario_mecasoft_id && formData.value.usuario_mecasoft_id !== ''
    })
    
    const folioValid = computed(() => {
      return formData.value.recepcion_id && formData.value.recepcion_id !== ''
    })
    
    const isStepValid = computed(() => {
      return mecanicoValid.value && folioValid.value
    })
    
    // Cargar mecánicos desde la API
    const cargarMecanicos = async () => {
      isLoadingMecanicos.value = true
      
      try {
        const response = await apiClient.get('/usuarios-mecanicos')
        
        // Verificar estructura de respuesta
        if (!response.data || typeof response.data !== 'object') {
          throw new Error('Respuesta inválida del servidor')
        }
        
        // Extraer usuarios mecánicos
        const usuariosMecanicos = response.data.usuarios_mecanicos
        
        if (!Array.isArray(usuariosMecanicos)) {
          mecanicos.value = []
          return
        }
        
        // Mapear datos
        mecanicos.value = usuariosMecanicos.map(usuario => ({
          id: usuario.id,
          nombre: usuario.nombre
        }))
        
      } catch (error) {
        console.error('Error cargando mecánicos:', error.response?.data || error.message)
        mecanicos.value = []
        toastStore.addToast({
          message: `Error al cargar mecánicos: ${error.response?.data?.message || error.message}`,
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
        const response = await apiClient.get('/ordenes-sin-diagnosticos')
        
        // Verificar estructura de respuesta
        if (!response.data || typeof response.data !== 'object') {
          throw new Error('Respuesta inválida del servidor')
        }
        
        // Extraer IDs de órdenes sin diagnóstico
        const ordenesSinDiagnostico = response.data.ordenes_sin_diagnostico
        
        if (!Array.isArray(ordenesSinDiagnostico)) {
          recepciones.value = []
          return
        }
        
        // Los datos son solo IDs, almacenarlos directamente
        recepciones.value = ordenesSinDiagnostico
        
      } catch (error) {
        console.error('Error cargando órdenes:', error.response?.data || error.message)
        recepciones.value = []
        
        if (error.response?.status !== 404) {
          toastStore.addToast({
            message: `Error al cargar órdenes: ${error.response?.data?.message || error.message}`,
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
          // Preparar los datos para enviar a la API
          const diagnosticoData = {
            usuario_mecasoft_id: parseInt(formData.value.usuario_mecasoft_id),
            recepcion_id: parseInt(formData.value.recepcion_id)
          }
          
          // Enviar a la API
          const response = await apiClient.post('/diagnosticos', diagnosticoData)
          
          // Emitir evento de diagnóstico creado con los datos de la respuesta
          emit('diagnostico-creado', response.data.diagnostico)
          
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
        
        let errorMessage = 'Error al crear el diagnóstico'
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        }
        
        toastStore.addToast({
          message: errorMessage,
          type: 'error',
          duration: 5000
        })
      }
    }
    
    // Limpiar formulario
    const resetForm = () => {
      formData.value = {
        usuario_mecasoft_id: '',
        recepcion_id: ''
      }
    }
    
    // Cargar datos cuando se abre el modal
    watch(() => props.show, async (newValue) => {
      if (newValue) {
        // Resetear formulario y limpiar arrays
        resetForm()
        mecanicos.value = []
        recepciones.value = []
        
        // Cargar datos en paralelo
        await Promise.all([
          cargarMecanicos(),
          cargarRecepciones()
        ])
      }
    }, { immediate: false })
    
    // Cargar datos si el modal ya está abierto al montar el componente
    onMounted(() => {
      if (props.show) {
        resetForm()
        mecanicos.value = []
        recepciones.value = []
        
        Promise.all([
          cargarMecanicos(),
          cargarRecepciones()
        ])
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