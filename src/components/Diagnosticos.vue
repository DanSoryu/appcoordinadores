<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader :user="user" v-model:activeTab="activeTab" />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div v-if="activeTab === 'diagnosticos'">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Diagnósticos</h2>
          <p class="text-gray-600">Módulo de diagnósticos en desarrollo...</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppHeader from './global/AppHeader.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const activeTab = ref('diagnosticos')
</script>