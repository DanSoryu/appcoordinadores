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
        <button v-if="error !== 'No hay datos disponibles'" @click="cargarChecklistData()" class="ml-2 text-blue-600 hover:text-blue-800 underline">
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
                  <!-- Botón Ver - Solo cuando está completado -->
                  <button 
                    v-if="isCompleted(item)"
                    @click="verDetalles(item)"
                    class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ver
                  </button>
                  
                  <!-- Botón Completar - Solo cuando está pendiente -->
                  <button 
                    v-if="!isCompleted(item)"
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
                  <div v-if="error" :class="[
                    'flex items-center justify-center space-x-2',
                    error === 'No hay datos disponibles' ? 'text-gray-600' : 'text-red-600'
                  ]">
                    <svg v-if="error === 'No hay datos disponibles'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>{{ error }}</span>
                    <button v-if="error !== 'No hay datos disponibles'" @click="cargarChecklistData()" class="ml-2 text-blue-600 hover:text-blue-800 underline">
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
          <div v-if="currentChecklistItem" class="space-y-6">
            
            <!-- Información General -->
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="text-lg font-bold text-blue-800 mb-3">Información General</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">ID</p>
                  <p class="font-semibold">{{ currentChecklistItem.id }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Estado</p>
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    isCompleted(currentChecklistItem) ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ isCompleted(currentChecklistItem) ? 'Completado' : 'Pendiente' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Recepción - Llaves -->
            <div class="bg-emerald-50 p-4 rounded-lg">
              <h4 class="text-lg font-bold text-emerald-800 mb-3">Recepción - Llaves</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Cantidad de Llaves</p>
                  <p class="font-semibold">{{ currentChecklistItem.cantidadLlaves || 'No especificado' }}</p>
                </div>
              </div>
            </div>

            <!-- Documentos -->
            <div class="bg-sky-50 p-4 rounded-lg">
              <h4 class="text-lg font-bold text-sky-800 mb-3">Documentos</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Tarjeta de Circulación</p>
                  <p class="font-semibold">{{ currentChecklistItem.tarjetaCirculacion ? 'SI' : 'NO' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Póliza de Seguro</p>
                  <p class="font-semibold">{{ currentChecklistItem.polizaSeguro ? 'SI' : 'NO' }}</p>
                </div>
              </div>
              
              <!-- Póliza de Seguro Imagen -->
              <div v-if="currentChecklistItem.polizaSeguroImagen" class="mt-4">
                <p class="text-sm font-medium text-gray-500 mb-2">Imagen Póliza de Seguro</p>
                <a :href="getImageUrl(currentChecklistItem.polizaSeguroImagen)" target="_blank" class="block">
                  <img :src="getImageUrl(currentChecklistItem.polizaSeguroImagen)" 
                       alt="Póliza de Seguro" 
                       class="w-32 h-24 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                </a>
              </div>
            </div>

            <!-- Accesorios/Herramienta -->
            <div class="bg-green-50 p-4 rounded-lg">
              <h4 class="text-lg font-bold text-green-800 mb-3">Accesorios/Herramienta</h4>
              
              <!-- Descripción de Accesorios -->
              <div v-if="currentChecklistItem.descripcionAccesorios" class="mb-4">
                <p class="text-sm font-medium text-gray-500">Descripción de Accesorios</p>
                <p class="mt-1 text-gray-800 bg-white p-2 rounded border">{{ currentChecklistItem.descripcionAccesorios }}</p>
              </div>
              
              <!-- Accesorios Imagen -->
              <div v-if="currentChecklistItem.accesoriosHerramientaImagen">
                <p class="text-sm font-medium text-gray-500 mb-2">Imagen Accesorios y Herramientas</p>
                <a :href="getImageUrl(currentChecklistItem.accesoriosHerramientaImagen)" target="_blank" class="block">
                  <img :src="getImageUrl(currentChecklistItem.accesoriosHerramientaImagen)" 
                       alt="Accesorios y Herramientas" 
                       class="w-32 h-24 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                </a>
              </div>
            </div>

            <!-- Cluster -->
            <div class="bg-yellow-50 p-4 rounded-lg">
              <h4 class="text-lg font-bold text-yellow-800 mb-3">Cluster</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Nivel de Combustible</p>
                  <p class="font-semibold">{{ currentChecklistItem.nivelCombustible || 'No especificado' }}</p>
                </div>
              </div>
              
              <!-- Odómetro y Combustible -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div v-if="currentChecklistItem.odometroImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Odómetro</p>
                  <a :href="getImageUrl(currentChecklistItem.odometroImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.odometroImagen)" 
                         alt="Odómetro" 
                         class="w-32 h-24 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
                
                <div v-if="currentChecklistItem.combustibleImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Combustible</p>
                  <a :href="getImageUrl(currentChecklistItem.combustibleImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.combustibleImagen)" 
                         alt="Combustible" 
                         class="w-32 h-24 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
              </div>
              
              <!-- Testigos Encendidos -->
              <div v-if="currentChecklistItem.testigosEncendidos && currentChecklistItem.testigosEncendidos.length > 0" class="mb-4">
                <p class="text-sm font-medium text-gray-500 mb-2">Testigos Encendidos</p>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="testigo in currentChecklistItem.testigosEncendidos" 
                    :key="testigo"
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                  >
                    {{ testigo }}
                  </span>
                </div>
              </div>
              
              <!-- Testigos Imagen -->
              <div v-if="currentChecklistItem.testigosImagen">
                <p class="text-sm font-medium text-gray-500 mb-2">Imagen Testigos</p>
                <a :href="getImageUrl(currentChecklistItem.testigosImagen)" target="_blank" class="block">
                  <img :src="getImageUrl(currentChecklistItem.testigosImagen)" 
                       alt="Testigos" 
                       class="w-32 h-24 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                </a>
              </div>
            </div>

            <!-- Tablero -->
            <div class="bg-amber-50 p-4 rounded-lg">
              <h4 class="text-lg font-bold text-amber-800 mb-3">Tablero</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Estereo</p>
                  <p class="font-semibold">{{ currentChecklistItem.estereo !== null ? (currentChecklistItem.estereo ? 'SI' : 'NO') : 'No especificado' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Cantidad de Bocinas</p>
                  <p class="font-semibold">{{ currentChecklistItem.cantidadBocinas || 'No especificado' }}</p>
                </div>
              </div>
            </div>

            <!-- Puertas -->
            <div class="bg-teal-50 p-4 rounded-lg">
              <h4 class="text-lg font-bold text-teal-800 mb-3">Puertas</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Manijas</p>
                  <p class="font-semibold">{{ currentChecklistItem.manijas !== null ? (currentChecklistItem.manijas ? 'SI' : 'NO') : 'No especificado' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Estado Seguros</p>
                  <p class="font-semibold capitalize">{{ currentChecklistItem.estadoSeguros?.replace('_', ' ') || 'No especificado' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Estado Cristales de Puertas</p>
                  <p class="font-semibold capitalize">{{ currentChecklistItem.estadoCristales?.replace('_', ' ') || 'No especificado' }}</p>
                </div>
              </div>
              
              <!-- Imágenes de Puertas -->
              <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div v-if="currentChecklistItem.segurosImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Seguros</p>
                  <a :href="getImageUrl(currentChecklistItem.segurosImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.segurosImagen)" 
                         alt="Seguros" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
                
                <div v-if="currentChecklistItem.cristalesImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Cristales de Puertas</p>
                  <a :href="getImageUrl(currentChecklistItem.cristalesImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.cristalesImagen)" 
                         alt="Cristales de Puertas" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
              </div>
            </div>

            <!-- Asientos -->
            <div class="bg-purple-50 p-4 rounded-lg">
              <h4 class="text-lg font-bold text-purple-800 mb-3">Asientos</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Estado Vestiduras</p>
                  <p class="font-semibold capitalize">{{ currentChecklistItem.estadoVestiduras?.replace('_', ' ') || 'No especificado' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Estado Cabeceras</p>
                  <p class="font-semibold capitalize">{{ currentChecklistItem.estadoCabeceras?.replace('_', ' ') || 'No especificado' }}</p>
                </div>
              </div>
              
              <!-- Imágenes de Asientos -->
              <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div v-if="currentChecklistItem.vestidurasImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Vestiduras</p>
                  <a :href="getImageUrl(currentChecklistItem.vestidurasImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.vestidurasImagen)" 
                         alt="Vestiduras" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
                
                <div v-if="currentChecklistItem.cabecerasImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Cabeceras</p>
                  <a :href="getImageUrl(currentChecklistItem.cabecerasImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.cabecerasImagen)" 
                         alt="Cabeceras" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
              </div>
            </div>

            <!-- Cinturones de Seguridad -->
            <div class="bg-rose-50 p-4 rounded-lg">
              <h4 class="text-lg font-bold text-rose-800 mb-3">Cinturones de Seguridad</h4>
              <div class="grid grid-cols-1 gap-4">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Funcionalidad Cinturones</p>
                  <p class="font-semibold capitalize">{{ currentChecklistItem.funcionalidadCinturones?.replace('_', ' ') || 'No especificado' }}</p>
                </div>
              </div>
            </div>

            <!-- Carrocería -->
            <div class="bg-red-50 p-4 rounded-lg">
              <h4 class="text-lg font-bold text-red-800 mb-3">Carrocería</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Lado Derecho</p>
                  <p class="font-semibold capitalize">{{ currentChecklistItem.carroceriaLadoDerecho?.replace('_', ' ') || 'No especificado' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Lado Izquierdo</p>
                  <p class="font-semibold capitalize">{{ currentChecklistItem.carroceriaLadoIzquierdo?.replace('_', ' ') || 'No especificado' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Lado Trasero</p>
                  <p class="font-semibold capitalize">{{ currentChecklistItem.carroceriaLadoTrasero?.replace('_', ' ') || 'No especificado' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Lado Frontal</p>
                  <p class="font-semibold capitalize">{{ currentChecklistItem.carroceriaLadoFrontal?.replace('_', ' ') || 'No especificado' }}</p>
                </div>
              </div>
              
              <!-- Imágenes de Carrocería -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-if="currentChecklistItem.carroceriaLadoDerechoImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Lado Derecho</p>
                  <a :href="getImageUrl(currentChecklistItem.carroceriaLadoDerechoImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.carroceriaLadoDerechoImagen)" 
                         alt="Carrocería Lado Derecho" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
                
                <div v-if="currentChecklistItem.carroceriaLadoIzquierdoImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Lado Izquierdo</p>
                  <a :href="getImageUrl(currentChecklistItem.carroceriaLadoIzquierdoImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.carroceriaLadoIzquierdoImagen)" 
                         alt="Carrocería Lado Izquierdo" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
                
                <div v-if="currentChecklistItem.carroceriaLadoTraseroImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Lado Trasero</p>
                  <a :href="getImageUrl(currentChecklistItem.carroceriaLadoTraseroImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.carroceriaLadoTraseroImagen)" 
                         alt="Carrocería Lado Trasero" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
                
                <div v-if="currentChecklistItem.carroceriaLadoFrontalImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Lado Frontal</p>
                  <a :href="getImageUrl(currentChecklistItem.carroceriaLadoFrontalImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.carroceriaLadoFrontalImagen)" 
                         alt="Carrocería Lado Frontal" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
              </div>
            </div>

            <!-- Neumáticos -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="text-lg font-bold text-gray-800 mb-3">Neumáticos</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Lado Piloto</p>
                  <p class="font-semibold capitalize">{{ currentChecklistItem.neumaticosLadoPiloto?.replace('_', ' ') || 'No especificado' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Atrás Piloto</p>
                  <p class="font-semibold capitalize">{{ currentChecklistItem.neumaticosLadoAtrasPiloto?.replace('_', ' ') || 'No especificado' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Lado Copiloto</p>
                  <p class="font-semibold capitalize">{{ currentChecklistItem.neumaticosLadoCopiloto?.replace('_', ' ') || 'No especificado' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Atrás Copiloto</p>
                  <p class="font-semibold capitalize">{{ currentChecklistItem.neumaticosLadoAtrasCopiloto?.replace('_', ' ') || 'No especificado' }}</p>
                </div>
              </div>
              
              <!-- Imágenes de Neumáticos -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-if="currentChecklistItem.neumaticosLadoPilotoImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Lado Piloto</p>
                  <a :href="getImageUrl(currentChecklistItem.neumaticosLadoPilotoImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.neumaticosLadoPilotoImagen)" 
                         alt="Neumático Lado Piloto" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
                
                <div v-if="currentChecklistItem.neumaticosLadoAtrasPilotoImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Atrás Piloto</p>
                  <a :href="getImageUrl(currentChecklistItem.neumaticosLadoAtrasPilotoImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.neumaticosLadoAtrasPilotoImagen)" 
                         alt="Neumático Atrás Piloto" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
                
                <div v-if="currentChecklistItem.neumaticosLadoCopilotoImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Lado Copiloto</p>
                  <a :href="getImageUrl(currentChecklistItem.neumaticosLadoCopilotoImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.neumaticosLadoCopilotoImagen)" 
                         alt="Neumático Lado Copiloto" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
                
                <div v-if="currentChecklistItem.neumaticosLadoAtrasCopilotoImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Atrás Copiloto</p>
                  <a :href="getImageUrl(currentChecklistItem.neumaticosLadoAtrasCopilotoImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.neumaticosLadoAtrasCopilotoImagen)" 
                         alt="Neumático Atrás Copiloto" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
              </div>
            </div>

            <!-- Cristales del Vehículo -->
            <div class="bg-cyan-50 p-4 rounded-lg">
              <h4 class="text-lg font-bold text-cyan-800 mb-3">Cristales del Vehículo</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Parabrisas</p>
                  <p class="font-semibold capitalize">{{ currentChecklistItem.cristalesParabrisas?.replace('_', ' ') || 'No especificado' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Medallón Trasero</p>
                  <p class="font-semibold capitalize">{{ currentChecklistItem.cristalesMedallonTrasero?.replace('_', ' ') || 'No especificado' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Limpiaparabrisas</p>
                  <p class="font-semibold capitalize">{{ currentChecklistItem.cristalesLimpiadores?.replace('_', ' ') || 'No especificado' }}</p>
                </div>
              </div>
              
              <!-- Imágenes de Cristales -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div v-if="currentChecklistItem.cristalesParabrisasImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Parabrisas</p>
                  <a :href="getImageUrl(currentChecklistItem.cristalesParabrisasImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.cristalesParabrisasImagen)" 
                         alt="Cristales Parabrisas" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
                
                <div v-if="currentChecklistItem.cristalesMedallonTraseroImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Medallón Trasero</p>
                  <a :href="getImageUrl(currentChecklistItem.cristalesMedallonTraseroImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.cristalesMedallonTraseroImagen)" 
                         alt="Cristales Medallón Trasero" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
                
                <div v-if="currentChecklistItem.cristalesLimpiadoresImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Limpiaparabrisas</p>
                  <a :href="getImageUrl(currentChecklistItem.cristalesLimpiadoresImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.cristalesLimpiadoresImagen)" 
                         alt="Cristales Limpiaparabrisas" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
              </div>
            </div>

            <!-- Motor -->
            <div class="bg-orange-50 p-4 rounded-lg">
              <h4 class="text-lg font-bold text-orange-800 mb-3">Motor</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Tapones</p>
                  <p class="font-semibold capitalize">{{ currentChecklistItem.motorTapones?.replace('_', ' ') || 'No especificado' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Batería</p>
                  <p class="font-semibold capitalize">{{ currentChecklistItem.motorBateria?.replace('_', ' ') || 'No especificado' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Nivel de Aceite</p>
                  <p class="font-semibold">{{ currentChecklistItem.motorNivelAceite || 'No especificado' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Nivel Líquido Frenos</p>
                  <p class="font-semibold">{{ currentChecklistItem.motorNivelLiquidoFrenos || 'No especificado' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Nivel Anticongelante</p>
                  <p class="font-semibold">{{ currentChecklistItem.motorNivelAnticongelante || 'No especificado' }}</p>
                </div>
              </div>
              
              <!-- Imágenes del Motor -->
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div v-if="currentChecklistItem.motorTaponesImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Tapones</p>
                  <a :href="getImageUrl(currentChecklistItem.motorTaponesImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.motorTaponesImagen)" 
                         alt="Motor Tapones" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
                
                <div v-if="currentChecklistItem.motorBateriaImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Batería</p>
                  <a :href="getImageUrl(currentChecklistItem.motorBateriaImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.motorBateriaImagen)" 
                         alt="Motor Batería" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
                
                <div v-if="currentChecklistItem.motorNivelAceiteImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Nivel Aceite</p>
                  <a :href="getImageUrl(currentChecklistItem.motorNivelAceiteImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.motorNivelAceiteImagen)" 
                         alt="Motor Nivel Aceite" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
                
                <div v-if="currentChecklistItem.motorNivelLiquidoFrenosImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Líquido Frenos</p>
                  <a :href="getImageUrl(currentChecklistItem.motorNivelLiquidoFrenosImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.motorNivelLiquidoFrenosImagen)" 
                         alt="Motor Nivel Líquido Frenos" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
                
                <div v-if="currentChecklistItem.motorNivelAnticongelanteImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Anticongelante</p>
                  <a :href="getImageUrl(currentChecklistItem.motorNivelAnticongelanteImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.motorNivelAnticongelanteImagen)" 
                         alt="Motor Nivel Anticongelante" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
              </div>
            </div>

            <!-- Depósito y Sistema de Escape -->
            <div class="bg-indigo-50 p-4 rounded-lg">
              <h4 class="text-lg font-bold text-indigo-800 mb-3">Depósito Gasolina</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Depósito Puerta</p>
                  <p class="font-semibold">{{ currentChecklistItem.depositoPuerta !== null ? (currentChecklistItem.depositoPuerta ? 'SI' : 'NO') : 'No especificado' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Depósito Tapón</p>
                  <p class="font-semibold">{{ currentChecklistItem.depositoTapon !== null ? (currentChecklistItem.depositoTapon ? 'SI' : 'NO') : 'No especificado' }}</p>
                </div>
              </div>
            </div>

            <!-- Escape -->
            <div class="bg-slate-50 p-4 rounded-lg">
              <h4 class="text-lg font-bold text-slate-800 mb-3">Escape</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Escape Silenciador</p>
                  <p class="font-semibold">{{ currentChecklistItem.escapeSilenciador !== null ? (currentChecklistItem.escapeSilenciador ? 'SI' : 'NO') : 'No especificado' }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-sm font-medium text-gray-500">Escape Catalizador</p>
                  <p class="font-semibold">{{ currentChecklistItem.escapeCatalizador !== null ? (currentChecklistItem.escapeCatalizador ? 'SI' : 'NO') : 'No especificado' }}</p>
                </div>
              </div>
              
              <!-- Imágenes del Escape -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-if="currentChecklistItem.escapeSilenciadorImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Escape Silenciador</p>
                  <a :href="getImageUrl(currentChecklistItem.escapeSilenciadorImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.escapeSilenciadorImagen)" 
                         alt="Escape Silenciador" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
                
                <div v-if="currentChecklistItem.escapeCatalizadorImagen">
                  <p class="text-sm font-medium text-gray-500 mb-2">Escape Catalizador</p>
                  <a :href="getImageUrl(currentChecklistItem.escapeCatalizadorImagen)" target="_blank" class="block">
                    <img :src="getImageUrl(currentChecklistItem.escapeCatalizadorImagen)" 
                         alt="Escape Catalizador" 
                         class="w-full h-20 object-cover rounded-lg border hover:opacity-75 transition-opacity cursor-pointer">
                  </a>
                </div>
              </div>
            </div>

            <!-- Comentarios Generales -->
            <div v-if="currentChecklistItem.comentarioGeneral" class="bg-gray-100 p-4 rounded-lg">
              <h4 class="text-lg font-bold text-gray-800 mb-3">Comentarios Generales</h4>
              <p class="text-gray-800 bg-white p-3 rounded border">{{ currentChecklistItem.comentarioGeneral }}</p>
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
          
          // Procesar los datos para asegurar que testigosEncendidos sea un array válido
          const processedData = (data.data || []).map(item => {
            const processedItem = { ...item };
            
            // Procesar testigosEncendidos
            if (processedItem.testigosEncendidos) {
              if (typeof processedItem.testigosEncendidos === 'string') {
                try {
                  // Intentar parsear como JSON
                  processedItem.testigosEncendidos = JSON.parse(processedItem.testigosEncendidos);
                } catch (e) {
                  // Si no es JSON válido, convertir a array con un solo elemento
                  processedItem.testigosEncendidos = [processedItem.testigosEncendidos];
                }
              }
              
              // Asegurar que sea un array
              if (!Array.isArray(processedItem.testigosEncendidos)) {
                processedItem.testigosEncendidos = [processedItem.testigosEncendidos];
              }
            } else {
              processedItem.testigosEncendidos = [];
            }
            
            return processedItem;
          });
          
          checklistData.value = processedData;
          totalItems.value = data.total || 0;
          totalPages.value = data.last_page || 1;
          currentPage.value = data.current_page || 1;
          
          console.log('Datos de checklist cargados y procesados:', {
            items: checklistData.value.length,
            total: totalItems.value,
            page: currentPage.value
          });
        } else {
          throw new Error('Respuesta no exitosa del servidor');
        }
      } catch (err) {
        console.error('Error al cargar checklist:', err);
        
        // Manejar específicamente el error 404 (no hay datos)
        if (err.response?.status === 404) {
          error.value = 'No hay datos disponibles';
          checklistData.value = [];
          totalItems.value = 0;
          totalPages.value = 1;
          currentPage.value = 1;
          // No mostrar toast para 404, es un estado normal cuando no hay datos
        } else {
          // Para otros errores (500, 401, etc.)
          error.value = 'Error al cargar los datos del checklist';
          toastStore.addToast({
            message: 'Error al cargar los datos del checklist',
            type: 'error',
            duration: 5000
          });
        }
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

    // Ver archivo - construir URL completa para las imágenes (mantenido para compatibilidad)
    const verArchivo = (nombreArchivo) => {
      if (!nombreArchivo) return;
      
      // Construir URL de la imagen
      const imageUrl = getImageUrl(nombreArchivo);
      
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

    // Helper para obtener la URL completa de una imagen
    const getImageUrl = (imageName) => {
      if (!imageName) return null;
      // return `http://127.0.0.1:8000/Mecasoft/detalles_ordenes/${imageName}`;
      return `https://api.ed-intra.com/Mecasoft/detalles_ordenes/${imageName}`;
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
      getImageUrl,
      // Nuevas funciones para manejo de roles y orden
      getOldestPendingChecklist,
      canCompleteChecklist
    };
  }
};
</script>
