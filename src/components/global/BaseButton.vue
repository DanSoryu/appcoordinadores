<template>
  <button
    :type="type"
    :disabled="disabled || isLoading"
    :class="buttonClasses"
    @click="handleClick"
    class="relative transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2"
  >
    <!-- Contenido normal del botón -->
    <span :class="{ 'opacity-0': isLoading }" class="flex items-center justify-center gap-2">
      <slot>{{ text }}</slot>
    </span>
    
    <!-- Overlay de loading -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center"
    >
      <div class="flex items-center gap-2">
        <!-- Spinner de puntos -->
        <div class="flex space-x-1">
          <div
            v-for="i in 3"
            :key="i"
            class="w-2 h-2 rounded-full animate-pulse"
            :class="spinnerColorClass"
            :style="{ animationDelay: `${(i - 1) * 0.2}s` }"
          ></div>
        </div>
        <span class="text-sm">{{ loadingText }}</span>
      </div>
    </div>
  </button>
</template>

<script>
import { computed } from 'vue'
import { useSubmitButton } from '../../composables/useSubmitButton.js'

export default {
  name: 'BaseButton',
  props: {
    // Tipo de botón
    type: {
      type: String,
      default: 'button',
      validator: (value) => ['button', 'submit', 'reset'].includes(value)
    },
    // Variante de estilo
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'outline'].includes(value)
    },
    // Tamaño del botón
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
    },
    // Texto del botón (alternativa al slot)
    text: {
      type: String,
      default: ''
    },
    // Deshabilitado
    disabled: {
      type: Boolean,
      default: false
    },
    // Función asíncrona a ejecutar (opcional)
    onClick: {
      type: Function,
      default: null
    },
    // Texto personalizado durante loading
    customLoadingText: {
      type: String,
      default: ''
    },
    // Delay mínimo para el loading
    minDelay: {
      type: Number,
      default: 1500
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const { isLoading, loadingText, executeWithLoading } = useSubmitButton()

    // Clases para diferentes variantes
    const variantClasses = {
      primary: 'bg-blue-500 hover:bg-blue-600 text-white border-transparent focus:ring-blue-500',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700 border-transparent focus:ring-gray-500',
      success: 'bg-green-500 hover:bg-green-600 text-white border-transparent focus:ring-green-500',
      danger: 'bg-red-500 hover:bg-red-600 text-white border-transparent focus:ring-red-500',
      warning: 'bg-yellow-500 hover:bg-yellow-600 text-white border-transparent focus:ring-yellow-500',
      info: 'bg-cyan-500 hover:bg-cyan-600 text-white border-transparent focus:ring-cyan-500',
      outline: 'bg-transparent hover:bg-gray-50 text-gray-700 border-gray-300 border focus:ring-gray-500'
    }

    // Clases para diferentes tamaños
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-base rounded-lg',
      lg: 'px-6 py-3 text-lg rounded-lg',
      xl: 'px-8 py-4 text-xl rounded-xl'
    }

    // Color del spinner según la variante
    const spinnerColorClass = computed(() => {
      if (props.variant === 'outline') return 'bg-gray-600'
      return 'bg-white'
    })

    // Clases computadas del botón
    const buttonClasses = computed(() => {
      const base = 'inline-flex items-center justify-center border'
      const variant = variantClasses[props.variant]
      const size = sizeClasses[props.size]
      const disabled = (props.disabled || isLoading.value) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      
      return `${base} ${variant} ${size} ${disabled}`
    })

    // Manejar click
    const handleClick = async (event) => {
      if (props.disabled || isLoading.value) return

      // Si hay una función onClick, ejecutarla con loading
      if (props.onClick && typeof props.onClick === 'function') {
        await executeWithLoading(
          () => props.onClick(event),
          {
            loadingText: props.customLoadingText || loadingText.value,
            minDelay: props.minDelay
          }
        )
      } else {
        // Emitir evento click normal
        emit('click', event)
      }
    }

    return {
      isLoading,
      loadingText,
      buttonClasses,
      spinnerColorClass,
      handleClick
    }
  }
}
</script>

<style scoped>
/* Animación personalizada para los puntos */
@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}

.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}
</style>