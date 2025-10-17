<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
    <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative border border-gray-200 overflow-y-auto max-h-[90vh]">
  <button @click="$emit('close')" class="close-button absolute top-4 right-4">
      <font-awesome-icon icon="times" />
    </button>
      <h2 class="text-2xl font-bold mb-6 text-blue-600 text-center">CheckList Recepción</h2>
      <form @submit.prevent="">
        <div v-if="currentStep === 1">
          <!-- SECCIÓN 1: RECEPCIÓN DE LLAVES -->
          <div class="mb-8 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border-l-4 border-primary-500">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center mr-3">
                <font-awesome-icon icon="key" class="w-4 h-4" />
              </div>
              <h3 class="text-xl font-bold text-primary-700">Recepción de Llaves</h3>
            </div>
            
            <div class="space-y-4">
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">¿Recibió el vehículo con llaves?</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="true" v-model="uiControls.llavesRecibidas" 
                           class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500" />
                    <span class="text-gray-700 font-medium">Sí</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="false" v-model="uiControls.llavesRecibidas" 
                           class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500" />
                    <span class="text-gray-700 font-medium">No</span>
                  </label>
                </div>
                <div v-if="uiControls.llavesRecibidas === 'true'" class="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <label class="block mb-2 font-semibold text-green-800">Cantidad de Llaves</label>
                  <select v-model="formData.cantidadLlaves" class="input w-full max-w-xs border-green-300 focus:border-green-500">
                    <option value="" disabled>Selecciona cantidad</option>
                    <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- SECCIÓN 2: DOCUMENTOS -->
          <div class="mb-8 p-6 bg-gradient-to-r from-secondary-50 to-purple-50 rounded-xl border-l-4 border-secondary-500">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-secondary-500 text-white rounded-full flex items-center justify-center mr-3">
                <font-awesome-icon icon="file-alt" class="w-4 h-4" />
              </div>
              <h3 class="text-xl font-bold text-secondary-700">Documentos</h3>
            </div>
            
            <div class="space-y-6">
              <!-- Póliza de Seguro -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">¿Cuenta con póliza de seguro?</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="true" v-model="uiControls.polizaSeguro" 
                           class="w-4 h-4 text-secondary-600 border-gray-300 focus:ring-secondary-500" />
                    <span class="text-gray-700 font-medium">Sí</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="false" v-model="uiControls.polizaSeguro" 
                           class="w-4 h-4 text-secondary-600 border-gray-300 focus:ring-secondary-500" />
                    <span class="text-gray-700 font-medium">No</span>
                  </label>
                </div>
                <div v-if="uiControls.polizaSeguro === 'true'" class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p class="text-sm text-blue-800 font-medium mb-3">Por favor, sube una foto de la evidencia</p>
                  <FileUploadPreview
                    id="polizaSeguroArchivo"
                    accept=".pdf, .jpeg, .jpg, .png"
                    :preloadedFile="checklistData.polizaSeguro"
                    @file-selected="(file) => handleFileChange('polizaSeguroArchivo', file)"
                  />
                </div>
              </div>

              <!-- Tarjeta de Circulación -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">¿Cuenta con tarjeta de circulación?</h4>
                <div class="flex gap-6">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="true" v-model="uiControls.tarjetaCirculacion" 
                           class="w-4 h-4 text-secondary-600 border-gray-300 focus:ring-secondary-500" />
                    <span class="text-gray-700 font-medium">Sí</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="false" v-model="uiControls.tarjetaCirculacion" 
                           class="w-4 h-4 text-secondary-600 border-gray-300 focus:ring-secondary-500" />
                    <span class="text-gray-700 font-medium">No</span>
                  </label>
                </div>
              </div>

              <!-- Otro documento -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">¿Cuenta con otro documento?</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="true" v-model="uiControls.otroDocumento" 
                           class="w-4 h-4 text-secondary-600 border-gray-300 focus:ring-secondary-500" />
                    <span class="text-gray-700 font-medium">Sí</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="false" v-model="uiControls.otroDocumento" 
                           class="w-4 h-4 text-secondary-600 border-gray-300 focus:ring-secondary-500" />
                    <span class="text-gray-700 font-medium">No</span>
                  </label>
                </div>
                <div v-if="uiControls.otroDocumento === 'true'" class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p class="text-sm text-blue-800 font-medium mb-3">Por favor, sube una foto de la evidencia</p>
                  <FileUploadPreview
                    id="otroDocumentoArchivo"
                    accept=".pdf, .csv, .jpeg, .jpg, .png"
                    :preloadedFile="checklistData.otroDocumento"
                    @file-selected="(file) => handleFileChange('otroDocumentoArchivo', file)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- SECCIÓN 3: ACCESORIOS/HERRAMIENTA -->
          <div class="mb-6 p-6 bg-gradient-to-r from-accent-blue/10 to-indigo-50 rounded-xl border-l-4 border-accent-blue">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-accent-blue text-white rounded-full flex items-center justify-center mr-3">
                <font-awesome-icon icon="wrench" class="w-4 h-4" />
              </div>
              <h3 class="text-xl font-bold text-accent-blue">Accesorios/Herramienta</h3>
            </div>
            
            <div class="space-y-4">
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">¿Cuenta con llave birlo?</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="true" v-model="uiControls.accesoriosHerramienta" 
                           class="w-4 h-4 text-accent-blue border-gray-300 focus:ring-blue-500" />
                    <span class="text-gray-700 font-medium">Sí</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="false" v-model="uiControls.accesoriosHerramienta" 
                           class="w-4 h-4 text-accent-blue border-gray-300 focus:ring-blue-500" />
                    <span class="text-gray-700 font-medium">No</span>
                  </label>
                </div>
                <div v-if="uiControls.accesoriosHerramienta === 'true'" class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p class="text-sm text-blue-800 font-medium mb-3">Por favor, sube una foto de la evidencia</p>
                  <FileUploadPreview
                    id="accesoriosHerramientaArchivo"
                    accept=".pdf, .jpeg, .jpg, .png"
                    :preloadedFile="checklistData.accesoriosHerramienta"
                    @file-selected="(file) => handleFileChange('accesoriosHerramientaArchivo', file)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="currentStep === 2">
          <!-- SECCIÓN 1: CLUSTER -->
          <div class="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-l-4 border-emerald-500">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center mr-3">
                <font-awesome-icon icon="tachometer-alt" class="w-4 h-4" />
              </div>
              <h3 class="text-xl font-bold text-emerald-700">Cluster</h3>
            </div>
            
            <div class="space-y-4">
              <!-- Gato -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">¿Cuenta con gato?</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="true" v-model="uiControls.gato" 
                           class="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500" />
                    <span class="text-gray-700 font-medium">Sí</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="false" v-model="uiControls.gato" 
                           class="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500" />
                    <span class="text-gray-700 font-medium">No</span>
                  </label>
                </div>
                <div v-if="uiControls.gato === 'true'" class="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p class="text-sm text-green-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="gatoArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.gatoArchivo"
                    @file-selected="(file) => handleFileChange('gatoArchivo', file)"
                  />
                </div>
              </div>

              <!-- Odómetro (KM) -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Odómetro (KM)</h4>
                <p class="text-sm text-gray-600 mb-3">Por favor, sube una foto del odómetro</p>
                <FileUploadPreview
                  id="odometroArchivo"
                  accept=".jpeg, .jpg, .png"
                  :preloadedFile="checklistData.odometroArchivo"
                  @file-selected="(file) => handleFileChange('odometroArchivo', file)"
                />
              </div>

              <!-- Combustible -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Nivel de Combustible</h4>
                <div class="grid grid-cols-3 gap-3">
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="vacio" v-model="formData.nivelCombustible" 
                           class="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500" />
                    <span class="text-gray-700 font-medium mt-2">Vacío</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-red-500 h-2.5 rounded-full" style="width: 0%"></div>
                    </div>
                  </label>
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="1/4" v-model="formData.nivelCombustible" 
                           class="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500" />
                    <span class="text-gray-700 font-medium mt-2">1/4</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-yellow-500 h-2.5 rounded-full" style="width: 25%"></div>
                    </div>
                  </label>
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="1/2" v-model="formData.nivelCombustible" 
                           class="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500" />
                    <span class="text-gray-700 font-medium mt-2">1/2</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-yellow-600 h-2.5 rounded-full" style="width: 50%"></div>
                    </div>
                  </label>
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="3/4" v-model="formData.nivelCombustible" 
                           class="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500" />
                    <span class="text-gray-700 font-medium mt-2">3/4</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-green-500 h-2.5 rounded-full" style="width: 75%"></div>
                    </div>
                  </label>
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="lleno" v-model="formData.nivelCombustible" 
                           class="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500" />
                    <span class="text-gray-700 font-medium mt-2">Lleno</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-green-600 h-2.5 rounded-full" style="width: 100%"></div>
                    </div>
                  </label>
                </div>
                
                <!-- Evidencia nivel combustible (siempre visible) -->
                <div class="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p class="text-sm text-green-800 font-medium mb-3">Por favor, sube una foto de evidencia del nivel de combustible</p>
                  <FileUploadPreview
                    id="combustibleArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.combustibleArchivo"
                    @file-selected="(file) => handleFileChange('combustibleArchivo', file)"
                  />
                </div>
              </div>

              <!-- Testigos -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Testigos (seleccione los que están encendidos)</h4>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <label class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="checkbox" value="ABS" v-model="formData.testigosEncendidos" 
                           class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                           @change="handleTestigoChange('ABS')" />
                    <span class="text-gray-700 font-medium">ABS</span>
                  </label>
                  <label class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="checkbox" value="CHECK_ENGINE" v-model="formData.testigosEncendidos" 
                           class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                           @change="handleTestigoChange('CHECK_ENGINE')" />
                    <span class="text-gray-700 font-medium">Check Engine</span>
                  </label>
                  <label class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="checkbox" value="TPMS" v-model="formData.testigosEncendidos" 
                           class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                           @change="handleTestigoChange('TPMS')" />
                    <span class="text-gray-700 font-medium">TPMS</span>
                  </label>
                  <label class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="checkbox" value="AIRBAG" v-model="formData.testigosEncendidos" 
                           class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                           @change="handleTestigoChange('AIRBAG')" />
                    <span class="text-gray-700 font-medium">Airbag</span>
                  </label>
                  <label class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="checkbox" value="BATERIA" v-model="formData.testigosEncendidos" 
                           class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                           @change="handleTestigoChange('BATERIA')" />
                    <span class="text-gray-700 font-medium">Batería</span>
                  </label>
                  <label class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="checkbox" value="ACEITE" v-model="formData.testigosEncendidos" 
                           class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                           @change="handleTestigoChange('ACEITE')" />
                    <span class="text-gray-700 font-medium">Aceite</span>
                  </label>
                  <label class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="checkbox" value="NINGUNO" v-model="formData.testigosEncendidos" 
                           class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                           @change="handleTestigoChange('NINGUNO')" />
                    <span class="text-gray-700 font-medium">Ninguno</span>
                  </label>
                </div>
                
                <!-- Evidencia de testigos encendidos -->
                <div v-if="hayTestigosSeleccionados && !isNingunoSeleccionado" class="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p class="text-sm text-green-800 font-medium mb-3">Por favor, sube una foto de evidencia de los testigos encendidos</p>
                  <FileUploadPreview
                    id="testigosEncendidosArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.testigosEncendidosArchivo"
                    @file-selected="(file) => handleFileChange('testigosEncendidosArchivo', file)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- SECCIÓN 2: TABLERO -->
          <div class="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-l-4 border-indigo-500">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-3">
                <font-awesome-icon icon="microchip" class="w-4 h-4" />
              </div>
              <h3 class="text-xl font-bold text-indigo-700">Tablero</h3>
            </div>
            
            <div class="space-y-4">
              <!-- Guantera -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Estado de Guantera</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="buen_estado" v-model="formData.estadoGuantera" 
                           class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                    <span class="text-gray-700 font-medium">Buen Estado</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="mal_estado" v-model="formData.estadoGuantera" 
                           class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                    <span class="text-gray-700 font-medium">Mal Estado</span>
                  </label>
                </div>
              </div>

              <!-- Estéreo -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">¿Cuenta con estéreo?</h4>
                <div class="flex gap-6">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="true" v-model="uiControls.estereo" 
                           class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                    <span class="text-gray-700 font-medium">Sí</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="false" v-model="uiControls.estereo" 
                           class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                    <span class="text-gray-700 font-medium">No</span>
                  </label>
                </div>
              </div>

              <!-- Bocina -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">¿Cuenta con bocinas?</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="true" v-model="uiControls.bocinas" 
                           class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                    <span class="text-gray-700 font-medium">Sí</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="false" v-model="uiControls.bocinas" 
                           class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                    <span class="text-gray-700 font-medium">No</span>
                  </label>
                </div>
                <div v-if="uiControls.bocinas === 'true'" class="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <label class="block mb-2 font-semibold text-purple-800">Cantidad de Bocinas</label>
                  <select v-model="formData.cantidadBocinas" class="input w-full max-w-xs border-purple-300 focus:border-purple-500">
                    <option value="" disabled>Selecciona cantidad</option>
                    <option v-for="n in 10" :key="`bocina-${n}`" :value="n">{{ n }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- SECCIÓN 3: PUERTAS -->
          <div class="mb-8 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-l-4 border-amber-500">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center mr-3">
                <font-awesome-icon icon="door-closed" class="w-4 h-4" />
              </div>
              <h3 class="text-xl font-bold text-amber-700">Puertas</h3>
            </div>
            
            <div class="space-y-4">
              <!-- Manijas -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">¿Las manijas funcionan correctamente?</h4>
                <div class="flex gap-6">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="true" v-model="formData.manijas" 
                           class="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500" />
                    <span class="text-gray-700 font-medium">Sí</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="false" v-model="formData.manijas" 
                           class="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500" />
                    <span class="text-gray-700 font-medium">No</span>
                  </label>
                </div>
              </div>

              <!-- Seguros -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Estado de los Seguros</h4>
                <div class="flex gap-6">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="buen_estado" v-model="formData.estadoSeguros" 
                           class="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500" />
                    <span class="text-gray-700 font-medium">Buen Estado</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="mal_estado" v-model="formData.estadoSeguros" 
                           class="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500" />
                    <span class="text-gray-700 font-medium">Mal Estado</span>
                  </label>
                </div>
              </div>

              <!-- Cristal Ventanas -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Estado de Cristales/Ventanas</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="buen_estado" v-model="formData.estadoCristales" 
                           class="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500" />
                    <span class="text-gray-700 font-medium">Buen Estado</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="mal_estado" v-model="formData.estadoCristales" 
                           class="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500" />
                    <span class="text-gray-700 font-medium">Mal Estado</span>
                  </label>
                </div>
                <div v-if="formData.estadoCristales === 'mal_estado'" class="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p class="text-sm text-yellow-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="cristalesArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.cristalesArchivo"
                    @file-selected="(file) => handleFileChange('cristalesArchivo', file)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- SECCIÓN 4: ASIENTOS -->
          <div class="mb-8 p-6 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border-l-4 border-rose-500">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center mr-3">
                <font-awesome-icon icon="chair" class="w-4 h-4" />
              </div>
              <h3 class="text-xl font-bold text-rose-700">Asientos</h3>
            </div>
            
            <div class="space-y-4">
              <!-- Vestiduras -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Estado de Vestiduras</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="buen_estado" v-model="formData.estadoVestiduras" 
                           class="w-4 h-4 text-rose-600 border-gray-300 focus:ring-rose-500" />
                    <span class="text-gray-700 font-medium">Buen Estado</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="mal_estado" v-model="formData.estadoVestiduras" 
                           class="w-4 h-4 text-rose-600 border-gray-300 focus:ring-rose-500" />
                    <span class="text-gray-700 font-medium">Mal Estado</span>
                  </label>
                </div>
                <div v-if="formData.estadoVestiduras === 'mal_estado'" class="mt-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <p class="text-sm text-pink-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="vestidurasArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.vestidurasArchivo"
                    @file-selected="(file) => handleFileChange('vestidurasArchivo', file)"
                  />
                </div>
              </div>

              <!-- Cabeceras -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Estado de Cabeceras</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="buen_estado" v-model="formData.estadoCabeceras" 
                           class="w-4 h-4 text-rose-600 border-gray-300 focus:ring-rose-500" />
                    <span class="text-gray-700 font-medium">Buen Estado</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="mal_estado" v-model="formData.estadoCabeceras" 
                           class="w-4 h-4 text-rose-600 border-gray-300 focus:ring-rose-500" />
                    <span class="text-gray-700 font-medium">Mal Estado</span>
                  </label>
                </div>
                <div v-if="formData.estadoCabeceras === 'mal_estado'" class="mt-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <p class="text-sm text-pink-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="cabecerasArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.cabecerasArchivo"
                    @file-selected="(file) => handleFileChange('cabecerasArchivo', file)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- SECCIÓN 5: CINTURONES DE SEGURIDAD -->
          <div class="mb-6 p-6 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-xl border-l-4 border-sky-500">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center mr-3">
                <font-awesome-icon icon="life-ring" class="w-4 h-4" />
              </div>
              <h3 class="text-xl font-bold text-sky-700">Cinturones de Seguridad</h3>
            </div>
            
            <div class="space-y-4">
              <!-- Funcionalidad -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Estado de Funcionalidad</h4>
                <div class="flex gap-6">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="funciona" v-model="formData.funcionalidadCinturones" 
                           class="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500" />
                    <span class="text-gray-700 font-medium">Funciona</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="no_funciona" v-model="formData.funcionalidadCinturones" 
                           class="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500" />
                    <span class="text-gray-700 font-medium">No Funciona</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="currentStep === 3">
          <!-- SECCIÓN 1: CARROCERÍA -->
          <div class="mb-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-l-4 border-orange-500">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-3">
                <font-awesome-icon icon="car" class="w-4 h-4" />
              </div>
              <h3 class="text-xl font-bold text-orange-700">Carrocería</h3>
            </div>
            
            <div class="space-y-4">
              <!-- Lado Derecho -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Lado Derecho</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="buen_estado" v-model="formData.carroceriaLadoDerecho" 
                           class="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                    <span class="text-gray-700 font-medium">Buen Estado</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="mal_estado" v-model="formData.carroceriaLadoDerecho" 
                           class="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                    <span class="text-gray-700 font-medium">Mal Estado</span>
                  </label>
                </div>
                <div v-if="formData.carroceriaLadoDerecho === 'mal_estado'" class="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p class="text-sm text-orange-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="carroceriaLadoDerechoArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.carroceriaLadoDerechoArchivo"
                    @file-selected="(file) => handleFileChange('carroceriaLadoDerechoArchivo', file)"
                  />
                </div>
              </div>

              <!-- Lado Izquierdo -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Lado Izquierdo</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="buen_estado" v-model="formData.carroceriaLadoIzquierdo" 
                           class="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                    <span class="text-gray-700 font-medium">Buen Estado</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="mal_estado" v-model="formData.carroceriaLadoIzquierdo" 
                           class="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                    <span class="text-gray-700 font-medium">Mal Estado</span>
                  </label>
                </div>
                <div v-if="formData.carroceriaLadoIzquierdo === 'mal_estado'" class="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p class="text-sm text-orange-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="carroceriaLadoIzquierdoArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.carroceriaLadoIzquierdoArchivo"
                    @file-selected="(file) => handleFileChange('carroceriaLadoIzquierdoArchivo', file)"
                  />
                </div>
              </div>

              <!-- Lado Trasero -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Lado Trasero</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="buen_estado" v-model="formData.carroceriaLadoTrasero" 
                           class="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                    <span class="text-gray-700 font-medium">Buen Estado</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="mal_estado" v-model="formData.carroceriaLadoTrasero" 
                           class="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                    <span class="text-gray-700 font-medium">Mal Estado</span>
                  </label>
                </div>
                <div v-if="formData.carroceriaLadoTrasero === 'mal_estado'" class="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p class="text-sm text-orange-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="carroceriaLadoTraseroArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.carroceriaLadoTraseroArchivo"
                    @file-selected="(file) => handleFileChange('carroceriaLadoTraseroArchivo', file)"
                  />
                </div>
              </div>

              <!-- Lado Frontal -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Lado Frontal</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="buen_estado" v-model="formData.carroceriaLadoFrontal" 
                           class="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                    <span class="text-gray-700 font-medium">Buen Estado</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="mal_estado" v-model="formData.carroceriaLadoFrontal" 
                           class="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500" />
                    <span class="text-gray-700 font-medium">Mal Estado</span>
                  </label>
                </div>
                <div v-if="formData.carroceriaLadoFrontal === 'mal_estado'" class="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p class="text-sm text-orange-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="carroceriaLadoFrontalArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.carroceriaLadoFrontalArchivo"
                    @file-selected="(file) => handleFileChange('carroceriaLadoFrontalArchivo', file)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- SECCIÓN 2: NEUMÁTICOS -->
          <div class="mb-8 p-6 bg-gradient-to-r from-gray-50 to-zinc-100 rounded-xl border-l-4 border-gray-500">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center mr-3">
                <font-awesome-icon icon="circle" class="w-4 h-4" />
              </div>
              <h3 class="text-xl font-bold text-gray-700">Neumáticos</h3>
            </div>
            
            <div class="space-y-4">
              <!-- Lado Piloto -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Lado Piloto</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="buen_estado" v-model="formData.neumaticosLadoPiloto" 
                           class="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500" />
                    <span class="text-gray-700 font-medium">Buen Estado</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="mal_estado" v-model="formData.neumaticosLadoPiloto" 
                           class="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500" />
                    <span class="text-gray-700 font-medium">Mal Estado</span>
                  </label>
                </div>
                <div v-if="formData.neumaticosLadoPiloto === 'mal_estado'" class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p class="text-sm text-gray-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="neumaticosLadoPilotoArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.neumaticosLadoPilotoArchivo"
                    @file-selected="(file) => handleFileChange('neumaticosLadoPilotoArchivo', file)"
                  />
                </div>
              </div>

              <!-- Lado Atrás Piloto -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Lado Atrás Piloto</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="buen_estado" v-model="formData.neumaticosLadoAtrasPiloto" 
                           class="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500" />
                    <span class="text-gray-700 font-medium">Buen Estado</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="mal_estado" v-model="formData.neumaticosLadoAtrasPiloto" 
                           class="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500" />
                    <span class="text-gray-700 font-medium">Mal Estado</span>
                  </label>
                </div>
                <div v-if="formData.neumaticosLadoAtrasPiloto === 'mal_estado'" class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p class="text-sm text-gray-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="neumaticosLadoAtrasPilotoArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.neumaticosLadoAtrasPilotoArchivo"
                    @file-selected="(file) => handleFileChange('neumaticosLadoAtrasPilotoArchivo', file)"
                  />
                </div>
              </div>

              <!-- Lado Copiloto -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Lado Copiloto</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="buen_estado" v-model="formData.neumaticosLadoCopiloto" 
                           class="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500" />
                    <span class="text-gray-700 font-medium">Buen Estado</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="mal_estado" v-model="formData.neumaticosLadoCopiloto" 
                           class="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500" />
                    <span class="text-gray-700 font-medium">Mal Estado</span>
                  </label>
                </div>
                <div v-if="formData.neumaticosLadoCopiloto === 'mal_estado'" class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p class="text-sm text-gray-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="neumaticosLadoCopilotoArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.neumaticosLadoCopilotoArchivo"
                    @file-selected="(file) => handleFileChange('neumaticosLadoCopilotoArchivo', file)"
                  />
                </div>
              </div>

              <!-- Lado Atrás Copiloto -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Lado Atrás Copiloto</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="buen_estado" v-model="formData.neumaticosLadoAtrasCopiloto" 
                           class="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500" />
                    <span class="text-gray-700 font-medium">Buen Estado</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="mal_estado" v-model="formData.neumaticosLadoAtrasCopiloto" 
                           class="w-4 h-4 text-gray-600 border-gray-300 focus:ring-gray-500" />
                    <span class="text-gray-700 font-medium">Mal Estado</span>
                  </label>
                </div>
                <div v-if="formData.neumaticosLadoAtrasCopiloto === 'mal_estado'" class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p class="text-sm text-gray-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="neumaticosLadoAtrasCopilotoArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.neumaticosLadoAtrasCopilotoArchivo"
                    @file-selected="(file) => handleFileChange('neumaticosLadoAtrasCopilotoArchivo', file)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- SECCIÓN 3: CRISTALES -->
          <div class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-l-4 border-blue-500">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                <font-awesome-icon icon="window-maximize" class="w-4 h-4" />
              </div>
              <h3 class="text-xl font-bold text-blue-700">Cristales</h3>
            </div>
            
            <div class="space-y-4">
              <!-- Parabrisas -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Parabrisas</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="buen_estado" v-model="formData.cristalesParabrisas" 
                           class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <span class="text-gray-700 font-medium">Buen Estado</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="mal_estado" v-model="formData.cristalesParabrisas" 
                           class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <span class="text-gray-700 font-medium">Mal Estado</span>
                  </label>
                </div>
                <div v-if="formData.cristalesParabrisas === 'mal_estado'" class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p class="text-sm text-blue-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="cristalesParabrisasArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.cristalesParabrisasArchivo"
                    @file-selected="(file) => handleFileChange('cristalesParabrisasArchivo', file)"
                  />
                </div>
              </div>

              <!-- Medallón Trasero -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Medallón Trasero</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="buen_estado" v-model="formData.cristalesMedallonTrasero" 
                           class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <span class="text-gray-700 font-medium">Buen Estado</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="mal_estado" v-model="formData.cristalesMedallonTrasero" 
                           class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <span class="text-gray-700 font-medium">Mal Estado</span>
                  </label>
                </div>
                <div v-if="formData.cristalesMedallonTrasero === 'mal_estado'" class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p class="text-sm text-blue-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="cristalesMedallonTraseroArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.cristalesMedallonTraseroArchivo"
                    @file-selected="(file) => handleFileChange('cristalesMedallonTraseroArchivo', file)"
                  />
                </div>
              </div>

              <!-- Plumas Limpiadoras -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Plumas Limpiadoras</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="buen_estado" v-model="formData.cristalesLimpiadores" 
                           class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <span class="text-gray-700 font-medium">Buen Estado</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="mal_estado" v-model="formData.cristalesLimpiadores" 
                           class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <span class="text-gray-700 font-medium">Mal Estado</span>
                  </label>
                </div>
                <div v-if="formData.cristalesLimpiadores === 'mal_estado'" class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p class="text-sm text-blue-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="cristalesLimpiadoresArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.cristalesLimpiadoresArchivo"
                    @file-selected="(file) => handleFileChange('cristalesLimpiadoresArchivo', file)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- SECCIÓN 4: MOTOR -->
          <div class="mb-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border-l-4 border-red-500">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center mr-3">
                <font-awesome-icon icon="car-side" class="w-4 h-4" />
              </div>
              <h3 class="text-xl font-bold text-red-700">Motor</h3>
            </div>
            
            <div class="space-y-4">
              <!-- Tapones -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Tapones</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="buen_estado" v-model="formData.motorTapones" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium">Buen Estado</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="mal_estado" v-model="formData.motorTapones" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium">Mal Estado</span>
                  </label>
                </div>
                <div v-if="formData.motorTapones === 'mal_estado'" class="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <p class="text-sm text-red-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="motorTaponesArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.motorTaponesArchivo"
                    @file-selected="(file) => handleFileChange('motorTaponesArchivo', file)"
                  />
                </div>
              </div>

              <!-- Batería -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Batería</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="buen_estado" v-model="formData.motorBateria" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium">Buen Estado</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="mal_estado" v-model="formData.motorBateria" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium">Mal Estado</span>
                  </label>
                </div>
                <div v-if="formData.motorBateria === 'mal_estado'" class="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <p class="text-sm text-red-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="motorBateriaArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.motorBateriaArchivo"
                    @file-selected="(file) => handleFileChange('motorBateriaArchivo', file)"
                  />
                </div>
              </div>

              <!-- Nivel Aceite -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Nivel de Aceite</h4>
                <div class="grid grid-cols-3 gap-3">
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="vacio" v-model="formData.motorNivelAceite" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium mt-2">Vacío</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-red-500 h-2.5 rounded-full" style="width: 0%"></div>
                    </div>
                  </label>
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="1/4" v-model="formData.motorNivelAceite" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium mt-2">1/4</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-yellow-500 h-2.5 rounded-full" style="width: 25%"></div>
                    </div>
                  </label>
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="1/2" v-model="formData.motorNivelAceite" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium mt-2">1/2</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-yellow-600 h-2.5 rounded-full" style="width: 50%"></div>
                    </div>
                  </label>
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="3/4" v-model="formData.motorNivelAceite" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium mt-2">3/4</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-green-500 h-2.5 rounded-full" style="width: 75%"></div>
                    </div>
                  </label>
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="lleno" v-model="formData.motorNivelAceite" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium mt-2">Lleno</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-green-600 h-2.5 rounded-full" style="width: 100%"></div>
                    </div>
                  </label>
                </div>
                <div class="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <p class="text-sm text-red-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="motorNivelAceiteArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.motorNivelAceiteArchivo"
                    @file-selected="(file) => handleFileChange('motorNivelAceiteArchivo', file)"
                  />
                </div>
              </div>

              <!-- Nivel Líquido Frenos -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Nivel Líquido Frenos</h4>
                <div class="grid grid-cols-3 gap-3">
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="vacio" v-model="formData.motorNivelLiquidoFrenos" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium mt-2">Vacío</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-red-500 h-2.5 rounded-full" style="width: 0%"></div>
                    </div>
                  </label>
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="1/4" v-model="formData.motorNivelLiquidoFrenos" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium mt-2">1/4</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-yellow-500 h-2.5 rounded-full" style="width: 25%"></div>
                    </div>
                  </label>
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="1/2" v-model="formData.motorNivelLiquidoFrenos" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium mt-2">1/2</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-yellow-600 h-2.5 rounded-full" style="width: 50%"></div>
                    </div>
                  </label>
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="3/4" v-model="formData.motorNivelLiquidoFrenos" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium mt-2">3/4</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-green-500 h-2.5 rounded-full" style="width: 75%"></div>
                    </div>
                  </label>
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="lleno" v-model="formData.motorNivelLiquidoFrenos" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium mt-2">Lleno</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-green-600 h-2.5 rounded-full" style="width: 100%"></div>
                    </div>
                  </label>
                </div>
                <div class="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <p class="text-sm text-red-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="motorNivelLiquidoFrenosArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.motorNivelLiquidoFrenosArchivo"
                    @file-selected="(file) => handleFileChange('motorNivelLiquidoFrenosArchivo', file)"
                  />
                </div>
              </div>

              <!-- Nivel Anticongelante -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Nivel Anticongelante</h4>
                <div class="grid grid-cols-3 gap-3">
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="vacio" v-model="formData.motorNivelAnticongelante" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium mt-2">Vacío</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-red-500 h-2.5 rounded-full" style="width: 0%"></div>
                    </div>
                  </label>
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="1/4" v-model="formData.motorNivelAnticongelante" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium mt-2">1/4</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-yellow-500 h-2.5 rounded-full" style="width: 25%"></div>
                    </div>
                  </label>
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="1/2" v-model="formData.motorNivelAnticongelante" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium mt-2">1/2</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-yellow-600 h-2.5 rounded-full" style="width: 50%"></div>
                    </div>
                  </label>
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="3/4" v-model="formData.motorNivelAnticongelante" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium mt-2">3/4</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-green-500 h-2.5 rounded-full" style="width: 75%"></div>
                    </div>
                  </label>
                  <label class="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200">
                    <input type="radio" value="lleno" v-model="formData.motorNivelAnticongelante" 
                           class="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500" />
                    <span class="text-gray-700 font-medium mt-2">Lleno</span>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div class="bg-green-600 h-2.5 rounded-full" style="width: 100%"></div>
                    </div>
                  </label>
                </div>
                <div class="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <p class="text-sm text-red-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="motorNivelAnticongelanteArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.motorNivelAnticongelanteArchivo"
                    @file-selected="(file) => handleFileChange('motorNivelAnticongelanteArchivo', file)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- SECCIÓN 5: DEPÓSITO GASOLINA -->
          <div class="mb-8 p-6 bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-xl border-l-4 border-purple-500">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mr-3">
                <font-awesome-icon icon="gas-pump" class="w-4 h-4" />
              </div>
              <h3 class="text-xl font-bold text-purple-700">Depósito Gasolina</h3>
            </div>
            
            <div class="space-y-4">
              <!-- Depósito Gasolina - Puerta -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Puerta de Acceso</h4>
                <div class="flex gap-6">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="true" v-model="formData.depositoPuerta" 
                           class="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500" />
                    <span class="text-gray-700 font-medium">Sí</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="false" v-model="formData.depositoPuerta" 
                           class="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500" />
                    <span class="text-gray-700 font-medium">No</span>
                  </label>
                </div>
              </div>

              <!-- Depósito Gasolina - Tapón -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Tapón</h4>
                <div class="flex gap-6">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="true" v-model="formData.depositoTapon" 
                           class="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500" />
                    <span class="text-gray-700 font-medium">Sí</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="false" v-model="formData.depositoTapon" 
                           class="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500" />
                    <span class="text-gray-700 font-medium">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- SECCIÓN 6: ESCAPE -->
          <div class="mb-6 p-6 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border-l-4 border-teal-500">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center mr-3">
                <font-awesome-icon icon="smog" class="w-4 h-4" />
              </div>
              <h3 class="text-xl font-bold text-teal-700">Escape</h3>
            </div>
            
            <div class="space-y-4">
              <!-- Escape - Silenciador -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Silenciador</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="true" v-model="formData.escapeSilenciador" 
                           class="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500" />
                    <span class="text-gray-700 font-medium">Sí</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="false" v-model="formData.escapeSilenciador" 
                           class="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500" />
                    <span class="text-gray-700 font-medium">No</span>
                  </label>
                </div>
                <div v-if="formData.escapeSilenciador === 'true'" class="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <p class="text-sm text-teal-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="escapeSilenciadorArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.escapeSilenciadorArchivo"
                    @file-selected="(file) => handleFileChange('escapeSilenciadorArchivo', file)"
                  />
                </div>
              </div>

              <!-- Escape - Catalizador -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Catalizador</h4>
                <div class="flex gap-6 mb-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="true" v-model="formData.escapeCatalizador" 
                           class="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500" />
                    <span class="text-gray-700 font-medium">Sí</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="false" v-model="formData.escapeCatalizador" 
                           class="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500" />
                    <span class="text-gray-700 font-medium">No</span>
                  </label>
                </div>
                <div v-if="formData.escapeCatalizador === 'true'" class="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <p class="text-sm text-teal-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <FileUploadPreview
                    id="escapeCatalizadorArchivo"
                    accept=".jpeg, .jpg, .png"
                    :preloadedFile="checklistData.escapeCatalizadorArchivo"
                    @file-selected="(file) => handleFileChange('escapeCatalizadorArchivo', file)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-between mt-8">
          <BaseButton 
            type="submit" 
            variant="secondary" 
            :disabled="currentStep === 1"
            :onClick="handlePrevStep"
            custom-loading-text="Procesando"
          >
            <div class="flex items-center gap-2">
              <font-awesome-icon icon="chevron-left" class="w-4 h-4" />
              Guardar y regresar
            </div>
          </BaseButton>
          <BaseButton 
            v-if="currentStep < 3" 
            type="submit" 
            variant="primary"
            :onClick="handleNextStep"
            custom-loading-text="Procesando"
          >
            <div class="flex items-center gap-2">
              Guardar y continuar
              <font-awesome-icon icon="chevron-right" class="w-4 h-4" />
            </div>
          </BaseButton>
          <BaseButton 
            v-if="currentStep === 3" 
            type="submit" 
            variant="success"
            :disabled="!isStepValid"
            :onClick="handleFinalSubmit"
            custom-loading-text="Procesando"
            :min-delay="2500"
          >
            Guardar
          </BaseButton>
        </div>
        <div class="mt-6 flex justify-center gap-2">
          <span v-for="step in 3" :key="step" :class="[ 'h-3 w-3 rounded-full', currentStep === step ? 'bg-blue-500' : 'bg-gray-300' ]"></span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import FileUploadPreview from '../global/FileUploadPreview.vue';
import BaseButton from '../global/BaseButton.vue';
import { useSubmitButton } from '../../composables/useSubmitButton.js';
import { useToastStore } from '../../stores/toast.js';

export default {
  name: 'CheckListFormModal',
  components: {
    FileUploadPreview,
    BaseButton
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    checklistData: {
      type: Object,
      default: () => ({})
    }
  },
  setup() {
    const { executeNavigation, executeSubmit } = useSubmitButton();
    const toastStore = useToastStore();
    return {
      executeNavigation,
      executeSubmit,
      toastStore
    };
  },
  data() {
    return {
      currentStep: 1,
      // Controles de UI para los radio buttons
      uiControls: {
        // Step 1
        llavesRecibidas: '',
        polizaSeguro: '',
        tarjetaCirculacion: '',
        otroDocumento: '',
        accesoriosHerramienta: '',
        // Step 2 - Cluster
        gato: '',
        // Step 2 - Tablero
        estereo: '',
        bocinas: ''
      },
      // Datos reales que se enviarán en el JSON
      formData: {
        // --- STEP 1 ---
        // Llaves
        cantidadLlaves: null,
        // Poliza Seguro
        polizaSeguroArchivo: null,
        // Tarjeta Circulación
        tarjetaCirculacion: null,
        // Otro documento
        otroDocumentoArchivo: null,
        // Accesorios/Herramienta
        accesoriosHerramientaArchivo: null,
        
        // --- STEP 2 ---
        // Cluster
        gatoArchivo: null,
        odometroArchivo: null,
        nivelCombustible: null,
        combustibleArchivo: null,
        testigosEncendidos: [],
        testigosEncendidosArchivo: null,
        
        // Tablero
        estadoGuantera: null,
        estereo: null,
        cantidadBocinas: null,
        
        // Puertas
        manijas: null,
        estadoSeguros: null,
        estadoCristales: null,
        cristalesArchivo: null,
        
        // Asientos
        estadoVestiduras: null,
        vestidurasArchivo: null,
        estadoCabeceras: null,
        cabecerasArchivo: null,
        
        // Cinturones
        funcionalidadCinturones: null,
        
        // --- STEP 3 ---
        // Carrocería
        carroceriaLadoDerecho: null,
        carroceriaLadoDerechoArchivo: null,
        carroceriaLadoIzquierdo: null,
        carroceriaLadoIzquierdoArchivo: null,
        carroceriaLadoTrasero: null,
        carroceriaLadoTraseroArchivo: null,
        carroceriaLadoFrontal: null,
        carroceriaLadoFrontalArchivo: null,
        
        // Neumáticos
        neumaticosLadoPiloto: null,
        neumaticosLadoPilotoArchivo: null,
        neumaticosLadoAtrasPiloto: null,
        neumaticosLadoAtrasPilotoArchivo: null,
        neumaticosLadoCopiloto: null,
        neumaticosLadoCopilotoArchivo: null,
        neumaticosLadoAtrasCopiloto: null,
        neumaticosLadoAtrasCopilotoArchivo: null,
        
        // Cristales
        cristalesParabrisas: null,
        cristalesParabrisasArchivo: null,
        cristalesMedallonTrasero: null,
        cristalesMedallonTraseroArchivo: null,
        cristalesLimpiadores: null,
        cristalesLimpiadoresArchivo: null,
        
        // Motor
        motorTapones: null,
        motorTaponesArchivo: null,
        motorBateria: null,
        motorBateriaArchivo: null,
        motorNivelAceite: null,
        motorNivelAceiteArchivo: null,
        motorNivelLiquidoFrenos: null,
        motorNivelLiquidoFrenosArchivo: null,
        motorNivelAnticongelante: null,
        motorNivelAnticongelanteArchivo: null,
        
        // Depósito Gasolina y Escape
        depositoPuerta: null,
        depositoTapon: null,
        escapeSilenciador: null,
        escapeSilenciadorArchivo: null,
        escapeCatalizador: null,
        escapeCatalizadorArchivo: null,
      }
    };
  },
  created() {
    this.loadChecklistData();
  },
  watch: {
    checklistData: {
      handler() {
        this.loadChecklistData();
      },
      deep: true
    }
  },
  computed: {
    // Indica si hay al menos un testigo seleccionado que no sea "NINGUNO"
    hayTestigosSeleccionados() {
      return this.formData.testigosEncendidos.filter(t => t !== 'NINGUNO').length > 0;
    },
    
    // Indica si "NINGUNO" está seleccionado
    isNingunoSeleccionado() {
      return this.formData.testigosEncendidos.includes('NINGUNO');
    },
    
    isStepValid() {
      if (this.currentStep === 1) {
        // Validar que todos los campos del paso 1 estén completos
        const step1Controls = [
          this.uiControls.llavesRecibidas,
          this.uiControls.polizaSeguro,
          this.uiControls.tarjetaCirculacion,
          this.uiControls.otroDocumento,
          this.uiControls.accesoriosHerramienta
        ];

        // Validar campos condicionales
        if (this.uiControls.llavesRecibidas === 'true' && !this.formData.cantidadLlaves) {
          return false;
        }
        if (this.uiControls.polizaSeguro === 'true' && !this.formData.polizaSeguroArchivo) {
          return false;
        }
        if (this.uiControls.otroDocumento === 'true' && !this.formData.otroDocumentoArchivo) {
          return false;
        }
        if (this.uiControls.accesoriosHerramienta === 'true' && !this.formData.accesoriosHerramientaArchivo) {
          return false;
        }

        return step1Controls.every(control => control !== '');
      }

      if (this.currentStep === 2) {
        // Validar que todos los campos requeridos del paso 2 estén completos
        
        // Cluster - campos requeridos
        const clusterControls = [
          this.uiControls.gato,
          !!this.formData.odometroArchivo,
          !!this.formData.nivelCombustible,
          !!this.formData.combustibleArchivo,
          !!this.formData.testigosEncendidos.length
        ];
        
        // Cluster - campos condicionales
        if (this.uiControls.gato === 'true' && !this.formData.gatoArchivo) {
          return false;
        }
        
        // Si hay testigos seleccionados diferentes a NINGUNO, verificar que tenga archivo
        if (this.hayTestigosSeleccionados && !this.isNingunoSeleccionado && !this.formData.testigosEncendidosArchivo) {
          return false;
        }
        
        // Tablero - campos requeridos
        const tableroControls = [
          !!this.formData.estadoGuantera,
          this.uiControls.estereo,
          this.uiControls.bocinas
        ];
        
        // Tablero - campos condicionales
        if (this.uiControls.bocinas === 'true' && !this.formData.cantidadBocinas) {
          return false;
        }
        
        // Puertas - campos requeridos
        const puertasControls = [
          !!this.formData.manijas,
          !!this.formData.estadoSeguros,
          !!this.formData.estadoCristales
        ];
        
        // Puertas - campos condicionales
        if (this.formData.estadoCristales === 'mal_estado' && !this.formData.cristalesArchivo) {
          return false;
        }
        
        // Asientos - campos requeridos
        const asientosControls = [
          !!this.formData.estadoVestiduras,
          !!this.formData.estadoCabeceras
        ];
        
        // Asientos - campos condicionales
        if (this.formData.estadoVestiduras === 'mal_estado' && !this.formData.vestidurasArchivo) {
          return false;
        }
        if (this.formData.estadoCabeceras === 'mal_estado' && !this.formData.cabecerasArchivo) {
          return false;
        }
        
        // Cinturones - campos requeridos
        const cinturones = [
          !!this.formData.funcionalidadCinturones
        ];
        
        // Verificar que todos los campos requeridos tengan valor
        return clusterControls.every(control => !!control) &&
               tableroControls.every(control => !!control) &&
               puertasControls.every(control => !!control) &&
               asientosControls.every(control => !!control) &&
               cinturones.every(control => !!control);
      }

      if (this.currentStep === 3) {
        // Validar campos de Carrocería
        const carroceriaControls = [
          !!this.formData.carroceriaLadoDerecho,
          !!this.formData.carroceriaLadoIzquierdo,
          !!this.formData.carroceriaLadoTrasero,
          !!this.formData.carroceriaLadoFrontal
        ];
        
        // Validar campos condicionales de Carrocería
        if (this.formData.carroceriaLadoDerecho === 'mal_estado' && !this.formData.carroceriaLadoDerechoArchivo) {
          return false;
        }
        if (this.formData.carroceriaLadoIzquierdo === 'mal_estado' && !this.formData.carroceriaLadoIzquierdoArchivo) {
          return false;
        }
        if (this.formData.carroceriaLadoTrasero === 'mal_estado' && !this.formData.carroceriaLadoTraseroArchivo) {
          return false;
        }
        if (this.formData.carroceriaLadoFrontal === 'mal_estado' && !this.formData.carroceriaLadoFrontalArchivo) {
          return false;
        }
        
        // Validar campos de Neumáticos
        const neumaticosControls = [
          !!this.formData.neumaticosLadoPiloto,
          !!this.formData.neumaticosLadoAtrasPiloto,
          !!this.formData.neumaticosLadoCopiloto,
          !!this.formData.neumaticosLadoAtrasCopiloto
        ];
        
        // Validar campos condicionales de Neumáticos
        if (this.formData.neumaticosLadoPiloto === 'mal_estado' && !this.formData.neumaticosLadoPilotoArchivo) {
          return false;
        }
        if (this.formData.neumaticosLadoAtrasPiloto === 'mal_estado' && !this.formData.neumaticosLadoAtrasPilotoArchivo) {
          return false;
        }
        if (this.formData.neumaticosLadoCopiloto === 'mal_estado' && !this.formData.neumaticosLadoCopilotoArchivo) {
          return false;
        }
        if (this.formData.neumaticosLadoAtrasCopiloto === 'mal_estado' && !this.formData.neumaticosLadoAtrasCopilotoArchivo) {
          return false;
        }
        
        // Validar campos de Cristales
        const cristalesControls = [
          !!this.formData.cristalesParabrisas,
          !!this.formData.cristalesMedallonTrasero,
          !!this.formData.cristalesLimpiadores
        ];
        
        // Validar campos condicionales de Cristales
        if (this.formData.cristalesParabrisas === 'mal_estado' && !this.formData.cristalesParabrisasArchivo) {
          return false;
        }
        if (this.formData.cristalesMedallonTrasero === 'mal_estado' && !this.formData.cristalesMedallonTraseroArchivo) {
          return false;
        }
        if (this.formData.cristalesLimpiadores === 'mal_estado' && !this.formData.cristalesLimpiadoresArchivo) {
          return false;
        }
        
        // Validar campos de Motor
        const motorControls = [
          !!this.formData.motorTapones,
          !!this.formData.motorBateria,
          !!this.formData.motorNivelAceite,
          !!this.formData.motorNivelLiquidoFrenos,
          !!this.formData.motorNivelAnticongelante
        ];
        
        // Validar campos condicionales de Motor
        if (this.formData.motorTapones === 'mal_estado' && !this.formData.motorTaponesArchivo) {
          return false;
        }
        if (this.formData.motorBateria === 'mal_estado' && !this.formData.motorBateriaArchivo) {
          return false;
        }
        // Los archivos de nivel son obligatorios independientemente del valor
        if (!this.formData.motorNivelAceiteArchivo) {
          return false;
        }
        if (!this.formData.motorNivelLiquidoFrenosArchivo) {
          return false;
        }
        if (!this.formData.motorNivelAnticongelanteArchivo) {
          return false;
        }
        
        // Validar campos de Depósito y Escape
        const depositoEscapeControls = [
          !!this.formData.depositoPuerta,
          !!this.formData.depositoTapon,
          !!this.formData.escapeSilenciador,
          !!this.formData.escapeCatalizador
        ];
        
        // Validar campos condicionales de Depósito y Escape
        if (this.formData.escapeSilenciador === 'true' && !this.formData.escapeSilenciadorArchivo) {
          return false;
        }
        if (this.formData.escapeCatalizador === 'true' && !this.formData.escapeCatalizadorArchivo) {
          return false;
        }
        
        // Verificar que los campos requeridos tengan valor y que el comentario no esté vacío
        return carroceriaControls.every(control => !!control) &&
               neumaticosControls.every(control => !!control) &&
               cristalesControls.every(control => !!control) &&
               motorControls.every(control => !!control) &&
               depositoEscapeControls.every(control => !!control) &&
               (this.formData.comentario && this.formData.comentario.trim() !== '');
      }

      return false;
    },
      // Crear un JSON final que solo incluya los valores relevantes según los controles
    finalFormData() {
      const result = {
        // --- STEP 1 ---
        // Inicializar todas las claves con null por defecto
        cantidadLlaves: null,
        polizaSeguro: null,
        tarjetaCirculacion: null,
        otroDocumento: null,
        accesoriosHerramienta: null,
        
        // --- STEP 2 ---
        // Cluster
        gatoArchivo: null,
        odometroArchivo: null,
        nivelCombustible: this.formData.nivelCombustible,
        combustibleArchivo: null,
        testigosEncendidos: this.formData.testigosEncendidos,
        testigosEncendidosArchivo: null,
        
        // Tablero
        estadoGuantera: this.formData.estadoGuantera,
        estereo: this.uiControls.estereo === 'true' ? true : (this.uiControls.estereo === 'false' ? false : null),
        cantidadBocinas: null,
        
        // Puertas
        manijas: this.formData.manijas === 'true' ? true : (this.formData.manijas === 'false' ? false : null),
        estadoSeguros: this.formData.estadoSeguros,
        estadoCristales: this.formData.estadoCristales,
        cristalesArchivo: null,
        
        // Asientos
        estadoVestiduras: this.formData.estadoVestiduras,
        vestidurasArchivo: null,
        estadoCabeceras: this.formData.estadoCabeceras,
        cabecerasArchivo: null,
        
        // Cinturones
        funcionalidadCinturones: this.formData.funcionalidadCinturones,
        
        // --- STEP 3 ---
        // Carrocería
        carroceriaLadoDerecho: this.formData.carroceriaLadoDerecho,
        carroceriaLadoDerechoArchivo: null,
        carroceriaLadoIzquierdo: this.formData.carroceriaLadoIzquierdo,
        carroceriaLadoIzquierdoArchivo: null,
        carroceriaLadoTrasero: this.formData.carroceriaLadoTrasero,
        carroceriaLadoTraseroArchivo: null,
        carroceriaLadoFrontal: this.formData.carroceriaLadoFrontal,
        carroceriaLadoFrontalArchivo: null,
        
        // Neumáticos
        neumaticosLadoPiloto: this.formData.neumaticosLadoPiloto,
        neumaticosLadoPilotoArchivo: null,
        neumaticosLadoAtrasPiloto: this.formData.neumaticosLadoAtrasPiloto,
        neumaticosLadoAtrasPilotoArchivo: null,
        neumaticosLadoCopiloto: this.formData.neumaticosLadoCopiloto,
        neumaticosLadoCopilotoArchivo: null,
        neumaticosLadoAtrasCopiloto: this.formData.neumaticosLadoAtrasCopiloto,
        neumaticosLadoAtrasCopilotoArchivo: null,
        
        // Cristales
        cristalesParabrisas: this.formData.cristalesParabrisas,
        cristalesParabrisasArchivo: null,
        cristalesMedallonTrasero: this.formData.cristalesMedallonTrasero,
        cristalesMedallonTraseroArchivo: null,
        cristalesLimpiadores: this.formData.cristalesLimpiadores,
        cristalesLimpiadoresArchivo: null,
        
        // Motor
        motorTapones: this.formData.motorTapones,
        motorTaponesArchivo: null,
        motorBateria: this.formData.motorBateria,
        motorBateriaArchivo: null,
        motorNivelAceite: this.formData.motorNivelAceite,
        motorNivelAceiteArchivo: null,
        motorNivelLiquidoFrenos: this.formData.motorNivelLiquidoFrenos,
        motorNivelLiquidoFrenosArchivo: null,
        motorNivelAnticongelante: this.formData.motorNivelAnticongelante,
        motorNivelAnticongelanteArchivo: null,
        
        // Depósito Gasolina y Escape
        depositoPuerta: this.formData.depositoPuerta === 'true' ? true : (this.formData.depositoPuerta === 'false' ? false : null),
        depositoTapon: this.formData.depositoTapon === 'true' ? true : (this.formData.depositoTapon === 'false' ? false : null),
        escapeSilenciador: this.formData.escapeSilenciador === 'true' ? true : (this.formData.escapeSilenciador === 'false' ? false : null),
        escapeSilenciadorArchivo: null,
        escapeCatalizador: this.formData.escapeCatalizador === 'true' ? true : (this.formData.escapeCatalizador === 'false' ? false : null),
        escapeCatalizadorArchivo: null,
      };      // --- STEP 1 ---
      // Solo asignar cantidadLlaves si llavesRecibidas es true y hay valor
      if (this.uiControls.llavesRecibidas === 'true' && this.formData.cantidadLlaves) {
        result.cantidadLlaves = this.formData.cantidadLlaves;
      }
      
      // Solo asignar polizaSeguro si polizaSeguro es true y hay archivo
      if (this.uiControls.polizaSeguro === 'true' && this.formData.polizaSeguroArchivo) {
        result.polizaSeguro = this.formData.polizaSeguroArchivo.name;
      }
      
      // Solo asignar tarjetaCirculacion si es true
      if (this.uiControls.tarjetaCirculacion === 'true') {
        result.tarjetaCirculacion = true;
      }
      
      // Solo asignar otroDocumento si otroDocumento es true y hay archivo
      if (this.uiControls.otroDocumento === 'true' && this.formData.otroDocumentoArchivo) {
        result.otroDocumento = this.formData.otroDocumentoArchivo.name;
      }
      
      // Solo asignar accesoriosHerramienta si accesoriosHerramienta es true y hay archivo
      if (this.uiControls.accesoriosHerramienta === 'true' && this.formData.accesoriosHerramientaArchivo) {
        result.accesoriosHerramienta = this.formData.accesoriosHerramientaArchivo.name;
      }
      
      // --- STEP 2 ---
      // Cluster
      if (this.uiControls.gato === 'true' && this.formData.gatoArchivo) {
        result.gatoArchivo = this.formData.gatoArchivo.name;
      }
      
      if (this.formData.odometroArchivo) {
        result.odometroArchivo = this.formData.odometroArchivo.name;
      }
      
      if (this.formData.combustibleArchivo) {
        result.combustibleArchivo = this.formData.combustibleArchivo.name;
      }
      
      if (this.hayTestigosSeleccionados && !this.isNingunoSeleccionado && this.formData.testigosEncendidosArchivo) {
        result.testigosEncendidosArchivo = this.formData.testigosEncendidosArchivo.name;
      }
      
      // Tablero
      if (this.uiControls.bocinas === 'true' && this.formData.cantidadBocinas) {
        result.cantidadBocinas = this.formData.cantidadBocinas;
      }
      
      // Puertas
      if (this.formData.estadoCristales === 'mal_estado' && this.formData.cristalesArchivo) {
        result.cristalesArchivo = this.formData.cristalesArchivo.name;
      }
      
      // Asientos
      if (this.formData.estadoVestiduras === 'mal_estado' && this.formData.vestidurasArchivo) {
        result.vestidurasArchivo = this.formData.vestidurasArchivo.name;
      }
      
      if (this.formData.estadoCabeceras === 'mal_estado' && this.formData.cabecerasArchivo) {
        result.cabecerasArchivo = this.formData.cabecerasArchivo.name;
      }
      
      // --- STEP 3 ---
      // Carrocería
      if (this.formData.carroceriaLadoDerecho === 'mal_estado' && this.formData.carroceriaLadoDerechoArchivo) {
        result.carroceriaLadoDerechoArchivo = this.formData.carroceriaLadoDerechoArchivo.name;
      }
      
      if (this.formData.carroceriaLadoIzquierdo === 'mal_estado' && this.formData.carroceriaLadoIzquierdoArchivo) {
        result.carroceriaLadoIzquierdoArchivo = this.formData.carroceriaLadoIzquierdoArchivo.name;
      }
      
      if (this.formData.carroceriaLadoTrasero === 'mal_estado' && this.formData.carroceriaLadoTraseroArchivo) {
        result.carroceriaLadoTraseroArchivo = this.formData.carroceriaLadoTraseroArchivo.name;
      }
      
      if (this.formData.carroceriaLadoFrontal === 'mal_estado' && this.formData.carroceriaLadoFrontalArchivo) {
        result.carroceriaLadoFrontalArchivo = this.formData.carroceriaLadoFrontalArchivo.name;
      }
      
      // Neumáticos
      if (this.formData.neumaticosLadoPiloto === 'mal_estado' && this.formData.neumaticosLadoPilotoArchivo) {
        result.neumaticosLadoPilotoArchivo = this.formData.neumaticosLadoPilotoArchivo.name;
      }
      
      if (this.formData.neumaticosLadoAtrasPiloto === 'mal_estado' && this.formData.neumaticosLadoAtrasPilotoArchivo) {
        result.neumaticosLadoAtrasPilotoArchivo = this.formData.neumaticosLadoAtrasPilotoArchivo.name;
      }
      
      if (this.formData.neumaticosLadoCopiloto === 'mal_estado' && this.formData.neumaticosLadoCopilotoArchivo) {
        result.neumaticosLadoCopilotoArchivo = this.formData.neumaticosLadoCopilotoArchivo.name;
      }
      
      if (this.formData.neumaticosLadoAtrasCopiloto === 'mal_estado' && this.formData.neumaticosLadoAtrasCopilotoArchivo) {
        result.neumaticosLadoAtrasCopilotoArchivo = this.formData.neumaticosLadoAtrasCopilotoArchivo.name;
      }
      
      // Cristales
      if (this.formData.cristalesParabrisas === 'mal_estado' && this.formData.cristalesParabrisasArchivo) {
        result.cristalesParabrisasArchivo = this.formData.cristalesParabrisasArchivo.name;
      }
      
      if (this.formData.cristalesMedallonTrasero === 'mal_estado' && this.formData.cristalesMedallonTraseroArchivo) {
        result.cristalesMedallonTraseroArchivo = this.formData.cristalesMedallonTraseroArchivo.name;
      }
      
      if (this.formData.cristalesLimpiadores === 'mal_estado' && this.formData.cristalesLimpiadoresArchivo) {
        result.cristalesLimpiadoresArchivo = this.formData.cristalesLimpiadoresArchivo.name;
      }
      
      // Motor
      if (this.formData.motorTapones === 'mal_estado' && this.formData.motorTaponesArchivo) {
        result.motorTaponesArchivo = this.formData.motorTaponesArchivo.name;
      }
      
      if (this.formData.motorBateria === 'mal_estado' && this.formData.motorBateriaArchivo) {
        result.motorBateriaArchivo = this.formData.motorBateriaArchivo.name;
      }
      
      // Los niveles siempre requieren evidencia independientemente del valor seleccionado
      if (this.formData.motorNivelAceiteArchivo) {
        result.motorNivelAceiteArchivo = this.formData.motorNivelAceiteArchivo.name;
      }
      
      if (this.formData.motorNivelLiquidoFrenosArchivo) {
        result.motorNivelLiquidoFrenosArchivo = this.formData.motorNivelLiquidoFrenosArchivo.name;
      }
      
      if (this.formData.motorNivelAnticongelanteArchivo) {
        result.motorNivelAnticongelanteArchivo = this.formData.motorNivelAnticongelanteArchivo.name;
      }
      
      // Depósito Gasolina y Escape
      if (this.formData.escapeSilenciador === 'true' && this.formData.escapeSilenciadorArchivo) {
        result.escapeSilenciadorArchivo = this.formData.escapeSilenciadorArchivo.name;
      }
      
      if (this.formData.escapeCatalizador === 'true' && this.formData.escapeCatalizadorArchivo) {
        result.escapeCatalizadorArchivo = this.formData.escapeCatalizadorArchivo.name;
      }
      
      return result;
    }
  },
  watch: {
    uiControls: {
      deep: true,
      handler(newVal) {
        // Asegurar que los valores dependientes sean null cuando el radio button es false
        if (newVal.llavesRecibidas === 'false') {
          this.formData.cantidadLlaves = null;
        }
        if (newVal.polizaSeguro === 'false') {
          this.formData.polizaSeguroArchivo = null;
        }
        if (newVal.otroDocumento === 'false') {
          this.formData.otroDocumentoArchivo = null;
        }
        if (newVal.accesoriosHerramienta === 'false') {
          this.formData.accesoriosHerramientaArchivo = null;
        }
        
        // Log cuando cambian los controles
        console.log('UI Controls changed:', newVal);
        console.log('Datos actualizados por UI Controls:', JSON.stringify(this.finalFormData, null, 2));
      }
    },
    
    // Watch para toda la formData
    formData: {
      deep: true,
      handler(newVal) {
        console.log('FormData changed:', newVal);
        console.log('Datos actualizados por FormData:', JSON.stringify(this.finalFormData, null, 2));
      }
    }
  },
  methods: {
    loadChecklistData() {
      if (!this.checklistData || Object.keys(this.checklistData).length === 0) return;
      
      console.log('Cargando datos del checklist:', this.checklistData);
      
      // --- STEP 1 ---
      // Cargar datos del formulario (Step 1)
      this.formData.cantidadLlaves = this.checklistData.cantidadLlaves || null;
      
      // Configurar controles de UI basados en los datos (Step 1)
      this.uiControls.llavesRecibidas = this.checklistData.cantidadLlaves !== null ? 'true' : 'false';
      this.uiControls.polizaSeguro = this.checklistData.polizaSeguro ? 'true' : 'false';
      this.uiControls.tarjetaCirculacion = this.checklistData.tarjetaCirculacion !== null ? 'true' : 'false';
      this.uiControls.otroDocumento = this.checklistData.otroDocumento ? 'true' : 'false';
      this.uiControls.accesoriosHerramienta = this.checklistData.accesoriosHerramienta ? 'true' : 'false';
      
      // Configurar valores booleanos (Step 1)
      this.formData.tarjetaCirculacion = this.checklistData.tarjetaCirculacion;
      
      // Simular archivos (Step 1)
      if (this.checklistData.polizaSeguro) {
        this.formData.polizaSeguroArchivo = { name: this.checklistData.polizaSeguro };
      }
      if (this.checklistData.otroDocumento) {
        this.formData.otroDocumentoArchivo = { name: this.checklistData.otroDocumento };
      }
      if (this.checklistData.accesoriosHerramienta) {
        this.formData.accesoriosHerramientaArchivo = { name: this.checklistData.accesoriosHerramienta };
      }
      
      // --- STEP 2 ---
      // Cluster
      this.uiControls.gato = this.checklistData.gatoArchivo ? 'true' : 'false';
      if (this.checklistData.gatoArchivo) {
        this.formData.gatoArchivo = { name: this.checklistData.gatoArchivo };
      }
      if (this.checklistData.odometroArchivo) {
        this.formData.odometroArchivo = { name: this.checklistData.odometroArchivo };
      }
      this.formData.nivelCombustible = this.checklistData.nivelCombustible || null;
      if (this.checklistData.combustibleArchivo) {
        this.formData.combustibleArchivo = { name: this.checklistData.combustibleArchivo };
      }
      this.formData.testigosEncendidos = this.checklistData.testigosEncendidos || ['NINGUNO'];
      if (this.checklistData.testigosEncendidosArchivo) {
        this.formData.testigosEncendidosArchivo = { name: this.checklistData.testigosEncendidosArchivo };
      }
      
      // Tablero
      this.formData.estadoGuantera = this.checklistData.estadoGuantera || null;
      this.uiControls.estereo = this.checklistData.estereo !== null ? String(this.checklistData.estereo) : '';
      this.uiControls.bocinas = this.checklistData.cantidadBocinas !== null ? 'true' : 'false';
      this.formData.cantidadBocinas = this.checklistData.cantidadBocinas || null;
      
      // Puertas
      this.formData.manijas = this.checklistData.manijas || null;
      this.formData.estadoSeguros = this.checklistData.estadoSeguros || null;
      this.formData.estadoCristales = this.checklistData.estadoCristales || null;
      if (this.checklistData.cristalesArchivo) {
        this.formData.cristalesArchivo = { name: this.checklistData.cristalesArchivo };
      }
      
      // Asientos
      this.formData.estadoVestiduras = this.checklistData.estadoVestiduras || null;
      if (this.checklistData.vestidurasArchivo) {
        this.formData.vestidurasArchivo = { name: this.checklistData.vestidurasArchivo };
      }
      this.formData.estadoCabeceras = this.checklistData.estadoCabeceras || null;
      if (this.checklistData.cabecerasArchivo) {
        this.formData.cabecerasArchivo = { name: this.checklistData.cabecerasArchivo };
      }
      
      // Cinturones
      this.formData.funcionalidadCinturones = this.checklistData.funcionalidadCinturones || null;
      
      // --- STEP 3 ---
      // Carrocería
      this.formData.carroceriaLadoDerecho = this.checklistData.carroceriaLadoDerecho || null;
      if (this.checklistData.carroceriaLadoDerechoArchivo) {
        this.formData.carroceriaLadoDerechoArchivo = { name: this.checklistData.carroceriaLadoDerechoArchivo };
      }
      this.formData.carroceriaLadoIzquierdo = this.checklistData.carroceriaLadoIzquierdo || null;
      if (this.checklistData.carroceriaLadoIzquierdoArchivo) {
        this.formData.carroceriaLadoIzquierdoArchivo = { name: this.checklistData.carroceriaLadoIzquierdoArchivo };
      }
      this.formData.carroceriaLadoTrasero = this.checklistData.carroceriaLadoTrasero || null;
      if (this.checklistData.carroceriaLadoTraseroArchivo) {
        this.formData.carroceriaLadoTraseroArchivo = { name: this.checklistData.carroceriaLadoTraseroArchivo };
      }
      this.formData.carroceriaLadoFrontal = this.checklistData.carroceriaLadoFrontal || null;
      if (this.checklistData.carroceriaLadoFrontalArchivo) {
        this.formData.carroceriaLadoFrontalArchivo = { name: this.checklistData.carroceriaLadoFrontalArchivo };
      }
      
      // Neumáticos
      this.formData.neumaticosLadoPiloto = this.checklistData.neumaticosLadoPiloto || null;
      if (this.checklistData.neumaticosLadoPilotoArchivo) {
        this.formData.neumaticosLadoPilotoArchivo = { name: this.checklistData.neumaticosLadoPilotoArchivo };
      }
      this.formData.neumaticosLadoAtrasPiloto = this.checklistData.neumaticosLadoAtrasPiloto || null;
      if (this.checklistData.neumaticosLadoAtrasPilotoArchivo) {
        this.formData.neumaticosLadoAtrasPilotoArchivo = { name: this.checklistData.neumaticosLadoAtrasPilotoArchivo };
      }
      this.formData.neumaticosLadoCopiloto = this.checklistData.neumaticosLadoCopiloto || null;
      if (this.checklistData.neumaticosLadoCopilotoArchivo) {
        this.formData.neumaticosLadoCopilotoArchivo = { name: this.checklistData.neumaticosLadoCopilotoArchivo };
      }
      this.formData.neumaticosLadoAtrasCopiloto = this.checklistData.neumaticosLadoAtrasCopiloto || null;
      if (this.checklistData.neumaticosLadoAtrasCopilotoArchivo) {
        this.formData.neumaticosLadoAtrasCopilotoArchivo = { name: this.checklistData.neumaticosLadoAtrasCopilotoArchivo };
      }
      
      // Cristales
      this.formData.cristalesParabrisas = this.checklistData.cristalesParabrisas || null;
      if (this.checklistData.cristalesParabrisasArchivo) {
        this.formData.cristalesParabrisasArchivo = { name: this.checklistData.cristalesParabrisasArchivo };
      }
      this.formData.cristalesMedallonTrasero = this.checklistData.cristalesMedallonTrasero || null;
      if (this.checklistData.cristalesMedallonTraseroArchivo) {
        this.formData.cristalesMedallonTraseroArchivo = { name: this.checklistData.cristalesMedallonTraseroArchivo };
      }
      this.formData.cristalesLimpiadores = this.checklistData.cristalesLimpiadores || null;
      if (this.checklistData.cristalesLimpiadoresArchivo) {
        this.formData.cristalesLimpiadoresArchivo = { name: this.checklistData.cristalesLimpiadoresArchivo };
      }
      
      // Motor
      this.formData.motorTapones = this.checklistData.motorTapones || null;
      if (this.checklistData.motorTaponesArchivo) {
        this.formData.motorTaponesArchivo = { name: this.checklistData.motorTaponesArchivo };
      }
      this.formData.motorBateria = this.checklistData.motorBateria || null;
      if (this.checklistData.motorBateriaArchivo) {
        this.formData.motorBateriaArchivo = { name: this.checklistData.motorBateriaArchivo };
      }
      this.formData.motorNivelAceite = this.checklistData.motorNivelAceite || null;
      if (this.checklistData.motorNivelAceiteArchivo) {
        this.formData.motorNivelAceiteArchivo = { name: this.checklistData.motorNivelAceiteArchivo };
      }
      this.formData.motorNivelLiquidoFrenos = this.checklistData.motorNivelLiquidoFrenos || null;
      if (this.checklistData.motorNivelLiquidoFrenosArchivo) {
        this.formData.motorNivelLiquidoFrenosArchivo = { name: this.checklistData.motorNivelLiquidoFrenosArchivo };
      }
      this.formData.motorNivelAnticongelante = this.checklistData.motorNivelAnticongelante || null;
      if (this.checklistData.motorNivelAnticongelanteArchivo) {
        this.formData.motorNivelAnticongelanteArchivo = { name: this.checklistData.motorNivelAnticongelanteArchivo };
      }
      
      // Depósito Gasolina y Escape
      this.formData.depositoPuerta = this.checklistData.depositoPuerta !== null ? String(this.checklistData.depositoPuerta) : null;
      this.formData.depositoTapon = this.checklistData.depositoTapon !== null ? String(this.checklistData.depositoTapon) : null;
      this.formData.escapeSilenciador = this.checklistData.escapeSilenciador !== null ? String(this.checklistData.escapeSilenciador) : null;
      if (this.checklistData.escapeSilenciadorArchivo) {
        this.formData.escapeSilenciadorArchivo = { name: this.checklistData.escapeSilenciadorArchivo };
      }
      this.formData.escapeCatalizador = this.checklistData.escapeCatalizador !== null ? String(this.checklistData.escapeCatalizador) : null;
      if (this.checklistData.escapeCatalizadorArchivo) {
        this.formData.escapeCatalizadorArchivo = { name: this.checklistData.escapeCatalizadorArchivo };
      }
    },
    
    async handleNextStep() {
      try {
        // Simular guardado de datos del paso actual
        await this.saveCurrentStepData();
        
        // Avanzar al siguiente paso
        if (this.currentStep < 3) {
          this.currentStep++;
        }
        
        // Mostrar toast de éxito
        this.toastStore.addToast({
          message: 'Datos guardados correctamente',
          type: 'success',
          duration: 3000
        });
        
      } catch (error) {
        console.error('Error al guardar datos:', error);
        // Mostrar toast de error
        this.toastStore.addToast({
          message: 'Error al guardar los datos. Por favor, intente nuevamente.',
          type: 'error',
          duration: 5000
        });
      }
    },
    
    async handlePrevStep() {
      try {
        // Simular guardado de datos del paso actual
        await this.saveCurrentStepData();
        
        // Retroceder al paso anterior
        if (this.currentStep > 1) {
          this.currentStep--;
        }
        
        // Mostrar toast de éxito
        this.toastStore.addToast({
          message: 'Datos guardados correctamente',
          type: 'success',
          duration: 3000
        });
        
      } catch (error) {
        console.error('Error al guardar datos:', error);
        // Mostrar toast de error
        this.toastStore.addToast({
          message: 'Error al guardar los datos. Por favor, intente nuevamente.',
          type: 'error',
          duration: 5000
        });
      }
    },
    
    async handleFinalSubmit() {
      // Validación final
      if (!this.isStepValid) return;
      
      try {
        // Simular envío de datos al servidor
        await this.submitFormData();
        
        // Mostrar toast de éxito
        this.toastStore.addToast({
          message: 'Formulario enviado exitosamente',
          type: 'success',
          duration: 4000
        });
        
  // Cerrar modal después del envío exitoso
  this.$emit('close');
        
        console.log('Formulario enviado exitosamente');
      } catch (error) {
        console.error('Error al enviar formulario:', error);
        // Mostrar toast de error
        this.toastStore.addToast({
          message: 'Error al enviar el formulario. Por favor, intente nuevamente.',
          type: 'error',
          duration: 5000
        });
      }
    },
    
    async saveCurrentStepData() {
      // Simular guardado de datos del paso actual
      // En una aplicación real, aquí harías una llamada a tu API
      console.log(`Guardando datos del paso ${this.currentStep}...`);
      console.log('Datos actuales:', JSON.stringify(this.finalFormData, null, 2));
      
      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`Datos del paso ${this.currentStep} guardados correctamente`);
    },
    
    async submitFormData() {
      // Simular envío final de todos los datos
      console.log('Enviando formulario completo...');
      console.log('Datos finales:', JSON.stringify(this.finalFormData, null, 2));
      
      // Simular tiempo de procesamiento del servidor
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular posible error ocasional (3% de probabilidad)
      if (Math.random() < 0.03) {
        throw new Error('Error del servidor al procesar los datos');
      }
      
      // Aquí es donde harías la llamada real a tu API
      // const response = await api.submitChecklistForm(this.finalFormData);
      
      console.log('Formulario enviado correctamente al servidor');
    },
    
    nextStep() {
      // Método legacy mantenido por compatibilidad
      // pero ya no se usa directamente
      if (this.currentStep < 3) this.currentStep++;
    },
    
    handleFileChange(field, file) {
      console.log(`=== INICIO handleFileChange ===`);
      console.log(`Field: ${field}`);
      console.log(`File:`, file);
      console.log(`File name:`, file ? file.name : 'null');
      
      // En Vue 3 no necesitamos $set, la asignación directa es reactiva
      this.formData[field] = file;
      
      console.log(`FormData[${field}] después de asignación:`, this.formData[field]);
      console.log(`¿Archivo tiene name?:`, this.formData[field] ? this.formData[field].name : 'No tiene name');
      
      // Log del estado actual de UI Controls
      console.log('UI Controls actuales:', this.uiControls);
      
      // Calcular inmediatamente el finalFormData
      const currentFinalFormData = this.finalFormData;
      console.log('Final Form Data calculado inmediatamente:', JSON.stringify(currentFinalFormData, null, 2));
      
      // Forzar recálculo del computed en nextTick
      this.$nextTick(() => {
        console.log('Final Form Data en nextTick:', JSON.stringify(this.finalFormData, null, 2));
        console.log(`=== FIN handleFileChange ===`);
      });
    },
    
    // Método para manejar la exclusión mutua entre "NINGUNO" y los demás testigos
    handleTestigoChange(testigo) {
      // Si se seleccionó "NINGUNO", deseleccionar todos los demás
      if (testigo === 'NINGUNO' && this.formData.testigosEncendidos.includes('NINGUNO')) {
        this.formData.testigosEncendidos = ['NINGUNO'];
        console.log('Se seleccionó NINGUNO, se deseleccionaron los demás testigos');
      } 
      // Si se seleccionó otro testigo y "NINGUNO" estaba seleccionado, deseleccionar "NINGUNO"
      else if (testigo !== 'NINGUNO' && this.formData.testigosEncendidos.includes(testigo) && 
               this.formData.testigosEncendidos.includes('NINGUNO')) {
        const index = this.formData.testigosEncendidos.indexOf('NINGUNO');
        if (index !== -1) {
          this.formData.testigosEncendidos.splice(index, 1);
          console.log('Se deseleccionó NINGUNO porque se seleccionó otro testigo');
        }
      }
      
      // Si no hay testigos seleccionados, seleccionar automáticamente "NINGUNO"
      if (this.formData.testigosEncendidos.length === 0) {
        this.formData.testigosEncendidos.push('NINGUNO');
        console.log('No hay testigos seleccionados, se selecciona NINGUNO automáticamente');
      }
      
      // Limpiar el archivo de evidencia si se selecciona "NINGUNO"
      if (this.isNingunoSeleccionado) {
        this.formData.testigosEncendidosArchivo = null;
      }
    },
    
    prevStep() {
      // Método legacy mantenido por compatibilidad
      // pero ya no se usa directamente
      if (this.currentStep > 1) this.currentStep--;
    },
    
    handleSubmit() {
      // Este método ya no se usa directamente
      // La lógica se movió a handleFinalSubmit
      if (this.isStepValid) {
        console.log('Datos enviados:', this.finalFormData);
        this.showModal = false;
      }
    },
    
    // closeModal eliminado, ahora se usa $emit('close') directamente
    
    validateEmail(email) {
      // Validación básica de email
      const re = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
      return re.test(email);
    }
  }
};
</script>

<style scoped>
.input {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px;
  font-size: 1rem;
  transition: border-color 0.2s;
}
.input:focus {
  border-color: #3b82f6;
  outline: none;
}
.btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  transition: background 0.2s, color 0.2s;
}
.btn:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}
.close-button {
  background-color: #f87171; /* Red background */
  color: white; /* White text */
  border-radius: 8px; /* Slightly rounded corners for square */
  width: 40px; /* Fixed width */
  height: 40px; /* Fixed height */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem; /* Font size for the X */
  border: none; /* Remove border */
  cursor: pointer; /* Pointer cursor */
  transition: background-color 0.2s; /* Smooth hover effect */
}
.close-button:hover {
  background-color: #ef4444; /* Darker red on hover */
}
</style>