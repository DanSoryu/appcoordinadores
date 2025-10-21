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

    <!-- Tabla de CheckList -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-gray-600">Cargando datos...</span>
      </div>
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse table-fixed">
            <thead class="bg-gray-50">
              <tr class="divide-x divide-gray-200">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad de Llaves</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Póliza de Seguro</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarjeta Circulación</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Otro Documento</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Llave Birlo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-gray-50 divide-x divide-gray-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span v-if="item.cantidadLlaves !== null && item.cantidadLlaves !== 0">{{ item.cantidadLlaves }}</span>
                  <span v-else class="text-gray-400 italic">No se proporcionaron</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span v-if="item.polizaSeguro">
                    <button class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200" @click="verArchivo(item.polizaSeguro)">Ver archivo</button>
                  </span>
                  <span v-else class="text-gray-400 italic">No disponible</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span v-if="item.tarjetaCirculacion !== null" :class="[
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                    item.tarjetaCirculacion ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    {{ item.tarjetaCirculacion ? 'SI' : 'NO' }}
                  </span>
                  <span v-else class="text-gray-400 italic">No especificado</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span v-if="item.otroDocumento">
                    <button class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200" @click="verArchivo(item.otroDocumento)">Ver archivo</button>
                  </span>
                  <span v-else class="text-gray-400 italic">No disponible</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span v-if="item.accesoriosHerramienta">
                    <button class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200" @click="verArchivo(item.accesoriosHerramienta)">Ver archivo</button>
                  </span>
                  <span v-else class="text-gray-400 italic">No disponible</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                    item.terminado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ item.terminado ? 'Completado' : 'Pendiente' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                  <button 
                    @click="verDetalles(item)"
                    class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ver
                  </button>
                  <button 
                    @click="$emit('abrir-checklist-modal', item)"
                    class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {{ item.terminado ? 'Editar' : 'Completar' }}
                  </button>
                </td>
              </tr>
              <!-- Mensaje cuando no hay datos -->
              <tr v-if="paginatedData.length === 0">
                <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                  No se encontraron registros de checklist.
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
                <p class="font-semibold">{{ currentChecklistItem.terminado ? 'Completado' : 'Pendiente' }}</p>
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
                <p class="text-sm font-medium text-gray-500">Dirección</p>
                <p class="font-semibold">{{ currentChecklistItem.direccion || 'No especificado' }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-500">Teléfono</p>
                <p class="font-semibold">{{ currentChecklistItem.telefono || 'No especificado' }}</p>
              </div>
            </div>
            
            <div class="mt-4">
              <p class="text-sm font-medium text-gray-500">Comentarios</p>
              <p class="mt-1 text-gray-800">{{ currentChecklistItem.comentario || 'Sin comentarios' }}</p>
            </div>
            
            <div class="mt-6">
              <h4 class="text-lg font-bold text-gray-800 mb-3">Archivos</h4>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-if="currentChecklistItem.polizaSeguro" class="space-y-2">
                    <p class="text-sm font-medium text-gray-500">Póliza de Seguro</p>
                    <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="verArchivo(currentChecklistItem.polizaSeguro)">
                      Ver Archivo
                    </button>
                  </div>
                  <div v-if="currentChecklistItem.otroDocumento" class="space-y-2">
                    <p class="text-sm font-medium text-gray-500">Otro Documento</p>
                    <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="verArchivo(currentChecklistItem.otroDocumento)">
                      Ver Archivo
                    </button>
                  </div>
                  <div v-if="currentChecklistItem.accesoriosHerramienta" class="space-y-2">
                    <p class="text-sm font-medium text-gray-500">Llave de Birlo / Accesorios</p>
                    <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="verArchivo(currentChecklistItem.accesoriosHerramienta)">
                      Ver Archivo
                    </button>
                  </div>
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
import { ref, computed, watch } from 'vue'
import { useToastStore } from '../../stores/toast.js'

export default {
  name: 'CheckListRecepcionTable',
  emits: ['abrir-checklist-modal'],
  setup(props, { emit }) {
    const toastStore = useToastStore();
    const isLoading = ref(false);
    
    // Datos de checklist
    const checklistData = ref([
      {
        id: 1,
        cantidadLlaves: 10,
        polizaSeguro: '1355110.jpeg',
        tarjetaCirculacion: true,
        otroDocumento: 'Mapeo proceso taller vehicular.pdf',
        accesoriosHerramienta: 'gaelillo.jpeg',
        terminado: true
      },
      {
        id: 2,
        cantidadLlaves: 2,
        polizaSeguro: 'seguro2.pdf',
        tarjetaCirculacion: false,
        otroDocumento: 'manual_usuario.docx',
        accesoriosHerramienta: 'llave_rueda.png',
        terminado: false
      },
      {
        id: 3,
        cantidadLlaves: 1,
        polizaSeguro: 'archivo3.png',
        tarjetaCirculacion: true,
        otroDocumento: 'factura_auto.pdf',
        accesoriosHerramienta: 'destornillador.jpg',
        terminado: false
      },
      {
        id: 4,
        cantidadLlaves: 3,
        polizaSeguro: null,
        tarjetaCirculacion: true,
        otroDocumento: null,
        accesoriosHerramienta: 'llaves_birlo.jpg',
        terminado: false
      },
      {
        id: 5,
        cantidadLlaves: 0,
        polizaSeguro: 'poliza_vigente.pdf',
        tarjetaCirculacion: true,
        otroDocumento: 'instrucciones.pdf',
        accesoriosHerramienta: null,
        terminado: true
      }
    ]);

    // Filtros
    const searchQuery = ref('');
    const terminadoFilter = ref('');
    const llavesFilter = ref('');

    // Paginación
    const currentPage = ref(1);
    const itemsPerPage = 10;
    const totalItems = ref(checklistData.value.length);
    
    // Modal de detalles
    const showDetallesModal = ref(false);
    const currentChecklistItem = ref(null);

    // Filtrar datos
    const filteredData = computed(() => {
      let result = checklistData.value;

      // Filtrar por terminado
      if (terminadoFilter.value !== '') {
        const isTerminado = terminadoFilter.value === 'true';
        result = result.filter(item => item.terminado === isTerminado);
      }

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
            (item.direccion && item.direccion.toLowerCase().includes(search)) ||
            (item.telefono && item.telefono.toLowerCase().includes(search)) ||
            (item.comentario && item.comentario.toLowerCase().includes(search))
          );
        });
      }

      totalItems.value = result.length;
      return result;
    });

    // Paginar datos
    const paginatedData = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage;
      return filteredData.value.slice(startIndex, startIndex + itemsPerPage);
    });

    const startRecord = computed(() => {
      if (filteredData.value.length === 0) return 0;
      return ((currentPage.value - 1) * itemsPerPage) + 1;
    });

    const endRecord = computed(() => {
      if (filteredData.value.length === 0) return 0;
      return Math.min(currentPage.value * itemsPerPage, totalItems.value);
    });

    const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage));

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
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const goToPage = (page) => {
      currentPage.value = page;
    };

    // Ver detalles del checklist
    const verDetalles = (item) => {
      currentChecklistItem.value = item;
      showDetallesModal.value = true;
    };

    // Ver archivo
    const verArchivo = (nombreArchivo) => {
      // Aquí podrías abrir un modal, mostrar una imagen, descargar, etc.
      toastStore.addToast({
        message: `Visualizando archivo: ${nombreArchivo}`,
        type: 'info',
        duration: 3000
      });
    };

    // Watchers para filtros
    watch([searchQuery, terminadoFilter, llavesFilter], () => {
      currentPage.value = 1;
    });

    return {
      isLoading,
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
      verArchivo
    };
  }
};
</script>
