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
              <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Cerrar Sesión
              </button>
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
      <div v-else-if="activeTab === 'complete' || activeTab === 'materials'" class="space-y-6">
        <div class="flex justify-between items-center">
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
                <label class="block text-sm font-medium text-gray-700 mb-1">Búsqueda General</label>
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Buscar en cualquier campo..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
                <input 
                  v-model="dateFrom"
                  type="date"
                  :max="dateTo.value || currentDate"
                  :min="minDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                <span class="text-xs text-gray-500 mt-1 block">
                  Máximo 2 años atrás
                </span>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
                <input 
                  v-model="dateTo"
                  type="date"
                  :max="currentDate"
                  :min="dateFrom.value || minDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                <span class="text-xs text-gray-500 mt-1 block">
                  Máximo fecha actual
                </span>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select 
                  v-model="statusFilter"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los estados</option>
                  <option value="COMPLETADA">Completada</option>
                  <option value="INCOMPLETA">Incompleta</option>
                  <option value="OBJETADA">Objetada</option>
                  <option value="EN_PROCESO">En Proceso</option>
                  <option value="REAGENDAR">Reagendar</option>
                  <option value="VACIO">Vacío</option>
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
            </template>
          </div>
        </div>

        <!--  Tabla con columnas específicas según la vista -->
        <!-- Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div v-if="isLoading" class="flex items-center justify-center p-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-gray-600">Cargando datos...</span>
          </div>
          <div v-else-if="error" class="p-4 text-red-600 bg-red-50 text-center">
            {{ error }}
          </div>
          <div v-else>
            <!-- Tabla con scroll -->
            <div class="overflow-x-auto">
              <table class="min-w-full border-collapse table-fixed">
              <thead class="bg-gray-50">
                <tr class="divide-x divide-gray-200">                  
                  <!-- Columnas para Órdenes -->
                  <template v-if="activeTab === 'complete'">
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-r border-gray-200">Folio Pisa</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ONT</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Expediente</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contratista</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Técnico</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COPE</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">División</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distrito</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tecnología</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Tarea</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Instalación</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terminal</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puerto</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paso</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordenadas</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coord. Terminal</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
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
                <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-gray-50 divide-x divide-gray-200">                  
                  <!-- Datos para Órdenes -->
                  <template v-if="activeTab === 'complete'">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-l border-r border-gray-200">{{ item.Folio_Pisa }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Telefono }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Ont }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.NExpediente }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.nombre_completo_cliente }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Direccion_Cliente }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.nombre_completo_contratista }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.nombre_completo_tecnico }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.COPE }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.area }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Division }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Distrito }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Tecnologia }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Tipo_Tarea }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Tipo_Instalacion }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Terminal }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Puerto }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Step_Registro }}/5</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.Latitud }}, {{ item.Longitud }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.Latitud_Terminal }}, {{ item.Longitud_Terminal }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.Fecha_Coordiapp }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusClass(item.Step_Registro === 5 ? 'COMPLETADA' : 'INCOMPLETA')" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ item.Step_Registro === 5 ? 'COMPLETADA' : 'INCOMPLETA' }}
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
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Método para cerrar sesión
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// State
const activeTab = ref('dashboard')
const showUserMenu = ref(false)
const isLoading = ref(false)
const error = ref(null)

// Filtros que hacen petición a la API
const dateFrom = ref('')
const dateTo = ref('')
const statusFilter = ref('')

// Filtro local de búsqueda
const searchQuery = ref('')

// Fechas límite
const currentDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const minDate = computed(() => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 2)
  return date.toISOString().split('T')[0]
})

// Watch para validar fechas
watch(dateFrom, (newValue) => {
  if (newValue && dateTo.value && newValue > dateTo.value) {
    dateFrom.value = dateTo.value
  }
})

watch(dateTo, (newValue) => {
  if (newValue && dateFrom.value && newValue < dateFrom.value) {
    dateTo.value = dateFrom.value
  }
})
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

