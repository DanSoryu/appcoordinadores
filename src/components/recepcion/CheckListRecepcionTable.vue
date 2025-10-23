<template>
  <div>
    <!-- Encabezado con título y botón de nuevo checklist -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">CheckList Recepción</h2>
    </div>

    <!-- Filtros de búsqueda -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Búsqueda General</label>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar en cualquier campo..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select 
            v-model="terminadoFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="true">Completados</option>
            <option value="false">Pendientes</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad de Llaves</label>
          <input 
            v-model="llavesFilter"
            type="number"
            min="0"
            placeholder="Filtrar por cantidad"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>
      </div>
    </div>

    <!-- Mensaje informativo sobre el orden de completado -->
    <div v-if="getOldestPendingChecklist" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-blue-800">
            Orden de Completado de CheckLists
          </h3>
          <div class="mt-2 text-sm text-blue-700">
            <p>Los checklists deben completarse en orden secuencial. El próximo checklist a completar es el <strong>ID {{ getOldestPendingChecklist.id }}</strong>.</p>
            <p class="mt-1">Solo se puede completar un checklist cuando el más antiguo pendiente ha sido terminado.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de CheckList -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-gray-600">Cargando datos...</span>
      </div>
      <div v-else-if="error" class="p-4 text-red-600 bg-red-50 text-center">
        {{ error }}
        <button @click="cargarChecklistData()" class="ml-2 text-blue-600 hover:text-blue-800 underline">
          Reintentar
        </button>
      </div>
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse table-fixed">
            <thead class="bg-gray-50">
              <tr class="divide-x divide-gray-200">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in paginatedData" :key="item.id" 
                  :class="[
                    'hover:bg-gray-50 divide-x divide-gray-200',
                    // Destacar el checklist que debe completarse siguiente
                    !isCompleted(item) && canCompleteChecklist(item) ? 'bg-yellow-50 border-l-4 border-yellow-400' : '',
                    // Marcar como completado
                    isCompleted(item) ? 'bg-green-50' : ''
                  ]">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div class="flex items-center space-x-2">
                    <span>{{ item.id }}</span>
                    <!-- Indicador de "siguiente a completar" -->
                    <span v-if="!isCompleted(item) && canCompleteChecklist(item)" 
                          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
                          title="Próximo checklist a completar">
                          <font-awesome-icon icon="clock" class="w-4 h-4 mr-1" /> Siguiente
                    </span>
                    <!-- Indicador de completado -->
                    <span v-if="isCompleted(item)" 
                          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      ✓ Completado
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                    isCompleted(item) ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ isCompleted(item) ? 'Completado' : 'Pendiente' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                  <!-- Botón Ver - Siempre visible -->
                  <button 
                    @click="verDetalles(item)"
                    class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ver
                  </button>
                  
                  <!-- Botón Editar - Solo para admin cuando está completado -->
                  <button 
                    v-if="shouldShowEditButton(item)"
                    @click="$emit('abrir-checklist-modal', item)"
                    class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Editar
                  </button>
                  
                  <!-- Botón Completar - Solo cuando no está completado -->
                  <button 
                    v-if="shouldShowCompleteButton(item)"
                    @click="$emit('abrir-checklist-modal', item)"
                    :disabled="!canCompleteChecklist(item)"
                    :title="!canCompleteChecklist(item) ? 'Debe completar primero el checklist más antiguo pendiente' : 'Completar checklist'"
                    :class="[
                      'inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2',
                      canCompleteChecklist(item) 
                        ? 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500 cursor-pointer' 
                        : 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-50'
                    ]"
                  >
                    Completar
                  </button>
                </td>
              </tr>
              <!-- Mensaje cuando no hay datos -->
              <tr v-if="paginatedData.length === 0 && !isLoading">
                <td colspan="3" class="px-6 py-8 text-center text-gray-500">
                  <div v-if="error" class="text-red-600">
                    {{ error }}
                    <button @click="cargarChecklistData()" class="ml-2 text-blue-600 hover:text-blue-800 underline">
                      Reintentar
                    </button>
                  </div>
                  <div v-else>
                    No se encontraron registros de checklist.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button 
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando <span class="font-medium">{{ startRecord }}</span> a <span class="font-medium">{{ endRecord }}</span> de <span class="font-medium">{{ totalItems }}</span> resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Anterior</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    currentPage === page ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]"
                >
                  {{ page }}
                </button>
                
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Siguiente</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles de Checklist -->
    <div v-if="showDetallesModal" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white w-[90%] max-w-2xl max-h-[90vh] rounded-lg shadow-xl">
        <!-- Encabezado del modal -->
        <div class="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h3 class="text-xl font-semibold">Detalles de Checklist</h3>
          <button @click="showDetallesModal = false" class="text-white hover:text-gray-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Contenido del modal -->
        <div class="p-6 overflow-y-auto" style="max-height: calc(90vh - 80px);">
          <div v-if="currentChecklistItem" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500">ID</p>
                <p class="font-semibold">{{ currentChecklistItem.id }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500">Estado</p>
                <p class="font-semibold">{{ isCompleted(currentChecklistItem) ? 'Completado' : 'Pendiente' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500">Cantidad de Llaves</p>
                <p class="font-semibold">{{ currentChecklistItem.cantidadLlaves || 'No especificado' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500">Tarjeta de Circulación</p>
                <p class="font-semibold">{{ currentChecklistItem.tarjetaCirculacion ? 'SI' : 'NO' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500">Póliza de Seguro</p>
                <p class="font-semibold">{{ currentChecklistItem.polizaSeguro ? 'SI' : 'NO' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500">Nivel de Combustible</p>
                <p class="font-semibold">{{ currentChecklistItem.nivelCombustible || 'No especificado' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500">Estereo</p>
                <p class="font-semibold">{{ currentChecklistItem.estereo !== null ? (currentChecklistItem.estereo ? 'SI' : 'NO') : 'No especificado' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500">Cantidad de Bocinas</p>
                <p class="font-semibold">{{ currentChecklistItem.cantidadBocinas || 'No especificado' }}</p>
              </div>
            </div>
            
            <div class="mt-4" v-if="currentChecklistItem.descripcionAccesorios">
              <p class="text-sm font-medium text-gray-500">Descripción de Accesorios</p>
              <p class="mt-1 text-gray-800">{{ currentChecklistItem.descripcionAccesorios }}</p>
            </div>
            
            <div class="mt-4" v-if="currentChecklistItem.comentarioGeneral">
              <p class="text-sm font-medium text-gray-500">Comentarios Generales</p>
              <p class="mt-1 text-gray-800">{{ currentChecklistItem.comentarioGeneral }}</p>
            </div>
            
            <!-- Sección de Testigos Encendidos -->
            <div class="mt-4" v-if="currentChecklistItem.testigosEncendidos && currentChecklistItem.testigosEncendidos.length > 0">
              <p class="text-sm font-medium text-gray-500">Testigos Encendidos</p>
              <div class="mt-1 flex flex-wrap gap-2">
                <span 
                  v-for="testigo in currentChecklistItem.testigosEncendidos" 
                  :key="testigo"
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                >
                  {{ testigo }}
                </span>
              </div>
            </div>
            
            <!-- Sección de imágenes/archivos -->
            <div class="mt-6">
              <h4 class="text-lg font-bold text-gray-800 mb-3">Imágenes del Checklist</h4>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <!-- Póliza de Seguro -->
                  <div v-if="currentChecklistItem.polizaSeguroImagen" class="space-y-2">
                    <p class="text-sm font-medium text-gray-500">Póliza de Seguro</p>
                    <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="verArchivo(currentChecklistItem.polizaSeguroImagen)">
                      Ver Imagen
                    </button>
                  </div>
                  
                  <!-- Accesorios y Herramientas -->
                  <div v-if="currentChecklistItem.accesoriosHerramientaImagen" class="space-y-2">
                    <p class="text-sm font-medium text-gray-500">Accesorios y Herramientas</p>
                    <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="verArchivo(currentChecklistItem.accesoriosHerramientaImagen)">
                      Ver Imagen
                    </button>
                  </div>
                  
                  <!-- Odómetro -->
                  <div v-if="currentChecklistItem.odometroImagen" class="space-y-2">
                    <p class="text-sm font-medium text-gray-500">Odómetro</p>
                    <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="verArchivo(currentChecklistItem.odometroImagen)">
                      Ver Imagen
                    </button>
                  </div>
                  
                  <!-- Combustible -->
                  <div v-if="currentChecklistItem.combustibleImagen" class="space-y-2">
                    <p class="text-sm font-medium text-gray-500">Combustible</p>
                    <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="verArchivo(currentChecklistItem.combustibleImagen)">
                      Ver Imagen
                    </button>
                  </div>
                  
                  <!-- Testigos -->
                  <div v-if="currentChecklistItem.testigosImagen" class="space-y-2">
                    <p class="text-sm font-medium text-gray-500">Testigos</p>
                    <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="verArchivo(currentChecklistItem.testigosImagen)">
                      Ver Imagen
                    </button>
                  </div>
                  
                  <!-- Seguros -->
                  <div v-if="currentChecklistItem.segurosImagen" class="space-y-2">
                    <p class="text-sm font-medium text-gray-500">Seguros</p>
                    <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="verArchivo(currentChecklistItem.segurosImagen)">
                      Ver Imagen
                    </button>
                  </div>
                  
                  <!-- Cristales -->
                  <div v-if="currentChecklistItem.cristalesImagen" class="space-y-2">
                    <p class="text-sm font-medium text-gray-500">Cristales</p>
                    <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="verArchivo(currentChecklistItem.cristalesImagen)">
                      Ver Imagen
                    </button>
                  </div>
                  
                  <!-- Vestiduras -->
                  <div v-if="currentChecklistItem.vestidurasImagen" class="space-y-2">
                    <p class="text-sm font-medium text-gray-500">Vestiduras</p>
                    <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="verArchivo(currentChecklistItem.vestidurasImagen)">
                      Ver Imagen
                    </button>
                  </div>
                  
                  <!-- Cabeceras -->
                  <div v-if="currentChecklistItem.cabecerasImagen" class="space-y-2">
                    <p class="text-sm font-medium text-gray-500">Cabeceras</p>
                    <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="verArchivo(currentChecklistItem.cabecerasImagen)">
                      Ver Imagen
                    </button>
                  </div>
                </div>
                
                <!-- Mostrar mensaje si no hay imágenes -->
                <div v-if="!hasAnyImages(currentChecklistItem)" class="text-center py-4 text-gray-500">
                  No hay imágenes disponibles para este checklist.
                </div>
              </div>
            </div>
            
            <!-- Información de fechas -->
            <div class="mt-6 pt-4 border-t border-gray-200">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span class="font-medium">Creado:</span> {{ formatDate(currentChecklistItem.created_at) }}
                </div>
                <div>
                  <span class="font-medium">Actualizado:</span> {{ formatDate(currentChecklistItem.updated_at) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useToastStore } from '../../stores/toast.js'
import { useAuthStore } from '../../stores/auth.js'
import apiClient from '../../services/api.js'

export default {
  name: 'CheckListRecepcionTable',
  emits: ['abrir-checklist-modal'],
  setup(props, { emit }) {
    const toastStore = useToastStore();
    const authStore = useAuthStore();
    const isLoading = ref(false);
    const error = ref(null);
    
    // Datos de checklist desde la API
    const checklistData = ref([]);
    const totalItems = ref(0);
    const totalPages = ref(1);
    const currentPage = ref(1);

    // Filtros
    const searchQuery = ref('');
    const terminadoFilter = ref('');
    const llavesFilter = ref('');

    // Paginación
    const itemsPerPage = 15; // El backend devuelve 15 por página
    
    // Modal de detalles
    const showDetallesModal = ref(false);
    const currentChecklistItem = ref(null);

    // Cargar datos desde la API
    const cargarChecklistData = async (page = 1) => {
      isLoading.value = true;
      error.value = null;
      
      try {
        const params = new URLSearchParams({
          page: page.toString()
        });

        // Agregar filtros si existen
        if (terminadoFilter.value !== '') {
          // Mapear terminado a estado del backend
          const estado = terminadoFilter.value === 'true' ? 'COMPLETADO' : 'PENDIENTE';
          params.append('estado', estado);
        }

        const response = await apiClient.get(`/detalle-recepcion?${params}`);
        
        if (response.data.success) {
          const data = response.data.data;
          checklistData.value = data.data || [];
          totalItems.value = data.total || 0;
          totalPages.value = data.last_page || 1;
          currentPage.value = data.current_page || 1;
          
          console.log('Datos de checklist cargados:', {
            items: checklistData.value.length,
            total: totalItems.value,
            page: currentPage.value
          });
        } else {
          throw new Error('Respuesta no exitosa del servidor');
        }
      } catch (err) {
        error.value = 'Error al cargar los datos del checklist';
        console.error('Error al cargar checklist:', err);
        toastStore.addToast({
          message: 'Error al cargar los datos del checklist',
          type: 'error',
          duration: 5000
        });
      } finally {
        isLoading.value = false;
      }
    };

    // Filtrar datos localmente (para filtros que no están en el backend)
    const filteredData = computed(() => {
      let result = checklistData.value;

      // Filtrar por cantidad de llaves
      if (llavesFilter.value !== '') {
        const llavesValue = parseInt(llavesFilter.value);
        if (!isNaN(llavesValue)) {
          result = result.filter(item => item.cantidadLlaves === llavesValue);
        }
      }

      // Filtrar por búsqueda general
      if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase();
        result = result.filter(item => {
          return (
            item.id.toString().includes(search) ||
            (item.cantidadLlaves !== null && item.cantidadLlaves.toString().includes(search)) ||
            (item.descripcionAccesorios && item.descripcionAccesorios.toLowerCase().includes(search)) ||
            (item.comentarioGeneral && item.comentarioGeneral.toLowerCase().includes(search)) ||
            (item.estado && item.estado.toLowerCase().includes(search))
          );
        });
      }

      return result;
    });

    // Paginar datos filtrados
    const paginatedData = computed(() => {
      // Si hay filtros locales activos, paginar los datos filtrados
      if (llavesFilter.value !== '' || searchQuery.value !== '') {
        const startIndex = (currentPage.value - 1) * itemsPerPage;
        return filteredData.value.slice(startIndex, startIndex + itemsPerPage);
      }
      // Si no hay filtros locales, usar los datos tal como vienen del servidor (ya paginados)
      return filteredData.value;
    });

    const startRecord = computed(() => {
      if (filteredData.value.length === 0) return 0;
      return ((currentPage.value - 1) * itemsPerPage) + 1;
    });

    const endRecord = computed(() => {
      if (filteredData.value.length === 0) return 0;
      return Math.min(currentPage.value * itemsPerPage, totalItems.value);
    });

    // Páginas visibles para navegación
    const visiblePages = computed(() => {
      const pages = [];
      
      // Always add page 1
      pages.push(1);
      
      // Add page before current if it exists and is not 1
      if (currentPage.value > 2) {
        pages.push(currentPage.value - 1);
      }
      
      // Add current page if it's not 1
      if (currentPage.value > 1) {
        pages.push(currentPage.value);
      }
      
      // Add page after current if it exists and is not the last page
      if (currentPage.value + 1 < totalPages.value) {
        pages.push(currentPage.value + 1);
      }
      
      // Add last page if it's not already added
      if (totalPages.value > 1 && !pages.includes(totalPages.value)) {
        pages.push(totalPages.value);
      }
      
      // Remove duplicates and sort
      return [...new Set(pages)].sort((a, b) => a - b);
    });

    // Navegación de páginas  
    const previousPage = () => {
      if (currentPage.value > 1) {
        goToPage(currentPage.value - 1);
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        goToPage(currentPage.value + 1);
      }
    };

    const goToPage = (page) => {
      if (page !== currentPage.value && page >= 1 && page <= totalPages.value) {
        cargarChecklistData(page);
      }
    };

    // Ver detalles del checklist
    const verDetalles = (item) => {
      currentChecklistItem.value = item;
      showDetallesModal.value = true;
    };

    // Ver archivo - construir URL completa para las imágenes
    const verArchivo = (nombreArchivo) => {
      if (!nombreArchivo) return;
      
      // Construir URL de la imagen
      const imageUrl = `https://api.ejemplo.com/Mecasoft/detalles_ordenes/${nombreArchivo}`;
      
      // Abrir en nueva ventana/pestaña
      window.open(imageUrl, '_blank');
      
      toastStore.addToast({
        message: `Abriendo archivo: ${nombreArchivo}`,
        type: 'info',
        duration: 3000
      });
    };

    // Helper para determinar el estado basado en la propiedad 'estado'
    const isCompleted = (item) => {
      return item.estado === 'COMPLETADO';
    };

    // Helper para verificar si hay imágenes en el checklist
    const hasAnyImages = (item) => {
      const imageFields = [
        'polizaSeguroImagen', 'accesoriosHerramientaImagen', 'odometroImagen',
        'combustibleImagen', 'testigosImagen', 'segurosImagen', 'cristalesImagen',
        'vestidurasImagen', 'cabecerasImagen', 'carroceriaLadoDerechoImagen',
        'carroceriaLadoIzquierdoImagen', 'carroceriaLadoTraseroImagen',
        'carroceriaLadoFrontalImagen', 'neumaticosLadoPilotoImagen',
        'neumaticosLadoAtrasPilotoImagen', 'neumaticosLadoCopilotoImagen',
        'neumaticosLadoAtrasCopilotoImagen', 'cristalesParabrisasImagen',
        'cristalesMedallonTraseroImagen', 'cristalesLimpiadoresImagen',
        'motorTaponesImagen', 'motorBateriaImagen', 'motorNivelAceiteImagen',
        'motorNivelLiquidoFrenosImagen', 'motorNivelAnticongelanteImagen',
        'escapeSilenciadorImagen', 'escapeCatalizadorImagen'
      ];
      
      return imageFields.some(field => item[field] && item[field] !== null);
    };

    // Helper para formatear fechas
    const formatDate = (dateString) => {
      if (!dateString) return 'No disponible';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return 'Fecha inválida';
      }
    };

    // Función para obtener el checklist más antiguo pendiente
    const getOldestPendingChecklist = computed(() => {
      const pendingChecklists = checklistData.value.filter(item => !isCompleted(item));
      if (pendingChecklists.length === 0) return null;
      
      // Ordenar por ID (asumiendo que ID menor = más antiguo)
      // También se podría usar created_at si está disponible
      return pendingChecklists.reduce((oldest, current) => {
        return current.id < oldest.id ? current : oldest;
      });
    });

    // Función para verificar si un checklist puede ser completado
    const canCompleteChecklist = (item) => {
      // Si ya está completado, no se puede "completar" de nuevo
      if (isCompleted(item)) return false;
      
      const oldestPending = getOldestPendingChecklist.value;
      if (!oldestPending) return false;
      
      // Solo se puede completar si es el más antiguo pendiente
      return item.id === oldestPending.id;
    };

    // Función para verificar si se puede editar (solo admin y completado)
    const canEditChecklist = (item) => {
      return authStore.isAdmin && isCompleted(item);
    };

    // Función para verificar si se debe mostrar botón de editar
    const shouldShowEditButton = (item) => {
      return authStore.isAdmin && isCompleted(item);
    };

    // Función para verificar si se debe mostrar botón de completar
    const shouldShowCompleteButton = (item) => {
      return !isCompleted(item);
    };

    // Watchers para filtros
    watch([terminadoFilter], () => {
      // Recargar datos cuando cambie el filtro de estado (se envía al backend)
      cargarChecklistData(1);
    });

    watch([searchQuery, llavesFilter], () => {
      // Reset a página 1 cuando cambien filtros locales
      currentPage.value = 1;
    });

    // Cargar datos al montar el componente
    onMounted(() => {
      cargarChecklistData();
    });

    return {
      isLoading,
      error,
      checklistData,
      paginatedData,
      searchQuery,
      terminadoFilter,
      llavesFilter,
      currentPage,
      totalItems,
      totalPages,
      startRecord,
      endRecord,
      visiblePages,
      showDetallesModal,
      currentChecklistItem,
      previousPage,
      nextPage,
      goToPage,
      verDetalles,
      verArchivo,
      isCompleted,
      hasAnyImages,
      formatDate,
      cargarChecklistData,
      // Nuevas funciones para manejo de roles y orden
      getOldestPendingChecklist,
      canCompleteChecklist,
      canEditChecklist,
      shouldShowEditButton,
      shouldShowCompleteButton
    };
  }
};
</script>
