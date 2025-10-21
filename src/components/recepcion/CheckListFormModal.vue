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
                  <PhotoUploadAndPreview
                    id="polizaSeguroArchivo"
                    fileNamePrefix="foto_poliza"
                    :preloadedPhoto="checklistData.polizaSeguro"
                    @photo-captured="(file) => handlePhotoCaptured('polizaSeguroArchivo', file)"
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
                <h4 class="text-base font-semibold text-gray-800 mb-3">Descripción de Accesorios y Herramientas</h4>
                <p class="text-sm text-gray-600 mb-3">Describe detalladamente qué accesorios y herramientas contaba el vehículo</p>
                <textarea 
                  v-model="formData.descripcionAccesorios" 
                  placeholder="Ej: Gato hidráulico, llave de ruedas, triángulos de seguridad, extintor, botiquín, cables de corriente, etc."
                  class="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-accent-blue resize-y"
                  rows="4"
                ></textarea>
                <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p class="text-sm text-blue-800 font-medium mb-3">Por favor, sube una foto de los accesorios y herramientas</p>
                  <PhotoUploadAndPreview
                    id="accesoriosHerramientaArchivo"
                    fileNamePrefix="foto_accesorios"
                    :preloadedPhoto="checklistData.accesoriosHerramienta"
                    @photo-captured="(file) => handlePhotoCaptured('accesoriosHerramientaArchivo', file)"
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
              <!-- Odómetro (KM) -->
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Odómetro (KM)</h4>
                <p class="text-sm text-gray-600 mb-3">Por favor, sube una foto del odómetro</p>
                <PhotoUploadAndPreview
                  id="odometroArchivo"
                  fileNamePrefix="foto_odometro"
                  :preloadedPhoto="checklistData.odometroArchivo"
                  @photo-captured="(file) => handlePhotoCaptured('odometroArchivo', file)"
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
                  <PhotoUploadAndPreview
                    id="combustibleArchivo"
                    fileNamePrefix="foto_combustible"
                    :preloadedPhoto="checklistData.combustibleArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('combustibleArchivo', file)"
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
                <div class="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p class="text-sm text-green-800 font-medium mb-3">Por favor, sube una foto de evidencia de los testigos del tablero</p>
                  <PhotoUploadAndPreview
                    id="testigosEncendidosArchivo"
                    fileNamePrefix="foto_testigos"
                    :preloadedPhoto="checklistData.testigosEncendidosArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('testigosEncendidosArchivo', file)"
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
                <div class="flex gap-6 mb-4">
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
                <div class="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p class="text-sm text-yellow-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <PhotoUploadAndPreview
                    id="segurosArchivo"
                    :preloadedPhoto="checklistData.segurosArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('segurosArchivo', file)"
                  />
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
                <div class="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p class="text-sm text-yellow-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <PhotoUploadAndPreview
                    id="cristalesArchivo"
                    :preloadedPhoto="checklistData.cristalesArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('cristalesArchivo', file)"
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
                <div class="mt-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <p class="text-sm text-pink-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <PhotoUploadAndPreview
                    id="vestidurasArchivo"
                    :preloadedPhoto="checklistData.vestidurasArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('vestidurasArchivo', file)"
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
                <div class="mt-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <p class="text-sm text-pink-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <PhotoUploadAndPreview
                    id="cabecerasArchivo"
                    :preloadedPhoto="checklistData.cabecerasArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('cabecerasArchivo', file)"
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
                <div class="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p class="text-sm text-orange-800 font-medium mb-3">Por favor, toma una foto de evidencia</p>
                  <PhotoUploadAndPreview
                    id="carroceriaLadoDerechoArchivo"
                    :preloadedPhoto="checklistData.carroceriaLadoDerechoArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('carroceriaLadoDerechoArchivo', file)"
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
                <div class="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p class="text-sm text-orange-800 font-medium mb-3">Por favor, toma una foto de evidencia</p>
                  <PhotoUploadAndPreview
                    id="carroceriaLadoIzquierdoArchivo"
                    :preloadedPhoto="checklistData.carroceriaLadoIzquierdoArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('carroceriaLadoIzquierdoArchivo', file)"
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
                <div class="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p class="text-sm text-orange-800 font-medium mb-3">Por favor, toma una foto de evidencia</p>
                  <PhotoUploadAndPreview
                    id="carroceriaLadoTraseroArchivo"
                    :preloadedPhoto="checklistData.carroceriaLadoTraseroArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('carroceriaLadoTraseroArchivo', file)"
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
                <div class="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p class="text-sm text-orange-800 font-medium mb-3">Por favor, toma una foto de evidencia</p>
                  <PhotoUploadAndPreview
                    id="carroceriaLadoFrontalArchivo"
                    :preloadedPhoto="checklistData.carroceriaLadoFrontalArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('carroceriaLadoFrontalArchivo', file)"
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
                <div class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p class="text-sm text-gray-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <PhotoUploadAndPreview
                    id="neumaticosLadoPilotoArchivo"
                    :preloadedPhoto="checklistData.neumaticosLadoPilotoArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('neumaticosLadoPilotoArchivo', file)"
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
                <div class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p class="text-sm text-gray-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <PhotoUploadAndPreview
                    id="neumaticosLadoAtrasPilotoArchivo"
                    :preloadedPhoto="checklistData.neumaticosLadoAtrasPilotoArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('neumaticosLadoAtrasPilotoArchivo', file)"
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
                <div class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p class="text-sm text-gray-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <PhotoUploadAndPreview
                    id="neumaticosLadoCopilotoArchivo"
                    :preloadedPhoto="checklistData.neumaticosLadoCopilotoArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('neumaticosLadoCopilotoArchivo', file)"
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
                <div class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p class="text-sm text-gray-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <PhotoUploadAndPreview
                    id="neumaticosLadoAtrasCopilotoArchivo"
                    :preloadedPhoto="checklistData.neumaticosLadoAtrasCopilotoArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('neumaticosLadoAtrasCopilotoArchivo', file)"
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
                <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p class="text-sm text-blue-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <PhotoUploadAndPreview
                    id="cristalesParabrisasArchivo"
                    :preloadedPhoto="checklistData.cristalesParabrisasArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('cristalesParabrisasArchivo', file)"
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
                <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p class="text-sm text-blue-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <PhotoUploadAndPreview
                    id="cristalesMedallonTraseroArchivo"
                    :preloadedPhoto="checklistData.cristalesMedallonTraseroArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('cristalesMedallonTraseroArchivo', file)"
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
                <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p class="text-sm text-blue-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <PhotoUploadAndPreview
                    id="cristalesLimpiadoresArchivo"
                    :preloadedPhoto="checklistData.cristalesLimpiadoresArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('cristalesLimpiadoresArchivo', file)"
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
                <div class="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <p class="text-sm text-red-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <PhotoUploadAndPreview
                    id="motorTaponesArchivo"
                    :preloadedPhoto="checklistData.motorTaponesArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('motorTaponesArchivo', file)"
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
                <div class="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <p class="text-sm text-red-800 font-medium mb-3">Por favor, sube una foto de evidencia</p>
                  <PhotoUploadAndPreview
                    id="motorBateriaArchivo"
                    :preloadedPhoto="checklistData.motorBateriaArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('motorBateriaArchivo', file)"
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
                  <PhotoUploadAndPreview
                    id="motorNivelAceiteArchivo"
                    :preloadedPhoto="checklistData.motorNivelAceiteArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('motorNivelAceiteArchivo', file)"
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
                  <PhotoUploadAndPreview
                    id="motorNivelLiquidoFrenosArchivo"
                    :preloadedPhoto="checklistData.motorNivelLiquidoFrenosArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('motorNivelLiquidoFrenosArchivo', file)"
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
                  <PhotoUploadAndPreview
                    id="motorNivelAnticongelanteArchivo"
                    :preloadedPhoto="checklistData.motorNivelAnticongelanteArchivo"
                    @photo-captured="(file) => handlePhotoCaptured('motorNivelAnticongelanteArchivo', file)"
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
                <div class="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
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
                <div class="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
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

          <!-- SECCIÓN 7: COMENTARIOS GENERALES -->
          <div class="mb-6 p-6 bg-gradient-to-r from-slate-50 to-gray-100 rounded-xl border-l-4 border-slate-500">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-slate-500 text-white rounded-full flex items-center justify-center mr-3">
                <font-awesome-icon icon="comment-alt" class="w-4 h-4" />
              </div>
              <h3 class="text-xl font-bold text-slate-700">Comentarios Generales</h3>
            </div>
            
            <div class="space-y-4">
              <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 class="text-base font-semibold text-gray-800 mb-3">Observaciones Adicionales</h4>
                <p class="text-sm text-gray-600 mb-3">Incluya cualquier observación adicional sobre el vehículo que considere relevante</p>
                <textarea 
                  v-model="formData.comentarioGeneral"
                  class="w-full input resize-none"
                  placeholder="Ej: Rayones menores en la puerta del conductor, desgaste normal del volante, ruido en el motor al acelerar..."
                  rows="4"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-between mt-8">
          <BaseButton 
            type="button" 
            variant="secondary" 
            :disabled="currentStep === 1"
            :onClick="handlePrevStep"
          >
            <div class="flex items-center gap-2">
              <font-awesome-icon icon="chevron-left" class="w-4 h-4" />
              Anterior
            </div>
          </BaseButton>
          <BaseButton 
            v-if="currentStep < 3" 
            type="button" 
            variant="primary"
            :onClick="handleNextStep"
          >
            <div class="flex items-center gap-2">
              Siguiente
              <font-awesome-icon icon="chevron-right" class="w-4 h-4" />
            </div>
          </BaseButton>
          <BaseButton 
            v-if="currentStep === 3" 
            type="submit" 
            variant="success"
            :disabled="!isStepValid"
            :onClick="handleFinalSubmit"
            custom-loading-text="Enviando formulario"
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
import PhotoUploadAndPreview from '../global/PhotoUploadAndPreview.vue';
import BaseButton from '../global/BaseButton.vue';
import { useSubmitButton } from '../../composables/useSubmitButton.js';
import { useToastStore } from '../../stores/toast.js';

