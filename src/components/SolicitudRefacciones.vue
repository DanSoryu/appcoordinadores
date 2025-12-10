<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader :user="user" v-model:activeTab="activeTab" />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div v-if="activeTab === 'solicitudes'">
        <SolicitudRefaccionesTable />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppHeader from './global/AppHeader.vue'
import SolicitudRefaccionesTable from './solicitud_refacciones/SolicitudRefaccionesTable.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const activeTab = ref('solicitudes')
</script>
