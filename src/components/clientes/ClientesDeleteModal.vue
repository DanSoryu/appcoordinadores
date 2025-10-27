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
        ¿Eliminar Cliente?
      </h2>
      
      <div class="mb-6">
        <p class="text-gray-600 text-center mb-4">
          Esta acción no se puede deshacer. Se eliminará permanentemente el cliente:
        </p>
        
        <div v-if="cliente" class="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10">
              <div class="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
                <span class="text-white text-sm font-bold">
                  #{{ cliente.id }}
                </span>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-sm font-medium text-gray-900">
                Cliente #{{ cliente.id }}
              </div>
              <div class="text-sm text-gray-500">
                Supervisor: {{ cliente.supervisor || 'Sin supervisor' }}
              </div>
              <div class="text-sm text-gray-500">
                {{ cliente.telefono || 'Sin teléfono' }}
              </div>
              <div class="text-sm text-gray-500">
                {{ cliente.correo || 'Sin correo' }}
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
                <strong>Advertencia:</strong> Esta acción eliminará permanentemente todos los datos asociados a este cliente, incluyendo historial de vehículos y servicios.
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
          Eliminar Cliente
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
  name: 'ClientesDeleteModal',
  components: {
    BaseButton
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    cliente: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['close', 'cliente-eliminado'],
  setup(props, { emit }) {
    const { executeSubmit } = useSubmitButton();
    const toastStore = useToastStore();

    const handleDelete = async () => {
      if (!props.cliente?.id) return;
      
      try {
        await executeSubmit(async () => {
          // Llamar a la API para eliminar el cliente
          await apiClient.delete(`/clientes/${props.cliente.id}`);
          
          console.log('Cliente eliminado:', props.cliente);
          
          // Emitir evento con el ID del cliente eliminado
          emit('cliente-eliminado', props.cliente.id);
        });
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        
        // Manejar errores específicos
        if (error.response?.status === 404) {
          toastStore.addToast({
            message: 'El cliente no fue encontrado',
            type: 'error',
            duration: 5000
          });
        } else if (error.response?.data?.error) {
          toastStore.addToast({
            message: error.response.data.error,
            type: 'error',
            duration: 5000
          });
        } else {
          toastStore.addToast({
            message: 'Error al eliminar el cliente. Por favor, intente nuevamente.',
            type: 'error',
            duration: 5000
          });
        }
      }
    };

    return {
      executeSubmit,
      toastStore,
      handleDelete
    };
  }
};
</script>