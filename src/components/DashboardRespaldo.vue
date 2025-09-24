<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-blue-600 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <h1 class="text-xl font-bold">Portal Coordinadores</h1>
          
          <!-- User Menu -->
          <div class="relative">
            <button 
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-3 hover:bg-blue-700 px-3 py-2 rounded-md transition-colors"
            >
                <!-- Imagen de usuario eliminada por error de importación -->
              <span class="font-medium">{{ user.usuario }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Cerrar Sesión
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Dashboard View -->
      <div v-if="activeTab === 'dashboard'">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
        
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Total Órdenes</p>
                <p class="text-2xl font-semibold text-gray-900">1,234</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Completas</p>
                <p class="text-2xl font-semibold text-gray-900">856</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex items-center">
              <div class="p-2 bg-yellow-100 rounded-lg">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Pendientes</p>
                <p class="text-2xl font-semibold text-gray-900">378</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex items-center">
              <div class="p-2 bg-purple-100 rounded-lg">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">Materiales</p>
                <p class="text-2xl font-semibold text-gray-900">2,456</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Bar Chart -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Órdenes por Mes</h3>
            <div class="h-64 flex items-end justify-between space-x-2">
              <div v-for="(value, month) in barChartData" :key="month" class="flex flex-col items-center">
                <div 
                  class="bg-blue-500 w-8 rounded-t transition-all duration-300 hover:bg-blue-600"
                  :style="{ height: `${(value / Math.max(...Object.values(barChartData))) * 200}px` }"
                ></div>
                <span class="text-xs text-gray-600 mt-2">{{ month }}</span>
              </div>
            </div>
          </div>

          <!-- Pie Chart -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Estado de Órdenes</h3>
            <div class="flex items-center justify-center h-64">
              <div class="relative w-48 h-48">
                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" stroke-width="10"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" stroke-width="10" 
                          stroke-dasharray="157" stroke-dashoffset="47" stroke-linecap="round"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" stroke-width="10" 
                          stroke-dasharray="94" stroke-dashoffset="-110" stroke-linecap="round"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" stroke-width="10" 
                          stroke-dasharray="63" stroke-dashoffset="-204" stroke-linecap="round"/>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-gray-900">1,234</div>
                    <div class="text-sm text-gray-600">Total</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 space-y-2">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600">Completas (70%)</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600">En Proceso (20%)</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-600">Pendientes (10%)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Reports -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Reportes Recientes</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 class="font-medium text-gray-900">Reporte Mensual - Enero 2024</h4>
                  <p class="text-sm text-gray-600">Generado el 01/02/2024</p>
                </div>
                <button class="text-blue-600 hover:text-blue-800 font-medium">Descargar</button>
              </div>
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 class="font-medium text-gray-900">Análisis de Materiales</h4>
                  <p class="text-sm text-gray-600">Generado el 28/01/2024</p>
                </div>
                <button class="text-blue-600 hover:text-blue-800 font-medium">Descargar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table Views -->
      <div v-else-if="activeTab === 'complete' || activeTab === 'materials'">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">{{ getCurrentTabName() }}</h2>
          <button 
            @click="exportToExcel"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Exportar a Excel</span>
          </button>
        </div>

        <!--  Agregando filtros específicos para cada vista -->
        <!-- Filters -->
        <div class="bg-white p-4 rounded-lg shadow mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Filtros para Órdenes (Completas) -->
            <template v-if="activeTab === 'complete'">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Folio PISA</label>
                <input 
                  v-model="folioFilter"
                  type="text" 
                  placeholder="Buscar folio..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input 
                  v-model="telefonoFilter"
                  type="text" 
                  placeholder="Buscar teléfono..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Contratista</label>
                <select 
                  v-model="contratistaFilter"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los contratistas</option>
                  <option value="ANA LILIA">ANA LILIA</option>
                  <option value="ALMACEN">ALMACEN</option>
                  <option value="MARCO ANTONIO">MARCO ANTONIO</option>
                  <option value="JOSE DIONISIO">JOSE DIONISIO</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">COPE</label>
                <select 
                  v-model="copeFilter"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los COPE</option>
                  <option value="CT BOSQUES DEL LAGO">CT BOSQUES DEL LAGO</option>
                  <option value="CT SAMBULA">CT SAMBULA</option>
                  <option value="CT MARQUES">CT MARQUES</option>
                  <option value="CT GOMEZ PALACIO">CT GOMEZ PALACIO</option>
                </select>
              </div>
            </template>

            <!-- Filtros para Materiales -->
            <template v-if="activeTab === 'materials'">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Número de Serie</label>
                <input 
                  v-model="serieFilter"
                  type="text" 
                  placeholder="Buscar serie..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Localidad</label>
                <select 
                  v-model="localidadFilter"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas las localidades</option>
                  <option value="ALMACEN LOCAL">ALMACEN LOCAL</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación Material</label>
                <select 
                  v-model="ubicacionFilter"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas las ubicaciones</option>
                  <option value="Tecnico">Técnico</option>
                </select>
              </div>
            </template>

            <!-- Filtros de fecha comunes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
              <input 
                v-model="dateFrom"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
              <input 
                v-model="dateTo"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>
          </div>
        </div>

        <!--  Tabla con columnas específicas según la vista -->
        <!-- Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  
                  <!-- Columnas para Órdenes Completas -->
                  <template v-if="activeTab === 'complete'">
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio Pisa</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ONT</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FK Contratista</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contratista</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ap. Paterno</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ap. Materno</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellidos</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Expediente</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COPE</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  </template>
                  
                  <!-- Columnas para Materiales -->
                  <template v-if="activeTab === 'materials'">
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Salida</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Num Serie</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alfanumérico</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localidad Material</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio Salida</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Salida</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación Material</th>
                  </template>
                  
                  <th v-if="activeTab !== 'materials'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.id }}</td>
                  
                  <!-- Datos para Órdenes -->
                  <template v-if="activeTab === 'complete'">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Folio_Pisa }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Telefono }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Ont }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.FK_Contratista_Tecnico }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Contratista }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.apellido_paterno }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.apellido_materno }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Nombre_T }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Apellidos_T }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.NExpediente }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.COPE }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusClass(item.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ item.status }}
                      </span>
                    </td>
                  </template>
                  
                  <!-- Datos para Materiales -->
                  <template v-if="activeTab === 'materials'">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.id_Salida_Det }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Num_Serie_S }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Alfanumerico_S }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Localidad_Material_S }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Folio_Salida_Material_Det_S }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Fecha_Salida_S }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Ubicacion_Material }}</td>
                  </template>
                  
                  <td v-if="activeTab !== 'materials'" class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button 
                        @click="viewMap(item)"
                        class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 transition-colors"
                        title="Ver Mapa"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </button>
                      <button 
                        @click="viewPhotos(item)"
                        class="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100 transition-colors"
                        title="Ver Fotos"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </button>
                      <button 
                        @click="editRecord(item)"
                        class="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-100 transition-colors"
                        title="Editar Registro"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
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
                  Mostrando <span class="font-medium">{{ startRecord }}</span> a <span class="font-medium">{{ endRecord }}</span> de <span class="font-medium">{{ filteredData.length }}</span> resultados
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button 
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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
                      page === currentPage 
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
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// State
const activeTab = ref('dashboard')
const showUserMenu = ref(false)

