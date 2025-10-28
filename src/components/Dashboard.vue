<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader :user="user" v-model:activeTab="activeTab" />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Dashboard View -->
      <div v-if="activeTab === 'dashboard'">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Panel Principal</h2>
          <p class="text-gray-600">Bienvenido al sistema MecaSoft. Utiliza la navegación superior para acceder a las diferentes secciones.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CheckListFormModal from './recepcion/CheckListFormModal.vue'
import { useAuthStore } from '@/stores/auth'
import AppHeader from './global/AppHeader.vue'
import OrdersTable from './OrdersTable.vue'
import DashboardView from './DashboardView.vue'
import CheckListRecepcion from './recepcion/CheckListRecepcionTable.vue'
import RecepcionTable from './recepcion/RecepcionTable.vue'
import UsuariosTable from './usuarios/UsuariosTable.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const activeTab = ref('dashboard')

// Control del modal checklist
const showChecklistModal = ref(false)
const selectedChecklistData = ref({})

function handleAbrirChecklistModal(item) {
  selectedChecklistData.value = item
  showChecklistModal.value = true
  console.log('Datos pasados al modal:', item)
}
</script>