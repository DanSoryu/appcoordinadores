import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  const toastId = ref(0)

  const addToast = ({ message, type = 'info', duration = 3000, progress = null }) => {
    const id = toastId.value++
    const toast = {
      id,
      message,
      type,
      progress,
      show: true
    }
    
    toasts.value.push(toast)

    // Solo configurar el temporizador si no hay barra de progreso
    if (duration && progress === null) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const updateToastProgress = (id, progress) => {
    const toast = toasts.value.find(t => t.id === id)
    if (toast) {
      toast.progress = progress
      // Si el progreso llega al 100%, actualizamos el mensaje y tipo, y lo removemos después de 2 segundos
      if (progress >= 100) {
        toast.message = 'Exportación completada'
        toast.type = 'success'
        setTimeout(() => {
          removeToast(id)
        }, 2000)
      }
    }
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value[index].show = false
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id)
      }, 300)
    }
  }

  return {
    toasts,
    addToast,
    removeToast,
    updateToastProgress
  }
})