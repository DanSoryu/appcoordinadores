import { ref } from 'vue'

/**
 * Composable para manejar el estado de botones de submit globalmente
 * Proporciona funcionalidad de loading, texto dinámico y prevención de doble click
 */
export function useSubmitButton() {
  const isLoading = ref(false)
  const originalText = ref('')
  const loadingText = ref('Procesando...')

  /**
   * Ejecuta una función asíncrona mostrando estado de loading
   * @param {Function} asyncFunction - Función asíncrona a ejecutar
   * @param {Object} options - Opciones de configuración
   * @param {string} options.loadingText - Texto a mostrar durante el loading
   * @param {number} options.minDelay - Delay mínimo en ms para mostrar el loading
   */
  const executeWithLoading = async (asyncFunction, options = {}) => {
    if (isLoading.value) return // Prevenir doble click

    const {
      loadingText: customLoadingText = 'Procesando...',
      minDelay = 1500 // Delay mínimo de 1.5 segundos
    } = options

    isLoading.value = true
    loadingText.value = customLoadingText

    try {
      // Crear promesas para la función y el delay mínimo
      const [result] = await Promise.all([
        asyncFunction(),
        new Promise(resolve => setTimeout(resolve, minDelay))
      ])
      
      return result
    } catch (error) {
      console.error('Error en executeWithLoading:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Función helper para botones de navegación
   * @param {Function} navigationFunction - Función de navegación
   * @param {string} direction - Dirección de navegación ('next' | 'prev')
   */
  const executeNavigation = async (navigationFunction, direction = 'next') => {
    await executeWithLoading(navigationFunction, {
      loadingText: 'Procesando...',
      minDelay: 1200
    })
  }

  /**
   * Función helper para envío de formularios
   * @param {Function} submitFunction - Función de envío
   */
  const executeSubmit = async (submitFunction) => {
    await executeWithLoading(submitFunction, {
      loadingText: 'Procesando...',
      minDelay: 2000
    })
  }

  return {
    isLoading,
    loadingText,
    executeWithLoading,
    executeNavigation,
    executeSubmit
  }
}