<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-4">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :class="[
          'transform transition-all duration-300 ease-out',
          toast.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        ]"
      >
        <div
          class="min-w-[320px] p-4 rounded-lg shadow-lg"
          :class="{
            'bg-blue-500 text-white': toast.type === 'info',
            'bg-green-500 text-white': toast.type === 'success',
            'bg-yellow-500 text-white': toast.type === 'warning',
            'bg-red-500 text-white': toast.type === 'error'
          }"
        >
          <div class="flex justify-between items-start">
            <p class="text-sm font-medium">{{ toast.message }}</p>
            <button
              @click="toastStore.removeToast(toast.id)"
              class="ml-4 inline-flex text-white hover:text-gray-100"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Barra de progreso con porcentaje -->
          <div
            v-if="toast.progress !== null"
            class="mt-2"
          >
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs text-white">Progreso</span>
              <span class="text-xs text-white">{{ Math.round(toast.progress) }}%</span>
            </div>
            <div class="w-full bg-black bg-opacity-20 rounded-full h-2 overflow-hidden">
              <div
                class="h-full bg-white transition-all duration-300 ease-out"
                :style="{ width: `${toast.progress}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>