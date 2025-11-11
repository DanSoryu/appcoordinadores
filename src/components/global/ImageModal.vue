<template>
  <div
    v-if="show && imageUrl"
    class="fixed inset-0 z-50 flex items-center justify-center"
    @click="closeModal"
  >
    <!-- Overlay oscuro -->
    <div class="absolute inset-0 bg-black bg-opacity-75"></div>
    
    <!-- Contenedor de la imagen -->
    <div class="relative max-w-[90vw] max-h-[90vh] z-10" @click.stop>
      <!-- Botón de cerrar -->
      <button
        @click="closeModal"
        class="absolute -top-4 -right-4 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-lg transition-colors z-20"
        title="Cerrar imagen"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      
      <!-- Imagen -->
      <img
        :src="imageUrl"
        :alt="imageAlt"
        class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        @error="handleImageError"
        @load="handleImageLoad"
      />
      
      <!-- Indicador de carga -->
      <div
        v-if="isLoading"
        class="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg"
      >
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p class="text-gray-600">Cargando imagen...</p>
        </div>
      </div>
      
      <!-- Error al cargar imagen -->
      <div
        v-if="hasError"
        class="bg-white p-8 rounded-lg shadow-2xl text-center max-w-md"
      >
        <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Error al cargar imagen</h3>
        <p class="text-gray-600 mb-4">No se pudo cargar la imagen solicitada.</p>
        <p class="text-sm text-gray-500 break-all">{{ imageUrl }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'ImageModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    imageUrl: {
      type: String,
      default: null
    },
    imageAlt: {
      type: String,
      default: 'Imagen'
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const isLoading = ref(false)
    const hasError = ref(false)

    const closeModal = () => {
      emit('close')
    }

    const handleImageLoad = () => {
      isLoading.value = false
      hasError.value = false
    }

    const handleImageError = () => {
      isLoading.value = false
      hasError.value = true
    }

    // Manejar la tecla ESC para cerrar el modal
    const handleKeydown = (event) => {
      if (event.key === 'Escape' && props.show) {
        closeModal()
      }
    }

    // Agregar/remover listener de teclado cuando el modal se muestra/oculta
    watch(() => props.show, (newShow) => {
      if (newShow) {
        isLoading.value = true
        hasError.value = false
        document.addEventListener('keydown', handleKeydown)
        // Prevenir scroll del body cuando el modal está abierto
        document.body.style.overflow = 'hidden'
      } else {
        document.removeEventListener('keydown', handleKeydown)
        // Restaurar scroll del body
        document.body.style.overflow = ''
      }
    })

    // Cleanup al desmontar el componente
    const cleanup = () => {
      document.removeEventListener('keydown', handleKeydown)
      document.body.style.overflow = ''
    }

    return {
      isLoading,
      hasError,
      closeModal,
      handleImageLoad,
      handleImageError,
      cleanup
    }
  },
  beforeUnmount() {
    this.cleanup()
  }
}
</script>

<style scoped>
/* Animaciones suaves para la entrada/salida del modal */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Asegurar que el modal esté por encima de todo */
.z-50 {
  z-index: 9999;
}
</style>