// Función para obtener datos de la API
const fetchOrdersData = async () => {
  if (activeTab.value !== 'complete') return
  
  isLoading.value = true
  error.value = null
  
  try {
    const params = {
      page: currentPage.value,
      per_page: itemsPerPage,
    }
    
    // Agregar filtros API
    if (dateFrom.value && dateTo.value) {
      // Añadir hora 00:00:00 a la fecha inicial
      params.fecha_inicio = `${dateFrom.value} 00:00:00`
      // Añadir hora 23:59:59 a la fecha final
      params.fecha_fin = `${dateTo.value} 23:59:59`
    }
    if (statusFilter.value) params.estatus_orden = statusFilter.value
    
    const response = await apiClient.get('/coordiapp-todas-division', { params })
    ordersCompleteData.value = response.data.data
    
    // Actualizar paginación con los valores del servidor
    totalPages.value = response.data.last_page
    totalItems.value = response.data.total
    
  } catch (err) {
    console.error('Error fetching orders:', err)
    error.value = 'Error al cargar los datos. Por favor, intente nuevamente.'
  } finally {
    isLoading.value = false
  }
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
  // Asegurarse de que currentData.value es un array
  const dataArray = Array.isArray(currentData.value) ? currentData.value : []
  
  // Si no hay datos o no estamos en la pestaña completa, retornar array vacío
  if (!dataArray.length || activeTab.value !== 'complete') return []
  
  // Si no hay término de búsqueda, retornar todos los datos
  if (!searchQuery.value) return dataArray

  const search = searchQuery.value.toLowerCase()
  
  // Filtrar por todos los campos
  return dataArray.filter(item => {
    // Convertir todos los valores del objeto a string para búsqueda
    return Object.values(item).some(value => {
      // Convertir el valor a string si no es null o undefined
      if (value !== null && value !== undefined) {
        return String(value).toLowerCase().includes(search)
      }
      return false
    })
  })
})

const totalItems = ref(0)
const totalPages = ref(1)

const paginatedData = computed(() => {
  if (activeTab.value === 'complete') {
    // Si hay término de búsqueda, usamos los datos filtrados
    if (searchQuery.value) {
      return filteredData.value
    }
    // Si no hay búsqueda, usamos los datos directamente de la API
    return currentData.value
  }
  return []
})

const startRecord = computed(() => ((currentPage.value - 1) * itemsPerPage) + 1)
const endRecord = computed(() => Math.min(currentPage.value * itemsPerPage, totalItems.value))

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

// Methods
const getCurrentTabName = () => {
  const tab = tabs.find(t => t.id === activeTab.value)
  return tab ? tab.name : ''
}

const getStatusClass = (status) => {
  switch (status) {
    case 'COMPLETADA':
      return 'bg-green-100 text-green-800'
    case 'INCOMPLETA':
      return 'bg-yellow-100 text-yellow-800'
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

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await fetchOrdersData()
  }
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    await fetchOrdersData()
  }
}

const goToPage = async (page) => {
  currentPage.value = page
  await fetchOrdersData()
}

// Función para limpiar filtros al cambiar de vista
const resetFilters = async () => {
  // Resetear todos los filtros
  searchQuery.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  statusFilter.value = ''
  
  // Resetear paginación
  currentPage.value = 1
  if (activeTab.value === 'complete') {
    await fetchOrdersData()
  }
  
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
  if (activeTab.value === 'complete') {
    fetchOrdersData()
  }
  materialsData.value = generateMaterialsData()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watch para resetear filtros al cambiar de vista y cargar datos
watch(activeTab, () => {
  resetFilters()
})

// Watch para el filtro de estado
watch(statusFilter, () => {
  if (activeTab.value === 'complete') {
    currentPage.value = 1
    fetchOrdersData()
  }
}, { debounce: 300 })

// Watch para las fechas
watch([dateFrom, dateTo], ([newDateFrom, newDateTo]) => {
  if (activeTab.value === 'complete' && newDateFrom && newDateTo) {
    currentPage.value = 1
    fetchOrdersData()
  }
}, { debounce: 300 })

// Watch para el término de búsqueda
watch(searchQuery, (newValue) => {
  if (activeTab.value === 'complete') {
    if (!newValue) {
      // Si el campo de búsqueda está vacío, volvemos a cargar los datos del servidor
      fetchOrdersData()
    }
    currentPage.value = 1
  }
}, { debounce: 300 })
</script>