// Filtros para órdenes
const folioFilter = ref('')
const telefonoFilter = ref('')
const contratistaFilter = ref('')
const copeFilter = ref('')
// Filtros para materiales
const serieFilter = ref('')
const localidadFilter = ref('')
const ubicacionFilter = ref('')
// Filtros comunes
const dateFrom = ref('')
const dateTo = ref('')
const currentPage = ref(1)
const itemsPerPage = 15

// Data
const tabs = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'complete', name: 'Órdenes Completas' },
  { id: 'materials', name: 'Materiales' }
]

const barChartData = {
  'Ene': 120,
  'Feb': 150,
  'Mar': 180,
  'Abr': 200,
  'May': 170,
  'Jun': 190,
  'Jul': 220,
  'Ago': 240,
  'Sep': 210,
  'Oct': 180,
  'Nov': 160,
  'Dic': 140
}

//  Datos específicos para cada vista
// Sample data for different views
const ordersCompleteData = ref([])
const materialsData = ref([])

//  Generación de datos específicos para cada vista
// Generate sample data for each view
const generateOrdersData = (isComplete = true) => {
  const nombres = ['ADOLFO', 'FRANCISCO', 'JOSE', 'ROBERTO', 'ROLANDO', 'MARTIN', 'JOEL', 'RAUL', 'JAIRO', 'MANUEL']
  const apellidos = ['SERRANO', 'CHAN', 'RIVERA', 'RODRIGUEZ', 'COLIN', 'ESTRADA', 'CRUZ', 'CADENA', 'TZUB', 'HERNANDEZ']
  const contractors = ['ANA LILIA', 'ALMACEN', 'MARCO ANTONIO', 'JOSE DIONISIO', 'CARLOS ALFREDO', 'MIGUEL ANGEL', 'ABRAHAM', 'CESAR']
  const copes = ['CT BOSQUES DEL LAGO', 'CT SAMBULA', 'CT MARQUES', 'CT GOMEZ PALACIO', 'CT NAUCALPAN', 'CT ALDAMA', 'CT ITZCALI', 'CT DOS CAMINOS']
  const data = []
  
  for (let i = 1; i <= 75; i++) {
    const nombre = nombres[Math.floor(Math.random() * nombres.length)]
    const apellidoPaterno = apellidos[Math.floor(Math.random() * apellidos.length)]
    const apellidoMaterno = apellidos[Math.floor(Math.random() * apellidos.length)]
    const telefono = Math.floor(Math.random() * 9000000000) + 1000000000
    const expediente = Math.floor(Math.random() * 900000) + 100000

    data.push({
      Folio_Pisa: (18000000 + Math.floor(Math.random() * 1000000)).toString(),
      Telefono: telefono.toString(),
      Ont: `ALCLB${Math.floor(Math.random() * 90000) + 10000}${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}`,
      FK_Contratista_Tecnico: Math.floor(Math.random() * 100) + 1,
      Contratista: contractors[Math.floor(Math.random() * contractors.length)],
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      Nombre_T: nombre,
      Apellidos_T: `${apellidoPaterno} ${apellidoMaterno}`,
      NExpediente: expediente.toString(),
      COPE: copes[Math.floor(Math.random() * copes.length)],
      status: isComplete ? 'completa' : (Math.random() > 0.5 ? 'pendiente' : 'proceso')
    })
  }
  
  return data
}

