<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
      <button 
        @click="abrirModalNuevoCliente"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>Nuevo Cliente</span>
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Buscar Cliente
          </label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre, teléfono, email..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            v-model="estadoFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="Ciudad de México">Ciudad de México</option>
            <option value="Estado de México">Estado de México</option>
            <option value="Jalisco">Jalisco</option>
            <option value="Nuevo León">Nuevo León</option>
            <option value="Puebla">Puebla</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Municipio
          </label>
          <select
            v-model="municipioFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los municipios</option>
            <option value="Benito Juárez">Benito Juárez</option>
            <option value="Miguel Hidalgo">Miguel Hidalgo</option>
            <option value="Cuauhtémoc">Cuauhtémoc</option>
            <option value="Tlalnepantla">Tlalnepantla</option>
            <option value="Naucalpan">Naucalpan</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-gray-600">Cargando clientes...</span>
      </div>
      <div v-else-if="error" class="p-4 text-red-600 bg-red-50 text-center">
        {{ error }}
      </div>
      <div v-else>
        <!-- Tabla con scroll -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="cliente in paginatedData" :key="cliente.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                        <span class="text-white text-sm font-medium">
                          {{ cliente.nombre.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">
                        {{ cliente.nombre }}
                      </div>
                      <div class="text-sm text-gray-500">
                        ID: {{ cliente.id }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ cliente.telefono }}</div>
                  <div class="text-sm text-gray-500">{{ cliente.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ cliente.calle }} {{ cliente.numeroExtInt }}</div>
                  <div class="text-sm text-gray-500">{{ cliente.colonia }}, C.P. {{ cliente.cp }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {{ cliente.estado }}
                  </span>
                  <div class="text-sm text-gray-500 mt-1">{{ cliente.delegacionMunicipio }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div class="flex justify-center space-x-2">
                    <button
                      @click="verDetalles(cliente)"
                      class="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition-colors"
                      title="Ver detalles"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                    <button
                      @click="editarCliente(cliente)"
                      class="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-100 transition-colors"
                      title="Editar cliente"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      @click="eliminarCliente(cliente)"
                      class="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors"
                      title="Eliminar cliente"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
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
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Anterior</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    currentPage === page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
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
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Nuevo/Editar Cliente -->
    <ClientesFormModal
      v-if="showClienteModal"
      :show="showClienteModal"
      :clienteData="clienteToEdit"
      @close="showClienteModal = false"
      @cliente-guardado="handleClienteGuardado"
    />

    <!-- Modal de Detalles de Cliente -->
    <div v-if="showDetallesModal" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white w-[90%] max-w-lg max-h-[90vh] rounded-lg shadow-xl">
        <!-- Encabezado del modal -->
        <div class="bg-green-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h3 class="text-lg font-semibold">Detalles del Cliente</h3>
          <button @click="showDetallesModal = false" class="text-white hover:text-gray-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Contenido del modal -->
        <div class="p-6 overflow-y-auto" style="max-height: calc(90vh - 80px);">
          <div v-if="currentCliente" class="space-y-4">
            <div class="text-center mb-6">
              <div class="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3">
                <span class="text-white text-2xl font-bold">
                  {{ currentCliente.nombre.charAt(0).toUpperCase() }}
                </span>
              </div>
              <h4 class="text-xl font-bold text-gray-900">{{ currentCliente.nombre }}</h4>
              <p class="text-gray-600">{{ currentCliente.email }}</p>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-500">Nombre Completo</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentCliente.nombre }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Teléfono</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentCliente.telefono }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Email</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentCliente.email }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Dirección Completa</label>
                  <p class="text-sm text-gray-900 font-semibold">
                    {{ currentCliente.calle }} {{ currentCliente.numeroExtInt }}, 
                    {{ currentCliente.colonia }}, 
                    {{ currentCliente.delegacionMunicipio }}, 
                    {{ currentCliente.estado }}, 
                    C.P. {{ currentCliente.cp }}
                  </p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Domicilio</label>
                  <p class="text-sm text-gray-900 font-semibold">{{ currentCliente.domicilio }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Eliminar Cliente -->
    <ClientesDeleteModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :cliente="clienteToDelete"
      @close="showDeleteModal = false"
      @cliente-eliminado="handleClienteEliminado"
    />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useToastStore } from '../../stores/toast.js'
import ClientesFormModal from './ClientesFormModal.vue'
import ClientesDeleteModal from './ClientesDeleteModal.vue'

export default {
  name: 'ClientesTable',
  components: {
    ClientesFormModal,
    ClientesDeleteModal
  },
  setup() {
    const toastStore = useToastStore()
    const isLoading = ref(false)
    const error = ref(null)
    
    // Datos de clientes (mockup)
    const clientes = ref([
      {
        id: 1,
        nombre: 'Juan Pérez García',
        telefono: '55-1234-5678',
        domicilio: 'Avenida Insurgentes Sur 1234',
        calle: 'Avenida Insurgentes Sur',
        numeroExtInt: '1234',
        colonia: 'Del Valle',
        cp: '03100',
        delegacionMunicipio: 'Benito Juárez',
        estado: 'Ciudad de México',
        email: 'juan.perez@email.com'
      },
      {
        id: 2,
        nombre: 'María López Rodríguez',
        telefono: '55-9876-5432',
        domicilio: 'Calle Reforma 567',
        calle: 'Calle Reforma',
        numeroExtInt: '567',
        colonia: 'Juárez',
        cp: '06600',
        delegacionMunicipio: 'Cuauhtémoc',
        estado: 'Ciudad de México',
        email: 'maria.lopez@email.com'
      },
      {
        id: 3,
        nombre: 'Carlos Sánchez Mendoza',
        telefono: '55-5555-1111',
        domicilio: 'Periférico Norte 890',
        calle: 'Periférico Norte',
        numeroExtInt: '890',
        colonia: 'Lomas Verdes',
        cp: '53120',
        delegacionMunicipio: 'Naucalpan',
        estado: 'Estado de México',
        email: 'carlos.sanchez@email.com'
      },
      {
        id: 4,
        nombre: 'Ana Torres Silva',
        telefono: '55-7777-8888',
        domicilio: 'Avenida Universidad 321',
        calle: 'Avenida Universidad',
        numeroExtInt: '321',
        colonia: 'Copilco',
        cp: '04360',
        delegacionMunicipio: 'Coyoacán',
        estado: 'Ciudad de México',
        email: 'ana.torres@email.com'
      },
      {
        id: 5,
        nombre: 'Luis García Hernández',
        telefono: '55-2222-3333',
        domicilio: 'Calzada de Tlalpan 456',
        calle: 'Calzada de Tlalpan',
        numeroExtInt: '456',
        colonia: 'Portales',
        cp: '03300',
        delegacionMunicipio: 'Benito Juárez',
        estado: 'Ciudad de México',
        email: 'luis.garcia@email.com'
      },
      {
        id: 6,
        nombre: 'Patricia Ruiz Jiménez',
        telefono: '55-4444-6666',
        domicilio: 'Boulevard Manuel Ávila Camacho 789',
        calle: 'Boulevard Manuel Ávila Camacho',
        numeroExtInt: '789',
        colonia: 'Lomas de Sotelo',
        cp: '53390',
        delegacionMunicipio: 'Naucalpan',
        estado: 'Estado de México',
        email: 'patricia.ruiz@email.com'
      },
      {
        id: 7,
        nombre: 'Roberto Mendoza Castro',
        telefono: '55-8888-9999',
        domicilio: 'Avenida Chapultepec 654',
        calle: 'Avenida Chapultepec',
        numeroExtInt: '654',
        colonia: 'Roma Norte',
        cp: '06700',
        delegacionMunicipio: 'Cuauhtémoc',
        estado: 'Ciudad de México',
        email: 'roberto.mendoza@email.com'
      },
      {
        id: 8,
        nombre: 'Carmen Jiménez Morales',
        telefono: '55-1111-2222',
        domicilio: 'Viaducto Miguel Alemán 147',
        calle: 'Viaducto Miguel Alemán',
        numeroExtInt: '147',
        colonia: 'Escandón',
        cp: '11800',
        delegacionMunicipio: 'Miguel Hidalgo',
        estado: 'Ciudad de México',
        email: 'carmen.jimenez@email.com'
      },
      {
        id: 9,
        nombre: 'Fernando Castro López',
        telefono: '55-3333-4444',
        domicilio: 'Avenida Constituyentes 258',
        calle: 'Avenida Constituyentes',
        numeroExtInt: '258',
        colonia: 'San Miguel Chapultepec',
        cp: '11850',
        delegacionMunicipio: 'Miguel Hidalgo',
        estado: 'Ciudad de México',
        email: 'fernando.castro@email.com'
      },
      {
        id: 10,
        nombre: 'Elena Vargas Herrera',
        telefono: '55-6666-7777',
        domicilio: 'Gustavo Baz 369',
        calle: 'Gustavo Baz',
        numeroExtInt: '369',
        colonia: 'Centro',
        cp: '54000',
        delegacionMunicipio: 'Tlalnepantla',
        estado: 'Estado de México',
        email: 'elena.vargas@email.com'
      },
      {
        id: 11,
        nombre: 'Miguel Herrera Ruiz',
        telefono: '55-5555-6666',
        domicilio: 'Eje Central Lázaro Cárdenas 741',
        calle: 'Eje Central Lázaro Cárdenas',
        numeroExtInt: '741',
        colonia: 'Centro',
        cp: '06000',
        delegacionMunicipio: 'Cuauhtémoc',
        estado: 'Ciudad de México',
        email: 'miguel.herrera@email.com'
      },
      {
        id: 12,
        nombre: 'Sofía Morales Vázquez',
        telefono: '55-9999-0000',
        domicilio: 'Avenida Revolución 852',
        calle: 'Avenida Revolución',
        numeroExtInt: '852',
        colonia: 'Mixcoac',
        cp: '03910',
        delegacionMunicipio: 'Benito Juárez',
        estado: 'Ciudad de México',
        email: 'sofia.morales@email.com'
      }
    ])

    // Modales
    const showClienteModal = ref(false)
    const showDetallesModal = ref(false)
    const showDeleteModal = ref(false)
    const currentCliente = ref(null)
    const clienteToEdit = ref(null)
    const clienteToDelete = ref(null)

    // Filtros
    const searchQuery = ref('')
    const estadoFilter = ref('')
    const municipioFilter = ref('')

    // Paginación
    const currentPage = ref(1)
    const itemsPerPage = 10
    const totalItems = ref(0)
    const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))

    // Filtrar datos
    const filteredData = computed(() => {
      let result = clientes.value

      // Filtrar por estado
      if (estadoFilter.value) {
        result = result.filter(item => item.estado === estadoFilter.value)
      }

      // Filtrar por municipio
      if (municipioFilter.value) {
        result = result.filter(item => item.delegacionMunicipio === municipioFilter.value)
      }

      // Filtrar por búsqueda general
      if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase()
        result = result.filter(item => {
          return item.nombre.toLowerCase().includes(search) ||
                 item.telefono.toLowerCase().includes(search) ||
                 item.email.toLowerCase().includes(search) ||
                 item.calle.toLowerCase().includes(search) ||
                 item.colonia.toLowerCase().includes(search) ||
                 item.delegacionMunicipio.toLowerCase().includes(search) ||
                 item.estado.toLowerCase().includes(search)
        })
      }

      totalItems.value = result.length
      return result
    })

    // Paginar datos
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
      
      // Always add page 1
      pages.push(1)
      
      // Add page before current if it exists and is not 1
      if (currentPage.value > 2) {
        pages.push(currentPage.value - 1)
      }
      
      // Add current page if it's not 1
      if (currentPage.value > 1) {
        pages.push(currentPage.value)
      }
      
      // Add page after current if it exists and is not the last page
      if (currentPage.value + 1 < totalPages.value) {
        pages.push(currentPage.value + 1)
      }
      
      // Add last page if it's not already added
      if (totalPages.value > 1 && !pages.includes(totalPages.value)) {
        pages.push(totalPages.value)
      }
      
      // Remove duplicates and sort
      return [...new Set(pages)].sort((a, b) => a - b)
    })

    // Navegación de páginas
    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const goToPage = (page) => {
      currentPage.value = page
    }

    // Simular carga de datos
    const cargarClientes = async () => {
      isLoading.value = true
      error.value = null
      
      try {
        // Simular delay de carga
        await new Promise(resolve => setTimeout(resolve, 500))
        // Los datos ya están cargados en el ref
      } catch (err) {
        error.value = 'Error al cargar los clientes'
        console.error('Error al cargar clientes:', err)
        toastStore.addToast({
          message: 'Error al cargar los clientes',
          type: 'error',
          duration: 5000
        })
      } finally {
        isLoading.value = false
      }
    }

    // Acciones de la tabla
    const abrirModalNuevoCliente = () => {
      clienteToEdit.value = null
      showClienteModal.value = true
    }

    const verDetalles = (cliente) => {
      currentCliente.value = cliente
      showDetallesModal.value = true
    }

    const editarCliente = (cliente) => {
      clienteToEdit.value = { ...cliente }
      showClienteModal.value = true
    }

    const eliminarCliente = (cliente) => {
      clienteToDelete.value = cliente
      showDeleteModal.value = true
    }

    const handleClienteGuardado = (cliente) => {
      if (clienteToEdit.value) {
        // Actualizar cliente existente
        const index = clientes.value.findIndex(c => c.id === clienteToEdit.value.id)
        if (index !== -1) {
          clientes.value[index] = { ...clienteToEdit.value, ...cliente }
        }
        toastStore.addToast({
          message: 'Cliente actualizado exitosamente',
          type: 'success',
          duration: 3000
        })
      } else {
        // Agregar nuevo cliente
        const nuevoCliente = {
          ...cliente,
          id: Math.max(...clientes.value.map(c => c.id)) + 1
        }
        clientes.value.push(nuevoCliente)
        toastStore.addToast({
          message: 'Cliente creado exitosamente',
          type: 'success',
          duration: 3000
        })
      }
      
      clienteToEdit.value = null
      showClienteModal.value = false
    }

    const handleClienteEliminado = (clienteId) => {
      clientes.value = clientes.value.filter(c => c.id !== clienteId)
      showDeleteModal.value = false
      clienteToDelete.value = null
      
      toastStore.addToast({
        message: 'Cliente eliminado exitosamente',
        type: 'success',
        duration: 3000
      })
    }

    // Watchers para filtros
    watch([searchQuery, estadoFilter, municipioFilter], () => {
      currentPage.value = 1
    })

    // Cargar datos al montar el componente
    onMounted(() => {
      cargarClientes()
    })

    return {
      clientes,
      isLoading,
      error,
      searchQuery,
      estadoFilter,
      municipioFilter,
      currentPage,
      totalItems,
      totalPages,
      paginatedData,
      startRecord,
      endRecord,
      visiblePages,
      showClienteModal,
      showDetallesModal,
      showDeleteModal,
      currentCliente,
      clienteToEdit,
      clienteToDelete,
      previousPage,
      nextPage,
      goToPage,
      abrirModalNuevoCliente,
      verDetalles,
      editarCliente,
      eliminarCliente,
      handleClienteGuardado,
      handleClienteEliminado,
      cargarClientes
    }
  }
}
</script>
