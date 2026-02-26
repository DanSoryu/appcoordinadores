<template>
  <div>
    <!-- Encabezado con título -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Diagnósticos</h2>
      <button 
        @click="exportarExcel"
        :disabled="exportandoExcel || diagnosticosData.length === 0"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg v-if="!exportandoExcel" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <div v-else class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
        <span>{{ exportandoExcel ? 'Exportando...' : 'Exportar Excel' }}</span>
      </button>
    </div>

    <!-- Filtros de búsqueda -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Búsqueda General</label>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar folio de recepción o No. económico..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select 
            v-model="estadoFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="completado">Completados</option>
            <option value="pendiente">Pendientes</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabla de Diagnósticos -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-gray-600">Cargando diagnósticos...</span>
      </div>
      <div v-else-if="error" :class="[
        'p-4 text-center',
        error === 'No hay datos disponibles' ? 'text-gray-600 bg-gray-50' : 'text-red-600 bg-red-50'
      ]">
        <div class="flex items-center justify-center space-x-2">
          <svg v-if="error === 'No hay datos disponibles'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{{ error }}</span>
        </div>
        <button v-if="error !== 'No hay datos disponibles'" @click="cargarDiagnosticos()" class="ml-2 text-blue-600 hover:text-blue-800 underline">
          Reintentar
        </button>
      </div>
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse table-fixed">
            <thead class="bg-gray-50">
              <tr class="divide-x divide-gray-200">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Folio Recepción</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">No. Económico</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Mecánico</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Estado</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="diagnostico in paginatedData" :key="diagnostico.id" 
                  :class="[
                    'hover:bg-gray-50 divide-x divide-gray-200',
                    diagnostico.estado === 'completado' ? 'bg-green-50' : ''
                  ]">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div class="flex items-center space-x-2">
                    <span>{{ diagnostico.folioRecepcion }}</span>
                    <span v-if="diagnostico.estado === 'completado'" 
                          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      ✓ Completado
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ diagnostico.numeroEconomico || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ diagnostico.mecanicoNombre || 'No asignado' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                    diagnostico.estado === 'completado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ diagnostico.estado === 'completado' ? 'Completado' : 'Pendiente' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <div class="flex justify-center space-x-2">
                    <!-- Botón Ver - Siempre visible -->
                    <button 
                      @click="verDetalles(diagnostico)"
                      class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      title="Ver detalles del diagnóstico"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      Ver
                    </button>
                    
                    <!-- Botón Generar PDF - Solo cuando está completado -->
                    <button 
                      v-if="diagnostico.estado === 'completado'"
                      @click="generarPDF(diagnostico)"
                      :disabled="generandoPDF"
                      class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Generar reporte PDF"
                    >
                      <svg v-if="!generandoPDF" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <svg v-else class="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ generandoPDF ? 'Generando...' : 'PDF' }}
                    </button>
                    
                    <!-- Botón Terminar - Solo cuando está pendiente -->
                    <button 
                      v-if="diagnostico.estado !== 'completado'"
                      @click="abrirModalDiagnostico(diagnostico)"
                      class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      title="Terminar diagnóstico"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Terminar
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Mensaje cuando no hay datos -->
              <tr v-if="paginatedData.length === 0 && !isLoading">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                  No se encontraron diagnósticos.
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
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles de Diagnóstico -->
    <div v-if="showDetallesModal" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white w-[90%] max-w-2xl max-h-[90vh] rounded-lg shadow-xl">
        <!-- Encabezado del modal -->
        <div class="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h3 class="text-xl font-semibold">Detalles del Diagnóstico</h3>
          <button @click="showDetallesModal = false" class="text-white hover:text-gray-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Contenido del modal -->
        <div class="p-6 overflow-y-auto" style="max-height: calc(90vh - 80px);">
          <div v-if="currentDiagnostico" class="space-y-6">
            
            <!-- Información General -->
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="text-lg font-semibold text-blue-800 mb-3">Información General</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-500">ID Diagnóstico</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentDiagnostico.id }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Folio de Recepción</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentDiagnostico.folioRecepcion }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">No. Económico</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentDiagnostico.numeroEconomico || 'N/A' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Mecánico Asignado</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentDiagnostico.mecanicoNombre || 'No asignado' }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Estado</label>
                  <span :class="[
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                    currentDiagnostico.estado === 'completado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ currentDiagnostico.estado === 'completado' ? 'Completado' : 'Pendiente' }}
                  </span>
                </div>
                <div v-if="currentDiagnostico.fechaCreacion">
                  <label class="text-sm font-medium text-gray-500">Fecha de Creación</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ formatDate(currentDiagnostico.fechaCreacion) }}</p>
                </div>
                <div v-if="currentDiagnostico.fechaCompletado && currentDiagnostico.estado === 'completado'">
                  <label class="text-sm font-medium text-gray-500">Fecha de Completado</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ formatDate(currentDiagnostico.fechaCompletado) }}</p>
                </div>
              </div>
            </div>

            <!-- Diagnósticos Realizados -->
            <div v-if="currentDiagnostico.diagnosticos && currentDiagnostico.diagnosticos.length > 0" class="bg-gray-50 p-4 rounded-lg">
              <h4 class="text-lg font-semibold text-gray-800 mb-3">Diagnósticos Realizados por Sección</h4>
              <div class="space-y-4">
                <div v-for="(diagnostico, index) in currentDiagnostico.diagnosticos" :key="index" 
                     class="bg-white p-4 rounded-lg border shadow-sm">
                  <!-- Encabezado de la sección -->
                  <div class="flex items-center mb-3">
                    <div class="flex-shrink-0 w-3 h-3 rounded-full mr-3"
                         :class="getSectionColor(diagnostico.seccion)"></div>
                    <h5 class="text-base font-semibold text-gray-800">{{ diagnostico.seccion }}</h5>
                  </div>
                  
                  <!-- Fallas encontradas como lista -->
                  <div class="mb-3">
                    <label class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                      Fallas Identificadas
                    </label>
                    <div class="bg-red-50 p-3 rounded border-l-4 border-red-400">
                      <ul class="space-y-1">
                        <li v-for="falla in parseFallasFromDescription(diagnostico.descripcion)" :key="falla" 
                            class="flex items-center text-sm text-gray-700">
                          <svg class="w-3 h-3 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                          </svg>
                          {{ falla }}
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <!-- Comentarios técnicos -->
                  <div v-if="diagnostico.comentarios" class="mt-4">
                    <label class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                      Observaciones Técnicas
                    </label>
                    <div class="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                      <p class="text-sm text-gray-700 leading-relaxed">
                        {{ diagnostico.comentarios }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Observaciones -->
            <div v-if="currentDiagnostico.observaciones" class="bg-yellow-50 p-4 rounded-lg">
              <h4 class="text-lg font-semibold text-yellow-800 mb-3">Observaciones Generales</h4>
              <p class="text-sm text-gray-900">{{ currentDiagnostico.observaciones }}</p>
            </div>

            <!-- Imágenes del Diagnóstico -->
            <div v-if="hasAnyImages(currentDiagnostico)" class="bg-purple-50 p-4 rounded-lg">
              <h4 class="text-lg font-semibold text-purple-800 mb-3">Fotografías del Diagnóstico</h4>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div 
                  v-for="(image, index) in extractImagesFromDiagnostico(currentDiagnostico)" 
                  :key="index"
                  class="relative group cursor-pointer"
                  @click="openImageModal(image.url)"
                >
                  <img 
                    :src="image.url" 
                    :alt="image.campo"
                    class="w-full h-32 object-cover rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-all"
                    @error="(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImagen no disponible%3C/text%3E%3C/svg%3E'"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                    <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                    </svg>
                  </div>
                  <p class="mt-1 text-xs text-gray-600 text-center truncate">{{ image.seccion }}</p>
                </div>
              </div>
            </div>

            <!-- Mensaje para diagnósticos pendientes -->
            <div v-if="currentDiagnostico.estado !== 'completado'" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-blue-800">Diagnóstico Pendiente</h3>
                  <div class="mt-2 text-sm text-blue-700">
                    <p>Este diagnóstico aún no ha sido completado. Use el botón "Terminar" en la tabla para completarlo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Formulario de Diagnóstico -->
    <DiagnosticosFormModal
      :show="showDiagnosticoModal"
      :diagnosticoData="diagnosticoParaCompletar"
      @close="cerrarModalDiagnostico"
      @diagnostico-guardado="onDiagnosticoGuardado"
    />

    <!-- Modal de Imagen -->
    <ImageModal
      :show="showImageModal"
      :imageUrl="currentImageUrl"
      @close="closeImageModal"
    />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useToastStore } from '../../stores/toast.js'
