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
                    {{ isLoadingMecanicos ? 'Cargando mecánicos...' : `Seleccionar mecánico... (${mecanicos.length} disponibles)` }}
                  </option>
                  <option 
                    v-for="mecanico in mecanicos" 
                    :key="mecanico.id" 
                    :value="mecanico.id"
                  >
                    {{ mecanico.nombre }} (ID: {{ mecanico.id }})
                  </option>
                </select>
                <div v-if="!isLoadingMecanicos && mecanicos.length === 0" class="text-yellow-600 text-xs mt-1">
                  No hay mecánicos disponibles
                </div>
                <div v-if="formData.mecanico_id && !mecanicoValid" class="text-red-500 text-xs mt-1">
                  Debe seleccionar un mecánico
                </div>
                <!-- DEBUG INFO -->
                <div class="text-xs text-gray-500 mt-1 p-2 bg-gray-50 rounded">
                  Debug: Loading={{ isLoadingMecanicos }}, Array length={{ mecanicos.length }}, Selected={{ formData.mecanico_id }}
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
                    {{ isLoadingRecepciones ? 'Cargando órdenes...' : `Seleccionar folio... (${recepciones.length} disponibles)` }}
                  </option>
                  <option 
                    v-for="recepcion in recepciones" 
                    :key="recepcion.id" 
                    :value="recepcion.id"
                  >
                    Folio: {{ recepcion.id }} - {{ recepcion.numero_economico }} ({{ recepcion.placas }})
                  </option>
                </select>
                <div v-if="!isLoadingRecepciones && recepciones.length === 0" class="text-yellow-600 text-xs mt-1">
                  No hay órdenes sin diagnóstico disponibles
                </div>
                <div v-if="formData.folio_recepcion && !folioValid" class="text-red-500 text-xs mt-1">
                  Debe seleccionar un folio de orden
                </div>
                <!-- DEBUG INFO -->
                <div class="text-xs text-gray-500 mt-1 p-2 bg-gray-50 rounded">
                  Debug: Loading={{ isLoadingRecepciones }}, Array length={{ recepciones.length }}, Selected={{ formData.folio_recepcion }}
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
    
    // Watchers para monitorear cambios en los arrays
    watch(mecanicos, (newValue) => {
      console.log('🔄 CAMBIO EN MECANICOS:', newValue)
      console.log('🔄 Cantidad de mecánicos:', newValue.length)
    }, { deep: true })
    
    watch(recepciones, (newValue) => {
      console.log('🔄 CAMBIO EN RECEPCIONES:', newValue)
      console.log('🔄 Cantidad de recepciones:', newValue.length)
    }, { deep: true })
    
    // Computed properties para validaciones
    const mecanicoValid = computed(() => {
      const isValid = formData.value.mecanico_id && formData.value.mecanico_id !== ''
      console.log('🔍 Validación mecánico - ID:', formData.value.mecanico_id, 'Válido:', isValid)
      return isValid
    })
    
    const folioValid = computed(() => {
      const isValid = formData.value.folio_recepcion && formData.value.folio_recepcion !== ''
      console.log('🔍 Validación folio - ID:', formData.value.folio_recepcion, 'Válido:', isValid)
      return isValid
    })
    
    const isStepValid = computed(() => {
      const isValid = mecanicoValid.value && folioValid.value
      console.log('🔍 Validación total - Mecánico:', mecanicoValid.value, 'Folio:', folioValid.value, 'Total válido:', isValid)
      return isValid
    })
    
    // Cargar mecánicos desde la API
    const cargarMecanicos = async () => {
      console.log('🚀 INICIANDO CARGA DE MECÁNICOS')
      isLoadingMecanicos.value = true
      
      try {
        console.log('📡 Haciendo petición GET a /usuarios-mecanicos')
        console.log('🔗 URL completa:', apiClient.defaults.baseURL + '/usuarios-mecanicos')
        
        const response = await apiClient.get('/usuarios-mecanicos')
        
        console.log('✅ Respuesta recibida:')
        console.log('   - Status:', response.status)
        console.log('   - Headers:', response.headers)
        console.log('   - Data completa:', JSON.stringify(response.data, null, 2))
        
        // Verificar estructura de respuesta
        if (!response.data || typeof response.data !== 'object') {
          throw new Error('Respuesta inválida del servidor')
        }
        
        // Extraer usuarios mecánicos
        const usuariosMecanicos = response.data.usuarios_mecanicos
        
        console.log('🔍 Procesando datos:')
        console.log('   - usuarios_mecanicos existe?', !!usuariosMecanicos)
        console.log('   - Es array?', Array.isArray(usuariosMecanicos))
        console.log('   - Cantidad:', usuariosMecanicos?.length || 0)
        console.log('   - Datos:', usuariosMecanicos)
        
        if (!Array.isArray(usuariosMecanicos)) {
          console.warn('⚠️ usuarios_mecanicos no es un array válido')
          mecanicos.value = []
          return
        }
        
        // Mapear y procesar datos
        console.log('🔄 Mapeando datos de mecánicos:')
        mecanicos.value = usuariosMecanicos.map((usuario, index) => {
          console.log(`   ${index + 1}. ID: ${usuario.id}, Nombre: "${usuario.nombre}"`)
          return {
            id: usuario.id,
            nombre: usuario.nombre
          }
        })
        
        console.log('✨ MECÁNICOS CARGADOS EXITOSAMENTE:')
        console.log('   - Total procesados:', mecanicos.value.length)
        console.log('   - Array final:', mecanicos.value)
        
        // Forzar actualización reactiva
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        console.error('❌ ERROR CARGANDO MECÁNICOS:')
        console.error('   - Tipo error:', error.name)
        console.error('   - Mensaje:', error.message)
        console.error('   - Status HTTP:', error.response?.status)
        console.error('   - Respuesta servidor:', error.response?.data)
        console.error('   - Error completo:', error)
        
        mecanicos.value = []
        toastStore.addToast({
          message: `Error al cargar mecánicos: ${error.response?.data?.message || error.message}`,
          type: 'error',
          duration: 5000
        })
      } finally {
        isLoadingMecanicos.value = false
        console.log('🏁 Carga de mecánicos finalizada - Loading:', isLoadingMecanicos.value)
      }
    }
    
    // Cargar órdenes sin diagnóstico desde la API
    const cargarRecepciones = async () => {
      console.log('🚀 INICIANDO CARGA DE ÓRDENES SIN DIAGNÓSTICO')
      isLoadingRecepciones.value = true
      
      try {
        console.log('📡 Haciendo petición GET a /ordenes-sin-diagnosticos')
        console.log('🔗 URL completa:', apiClient.defaults.baseURL + '/ordenes-sin-diagnosticos')
        
        const response = await apiClient.get('/ordenes-sin-diagnosticos')
        
        console.log('✅ Respuesta recibida:')
        console.log('   - Status:', response.status)
        console.log('   - Data completa:', JSON.stringify(response.data, null, 2))
        
        // Verificar estructura de respuesta
        if (!response.data || typeof response.data !== 'object') {
          throw new Error('Respuesta inválida del servidor')
        }
        
        // Extraer IDs de órdenes sin diagnóstico
        const ordenesSinDiagnostico = response.data.ordenes_sin_diagnostico
        
        console.log('🔍 Procesando datos:')
        console.log('   - ordenes_sin_diagnostico existe?', !!ordenesSinDiagnostico)
        console.log('   - Es array?', Array.isArray(ordenesSinDiagnostico))
        console.log('   - Cantidad:', ordenesSinDiagnostico?.length || 0)
        console.log('   - IDs:', ordenesSinDiagnostico)
        
        if (!Array.isArray(ordenesSinDiagnostico) || ordenesSinDiagnostico.length === 0) {
          console.warn('⚠️ No hay órdenes sin diagnóstico disponibles')
          recepciones.value = []
          return
        }
        
        // Crear opciones simplificadas usando solo los IDs
        console.log('🔄 Creando opciones para el select:')
        recepciones.value = ordenesSinDiagnostico.map((id, index) => {
          console.log(`   ${index + 1}. Orden ID: ${id}`)
          return {
            id: id,
            numero_economico: `Orden ${id}`,
            placas: 'Pendiente de cargar'
          }
        })
        
        console.log('✨ ÓRDENES CARGADAS EXITOSAMENTE:')
        console.log('   - Total procesadas:', recepciones.value.length)
        console.log('   - Array final:', recepciones.value)
        
        // Forzar actualización reactiva
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        console.error('❌ ERROR CARGANDO ÓRDENES:')
        console.error('   - Tipo error:', error.name)
        console.error('   - Mensaje:', error.message)
        console.error('   - Status HTTP:', error.response?.status)
        console.error('   - Respuesta servidor:', error.response?.data)
        console.error('   - Error completo:', error)
        
        recepciones.value = []
        
        if (error.response?.status === 404) {
          console.log('ℹ️ No hay órdenes sin diagnóstico (404) - esto es normal')
        } else {
          toastStore.addToast({
            message: `Error al cargar órdenes: ${error.response?.data?.message || error.message}`,
            type: 'error',
            duration: 5000
          })
        }
      } finally {
        isLoadingRecepciones.value = false
        console.log('🏁 Carga de órdenes finalizada - Loading:', isLoadingRecepciones.value)
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
    watch(() => props.show, async (newValue, oldValue) => {
      console.log('🔄 === WATCHER DEL MODAL ===')
      console.log('   📋 Valor anterior:', oldValue)
      console.log('   📋 Valor nuevo:', newValue)
      console.log('   🚪 ¿Modal abriéndose?:', newValue === true)
      
      if (newValue) {
        console.log('🎯 MODAL ABIERTO - Iniciando secuencia de carga...')
        
        // Resetear formulario
        resetForm()
        console.log('✅ Formulario reseteado')
        
        // Limpiar arrays por seguridad
        mecanicos.value = []
        recepciones.value = []
        console.log('🧹 Arrays limpiados')
        
        console.log('⏳ Estado inicial de carga:')
        console.log('   - Mecánicos array:', mecanicos.value.length)
        console.log('   - Recepciones array:', recepciones.value.length)
        console.log('   - Loading mecánicos:', isLoadingMecanicos.value)
        console.log('   - Loading recepciones:', isLoadingRecepciones.value)
        
        // Cargar datos en paralelo
        console.log('🔄 Iniciando carga de datos en paralelo...')
        await Promise.all([
          cargarMecanicos(),
          cargarRecepciones()
        ])
        
        console.log('✨ CARGA COMPLETA - Estado final:')
        console.log('   - Mecánicos cargados:', mecanicos.value.length, mecanicos.value)
        console.log('   - Órdenes cargadas:', recepciones.value.length, recepciones.value)
        console.log('   - Loading mecánicos:', isLoadingMecanicos.value)
        console.log('   - Loading recepciones:', isLoadingRecepciones.value)
      } else {
        console.log('🚪 Modal cerrado - limpiando estado')
        // Opcional: limpiar datos cuando se cierra
        // mecanicos.value = []
        // recepciones.value = []
      }
    }, { immediate: false })
    
    // Cargar datos si el modal ya está abierto al montar el componente
    onMounted(() => {
      console.log('🎅 COMPONENTE MONTADO')
      console.log('   - Modal show:', props.show)
      console.log('   - Mecánicos:', mecanicos.value.length)
      console.log('   - Recepciones:', recepciones.value.length)
      
      if (props.show) {
        console.log('🚀 Modal ya abierto al montar - cargando datos...')
        resetForm()
        mecanicos.value = []
        recepciones.value = []
        
        Promise.all([
          cargarMecanicos(),
          cargarRecepciones()
        ]).then(() => {
          console.log('✅ Datos cargados en onMounted')
        })
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