<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader :user="user" v-model:activeTab="activeTab" />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div v-if="activeTab === 'datosrecepcion'">
        <RecepcionTable />
      </div>

      <div v-if="activeTab === 'checklistrecepcion'">
        <CheckListRecepcion @abrir-checklist-modal="handleAbrirChecklistModal" />
        <CheckListFormModal 
          v-if="showChecklistModal" 
          :show="showChecklistModal" 
          :checklistData="selectedChecklistData"
          @close="showChecklistModal = false" 
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CheckListFormModal from './recepcion/CheckListFormModal.vue'
import { useAuthStore } from '@/stores/auth'
import AppHeader from './global/AppHeader.vue'
import CheckListRecepcion from './recepcion/CheckListRecepcionTable.vue'
import RecepcionTable from './recepcion/RecepcionTable.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const activeTab = ref('datosrecepcion')

// Control del modal checklist
const showChecklistModal = ref(false)
const selectedChecklistData = ref({})

function handleAbrirChecklistModal(item) {
  selectedChecklistData.value = item
  showChecklistModal.value = true
  console.log('Datos pasados al modal:', item)
}
</script>