const generateMaterialsData = () => {
  const localidades = ['ALMACEN LOCAL']
  const ubicaciones = ['Tecnico']
  const data = []
  
  for (let i = 1; i <= 100; i++) {
    const fecha = new Date()
    fecha.setHours(16)
    fecha.setMinutes(50)
    fecha.setSeconds(46)
    
    data.push({
      id_Salida_Det: i,
      Num_Serie_S: `ZTEG${Math.floor(Math.random() * 9000000) + 1000000}`,
      Alfanumerico_S: 'undefined',
      Localidad_Material_S: localidades[Math.floor(Math.random() * localidades.length)],
      Folio_Salida_Material_Det_S: 1,
      Fecha_Salida_S: fecha.toLocaleString('es-MX'),
      Ubicacion_Material: ubicaciones[Math.floor(Math.random() * ubicaciones.length)]
    })
  }
  
  return data
}

// Computed properties
const currentData = computed(() => {
  switch (activeTab.value) {
    case 'complete':
      return ordersCompleteData.value
    case 'materials':
      return materialsData.value
    default:
      return []
  }
})

const filteredData = computed(() => {
  let filtered = currentData.value

  // Filtros para órdenes
  if (activeTab.value === 'complete') {
    if (folioFilter.value) {
      filtered = filtered.filter(item => 
        item.Folio_Pisa.toLowerCase().includes(folioFilter.value.toLowerCase())
      )
    }
    if (telefonoFilter.value) {
      filtered = filtered.filter(item => 
        item.Telefono.includes(telefonoFilter.value)
      )
    }
    if (contratistaFilter.value) {
      filtered = filtered.filter(item => 
        item.Contratista === contratistaFilter.value
      )
    }
    if (copeFilter.value) {
      filtered = filtered.filter(item => 
        item.COPE === copeFilter.value
      )
    }
  }

  // Filtros para materiales
  if (activeTab.value === 'materials') {
    if (serieFilter.value) {
      filtered = filtered.filter(item => 
        item.Num_Serie_S.toLowerCase().includes(serieFilter.value.toLowerCase())
      )
    }
    if (localidadFilter.value) {
      filtered = filtered.filter(item => 
        item.Localidad_Material_S === localidadFilter.value
      )
    }
    if (ubicacionFilter.value) {
      filtered = filtered.filter(item => 
        item.Ubicacion_Material === ubicacionFilter.value
      )
    }
  }

  // Filtros de fecha (aplicar a todas las vistas de tabla)
  if (dateFrom.value) {
    filtered = filtered.filter(item => new Date(item.date.split('/').reverse().join('-')) >= new Date(dateFrom.value))
  }
  if (dateTo.value) {
    filtered = filtered.filter(item => new Date(item.date.split('/').reverse().join('-')) <= new Date(dateTo.value))
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredData.value.slice(start, end)
})

const startRecord = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endRecord = computed(() => Math.min(currentPage.value * itemsPerPage, filteredData.value.length))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const getCurrentTabName = () => {
  const tab = tabs.find(t => t.id === activeTab.value)
  return tab ? tab.name : ''
}

const getStatusClass = (status) => {
  switch (status) {
    case 'completa':
      return 'bg-green-100 text-green-800'
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800'
    case 'proceso':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

//  Nuevos métodos para clases de prioridad y stock
const getPriorityClass = (priority) => {
  switch (priority) {
    case 'alta':
      return 'bg-red-100 text-red-800'
    case 'media':
      return 'bg-yellow-100 text-yellow-800'
    case 'baja':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStockClass = (stock) => {
  switch (stock) {
    case 'disponible':
      return 'bg-green-100 text-green-800'
    case 'bajo':
      return 'bg-yellow-100 text-yellow-800'
    case 'agotado':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const viewMap = (item) => {
  alert(`Ver mapa para registro ${item.id}`)
}

const viewPhotos = (item) => {
  alert(`Ver fotos para registro ${item.id}`)
}

const editRecord = (item) => {
  alert(`Editar registro ${item.id}`)
}

const exportToExcel = () => {
  alert(`Exportando ${getCurrentTabName()} a Excel...`)
}

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

//  Función para limpiar filtros al cambiar de vista
const resetFilters = () => {
  // Resetear filtros de órdenes
  folioFilter.value = ''
  telefonoFilter.value = ''
  contratistaFilter.value = ''
  copeFilter.value = ''
  
  // Resetear filtros de materiales
  serieFilter.value = ''
  localidadFilter.value = ''
  ubicacionFilter.value = ''
  
  // Resetear filtros comunes
  dateFrom.value = ''
  dateTo.value = ''
  currentPage.value = 1
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showUserMenu.value = false
  }
}

// Lifecycle
onMounted(() => {
  ordersCompleteData.value = generateOrdersData(true)
  materialsData.value = generateMaterialsData()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

//  Watch para resetear filtros al cambiar de vista
// Watch for tab changes to reset filters and pagination
watch(activeTab, () => {
  resetFilters()
})
</script>