import { useAuthStore } from '../../stores/auth.js'
import DiagnosticosFormModal from './DiagnosticosFormModal.vue'
import ImageModal from '../global/ImageModal.vue'
import apiClient from '../../services/api.js'
import ExcelJS from 'exceljs'

export default {
  name: 'DiagnosticosTable',
  components: {
    DiagnosticosFormModal,
    ImageModal
  },
  setup() {
    const toastStore = useToastStore()
    const authStore = useAuthStore()
    
    // Estados reactivos
    const isLoading = ref(false)
    const error = ref(null)
    const diagnosticosData = ref([])
    const currentDiagnostico = ref(null)
    const showDetallesModal = ref(false)
    
    // Estados para el modal de diagnóstico
    const showDiagnosticoModal = ref(false)
    const diagnosticoParaCompletar = ref(null)
    
    // Estados para el modal de imagen
    const showImageModal = ref(false)
    const currentImageUrl = ref(null)
    
    // Estado de generación de PDF y Excel
    const generandoPDF = ref(false)
    const exportandoExcel = ref(false)
    
    // Filtros
    const searchQuery = ref('')
    const estadoFilter = ref('')
    
    // Paginación
    const currentPage = ref(1)
    const itemsPerPage = 10
    const totalItems = ref(0)
    const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))

    // Computed properties para filtrado
    const filteredData = computed(() => {
      let result = diagnosticosData.value

      // Filtrar por estado
      if (estadoFilter.value) {
        result = result.filter(item => item.estado === estadoFilter.value)
      }

      // Filtrar por búsqueda general
      if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase()
        result = result.filter(item => {
          return item.folioRecepcion.toLowerCase().includes(search) ||
                 item.id.toString().includes(search) ||
                 (item.numeroEconomico && item.numeroEconomico.toLowerCase().includes(search))
        })
      }

      totalItems.value = result.length
      return result
    })

    // Paginar datos filtrados
    const paginatedData = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage
      return filteredData.value.slice(startIndex, startIndex + itemsPerPage)
    })

    const startRecord = computed(() => {
      if (filteredData.value.length === 0) return 0
      return ((currentPage.value - 1) * itemsPerPage) + 1
    })

    const endRecord = computed(() => {
      if (filteredData.value.length === 0) return 0
      return Math.min(currentPage.value * itemsPerPage, totalItems.value)
    })

    // Páginas visibles para navegación
    const visiblePages = computed(() => {
      const pages = []
      const totalPagesValue = Math.ceil(filteredData.value.length / itemsPerPage)
      
      // Siempre agregar página 1
      pages.push(1)
      
      // Agregar página anterior a la actual si existe y no es 1
      if (currentPage.value > 2) {
        pages.push(currentPage.value - 1)
      }
      
      // Agregar página actual si no es 1
      if (currentPage.value > 1) {
        pages.push(currentPage.value)
      }
      
      // Agregar página siguiente si existe y no es la última
      if (currentPage.value + 1 < totalPagesValue) {
        pages.push(currentPage.value + 1)
      }
      
      // Agregar última página si no está ya agregada
      if (totalPagesValue > 1 && !pages.includes(totalPagesValue)) {
        pages.push(totalPagesValue)
      }
      
      // Remover duplicados y ordenar
      return [...new Set(pages)].sort((a, b) => a - b)
    })

    // Métodos de paginación
    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      const totalPagesValue = Math.ceil(filteredData.value.length / itemsPerPage)
      if (currentPage.value < totalPagesValue) {
        currentPage.value++
      }
    }

    const goToPage = (page) => {
      currentPage.value = page
    }

    // Métodos para cargar datos
    const cargarDiagnosticos = async () => {
      isLoading.value = true
      error.value = null
      
      try {
        const response = await apiClient.get('/diagnosticos')
        
        if (!response.data || !Array.isArray(response.data.diagnosticos)) {
          throw new Error('Estructura de datos inválida')
        }
        
        // Mapear datos de la API al formato esperado por el frontend
        diagnosticosData.value = response.data.diagnosticos.map(diagnostico => ({
          id: diagnostico.id,
          folioRecepcion: `${diagnostico.recepcion_id}`,
          numeroEconomico: diagnostico.numero_economico || 'N/A',
          estado: diagnostico.fecha_completado ? 'completado' : 'pendiente',
          fechaCreacion: diagnostico.created_at,
          fechaCompletado: diagnostico.fecha_completado,
          mecanicoNombre: diagnostico.mecanico_nombre,
          mecanicoId: diagnostico.mecanico_id,
          // Extraer diagnósticos de los campos JSON
          diagnosticos: extraerDiagnosticos(diagnostico),
          observaciones: generarObservaciones(diagnostico),
          // Guardar los datos originales para el modal de edición
          _original: diagnostico
        }))
        
        console.log('Datos de diagnósticos cargados:', diagnosticosData.value.length, 'registros')
      } catch (err) {
        console.error('Error al cargar diagnósticos:', err)
        error.value = err.response?.data?.message || 'Error al cargar los diagnósticos'
        toastStore.addToast({
          message: error.value,
          type: 'error',
          duration: 5000
        })
      } finally {
        isLoading.value = false
      }
    }

    // Función auxiliar para convertir nombres de campos a texto legible
    const convertirCampoATexto = (campo) => {
      const mapeoTextos = {
        // Motor
        motorEmpaques: 'Empaques dañados',
        motorSellos: 'Sellos desgastados',
        motorDesgasteAnillos: 'Desgaste de anillos',
        motorDesgasteValvulas: 'Desgaste de válvulas',
        motorFaltaLubricacion: 'Falta de lubricación',
        motorPiezasSueltas: 'Piezas sueltas',
        motorBujias: 'Bujías defectuosas',
        motorBateria: 'Problemas de batería',
        motorBombaGasolina: 'Bomba de gasolina',
        motorFallaRadiador: 'Falla en radiador',
        motorFallaTermostato: 'Falla en termostato',
        motorSoportes: 'Soportes dañados',
        
        // Transmisión
        transmisionRetenesDanados: 'Retenes dañados',
        transmisionJuntasDanadas: 'Juntas dañadas',
        transmisionNivelBajoFlujo: 'Nivel bajo de fluido',
        transmisionDesgasteInterno: 'Desgaste interno',
        transmisionDesgasteDiscos: 'Desgaste de discos',
        transmisionConvertidorTorque: 'Convertidor de torque',
        transmisionMantenimientoProgramado: 'Mantenimiento programado',
        
        // Frenos
        frenosAireEnSistema: 'Aire en el sistema',
        frenosFugaLiquido: 'Fuga de líquido',
        frenosBalatasDesgastadas: 'Balatas desgastadas',
        frenosDiscoDesgastado: 'Disco desgastado',
        frenosClipers: 'Calipers defectuosos',
        frenosManguerasDefectuosas: 'Mangueras defectuosas',
        frenosControlDesgastePeriodico: 'Control de desgaste periódico',
        
        // Sistema Eléctrico
        electricoCeldasDanadas: 'Celdas de batería dañadas',
        electricoAlternadorDefectuoso: 'Alternador defectuoso',
        electricoBandaSuelta: 'Banda suelta',
        electricoAlternadorDanado: 'Alternador dañado',
        electricoFocoFundido: 'Foco fundido',
        electricoConectoresSulfatados: 'Conectores sulfatados',
        electricoInspeccionPeriodica: 'Inspección periódica',
        
        // Suspensión y Dirección
        suspensionDesgaste: 'Desgaste en suspensión',
        suspensionRupturaRetenes: 'Ruptura de retenes',
        direccionTerminales: 'Terminales de dirección',
        direccionCremalleras: 'Cremalleras dañadas',
        suspensionBujesDanados: 'Bujes dañados',
        suspensionRotulasDanadas: 'Rótulas dañadas',
        suspensionAjusteProgramado: 'Ajuste programado',
        
        // Sistema de Enfriamiento
        enfriamientoManguerasPerforadas: 'Mangueras perforadas',
        enfriamientoNucleoPerforado: 'Núcleo perforado',
        enfriamientoDesgasteReten: 'Desgaste de retén',
        enfriamientoDesgasteRodamiento: 'Desgaste de rodamiento',
        enfriamientoTermostatoBloqueado: 'Termostato bloqueado',
        enfriamientoControlTemperatura: 'Control de temperatura',
        
        // Sistema de Escape
        escapeFugasPerforaciones: 'Fugas y perforaciones',
        escapeCorrosion: 'Corrosión',
        escapeImpacto: 'Daños por impacto',
        escapeRuidoExcesivo: 'Ruido excesivo',
        escapeSilenciadorRoto: 'Silenciador roto',
        escapeSilenciadorSuelto: 'Silenciador suelto',
        escapeCatalizadorObstruido: 'Catalizador obstruido',
        escapeMalaCombustion: 'Mala combustión',
        
        // Sistema de Climatización
        climatizacionAcNoEnfria: 'A/C no enfría',
        climatizacionFugaGas: 'Fuga de gas refrigerante',
        climatizacionCompresorDanado: 'Compresor dañado',
        climatizacionMalOlorVentilacion: 'Mal olor en ventilación',
        climatizacionFiltroCabinaSucio: 'Filtro de cabina sucio',
        climatizacionRevisionPresionesGas: 'Revisión de presiones de gas',
        climatizacionNoCalienta: 'No calienta',
        climatizacionFallaTermostato: 'Falla en termostato',
        climatizacionRadiadorInterior: 'Radiador interior',
        
        // Carrocería y Accesorios
        carroceriaRayonesAbolladuras: 'Rayones y abolladuras',
        carroceriaGolpes: 'Golpes en carrocería',
        carroceriaRoces: 'Roces',
        puertasCierreDeficiente: 'Cierre deficiente de puertas',
        puertasCerraduras: 'Cerraduras dañadas',
        puertasBisagraDesajustada: 'Bisagras desajustadas',
        cristalesGrietasAstilladuras: 'Grietas y astilladuras en cristales',
        cristalesImpactoCristal: 'Impacto en cristal',
        cristalesTensionTermica: 'Tensión térmica',
        limpiaParabrisasNoFunciona: 'Limpiaparabrisas no funciona',
        limpiaParabrisasMotorDanado: 'Motor de limpiaparabrisas dañado',
        limpiaParabrisasFusibleDanado: 'Fusible dañado',
        
        // Llantas y Rines
        llantasDesgasteIrregular: 'Desgaste irregular de llantas',
        llantasAlineacion: 'Problemas de alineación',
        llantasBalanceoDeficiente: 'Balanceo deficiente',
        llantasPresionIncorrecta: 'Presión incorrecta',
        llantasRevisionPeriodica: 'Revisión periódica',
        llantasRevisionFechaFabricacion: 'Revisión de fecha de fabricación',
        llantasControlVidaUtil: 'Control de vida útil',
        rinesGolpeadosDeformados: 'Rines golpeados o deformados',
        rinesImpactoBaches: 'Impacto por baches',
        rinesImpactoBanquetas: 'Impacto por banquetas'
      }
      
      return mapeoTextos[campo] || campo.replace(/_/g, ' ')
    }

    // Funciones auxiliares para procesar datos de la API
    const extraerDiagnosticos = (diagnostico) => {
      const diagnosticos = []
      
      // Mapear los campos JSON de la base de datos
      const campos = [
        { bd: 'detalle_motor', seccion: 'Motor' },
        { bd: 'detalle_transmision', seccion: 'Transmisión' },
        { bd: 'detalle_frenos', seccion: 'Frenos' },
        { bd: 'detalle_sistema_electrico', seccion: 'Sistema Eléctrico' },
        { bd: 'detalle_suspension_direccion', seccion: 'Suspensión y Dirección' },
        { bd: 'detalle_sistema_enfriamiento', seccion: 'Sistema de Enfriamiento' },
        { bd: 'detalle_sistema_escape', seccion: 'Sistema de Escape' },
        { bd: 'detalle_sistema_climatizacion', seccion: 'Sistema de Climatización' },
        { bd: 'detalle_carroceria_accesorios', seccion: 'Carrocería y Accesorios' },
        { bd: 'detalle_llantas_rines', seccion: 'Llantas y Rines' }
      ]
      
      campos.forEach(campo => {
        if (diagnostico[campo.bd]) {
          try {
            const detalles = typeof diagnostico[campo.bd] === 'string' 
              ? JSON.parse(diagnostico[campo.bd]) 
              : diagnostico[campo.bd]
            
            if (detalles && typeof detalles === 'object') {
              // Extraer fallas del objeto
              const fallas = []
              let comentarios = ''
              
              Object.keys(detalles).forEach(key => {
                if (key !== 'tipo_mantenimiento' && !key.includes('Comentarios') && detalles[key] === true) {
                  // Convertir nombres de campos a texto legible
                  const fallaTexto = convertirCampoATexto(key)
                  fallas.push(fallaTexto)
                } else if (key.includes('Comentarios') && detalles[key] && detalles[key].trim()) {
                  // Capturar comentarios (motorComentarios, transmisionComentarios, etc.)
                  comentarios = detalles[key].trim()
                }
              })
              
              if (fallas.length > 0 || comentarios) {
                let descripcion = ''
                if (fallas.length > 0) {
                  descripcion = `${campo.seccion}: ${fallas.join(', ')}.`
                } else {
                  descripcion = `${campo.seccion}: Revisión completada.`
                }
                
                // No agregar comentarios a la descripción, solo mantenerlos separados
                diagnosticos.push({
                  seccion: campo.seccion,
                  descripcion: descripcion,
                  comentarios: comentarios,
                  prioridad: 'media'
                })
              }
            }
          } catch (error) {
            console.error(`Error al procesar ${campo.bd}:`, error)
          }
        }
      })
      
      return diagnosticos
    }
    
    const generarObservaciones = (diagnostico) => {
      const observaciones = []
      
      // Campos de comentarios de cada sección
      const camposComentarios = [
        'detalle_motor',
        'detalle_transmision', 
        'detalle_frenos',
        'detalle_sistema_electrico',
        'detalle_suspension_direccion',
        'detalle_sistema_enfriamiento',
        'detalle_sistema_escape',
        'detalle_sistema_climatizacion',
        'detalle_carroceria_accesorios',
        'detalle_llantas_rines'
      ]
      
      camposComentarios.forEach(campo => {
        if (diagnostico[campo]) {
          try {
            const detalles = typeof diagnostico[campo] === 'string' 
              ? JSON.parse(diagnostico[campo]) 
              : diagnostico[campo]
            
            if (detalles && typeof detalles === 'object') {
              // Buscar el campo de comentarios específico para cada sección
              Object.keys(detalles).forEach(key => {
                if (key.includes('Comentarios') && detalles[key] && detalles[key].trim()) {
                  observaciones.push(detalles[key].trim())
                }
              })
            }
          } catch (error) {
            console.error(`Error al procesar comentarios de ${campo}:`, error)
          }
        }
      })
      
      return observaciones.length > 0 
        ? observaciones.join('. ')
        : (diagnostico.fecha_completado ? 'Diagnóstico completado sin observaciones adicionales' : 'Diagnóstico pendiente de realizar')
    }

    // Métodos de acciones
    const verDetalles = (diagnostico) => {
      currentDiagnostico.value = { ...diagnostico }
      showDetallesModal.value = true
    }

    const abrirModalDiagnostico = (diagnostico) => {
      diagnosticoParaCompletar.value = { ...diagnostico }
      showDiagnosticoModal.value = true
    }

    const cerrarModalDiagnostico = () => {
      showDiagnosticoModal.value = false
      diagnosticoParaCompletar.value = null
    }

    const onDiagnosticoGuardado = async (diagnosticoCompletado) => {
      try {
        // Recargar la lista completa desde la API para obtener datos actualizados
        await cargarDiagnosticos()
        
        // Ya no mostramos toast aquí porque el FormModal ya lo muestra
        
        cerrarModalDiagnostico()
      } catch (err) {
        console.error('Error al recargar diagnósticos:', err)
        toastStore.addToast({
          message: 'Error al actualizar la lista de diagnósticos',
          type: 'error',
          duration: 5000
        })
      }
    }

    // Utilidades
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      // Restar 6 horas para ajustar la diferencia de zona horaria de la BD
      date.setHours(date.getHours() - 6)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getSectionColor = (seccion) => {
      const colores = {
        'Motor': 'bg-red-500',
        'Transmisión': 'bg-blue-500',
        'Frenos': 'bg-yellow-500',
        'Sistema Eléctrico': 'bg-purple-500',
        'Suspensión y Dirección': 'bg-green-500',
        'Sistema de Enfriamiento': 'bg-cyan-500',
        'Sistema de Escape': 'bg-orange-500',
        'Sistema de Climatización': 'bg-indigo-500',
        'Carrocería y Accesorios': 'bg-pink-500',
        'Llantas y Rines': 'bg-gray-500'
      }
      return colores[seccion] || 'bg-gray-500'
    }

    const parseFallasFromDescription = (descripcion) => {
      if (!descripcion) return []
      
      // Extraer la parte después de los dos puntos y separar por comas
      const match = descripcion.match(/^[^:]+:\s*(.+)$/)
      if (!match) return [descripcion]
      
      const fallasText = match[1].trim()
      
      // Si termina con punto, removerlo antes de separar
      const cleanText = fallasText.endsWith('.') ? fallasText.slice(0, -1) : fallasText
      
      // Separar por comas y limpiar espacios
      return cleanText.split(',').map(falla => falla.trim()).filter(falla => falla.length > 0)
    }

    // Función para abrir el modal de imagen
    const openImageModal = (imageUrl) => {
      currentImageUrl.value = imageUrl
      showImageModal.value = true
    }

    // Función para cerrar el modal de imagen
    const closeImageModal = () => {
      showImageModal.value = false
    }
    
    // Helper para obtener la URL completa de una imagen de diagnóstico
    const getImageUrl = (imageName) => {
      if (!imageName) return null
      // Las imágenes se guardan en: Mecasoft/detalle_diagnostico/{diagnosticoId}/{seccion}/{nombreArchivo}
      // La ruta guardada en BD ya incluye: {diagnosticoId}/{seccion}/{nombreArchivo}
      return `https://api.ed-intra.com/Mecasoft/detalle_diagnostico/${imageName}`
    }
    
    // Función para convertir imagen a base64
    const getImageAsBase64 = async (imageUrl) => {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Error al cargar imagen:', error);
        return null;
      }
    };
    
    // Función para exportar a Excel con imágenes
    const exportarExcel = async () => {
      if (diagnosticosData.value.length === 0) {
        toastStore.addToast({
          message: 'No hay datos para exportar',
          type: 'warning',
          duration: 3000
        })
        return
      }

      exportandoExcel.value = true
      
      try {
        // Crear un nuevo libro de Excel
        const workbook = new ExcelJS.Workbook()
        workbook.creator = 'Sistema de Diagnósticos'
        workbook.created = new Date()
        
        // Crear una hoja por cada diagnóstico
        for (const diagnostico of diagnosticosData.value) {
          const nombreHoja = `Diag_${diagnostico.folioRecepcion}`.substring(0, 31) // Límite de Excel
          const worksheet = workbook.addWorksheet(nombreHoja)
          
          // Configurar ancho de columnas
          worksheet.columns = [
            { width: 30 },
            { width: 50 }
          ]
          
          let filaActual = 1
          
          // ENCABEZADO PRINCIPAL
          worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
          const headerCell = worksheet.getCell(`A${filaActual}`)
          headerCell.value = `DIAGNÓSTICO TÉCNICO - FOLIO RECEPCIÓN ${diagnostico.folioRecepcion}`
          headerCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } }
          headerCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF2563EB' }
          }
          headerCell.alignment = { vertical: 'middle', horizontal: 'center' }
          worksheet.getRow(filaActual).height = 30
          filaActual += 2
          
          // SECCIÓN: INFORMACIÓN GENERAL
          worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
          const seccionGeneral = worksheet.getCell(`A${filaActual}`)
          seccionGeneral.value = 'INFORMACIÓN GENERAL'
          seccionGeneral.font = { size: 12, bold: true, color: { argb: 'FFFFFFFF' } }
          seccionGeneral.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF059669' }
          }
          seccionGeneral.alignment = { vertical: 'middle', horizontal: 'center' }
          filaActual++
          
          // Datos generales
          const datosGenerales = [
            ['ID Diagnóstico:', diagnostico.id],
            ['Folio de Recepción:', diagnostico.folioRecepcion],
            ['No. Económico:', diagnostico.numeroEconomico || 'N/A'],
            ['Estado:', diagnostico.estado.toUpperCase()],
            ['Mecánico:', diagnostico.mecanicoNombre || 'No asignado'],
            ['Fecha de Creación:', formatDate(diagnostico.fechaCreacion)],
            ['Fecha de Completado:', diagnostico.fechaCompletado ? formatDate(diagnostico.fechaCompletado) : 'Pendiente']
          ]
          
          for (const [label, value] of datosGenerales) {
            const labelCell = worksheet.getCell(`A${filaActual}`)
            labelCell.value = label
            labelCell.font = { bold: true }
            labelCell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFE5E7EB' }
            }
            
            const valueCell = worksheet.getCell(`B${filaActual}`)
            valueCell.value = value || 'N/A'
            filaActual++
          }
          
          filaActual++
          
          // SECCIÓN: DIAGNÓSTICOS POR SISTEMA
          if (diagnostico.diagnosticos && diagnostico.diagnosticos.length > 0) {
            worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
            const seccionDiagnosticos = worksheet.getCell(`A${filaActual}`)
            seccionDiagnosticos.value = 'DIAGNÓSTICOS DETECTADOS'
            seccionDiagnosticos.font = { size: 12, bold: true, color: { argb: 'FFFFFFFF' } }
            seccionDiagnosticos.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF3B82F6' }
            }
            seccionDiagnosticos.alignment = { vertical: 'middle', horizontal: 'center' }
            filaActual++
            
            // Procesar cada sección de diagnóstico
            for (const diag of diagnostico.diagnosticos) {
              // Título de la sección
              worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
              const tituloSeccion = worksheet.getCell(`A${filaActual}`)
              tituloSeccion.value = diag.seccion
              tituloSeccion.font = { size: 11, bold: true, color: { argb: 'FF1F2937' } }
              tituloSeccion.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF3F4F6' }
              }
              tituloSeccion.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 }
              filaActual++
              
              // Extraer fallas del string
              const fallas = parseFallasFromDescription(diag.descripcion)
              
              if (fallas.length > 0) {
                for (const falla of fallas) {
                  const labelCell = worksheet.getCell(`A${filaActual}`)
                  labelCell.value = '• ' + falla
                  labelCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 2 }
                  worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
                  filaActual++
                }
              } else {
                const labelCell = worksheet.getCell(`A${filaActual}`)
                labelCell.value = diag.descripcion
                labelCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 2 }
                worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
                filaActual++
              }
              
              filaActual++
            }
          } else {
            worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
            const noDiagnosticos = worksheet.getCell(`A${filaActual}`)
            noDiagnosticos.value = 'No se han registrado diagnósticos'
            noDiagnosticos.font = { italic: true, color: { argb: 'FF6B7280' } }
            noDiagnosticos.alignment = { horizontal: 'center' }
            filaActual++
          }
          
          filaActual++
          
          // SECCIÓN: OBSERVACIONES
          if (diagnostico.observaciones && diagnostico.observaciones.trim()) {
            worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
            const seccionObservaciones = worksheet.getCell(`A${filaActual}`)
            seccionObservaciones.value = 'OBSERVACIONES GENERALES'
            seccionObservaciones.font = { size: 12, bold: true, color: { argb: 'FFFFFFFF' } }
            seccionObservaciones.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF6B7280' }
            }
            seccionObservaciones.alignment = { vertical: 'middle', horizontal: 'center' }
            filaActual++
            
            const observacionesCell = worksheet.getCell(`A${filaActual}`)
            observacionesCell.value = diagnostico.observaciones
            observacionesCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true }
            worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
            worksheet.getRow(filaActual).height = Math.max(30, diagnostico.observaciones.length / 50 * 15)
            filaActual++
            filaActual++
          }
          
          // SECCIÓN: IMÁGENES DEL DIAGNÓSTICO
          const imagenes = extractImagesFromDiagnostico(diagnostico)
          
          if (imagenes.length > 0) {
            worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
            const seccionImagenes = worksheet.getCell(`A${filaActual}`)
            seccionImagenes.value = 'FOTOGRAFÍAS DEL DIAGNÓSTICO'
            seccionImagenes.font = { size: 12, bold: true, color: { argb: 'FFFFFFFF' } }
            seccionImagenes.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF8B5CF6' }
            }
            seccionImagenes.alignment = { vertical: 'middle', horizontal: 'center' }
            filaActual++
            
            let imagenAgregada = false
            
            for (const imagen of imagenes) {
              try {
                // Construir URL completa
                const urlCompleta = getImageUrl(imagen.path)
                
                if (!urlCompleta) {
                  // Si no hay URL, mostrar mensaje
                  const labelCell = worksheet.getCell(`A${filaActual}`)
                  labelCell.value = imagen.label
                  labelCell.font = { bold: true }
                  
                  const valueCell = worksheet.getCell(`B${filaActual}`)
                  valueCell.value = 'Imagen no disponible'
                  valueCell.font = { italic: true, color: { argb: 'FFEF4444' } }
                  filaActual++
                  continue
                }
                
                // Descargar la imagen
                const imageResponse = await fetch(urlCompleta)
                
                if (imageResponse.ok) {
                  const imageBlob = await imageResponse.blob()
                  const arrayBuffer = await imageBlob.arrayBuffer()
                  
                  // Determinar la extensión de la imagen
                  let extension = 'jpeg'
                  const contentType = imageResponse.headers.get('content-type')
                  if (contentType) {
                    if (contentType.includes('png')) extension = 'png'
                    else if (contentType.includes('jpg') || contentType.includes('jpeg')) extension = 'jpeg'
                    else if (contentType.includes('gif')) extension = 'gif'
                  }
                  
                  // Agregar la imagen al workbook
                  const imageId = workbook.addImage({
                    buffer: arrayBuffer,
                    extension: extension
                  })
                  
                  // Escribir el nombre de la imagen
                  const labelCell = worksheet.getCell(`A${filaActual}`)
                  labelCell.value = imagen.label
                  labelCell.font = { bold: true }
                  labelCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF3F4F6' }
                  }
                  
                  // Aumentar altura de fila para la imagen
                  worksheet.getRow(filaActual).height = 120
                  
                  // Insertar imagen en la celda B
                  worksheet.addImage(imageId, {
                    tl: { col: 1, row: filaActual - 1 },
                    ext: { width: 200, height: 150 }
                  })
                  
                  filaActual++
                  imagenAgregada = true
                } else {
                  // Si no se puede descargar, mostrar mensaje
                  const labelCell = worksheet.getCell(`A${filaActual}`)
                  labelCell.value = imagen.label
                  labelCell.font = { bold: true }
                  
                  const valueCell = worksheet.getCell(`B${filaActual}`)
                  valueCell.value = 'Imagen no disponible'
                  valueCell.font = { italic: true, color: { argb: 'FFEF4444' } }
                  filaActual++
                }
              } catch (imageError) {
                console.error(`Error al procesar imagen ${imagen.label}:`, imageError)
                // Si hay error, mostrar mensaje
                const labelCell = worksheet.getCell(`A${filaActual}`)
                labelCell.value = imagen.label
                labelCell.font = { bold: true }
                
                const valueCell = worksheet.getCell(`B${filaActual}`)
                valueCell.value = 'Error al cargar imagen'
                valueCell.font = { italic: true, color: { argb: 'FFEF4444' } }
                filaActual++
              }
            }
            
            if (!imagenAgregada) {
              const noImagenesCell = worksheet.getCell(`A${filaActual}`)
              noImagenesCell.value = 'No hay imágenes disponibles'
              noImagenesCell.font = { italic: true, color: { argb: 'FF6B7280' } }
              worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
              filaActual++
            }
          } else {
            // No hay imágenes
            worksheet.mergeCells(`A${filaActual}:B${filaActual}`)
            const noImagenesCell = worksheet.getCell(`A${filaActual}`)
            noImagenesCell.value = 'No se registraron fotografías para este diagnóstico'
            noImagenesCell.font = { italic: true, color: { argb: 'FF6B7280' } }
            noImagenesCell.alignment = { horizontal: 'center' }
            filaActual++
          }
        }
        
        // Generar el archivo Excel
        const buffer = await workbook.xlsx.writeBuffer()
        
        // Crear blob y descargar
        const blob = new Blob([buffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        })
        
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        
        // Nombre del archivo con fecha
        const fecha = new Date().toISOString().split('T')[0]
        link.download = `Diagnosticos_${fecha}.xlsx`
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        toastStore.addToast({
          message: 'Excel exportado correctamente',
          type: 'success',
          duration: 3000
        })
      } catch (error) {
        console.error('Error al exportar Excel:', error)
        toastStore.addToast({
          message: 'Error al exportar el archivo Excel',
          type: 'error',
          duration: 5000
        })
      } finally {
        exportandoExcel.value = false
      }
    }
    
    // Función para generar el PDF
    const generarPDF = async (diagnostico) => {
      generandoPDF.value = true;
      
      try {
        // Importar jsPDF y autoTable dinámicamente
        const { default: jsPDF } = await import('jspdf');
        await import('jspdf-autotable');
        
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - (2 * margin);
        let yPosition = margin;
        
        // Función auxiliar para agregar nueva página si es necesario
        const checkAddPage = (requiredSpace = 20) => {
          if (yPosition + requiredSpace > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
            return true;
          }
          return false;
        };
        
        // Encabezado del documento
        doc.setFillColor(59, 130, 246); // bg-blue-600
        doc.rect(0, 0, pageWidth, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont(undefined, 'bold');
        doc.text('REPORTE DE DIAGNÓSTICO', pageWidth / 2, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text('Diagnóstico Técnico Vehicular', pageWidth / 2, 30, { align: 'center' });
        
        yPosition = 50;
        
        // Información general
        doc.setTextColor(0, 0, 0);
        doc.setFillColor(239, 246, 255); // bg-blue-50
        doc.roundedRect(margin, yPosition, contentWidth, 47, 3, 3, 'F');
        
        yPosition += 8;
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(30, 64, 175); // text-blue-800
        doc.text('Información General', margin + 5, yPosition);
        
        yPosition += 8;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`Folio: ${diagnostico.folioRecepcion}`, margin + 5, yPosition);
        doc.text(`Estado: ${diagnostico.estado.toUpperCase()}`, margin + 70, yPosition);
        
        yPosition += 6;
        doc.text(`No. Económico: ${diagnostico.numeroEconomico || 'N/A'}`, margin + 5, yPosition);
        
        yPosition += 6;
        doc.text(`Mecánico: ${diagnostico.mecanicoNombre || 'No asignado'}`, margin + 5, yPosition);
        
        yPosition += 6;
        doc.text(`Fecha de Creación: ${formatDate(diagnostico.fechaCreacion)}`, margin + 5, yPosition);
        
        if (diagnostico.fechaCompletado) {
          yPosition += 6;
          doc.text(`Fecha de Completado: ${formatDate(diagnostico.fechaCompletado)}`, margin + 5, yPosition);
        }
        
        yPosition += 15;
        
        // Función auxiliar para crear secciones
        const crearSeccion = (titulo, color, contenido) => {
          checkAddPage(30);
          
          doc.setFillColor(color[0], color[1], color[2]);
          doc.roundedRect(margin, yPosition, contentWidth, 8, 2, 2, 'F');
          
          doc.setFontSize(12);
          doc.setFont(undefined, 'bold');
          doc.setTextColor(255, 255, 255);
          doc.text(titulo, margin + 5, yPosition + 5.5);
          
        yPosition += 12;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        
        if (contenido) {
          contenido();
        }
      };
      
      // Función auxiliar para agregar fallas
      const agregarFallas = (fallas) => {
        if (!fallas || fallas.length === 0) {
          doc.setFont(undefined, 'italic');
          doc.text('No se detectaron fallas', margin + 10, yPosition);
          yPosition += 6;
          return;
        }
        
        fallas.forEach(falla => {
          checkAddPage();
          doc.setFont(undefined, 'normal');
          doc.text(`• ${falla}`, margin + 10, yPosition);
          yPosition += 5;
        });
      };        // Función auxiliar para agregar imagen
        const agregarImagen = async (etiqueta, imagePath) => {
          if (!imagePath) return;
          
          checkAddPage(50);
          
          doc.setFont(undefined, 'bold');
          doc.text(etiqueta, margin + 5, yPosition);
          yPosition += 5;
          
          const imageUrl = getImageUrl(imagePath);
          const imageData = await getImageAsBase64(imageUrl);
          
          if (imageData) {
            try {
              doc.addImage(imageData, 'JPEG', margin + 5, yPosition, 60, 40);
              yPosition += 45;
            } catch (error) {
              console.error('Error al agregar imagen al PDF:', error);
              doc.setFont(undefined, 'italic');
              doc.text('(Imagen no disponible)', margin + 5, yPosition);
              yPosition += 6;
            }
          } else {
            doc.setFont(undefined, 'italic');
            doc.text('(Imagen no disponible)', margin + 5, yPosition);
            yPosition += 6;
          }
        };
        
        // Procesar cada sección de diagnóstico
        if (diagnostico.diagnosticos && diagnostico.diagnosticos.length > 0) {
          for (const diag of diagnostico.diagnosticos) {
            const colorMap = {
              'Motor': [239, 68, 68],
              'Transmisión': [59, 130, 246],
              'Frenos': [234, 179, 8],
              'Sistema Eléctrico': [168, 85, 247],
              'Suspensión y Dirección': [34, 197, 94],
              'Sistema de Enfriamiento': [6, 182, 212],
              'Sistema de Escape': [249, 115, 22],
              'Sistema de Climatización': [99, 102, 241],
              'Carrocería y Accesorios': [236, 72, 153],
              'Llantas y Rines': [107, 114, 128]
            };
            
            const color = colorMap[diag.seccion] || [107, 114, 128];
            
            crearSeccion(diag.seccion.toUpperCase(), color, () => {
              if (diag.descripcion) {
                const fallas = parseFallasFromDescription(diag.descripcion);
                agregarFallas(fallas);
              }
              
              if (diag.comentarios) {
                checkAddPage();
                doc.setFont(undefined, 'bold');
                doc.text('Comentarios:', margin + 5, yPosition);
                yPosition += 5;
                doc.setFont(undefined, 'normal');
                const splitText = doc.splitTextToSize(diag.comentarios, contentWidth - 10);
                splitText.forEach(line => {
                  checkAddPage();
                  doc.text(line, margin + 10, yPosition);
                  yPosition += 5;
                });
                yPosition += 3;
              }
            });
          }
        }
        
        // Agregar imágenes del diagnóstico
        const imagenes = extractImagesFromDiagnostico(diagnostico);
        if (imagenes.length > 0) {
          crearSeccion('FOTOGRAFÍAS DEL DIAGNÓSTICO', [168, 85, 247], () => {
            // Sección header ya creada
          });
          
          for (const imagen of imagenes) {
            await agregarImagen(`${imagen.seccion} - ${imagen.campo}:`, imagen.path);
          }
        }
        
        // Observaciones generales
        if (diagnostico.observaciones) {
          crearSeccion('OBSERVACIONES GENERALES', [156, 163, 175], () => {
            const splitText = doc.splitTextToSize(diagnostico.observaciones, contentWidth - 10);
            splitText.forEach(line => {
              checkAddPage();
              doc.text(line, margin + 5, yPosition);
              yPosition += 5;
            });
          });
        }
        
        // Pie de página en todas las páginas
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(128, 128, 128);
          doc.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
          doc.text(`Generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
        }
        
        // Guardar PDF
        doc.save(`Reporte_Diagnostico_${diagnostico.folioRecepcion}_${new Date().getTime()}.pdf`);
        
        toastStore.addToast({
          message: 'Reporte PDF generado exitosamente',
          type: 'success',
          duration: 3000
        });
        
      } catch (error) {
        console.error('Error al generar PDF:', error);
        toastStore.addToast({
          message: 'Error al generar el reporte PDF',
          type: 'error',
          duration: 5000
        });
      } finally {
        generandoPDF.value = false;
      }
    };

    // Helper para extraer todas las imágenes de los detalles JSON de un diagnóstico
    const extractImagesFromDiagnostico = (diagnostico) => {
      if (!diagnostico || !diagnostico._original) return []
      
      const images = []
      const original = diagnostico._original
      
      // Campos JSON que pueden contener imágenes
      const detalleCampos = [
        'detalle_motor',
        'detalle_transmision',
        'detalle_frenos',
        'detalle_sistema_electrico',
        'detalle_suspension_direccion',
        'detalle_sistema_enfriamiento',
        'detalle_sistema_escape',
        'detalle_sistema_climatizacion',
        'detalle_carroceria_accesorios',
        'detalle_llantas_rines'
      ]
      
      detalleCampos.forEach(campo => {
        if (original[campo]) {
          try {
            const detalles = typeof original[campo] === 'string' 
              ? JSON.parse(original[campo]) 
              : original[campo]
            
            if (detalles && typeof detalles === 'object') {
              // Buscar campos que terminen en 'Imagen' y tengan valor
              Object.keys(detalles).forEach(key => {
                if (key.endsWith('Imagen') && detalles[key]) {
                  images.push({
                    seccion: campo.replace('detalle_', '').replace(/_/g, ' '),
                    campo: key,
                    url: getImageUrl(detalles[key])
                  })
                }
              })
            }
          } catch (error) {
            console.error(`Error al procesar imágenes de ${campo}:`, error)
          }
        }
      })
      
      return images
    }

    // Helper para verificar si un diagnóstico tiene imágenes
    const hasAnyImages = (diagnostico) => {
      return extractImagesFromDiagnostico(diagnostico).length > 0
    }

    // Watchers para reiniciar paginación cuando cambian los filtros
    watch([searchQuery, estadoFilter], () => {
      currentPage.value = 1
    })

    // Cargar datos al montar el componente
    onMounted(() => {
      cargarDiagnosticos()
    })

    return {
      // Estados
      isLoading,
      error,
      diagnosticosData,
      currentDiagnostico,
      showDetallesModal,
      
      // Estados del modal de diagnóstico
      showDiagnosticoModal,
      diagnosticoParaCompletar,
      
      // Filtros
      searchQuery,
      estadoFilter,
      
      // Paginación
      currentPage,
      totalItems,
      totalPages,
      paginatedData,
      startRecord,
      endRecord,
      visiblePages,
      
      // Métodos
      cargarDiagnosticos,
      verDetalles,
      abrirModalDiagnostico,
      cerrarModalDiagnostico,
      onDiagnosticoGuardado,
      previousPage,
      nextPage,
      goToPage,
      formatDate,
      getSectionColor,
      parseFallasFromDescription,
      // Funciones para imágenes
      showImageModal,
      currentImageUrl,
      openImageModal,
      closeImageModal,
      getImageUrl,
      extractImagesFromDiagnostico,
      hasAnyImages,
      // Funciones para PDF y Excel
      generarPDF,
      generandoPDF,
      exportarExcel,
      exportandoExcel
    }
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
.table-fixed {
  table-layout: fixed;
}
</style>