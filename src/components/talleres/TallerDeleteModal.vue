<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative border border-gray-200">
      <button @click="$emit('close')" class="absolute top-4 right-4 bg-gray-500 hover:bg-gray-600 text-white rounded-md p-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      
      <!-- Icono de advertencia -->
      <div class="flex items-center justify-center mb-6">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
      </div>

      <h2 class="text-2xl font-bold mb-4 text-gray-900 text-center">
        ¿Eliminar Taller?
      </h2>
      
      <div class="mb-6">
        <p class="text-gray-600 text-center mb-4">
          Esta acción no se puede deshacer. Se eliminará permanentemente el taller:
        </p>
        
        <div v-if="taller" class="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10">
              <div class="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-900">
                {{ taller.nombre }}
              </div>
              <div class="text-sm text-gray-500">
                COPEs asignados: {{ taller.copes?.length || 0 }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-800">
                <strong>Advertencia:</strong> Esta acción eliminará permanentemente el taller y todas sus asignaciones de COPEs.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <BaseButton 
          variant="secondary"
          @click="$emit('close')"
          type="button"
        >
          Cancelar
        </BaseButton>
        <BaseButton 
          variant="danger"
          :onClick="handleDelete"
          custom-loading-text="Eliminando"
          :min-delay="1000"
        >
          Eliminar Taller
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from '../global/BaseButton.vue'
import { useSubmitButton } from '../../composables/useSubmitButton.js'
import { useToastStore } from '../../stores/toast.js'
import apiClient from '../../services/api.js'

export default {
  name: 'TallerDeleteModal',
  components: {
    BaseButton
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    taller: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'taller-eliminado'],
  setup() {
    const { executeSubmit } = useSubmitButton()
    const toastStore = useToastStore()
    return {
      executeSubmit,
      toastStore
    }
  },
  methods: {
    async handleDelete() {
      if (!this.taller) return
      
      try {
        await this.executeSubmit(async () => {
          console.log('Eliminando taller:', this.taller.id)
          
          await apiClient.post(`/destroy/talleres/${this.taller.id}`)
          
          this.toastStore.addToast({
            message: 'Taller eliminado exitosamente',
            type: 'success',
            duration: 3000
          })
          
          this.$emit('taller-eliminado')
        })
      } catch (error) {
        console.error('Error al eliminar taller:', error)
        
        let errorMessage = 'Error al eliminar el taller. Por favor, intente nuevamente.'
        
        if (error.response?.data?.error) {
          const serverError = error.response.data.error
          if (typeof serverError === 'string') {
            errorMessage = serverError
          } else if (typeof serverError === 'object') {
            errorMessage = Object.values(serverError).flat().join(', ')
          }
        }
        
        this.toastStore.addToast({
          message: errorMessage,
          type: 'error',
          duration: 5000
        })
      }
    }
  }
}
</script>