export default {
  name: 'CheckListFormModal',
  components: {
    FileUploadPreview,
    PhotoUploadAndPreview,
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
        // Accesorios/Herramienta
        descripcionAccesorios: '',
        accesoriosHerramientaArchivo: null,
        
        // --- STEP 2 ---
        // Cluster
        odometroArchivo: null,
        nivelCombustible: null,
        combustibleArchivo: null,
        testigosEncendidos: [],
        testigosEncendidosArchivo: null,
        
        // Tablero
        estereo: null,
        cantidadBocinas: null,
        
        // Puertas
        manijas: null,
        estadoSeguros: null,
        segurosArchivo: null,
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
        
        // Comentarios Generales
        comentarioGeneral: ''
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
          this.uiControls.tarjetaCirculacion
        ];

        // Validar campos condicionales
        if (this.uiControls.llavesRecibidas === 'true' && !this.formData.cantidadLlaves) {
          return false;
        }
        if (this.uiControls.polizaSeguro === 'true' && !this.formData.polizaSeguroArchivo) {
          return false;
        }
        
        // Validar campos obligatorios para Accesorios/Herramienta
        if (!this.formData.descripcionAccesorios || this.formData.descripcionAccesorios.trim() === '') {
          return false;
        }
        if (!this.formData.accesoriosHerramientaArchivo) {
          return false;
        }

        return step1Controls.every(control => control !== '');
      }

      if (this.currentStep === 2) {
        // Validar que todos los campos requeridos del paso 2 estén completos
        
        // Cluster - campos requeridos
        const clusterControls = [
          !!this.formData.odometroArchivo,
          !!this.formData.nivelCombustible,
          !!this.formData.combustibleArchivo,
          !!this.formData.testigosEncendidos.length,
          !!this.formData.testigosEncendidosArchivo // Foto de testigos siempre requerida
        ];
        
        // Tablero - campos requeridos
        const tableroControls = [
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
        
        // Puertas - campos de fotos obligatorios
        if (!this.formData.segurosArchivo) {
          return false;
        }
        if (!this.formData.cristalesArchivo) {
          return false;
        }
        
        // Asientos - campos requeridos
        const asientosControls = [
          !!this.formData.estadoVestiduras,
          !!this.formData.estadoCabeceras
        ];
        
        // Asientos - campos de fotos obligatorios
        if (!this.formData.vestidurasArchivo) {
          return false;
        }
        if (!this.formData.cabecerasArchivo) {
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
        
        // Validar campos obligatorios de Carrocería - fotos siempre requeridas
        if (!this.formData.carroceriaLadoDerechoArchivo) {
          return false;
        }
        if (!this.formData.carroceriaLadoIzquierdoArchivo) {
          return false;
        }
        if (!this.formData.carroceriaLadoTraseroArchivo) {
          return false;
        }
        if (!this.formData.carroceriaLadoFrontalArchivo) {
          return false;
        }
        
        // Validar campos de Neumáticos
        const neumaticosControls = [
          !!this.formData.neumaticosLadoPiloto,
          !!this.formData.neumaticosLadoAtrasPiloto,
          !!this.formData.neumaticosLadoCopiloto,
          !!this.formData.neumaticosLadoAtrasCopiloto
        ];
        
        // Validar campos obligatorios de Neumáticos - fotos siempre requeridas
        if (!this.formData.neumaticosLadoPilotoArchivo) {
          return false;
        }
        if (!this.formData.neumaticosLadoAtrasPilotoArchivo) {
          return false;
        }
        if (!this.formData.neumaticosLadoCopilotoArchivo) {
          return false;
        }
        if (!this.formData.neumaticosLadoAtrasCopilotoArchivo) {
          return false;
        }
        
        // Validar campos de Cristales
        const cristalesControls = [
          !!this.formData.cristalesParabrisas,
          !!this.formData.cristalesMedallonTrasero,
          !!this.formData.cristalesLimpiadores
        ];
        
        // Validar campos obligatorios de Cristales - fotos siempre requeridas
        if (!this.formData.cristalesParabrisasArchivo) {
          return false;
        }
        if (!this.formData.cristalesMedallonTraseroArchivo) {
          return false;
        }
        if (!this.formData.cristalesLimpiadoresArchivo) {
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
        
        // Validar campos obligatorios de Motor - fotos siempre requeridas
        if (!this.formData.motorTaponesArchivo) {
          return false;
        }
        if (!this.formData.motorBateriaArchivo) {
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
        
        // Validar campos obligatorios de Escape - fotos siempre requeridas
        if (!this.formData.escapeSilenciadorArchivo) {
          return false;
        }
        if (!this.formData.escapeCatalizadorArchivo) {
          return false;
        }
        
        // Verificar que los campos requeridos tengan valor y que el comentario general no esté vacío
        return carroceriaControls.every(control => !!control) &&
               neumaticosControls.every(control => !!control) &&
               cristalesControls.every(control => !!control) &&
               motorControls.every(control => !!control) &&
               depositoEscapeControls.every(control => !!control) &&
               (this.formData.comentarioGeneral && this.formData.comentarioGeneral.trim() !== '');
      }

      return false;
    },
      // Crear un JSON final que solo incluya los valores relevantes según los controles
    finalFormData() {
      const result = {
        // --- STEP 1 ---
        // Inicializar todas las claves con null por defecto o con valores predeterminados según requerimiento
        cantidadLlaves: 0, // Por defecto es 0 si no se proporciona
        polizaSeguro: false, // Por defecto es false
        polizaSeguroImagen: null, // Nuevo campo para el nombre de la imagen
        tarjetaCirculacion: false, // Por defecto es false
        descripcionAccesorios: '', // Nuevo campo descriptivo
        accesoriosHerramientaImagen: null, // Nuevo campo para el nombre de la imagen
        
        // --- STEP 2 ---
        // Cluster
        odometroImagen: null, // Mantener como null para imagen
        nivelCombustible: this.formData.nivelCombustible,
        combustibleImagen: null, // Cambio de nombre a imagen
        testigosEncendidos: this.formData.testigosEncendidos,
        testigosImagen: null, // Cambio de nombre a imagen
        
        // Tablero
        estereo: this.uiControls.estereo === 'true' ? true : (this.uiControls.estereo === 'false' ? false : null),
        cantidadBocinas: 0, // Por defecto es 0 si no se proporciona
        
        // Puertas
        manijas: this.formData.manijas === 'true' ? true : (this.formData.manijas === 'false' ? false : null),
        estadoSeguros: this.formData.estadoSeguros,
        segurosImagen: null, // Nuevo campo para imagen de seguros
        estadoCristales: this.formData.estadoCristales,
        cristalesImagen: null, // Cambio de nombre a imagen
        
        // Asientos
        estadoVestiduras: this.formData.estadoVestiduras,
        vestidurasImagen: null, // Cambio de nombre a imagen
        estadoCabeceras: this.formData.estadoCabeceras,
        cabecerasImagen: null, // Cambio de nombre a imagen
        
        // Cinturones
        funcionalidadCinturones: this.formData.funcionalidadCinturones,
        
        // --- STEP 3 ---
        // Carrocería
        carroceriaLadoDerecho: this.formData.carroceriaLadoDerecho,
        carroceriaLadoDerechoImagen: null, // Cambio de nombre a imagen
        carroceriaLadoIzquierdo: this.formData.carroceriaLadoIzquierdo,
        carroceriaLadoIzquierdoImagen: null, // Cambio de nombre a imagen
        carroceriaLadoTrasero: this.formData.carroceriaLadoTrasero,
        carroceriaLadoTraseroImagen: null, // Cambio de nombre a imagen
        carroceriaLadoFrontal: this.formData.carroceriaLadoFrontal,
        carroceriaLadoFrontalImagen: null, // Cambio de nombre a imagen
        
        // Neumáticos
        neumaticosLadoPiloto: this.formData.neumaticosLadoPiloto,
        neumaticosLadoPilotoImagen: null, // Cambio de nombre a imagen
        neumaticosLadoAtrasPiloto: this.formData.neumaticosLadoAtrasPiloto,
        neumaticosLadoAtrasPilotoImagen: null, // Cambio de nombre a imagen
        neumaticosLadoCopiloto: this.formData.neumaticosLadoCopiloto,
        neumaticosLadoCopilotoImagen: null, // Cambio de nombre a imagen
        neumaticosLadoAtrasCopiloto: this.formData.neumaticosLadoAtrasCopiloto,
        neumaticosLadoAtrasCopilotoImagen: null, // Cambio de nombre a imagen
        
        // Cristales
        cristalesParabrisas: this.formData.cristalesParabrisas,
        cristalesParabrisasImagen: null, // Cambio de nombre a imagen
        cristalesMedallonTrasero: this.formData.cristalesMedallonTrasero,
        cristalesMedallonTraseroImagen: null, // Cambio de nombre a imagen
        cristalesLimpiadores: this.formData.cristalesLimpiadores,
        cristalesLimpiadoresImagen: null, // Cambio de nombre a imagen
        
        // Motor
        motorTapones: this.formData.motorTapones,
        motorTaponesImagen: null, // Cambio de nombre a imagen
        motorBateria: this.formData.motorBateria,
        motorBateriaImagen: null, // Cambio de nombre a imagen
        motorNivelAceite: this.formData.motorNivelAceite,
        motorNivelAceiteImagen: null, // Cambio de nombre a imagen
        motorNivelLiquidoFrenos: this.formData.motorNivelLiquidoFrenos,
        motorNivelLiquidoFrenosImagen: null, // Cambio de nombre a imagen
        motorNivelAnticongelante: this.formData.motorNivelAnticongelante,
        motorNivelAnticongelanteImagen: null, // Cambio de nombre a imagen
        
        // Depósito Gasolina y Escape
        depositoPuerta: this.formData.depositoPuerta === 'true' ? true : (this.formData.depositoPuerta === 'false' ? false : null),
        depositoTapon: this.formData.depositoTapon === 'true' ? true : (this.formData.depositoTapon === 'false' ? false : null),
        escapeSilenciador: this.formData.escapeSilenciador === 'true' ? true : (this.formData.escapeSilenciador === 'false' ? false : null),
        escapeSilenciadorImagen: null, // Cambio de nombre a imagen
        escapeCatalizador: this.formData.escapeCatalizador === 'true' ? true : (this.formData.escapeCatalizador === 'false' ? false : null),
        escapeCatalizadorImagen: null, // Cambio de nombre a imagen
        
        // Comentarios Generales
        comentarioGeneral: this.formData.comentarioGeneral || ''
      };      
      
      // --- STEP 1 ---
      // Asignar cantidadLlaves si llavesRecibidas es true y hay valor, de lo contrario 0
      if (this.uiControls.llavesRecibidas === 'true' && this.formData.cantidadLlaves) {
        result.cantidadLlaves = this.formData.cantidadLlaves;
      } else {
        result.cantidadLlaves = 0;
      }
      
      // Asignar polizaSeguro como true/false y guardar nombre de la imagen
      if (this.uiControls.polizaSeguro === 'true') {
        result.polizaSeguro = true;
        if (this.formData.polizaSeguroArchivo) {
          result.polizaSeguroImagen = this.formData.polizaSeguroArchivo.name;
        }
      } else {
        result.polizaSeguro = false;
      }
      
      // Asignar tarjetaCirculacion true/false según la selección
      result.tarjetaCirculacion = this.uiControls.tarjetaCirculacion === 'true';
      
      // Asignar descripcionAccesorios y accesoriosHerramientaImagen (siempre obligatorios)
      result.descripcionAccesorios = this.formData.descripcionAccesorios || '';
      if (this.formData.accesoriosHerramientaArchivo) {
        result.accesoriosHerramientaImagen = this.formData.accesoriosHerramientaArchivo.name;
      }
      
      // --- STEP 2 ---
      // Cluster
      if (this.formData.odometroArchivo) {
        result.odometroImagen = this.formData.odometroArchivo.name;
      }
      
      if (this.formData.combustibleArchivo) {
        result.combustibleImagen = this.formData.combustibleArchivo.name;
      }
      
      if (this.formData.testigosEncendidosArchivo) {
        result.testigosImagen = this.formData.testigosEncendidosArchivo.name;
      }
      
      // Tablero
      if (this.uiControls.bocinas === 'true' && this.formData.cantidadBocinas) {
        result.cantidadBocinas = this.formData.cantidadBocinas;
      } else {
        result.cantidadBocinas = 0;
      }
      
      // Puertas - fotos siempre requeridas
      if (this.formData.segurosArchivo) {
        result.segurosImagen = this.formData.segurosArchivo.name;
      }
      
      if (this.formData.cristalesArchivo) {
        result.cristalesImagen = this.formData.cristalesArchivo.name;
      }
      
      // Asientos - fotos siempre requeridas
      if (this.formData.vestidurasArchivo) {
        result.vestidurasImagen = this.formData.vestidurasArchivo.name;
      }
      
      if (this.formData.cabecerasArchivo) {
        result.cabecerasImagen = this.formData.cabecerasArchivo.name;
      }
      
      // --- STEP 3 ---
      // Carrocería
      if (this.formData.carroceriaLadoDerecho === 'mal_estado' && this.formData.carroceriaLadoDerechoArchivo) {
        result.carroceriaLadoDerechoImagen = this.formData.carroceriaLadoDerechoArchivo.name;
      }
      
      if (this.formData.carroceriaLadoIzquierdo === 'mal_estado' && this.formData.carroceriaLadoIzquierdoArchivo) {
        result.carroceriaLadoIzquierdoImagen = this.formData.carroceriaLadoIzquierdoArchivo.name;
      }
      
      if (this.formData.carroceriaLadoTrasero === 'mal_estado' && this.formData.carroceriaLadoTraseroArchivo) {
        result.carroceriaLadoTraseroImagen = this.formData.carroceriaLadoTraseroArchivo.name;
      }
      
      if (this.formData.carroceriaLadoFrontal === 'mal_estado' && this.formData.carroceriaLadoFrontalArchivo) {
        result.carroceriaLadoFrontalImagen = this.formData.carroceriaLadoFrontalArchivo.name;
      }
      
      // Neumáticos
      if (this.formData.neumaticosLadoPiloto === 'mal_estado' && this.formData.neumaticosLadoPilotoArchivo) {
        result.neumaticosLadoPilotoImagen = this.formData.neumaticosLadoPilotoArchivo.name;
      }
      
      if (this.formData.neumaticosLadoAtrasPiloto === 'mal_estado' && this.formData.neumaticosLadoAtrasPilotoArchivo) {
        result.neumaticosLadoAtrasPilotoImagen = this.formData.neumaticosLadoAtrasPilotoArchivo.name;
      }
      
      if (this.formData.neumaticosLadoCopiloto === 'mal_estado' && this.formData.neumaticosLadoCopilotoArchivo) {
        result.neumaticosLadoCopilotoImagen = this.formData.neumaticosLadoCopilotoArchivo.name;
      }
      
      if (this.formData.neumaticosLadoAtrasCopiloto === 'mal_estado' && this.formData.neumaticosLadoAtrasCopilotoArchivo) {
        result.neumaticosLadoAtrasCopilotoImagen = this.formData.neumaticosLadoAtrasCopilotoArchivo.name;
      }
      
      // Cristales
      if (this.formData.cristalesParabrisas === 'mal_estado' && this.formData.cristalesParabrisasArchivo) {
        result.cristalesParabrisasImagen = this.formData.cristalesParabrisasArchivo.name;
      }
      
      if (this.formData.cristalesMedallonTrasero === 'mal_estado' && this.formData.cristalesMedallonTraseroArchivo) {
        result.cristalesMedallonTraseroImagen = this.formData.cristalesMedallonTraseroArchivo.name;
      }
      
      if (this.formData.cristalesLimpiadores === 'mal_estado' && this.formData.cristalesLimpiadoresArchivo) {
        result.cristalesLimpiadoresImagen = this.formData.cristalesLimpiadoresArchivo.name;
      }
      
      // Motor
      if (this.formData.motorTapones === 'mal_estado' && this.formData.motorTaponesArchivo) {
        result.motorTaponesImagen = this.formData.motorTaponesArchivo.name;
      }
      
      if (this.formData.motorBateria === 'mal_estado' && this.formData.motorBateriaArchivo) {
        result.motorBateriaImagen = this.formData.motorBateriaArchivo.name;
      }
      
      // Los niveles siempre requieren evidencia independientemente del valor seleccionado
      if (this.formData.motorNivelAceiteArchivo) {
        result.motorNivelAceiteImagen = this.formData.motorNivelAceiteArchivo.name;
      }
      
      if (this.formData.motorNivelLiquidoFrenosArchivo) {
        result.motorNivelLiquidoFrenosImagen = this.formData.motorNivelLiquidoFrenosArchivo.name;
      }
      
      if (this.formData.motorNivelAnticongelanteArchivo) {
        result.motorNivelAnticongelanteImagen = this.formData.motorNivelAnticongelanteArchivo.name;
      }
      
      // Depósito Gasolina y Escape - fotos siempre requeridas
      if (this.formData.escapeSilenciadorArchivo) {
        result.escapeSilenciadorImagen = this.formData.escapeSilenciadorArchivo.name;
      }
      
      if (this.formData.escapeCatalizadorArchivo) {
        result.escapeCatalizadorImagen = this.formData.escapeCatalizadorArchivo.name;
      }
      
      // Agregamos un log para verificar la estructura final del JSON
      console.log('Estructura JSON actualizada para API:', JSON.stringify(result, null, 2));
      
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
      
      // Reiniciar todos los controles UI a estado vacío (sin selección)
      Object.keys(this.uiControls).forEach(key => {
        this.uiControls[key] = '';
      });
      
      // --- STEP 1 ---
      // Solo configurar los campos que realmente existen en el objeto de datos de prueba
      if ('cantidadLlaves' in this.checklistData) {
        this.formData.cantidadLlaves = this.checklistData.cantidadLlaves;
        this.uiControls.llavesRecibidas = 'true';
      }
      
      if ('polizaSeguro' in this.checklistData) {
        this.uiControls.polizaSeguro = 'true';
        this.formData.polizaSeguroArchivo = { name: this.checklistData.polizaSeguro };
      }
      
      if ('tarjetaCirculacion' in this.checklistData) {
        this.formData.tarjetaCirculacion = this.checklistData.tarjetaCirculacion;
        this.uiControls.tarjetaCirculacion = this.checklistData.tarjetaCirculacion ? 'true' : 'false';
      }
      
      if ('descripcionAccesorios' in this.checklistData) {
        this.formData.descripcionAccesorios = this.checklistData.descripcionAccesorios;
      }
      
      if ('accesoriosHerramientaArchivo' in this.checklistData) {
        this.formData.accesoriosHerramientaArchivo = { name: this.checklistData.accesoriosHerramientaArchivo };
      }
      
      // --- STEP 2 ---
      // Cluster - Solo configurar si existe en los datos de prueba
      if ('odometroArchivo' in this.checklistData && this.checklistData.odometroArchivo) {
        this.formData.odometroArchivo = { name: this.checklistData.odometroArchivo };
      }
      
      if ('nivelCombustible' in this.checklistData) {
        this.formData.nivelCombustible = this.checklistData.nivelCombustible;
      }
      
      if ('combustibleArchivo' in this.checklistData && this.checklistData.combustibleArchivo) {
        this.formData.combustibleArchivo = { name: this.checklistData.combustibleArchivo };
      }
      
      if ('testigosEncendidos' in this.checklistData) {
        this.formData.testigosEncendidos = this.checklistData.testigosEncendidos;
      } else {
        this.formData.testigosEncendidos = ['NINGUNO']; // Valor por defecto
      }
      
      if ('testigosEncendidosArchivo' in this.checklistData && this.checklistData.testigosEncendidosArchivo) {
        this.formData.testigosEncendidosArchivo = { name: this.checklistData.testigosEncendidosArchivo };
      }
      
      // Tablero - Solo configurar si existe en los datos de prueba
      if ('estereo' in this.checklistData && this.checklistData.estereo !== null) {
        this.uiControls.estereo = String(this.checklistData.estereo);
        this.formData.estereo = this.checklistData.estereo;
      }
      
      if ('cantidadBocinas' in this.checklistData && this.checklistData.cantidadBocinas !== null) {
        this.uiControls.bocinas = 'true';
        this.formData.cantidadBocinas = this.checklistData.cantidadBocinas;
      }
      
      // Puertas - Solo configurar si existe en los datos de prueba
      if ('manijas' in this.checklistData) {
        this.formData.manijas = this.checklistData.manijas;
      }
      
      if ('estadoSeguros' in this.checklistData) {
        this.formData.estadoSeguros = this.checklistData.estadoSeguros;
      }
      
      if ('segurosArchivo' in this.checklistData && this.checklistData.segurosArchivo) {
        this.formData.segurosArchivo = { name: this.checklistData.segurosArchivo };
      }
      
      if ('estadoCristales' in this.checklistData) {
        this.formData.estadoCristales = this.checklistData.estadoCristales;
      }
      
      if ('cristalesArchivo' in this.checklistData && this.checklistData.cristalesArchivo) {
        this.formData.cristalesArchivo = { name: this.checklistData.cristalesArchivo };
      }
      
      // Asientos - Solo configurar si existe en los datos de prueba
      if ('estadoVestiduras' in this.checklistData) {
        this.formData.estadoVestiduras = this.checklistData.estadoVestiduras;
      }
      
      if ('vestidurasArchivo' in this.checklistData && this.checklistData.vestidurasArchivo) {
        this.formData.vestidurasArchivo = { name: this.checklistData.vestidurasArchivo };
      }
      
      if ('estadoCabeceras' in this.checklistData) {
        this.formData.estadoCabeceras = this.checklistData.estadoCabeceras;
      }
      
      if ('cabecerasArchivo' in this.checklistData && this.checklistData.cabecerasArchivo) {
        this.formData.cabecerasArchivo = { name: this.checklistData.cabecerasArchivo };
      }
      
      // Cinturones - Solo configurar si existe en los datos de prueba
      if ('funcionalidadCinturones' in this.checklistData) {
        this.formData.funcionalidadCinturones = this.checklistData.funcionalidadCinturones;
      }
      
      // --- STEP 3 ---
      // Carrocería - Solo configurar si existe en los datos de prueba
      if ('carroceriaLadoDerecho' in this.checklistData) {
        this.formData.carroceriaLadoDerecho = this.checklistData.carroceriaLadoDerecho;
      }
      
      if ('carroceriaLadoDerechoArchivo' in this.checklistData && this.checklistData.carroceriaLadoDerechoArchivo) {
        this.formData.carroceriaLadoDerechoArchivo = { name: this.checklistData.carroceriaLadoDerechoArchivo };
      }
      
      if ('carroceriaLadoIzquierdo' in this.checklistData) {
        this.formData.carroceriaLadoIzquierdo = this.checklistData.carroceriaLadoIzquierdo;
      }
      
      if ('carroceriaLadoIzquierdoArchivo' in this.checklistData && this.checklistData.carroceriaLadoIzquierdoArchivo) {
        this.formData.carroceriaLadoIzquierdoArchivo = { name: this.checklistData.carroceriaLadoIzquierdoArchivo };
      }
      
      if ('carroceriaLadoTrasero' in this.checklistData) {
        this.formData.carroceriaLadoTrasero = this.checklistData.carroceriaLadoTrasero;
      }
      
      if ('carroceriaLadoTraseroArchivo' in this.checklistData && this.checklistData.carroceriaLadoTraseroArchivo) {
        this.formData.carroceriaLadoTraseroArchivo = { name: this.checklistData.carroceriaLadoTraseroArchivo };
      }
      
      if ('carroceriaLadoFrontal' in this.checklistData) {
        this.formData.carroceriaLadoFrontal = this.checklistData.carroceriaLadoFrontal;
      }
      
      if ('carroceriaLadoFrontalArchivo' in this.checklistData && this.checklistData.carroceriaLadoFrontalArchivo) {
        this.formData.carroceriaLadoFrontalArchivo = { name: this.checklistData.carroceriaLadoFrontalArchivo };
      }
      
      // Neumáticos - Solo configurar si existe en los datos de prueba
      if ('neumaticosLadoPiloto' in this.checklistData) {
        this.formData.neumaticosLadoPiloto = this.checklistData.neumaticosLadoPiloto;
      }
      
      if ('neumaticosLadoPilotoArchivo' in this.checklistData && this.checklistData.neumaticosLadoPilotoArchivo) {
        this.formData.neumaticosLadoPilotoArchivo = { name: this.checklistData.neumaticosLadoPilotoArchivo };
      }
      
      if ('neumaticosLadoAtrasPiloto' in this.checklistData) {
        this.formData.neumaticosLadoAtrasPiloto = this.checklistData.neumaticosLadoAtrasPiloto;
      }
      
      if ('neumaticosLadoAtrasPilotoArchivo' in this.checklistData && this.checklistData.neumaticosLadoAtrasPilotoArchivo) {
        this.formData.neumaticosLadoAtrasPilotoArchivo = { name: this.checklistData.neumaticosLadoAtrasPilotoArchivo };
      }
      
      if ('neumaticosLadoCopiloto' in this.checklistData) {
        this.formData.neumaticosLadoCopiloto = this.checklistData.neumaticosLadoCopiloto;
      }
      
      if ('neumaticosLadoCopilotoArchivo' in this.checklistData && this.checklistData.neumaticosLadoCopilotoArchivo) {
        this.formData.neumaticosLadoCopilotoArchivo = { name: this.checklistData.neumaticosLadoCopilotoArchivo };
      }
      if ('neumaticosLadoAtrasCopiloto' in this.checklistData) {
        this.formData.neumaticosLadoAtrasCopiloto = this.checklistData.neumaticosLadoAtrasCopiloto;
      }
      
      if ('neumaticosLadoAtrasCopilotoArchivo' in this.checklistData && this.checklistData.neumaticosLadoAtrasCopilotoArchivo) {
        this.formData.neumaticosLadoAtrasCopilotoArchivo = { name: this.checklistData.neumaticosLadoAtrasCopilotoArchivo };
      }
      
      // Cristales - Solo configurar si existe en los datos de prueba
      if ('cristalesParabrisas' in this.checklistData) {
        this.formData.cristalesParabrisas = this.checklistData.cristalesParabrisas;
      }
      
      if ('cristalesParabrisasArchivo' in this.checklistData && this.checklistData.cristalesParabrisasArchivo) {
        this.formData.cristalesParabrisasArchivo = { name: this.checklistData.cristalesParabrisasArchivo };
      }
      
      if ('cristalesMedallonTrasero' in this.checklistData) {
        this.formData.cristalesMedallonTrasero = this.checklistData.cristalesMedallonTrasero;
      }
      
      if ('cristalesMedallonTraseroArchivo' in this.checklistData && this.checklistData.cristalesMedallonTraseroArchivo) {
        this.formData.cristalesMedallonTraseroArchivo = { name: this.checklistData.cristalesMedallonTraseroArchivo };
      }
      
      if ('cristalesLimpiadores' in this.checklistData) {
        this.formData.cristalesLimpiadores = this.checklistData.cristalesLimpiadores;
      }
      
      if ('cristalesLimpiadoresArchivo' in this.checklistData && this.checklistData.cristalesLimpiadoresArchivo) {
        this.formData.cristalesLimpiadoresArchivo = { name: this.checklistData.cristalesLimpiadoresArchivo };
      }
      
      // Motor - Solo configurar si existe en los datos de prueba
      if ('motorTapones' in this.checklistData) {
        this.formData.motorTapones = this.checklistData.motorTapones;
      }
      
      if ('motorTaponesArchivo' in this.checklistData && this.checklistData.motorTaponesArchivo) {
        this.formData.motorTaponesArchivo = { name: this.checklistData.motorTaponesArchivo };
      }
      
      if ('motorBateria' in this.checklistData) {
        this.formData.motorBateria = this.checklistData.motorBateria;
      }
      
      if ('motorBateriaArchivo' in this.checklistData && this.checklistData.motorBateriaArchivo) {
        this.formData.motorBateriaArchivo = { name: this.checklistData.motorBateriaArchivo };
      }
      
      if ('motorNivelAceite' in this.checklistData) {
        this.formData.motorNivelAceite = this.checklistData.motorNivelAceite;
      }
      
      if ('motorNivelAceiteArchivo' in this.checklistData && this.checklistData.motorNivelAceiteArchivo) {
        this.formData.motorNivelAceiteArchivo = { name: this.checklistData.motorNivelAceiteArchivo };
      }
      
      if ('motorNivelLiquidoFrenos' in this.checklistData) {
        this.formData.motorNivelLiquidoFrenos = this.checklistData.motorNivelLiquidoFrenos;
      }
      
      if ('motorNivelLiquidoFrenosArchivo' in this.checklistData && this.checklistData.motorNivelLiquidoFrenosArchivo) {
        this.formData.motorNivelLiquidoFrenosArchivo = { name: this.checklistData.motorNivelLiquidoFrenosArchivo };
      }
      if ('motorNivelAnticongelante' in this.checklistData) {
        this.formData.motorNivelAnticongelante = this.checklistData.motorNivelAnticongelante;
      }
      
      if ('motorNivelAnticongelanteArchivo' in this.checklistData && this.checklistData.motorNivelAnticongelanteArchivo) {
        this.formData.motorNivelAnticongelanteArchivo = { name: this.checklistData.motorNivelAnticongelanteArchivo };
      }
      
      // Depósito Gasolina y Escape - Solo configurar si existe en los datos de prueba
      if ('depositoPuerta' in this.checklistData) {
        this.formData.depositoPuerta = String(this.checklistData.depositoPuerta);
      }
      
      if ('depositoTapon' in this.checklistData) {
        this.formData.depositoTapon = String(this.checklistData.depositoTapon);
      }
      
      if ('escapeSilenciador' in this.checklistData) {
        this.formData.escapeSilenciador = String(this.checklistData.escapeSilenciador);
      }
      
      if ('escapeSilenciadorArchivo' in this.checklistData && this.checklistData.escapeSilenciadorArchivo) {
        this.formData.escapeSilenciadorArchivo = { name: this.checklistData.escapeSilenciadorArchivo };
      }
      
      if ('escapeCatalizador' in this.checklistData) {
        this.formData.escapeCatalizador = String(this.checklistData.escapeCatalizador);
      }
      
      if ('escapeCatalizadorArchivo' in this.checklistData && this.checklistData.escapeCatalizadorArchivo) {
        this.formData.escapeCatalizadorArchivo = { name: this.checklistData.escapeCatalizadorArchivo };
      }
      
      // Comentarios Generales - Solo configurar si existe en los datos de prueba
      if ('comentarioGeneral' in this.checklistData) {
        this.formData.comentarioGeneral = this.checklistData.comentarioGeneral || '';
      }
      
      console.log('Datos cargados correctamente. Solamente se han seleccionado campos presentes en los datos de prueba.');
      console.log('Estado de uiControls después de cargar:', JSON.stringify(this.uiControls, null, 2));
    },
    
    handleNextStep() {
      // Avanzar al siguiente paso sin guardar datos
      if (this.currentStep < 3) {
        this.currentStep++;
      }
    },
    
    handlePrevStep() {
      // Retroceder al paso anterior sin guardar datos
      if (this.currentStep > 1) {
        this.currentStep--;
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
    
    // Este método ya no se utiliza porque ahora solo guardamos al final
    async saveCurrentStepData() {
      console.log(`El guardado por pasos ha sido deshabilitado`);
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
    
    // Método para manejar las fotografías capturadas
    handlePhotoCaptured(field, file) {
      console.log(`=== INICIO handlePhotoCaptured ===`);
      console.log(`Field: ${field}`);
      console.log(`File:`, file);
      console.log(`Photo name:`, file ? file.name : 'null');
      
      // Usar el mismo flujo que handleFileChange para mantener consistencia
      this.formData[field] = file;
      
      console.log(`FormData[${field}] después de asignación:`, this.formData[field]);
      console.log(`¿Foto tiene name?:`, this.formData[field] ? this.formData[field].name : 'No tiene name');
      
      // Log del estado actual de UI Controls
      console.log('UI Controls actuales:', this.uiControls);
      
      // Calcular inmediatamente el finalFormData
      const currentFinalFormData = this.finalFormData;
      console.log('Final Form Data calculado inmediatamente:', JSON.stringify(currentFinalFormData, null, 2));
      
      // Forzar recálculo del computed en nextTick
      this.$nextTick(() => {
        console.log('Final Form Data en nextTick:', JSON.stringify(this.finalFormData, null, 2));
        console.log(`=== FIN handlePhotoCaptured ===`);
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
      
      // Nota: La foto de testigos es ahora siempre requerida, independientemente de la selección
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