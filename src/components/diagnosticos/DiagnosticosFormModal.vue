<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
    <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl relative border border-gray-200 overflow-y-auto max-h-[90vh]">
      <button @click="$emit('close')" class="close-button absolute top-4 right-4">
        <font-awesome-icon icon="times" />
      </button>
      <h2 class="text-2xl font-bold mb-6 text-blue-600 text-center">Diagnóstico Técnico</h2>
      
      <form @submit.prevent="">
        <!-- STEP 0: Selección de Categorías -->
        <div v-if="currentStep === 1">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Seleccionar Sistemas a Diagnosticar</h3>
          
          <div class="mb-8 p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border-l-4 border-gray-500">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">¿Qué sistemas presentan fallas o requieren diagnóstico?</h4>
            <p class="text-sm text-gray-600 mb-6">Seleccione únicamente los sistemas que necesitan revisión. Solo se mostrarán los formularios correspondientes a los sistemas seleccionados.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                <input type="checkbox" v-model="categoriesSelection.motor" class="rounded text-blue-600">
                <div>
                  <span class="text-sm font-medium text-gray-800">Motor</span>
                  <p class="text-xs text-gray-500">Empaques, sellos, bujías, batería, etc.</p>
                </div>
              </label>
              
              <label class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
                <input type="checkbox" v-model="categoriesSelection.transmision" class="rounded text-green-600">
                <div>
                  <span class="text-sm font-medium text-gray-800">Sistema de Transmisión</span>
                  <p class="text-xs text-gray-500">Retenes, juntas, discos, convertidor, etc.</p>
                </div>
              </label>
              
              <label class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
                <input type="checkbox" v-model="categoriesSelection.frenos" class="rounded text-red-600">
                <div>
                  <span class="text-sm font-medium text-gray-800">Sistema de Frenos</span>
                  <p class="text-xs text-gray-500">Balatas, discos, líquido, calipers, etc.</p>
                </div>
              </label>
              
              <label class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-yellow-50 transition-colors cursor-pointer">
                <input type="checkbox" v-model="categoriesSelection.sistemaElectrico" class="rounded text-yellow-600">
                <div>
                  <span class="text-sm font-medium text-gray-800">Sistema Eléctrico</span>
                  <p class="text-xs text-gray-500">Batería, alternador, luces, conexiones, etc.</p>
                </div>
              </label>
              
              <label class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-orange-50 transition-colors cursor-pointer">
                <input type="checkbox" v-model="categoriesSelection.suspensionDireccion" class="rounded text-orange-600">
                <div>
                  <span class="text-sm font-medium text-gray-800">Suspensión y Dirección</span>
                  <p class="text-xs text-gray-500">Amortiguadores, terminales, rótulas, etc.</p>
                </div>
              </label>
              
              <label class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                <input type="checkbox" v-model="categoriesSelection.sistemaEnfriamiento" class="rounded text-blue-600">
                <div>
                  <span class="text-sm font-medium text-gray-800">Sistema de Enfriamiento</span>
                  <p class="text-xs text-gray-500">Radiador, bomba de agua, termostato, etc.</p>
                </div>
              </label>
              
              <label class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                <input type="checkbox" v-model="categoriesSelection.sistemaEscape" class="rounded text-purple-600">
                <div>
                  <span class="text-sm font-medium text-gray-800">Sistema de Escape</span>
                  <p class="text-xs text-gray-500">Silenciador, catalizador, corrosión, etc.</p>
                </div>
              </label>
              
              <label class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-teal-50 transition-colors cursor-pointer">
                <input type="checkbox" v-model="categoriesSelection.sistemaClimatizacion" class="rounded text-teal-600">
                <div>
                  <span class="text-sm font-medium text-gray-800">Sistema de Climatización</span>
                  <p class="text-xs text-gray-500">A/C, calefacción, filtros, etc.</p>
                </div>
              </label>
              
              <label class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-pink-50 transition-colors cursor-pointer">
                <input type="checkbox" v-model="categoriesSelection.carroceriaAccesorios" class="rounded text-pink-600">
                <div>
                  <span class="text-sm font-medium text-gray-800">Carrocería y Accesorios</span>
                  <p class="text-xs text-gray-500">Golpes, cristales, puertas, limpia parabrisas, etc.</p>
                </div>
              </label>
              
              <label class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer">
                <input type="checkbox" v-model="categoriesSelection.llantasRines" class="rounded text-indigo-600">
                <div>
                  <span class="text-sm font-medium text-gray-800">Llantas y Rines</span>
                  <p class="text-xs text-gray-500">Alineación, balanceo, presión, desgaste, etc.</p>
                </div>
              </label>
            </div>
            
            <!-- Mensaje informativo cuando no hay selecciones -->
            <div v-if="selectedCategories.length === 0" class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-amber-700">
                    Seleccione al menos un sistema para continuar con el diagnóstico.
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Resumen de selecciones -->
            <div v-else class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-green-700">
                    {{ selectedCategories.length }} sistema{{ selectedCategories.length > 1 ? 's' : '' }} seleccionado{{ selectedCategories.length > 1 ? 's' : '' }} para diagnóstico.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 2: Motor -->
        <div v-else-if="currentStep === 2 && categoriesSelection.motor">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Motor</h3>
          
          <!-- Sección: Motor -->
          <div class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
            <h4 class="text-lg font-semibold text-blue-800 mb-4">Motor</h4>
            <div class="space-y-4">
              <!-- Tipo de Mantenimiento -->
              <div class="mb-4 p-4 bg-white rounded-lg border border-blue-200">
                <label class="block text-sm font-medium text-gray-700 mb-3">Tipo de Mantenimiento:</label>
                <div class="flex space-x-6">
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.motor.tipo_mantenimiento" 
                      value="correctivo"
                      class="text-blue-600 focus:ring-blue-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Correctivo</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.motor.tipo_mantenimiento" 
                      value="preventivo"
                      class="text-blue-600 focus:ring-blue-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Preventivo</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Seleccione las fallas detectadas:</label>
                <div class="space-y-3">
                  <!-- Empaques dañados -->
                  <div class="flex items-center justify-between p-2 bg-white rounded border">
                    <label class="flex items-center space-x-2">
                      <input type="checkbox" v-model="formData.motor.empaques" class="rounded">
                      <span class="text-sm">Empaques dañados</span>
                    </label>
                    <div v-if="formData.motor.empaques" class="ml-2">
                      <PhotoUploadAndPreview
                        :key="'motor-empaques'"
                        button-text="📷"
                        button-class="w-8 h-8 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        @photo-captured="(file) => handlePhotoCaptured('motorEmpaquesImagen', file)"
                        :initial-photo="formData.motor.empaquesImagen"
                      />
                    </div>
                  </div>
                  
                  <!-- Sellos dañados -->
                  <div class="flex items-center justify-between p-2 bg-white rounded border">
                    <label class="flex items-center space-x-2">
                      <input type="checkbox" v-model="formData.motor.sellos" class="rounded">
                      <span class="text-sm">Sellos dañados</span>
                    </label>
                    <div v-if="formData.motor.sellos" class="ml-2">
                      <PhotoUploadAndPreview
                        :key="'motor-sellos'"
                        button-text="📷"
                        button-class="w-8 h-8 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        @photo-captured="(file) => handlePhotoCaptured('motorSellosImagen', file)"
                        :initial-photo="formData.motor.sellosImagen"
                      />
                    </div>
                  </div>
                  
                  <!-- Desgaste de anillos -->
                  <div class="flex items-center justify-between p-2 bg-white rounded border">
                    <label class="flex items-center space-x-2">
                      <input type="checkbox" v-model="formData.motor.desgasteAnillos" class="rounded">
                      <span class="text-sm">Desgaste de anillos</span>
                    </label>
                    <div v-if="formData.motor.desgasteAnillos" class="ml-2">
                      <PhotoUploadAndPreview
                        :key="'motor-desgasteAnillos'"
                        button-text="📷"
                        button-class="w-8 h-8 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        @photo-captured="(file) => handlePhotoCaptured('motorDesgasteAnillosImagen', file)"
                        :initial-photo="formData.motor.desgasteAnillosImagen"
                      />
                    </div>
                  </div>
                  
                  <!-- Desgaste válvulas -->
                  <div class="flex items-center justify-between p-2 bg-white rounded border">
                    <label class="flex items-center space-x-2">
                      <input type="checkbox" v-model="formData.motor.desgasteValvulas" class="rounded">
                      <span class="text-sm">Desgaste válvulas</span>
                    </label>
                    <div v-if="formData.motor.desgasteValvulas" class="ml-2">
                      <PhotoUploadAndPreview
                        :key="'motor-desgasteValvulas'"
                        button-text="📷"
                        button-class="w-8 h-8 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        @photo-captured="(file) => handlePhotoCaptured('motorDesgasteValvulasImagen', file)"
                        :initial-photo="formData.motor.desgasteValvulasImagen"
                      />
                    </div>
                  </div>
                  
                  <!-- Falta de lubricación -->
                  <div class="flex items-center justify-between p-2 bg-white rounded border">
                    <label class="flex items-center space-x-2">
                      <input type="checkbox" v-model="formData.motor.faltaLubricacion" class="rounded">
                      <span class="text-sm">Falta de lubricación</span>
                    </label>
                    <div v-if="formData.motor.faltaLubricacion" class="ml-2">
                      <PhotoUploadAndPreview
                        :key="'motor-faltaLubricacion'"
                        button-text="📷"
                        button-class="w-8 h-8 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        @photo-captured="(file) => handlePhotoCaptured('motorFaltaLubricacionImagen', file)"
                        :initial-photo="formData.motor.faltaLubricacionImagen"
                      />
                    </div>
                  </div>
                  
                  <!-- Piezas sueltas -->
                  <div class="flex items-center justify-between p-2 bg-white rounded border">
                    <label class="flex items-center space-x-2">
                      <input type="checkbox" v-model="formData.motor.piezasSueltas" class="rounded">
                      <span class="text-sm">Piezas sueltas</span>
                    </label>
                    <div v-if="formData.motor.piezasSueltas" class="ml-2">
                      <PhotoUploadAndPreview
                        :key="'motor-piezasSueltas'"
                        button-text="📷"
                        button-class="w-8 h-8 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        @photo-captured="(file) => handlePhotoCaptured('motorPiezasSueltasImagen', file)"
                        :initial-photo="formData.motor.piezasSueltasImagen"
                      />
                    </div>
                  </div>
                  
                  <!-- Bujías defectuosas -->
                  <div class="flex items-center justify-between p-2 bg-white rounded border">
                    <label class="flex items-center space-x-2">
                      <input type="checkbox" v-model="formData.motor.bujias" class="rounded">
                      <span class="text-sm">Bujías defectuosas</span>
                    </label>
                    <div v-if="formData.motor.bujias" class="ml-2">
                      <PhotoUploadAndPreview
                        :key="'motor-bujias'"
                        button-text="📷"
                        button-class="w-8 h-8 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        @photo-captured="(file) => handlePhotoCaptured('motorBujiasImagen', file)"
                        :initial-photo="formData.motor.bujiasImagen"
                      />
                    </div>
                  </div>
                  
                  <!-- Problemas con la Batería -->
                  <div class="flex items-center justify-between p-2 bg-white rounded border">
                    <label class="flex items-center space-x-2">
                      <input type="checkbox" v-model="formData.motor.bateria" class="rounded">
                      <span class="text-sm">Problemas con la Batería</span>
                    </label>
                    <div v-if="formData.motor.bateria" class="ml-2">
                      <PhotoUploadAndPreview
                        :key="'motor-bateria'"
                        button-text="📷"
                        button-class="w-8 h-8 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        @photo-captured="(file) => handlePhotoCaptured('motorBateriaImagen', file)"
                        :initial-photo="formData.motor.bateriaImagen"
                      />
                    </div>
                  </div>
                  
                  <!-- Problemas con la Bomba de Gasolina -->
                  <div class="flex items-center justify-between p-2 bg-white rounded border">
                    <label class="flex items-center space-x-2">
                      <input type="checkbox" v-model="formData.motor.bombaGasolina" class="rounded">
                      <span class="text-sm">Problemas con la Bomba de Gasolina</span>
                    </label>
                    <div v-if="formData.motor.bombaGasolina" class="ml-2">
                      <PhotoUploadAndPreview
                        :key="'motor-bombaGasolina'"
                        button-text="📷"
                        button-class="w-8 h-8 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        @photo-captured="(file) => handlePhotoCaptured('motorBombaGasolinaImagen', file)"
                        :initial-photo="formData.motor.bombaGasolinaImagen"
                      />
                    </div>
                  </div>
                  
                  <!-- Falla en el radiador -->
                  <div class="flex items-center justify-between p-2 bg-white rounded border">
                    <label class="flex items-center space-x-2">
                      <input type="checkbox" v-model="formData.motor.fallaRadiador" class="rounded">
                      <span class="text-sm">Falla en el radiador</span>
                    </label>
                    <div v-if="formData.motor.fallaRadiador" class="ml-2">
                      <PhotoUploadAndPreview
                        :key="'motor-fallaRadiador'"
                        button-text="📷"
                        button-class="w-8 h-8 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        @photo-captured="(file) => handlePhotoCaptured('motorFallaRadiadorImagen', file)"
                        :initial-photo="formData.motor.fallaRadiadorImagen"
                      />
                    </div>
                  </div>
                  
                  <!-- Falla termostato -->
                  <div class="flex items-center justify-between p-2 bg-white rounded border">
                    <label class="flex items-center space-x-2">
                      <input type="checkbox" v-model="formData.motor.fallaTermostato" class="rounded">
                      <span class="text-sm">Falla termostato</span>
                    </label>
                    <div v-if="formData.motor.fallaTermostato" class="ml-2">
                      <PhotoUploadAndPreview
                        :key="'motor-fallaTermostato'"
                        button-text="📷"
                        button-class="w-8 h-8 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        @photo-captured="(file) => handlePhotoCaptured('motorFallaTermostatoImagen', file)"
                        :initial-photo="formData.motor.fallaTermostatoImagen"
                      />
                    </div>
                  </div>
                  
                  <!-- Soportes de bujías defectuosas -->
                  <div class="flex items-center justify-between p-2 bg-white rounded border">
                    <label class="flex items-center space-x-2">
                      <input type="checkbox" v-model="formData.motor.soportes" class="rounded">
                      <span class="text-sm">Soportes de bujías defectuosas</span>
                    </label>
                    <div v-if="formData.motor.soportes" class="ml-2">
                      <PhotoUploadAndPreview
                        :key="'motor-soportes'"
                        button-text="📷"
                        button-class="w-8 h-8 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        @photo-captured="(file) => handlePhotoCaptured('motorSoportesImagen', file)"
                        :initial-photo="formData.motor.soportesImagen"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Comentarios sobre el Motor:</label>
                <textarea 
                  v-model="formData.motor.comentarios"
                  class="input w-full resize-none"
                  rows="3"
                  placeholder="Observaciones adicionales sobre el motor..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Sistema de Transmisión -->
        <div v-else-if="isCurrentCategoryStep('transmision')">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Sistema de Transmisión</h3>
          
          <!-- Sección: Sistema de Transmisión -->
          <div class="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
            <h4 class="text-lg font-semibold text-green-800 mb-4">Sistema de Transmisión</h4>
            <div class="space-y-4">
              <!-- Tipo de Mantenimiento -->
              <div class="mb-4 p-4 bg-white rounded-lg border border-green-200">
                <label class="block text-sm font-medium text-gray-700 mb-3">Tipo de Mantenimiento:</label>
                <div class="flex space-x-6">
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.transmision.tipo_mantenimiento" 
                      value="correctivo"
                      class="text-green-600 focus:ring-green-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Correctivo</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.transmision.tipo_mantenimiento" 
                      value="preventivo"
                      class="text-green-600 focus:ring-green-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Preventivo</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Seleccione las fallas detectadas:</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.transmision.retenesDanados" class="rounded">
                    <span class="text-sm">Retenes dañados</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.transmision.juntasDanadas" class="rounded">
                    <span class="text-sm">Juntas dañadas</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.transmision.nivelBajoFlujo" class="rounded">
                    <span class="text-sm">Nivel bajo de flujo</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.transmision.desgasteInterno" class="rounded">
                    <span class="text-sm">Desgaste interno</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.transmision.desgasteDiscos" class="rounded">
                    <span class="text-sm">Desgaste de discos</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.transmision.convertidorTorque" class="rounded">
                    <span class="text-sm">Problemas con el Convertidor de torque</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Comentarios sobre la Transmisión:</label>
                <textarea 
                  v-model="formData.transmision.comentarios"
                  class="input w-full resize-none"
                  rows="3"
                  placeholder="Observaciones adicionales sobre la transmisión..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Sistema de frenos -->
        <div v-else-if="isCurrentCategoryStep('frenos')">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Sistema de Frenos</h3>
          
          <!-- Sección: Frenos -->
          <div class="mb-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border-l-4 border-red-500">
            <h4 class="text-lg font-semibold text-red-800 mb-4">Frenos</h4>
            <div class="space-y-4">
              <!-- Tipo de Mantenimiento -->
              <div class="mb-4 p-4 bg-white rounded-lg border border-red-200">
                <label class="block text-sm font-medium text-gray-700 mb-3">Tipo de Mantenimiento:</label>
                <div class="flex space-x-6">
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.frenos.tipo_mantenimiento" 
                      value="correctivo"
                      class="text-red-600 focus:ring-red-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Correctivo</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.frenos.tipo_mantenimiento" 
                      value="preventivo"
                      class="text-red-600 focus:ring-red-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Preventivo</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Seleccione las fallas detectadas:</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.frenos.aireEnSistema" class="rounded">
                    <span class="text-sm">Aire en el sistema</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.frenos.fugaLiquido" class="rounded">
                    <span class="text-sm">Fuga de líquido</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.frenos.balatasDesgastadas" class="rounded">
                    <span class="text-sm">Balatas desgastadas</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.frenos.discoDesgastado" class="rounded">
                    <span class="text-sm">Disco desgastado</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.frenos.clipers" class="rounded">
                    <span class="text-sm">Clipers defectuosos</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.frenos.manguerasDefectuosas" class="rounded">
                    <span class="text-sm">Mangueras defectuosas</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Comentarios sobre Frenos:</label>
                <textarea 
                  v-model="formData.frenos.comentarios"
                  class="input w-full resize-none"
                  rows="3"
                  placeholder="Observaciones adicionales sobre los frenos..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Sistema eléctrico -->
        <div v-else-if="isCurrentCategoryStep('sistemaElectrico')">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Sistema Eléctrico</h3>
          
          <!-- Sección: Sistema Eléctrico (único recuadro) -->
          <div class="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-l-4 border-yellow-500">
            <h4 class="text-lg font-semibold text-yellow-800 mb-4">Sistema Eléctrico</h4>
            <div class="space-y-6">
              
              <!-- Tipo de Mantenimiento -->
              <div class="mb-4 p-4 bg-white rounded-lg border border-yellow-200">
                <label class="block text-sm font-medium text-gray-700 mb-3">Tipo de Mantenimiento:</label>
                <div class="flex space-x-6">
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.sistemaElectrico.tipo_mantenimiento" 
                      value="correctivo"
                      class="text-yellow-600 focus:ring-yellow-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Correctivo</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.sistemaElectrico.tipo_mantenimiento" 
                      value="preventivo"
                      class="text-yellow-600 focus:ring-yellow-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Preventivo</span>
                  </label>
                </div>
              </div>
              
              <!-- Subcategoría: Batería -->
              <div class="border-b border-yellow-200 pb-4">
                <h5 class="text-md font-medium text-yellow-700 mb-2">Batería</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaElectrico.celdasDanadas" class="rounded">
                    <span class="text-sm">Celdas dañadas</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaElectrico.alternadorDefectuoso" class="rounded">
                    <span class="text-sm">Alternador defectuoso</span>
                  </label>
                </div>
              </div>

              <!-- Subcategoría: Alternador -->
              <div class="border-b border-yellow-200 pb-4">
                <h5 class="text-md font-medium text-yellow-700 mb-2">Alternador</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaElectrico.bandaSuelta" class="rounded">
                    <span class="text-sm">Banda suelta</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaElectrico.alternadorDanado" class="rounded">
                    <span class="text-sm">Alternador dañado</span>
                  </label>
                </div>
              </div>

              <!-- Subcategoría: Luces y Conexiones -->
              <div class="border-b border-yellow-200 pb-4">
                <h5 class="text-md font-medium text-yellow-700 mb-2">Luces y Conexiones</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaElectrico.focoFundido" class="rounded">
                    <span class="text-sm">Foco fundido</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaElectrico.conectoresSulfatados" class="rounded">
                    <span class="text-sm">Conectores sulfatados o flojos</span>
                  </label>
                </div>
              </div>

              <!-- Comentario general para todo el Sistema Eléctrico -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Comentarios generales sobre el Sistema Eléctrico:</label>
                <textarea 
                  v-model="formData.sistemaElectrico.comentarios"
                  class="input w-full resize-none"
                  rows="4"
                  placeholder="Observaciones generales sobre todo el sistema eléctrico..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Suspensión y Dirección -->
        <div v-else-if="isCurrentCategoryStep('suspensionDireccion')">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Suspensión y Dirección</h3>
          
          <!-- Sección: Suspensión y Dirección (único recuadro) -->
          <div class="mb-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-l-4 border-orange-500">
            <h4 class="text-lg font-semibold text-orange-800 mb-4">Suspensión y Dirección</h4>
            <div class="space-y-6">
              
              <!-- Tipo de Mantenimiento -->
              <div class="mb-4 p-4 bg-white rounded-lg border border-orange-200">
                <label class="block text-sm font-medium text-gray-700 mb-3">Tipo de Mantenimiento:</label>
                <div class="flex space-x-6">
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.suspensionDireccion.tipo_mantenimiento" 
                      value="correctivo"
                      class="text-orange-600 focus:ring-orange-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Correctivo</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.suspensionDireccion.tipo_mantenimiento" 
                      value="preventivo"
                      class="text-orange-600 focus:ring-orange-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Preventivo</span>
                  </label>
                </div>
              </div>
              
              <!-- Subcategoría: Amortiguadores -->
              <div class="border-b border-orange-200 pb-4">
                <h5 class="text-md font-medium text-orange-700 mb-2">Amortiguadores</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.suspensionDireccion.desgaste" class="rounded">
                    <span class="text-sm">Desgaste</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.suspensionDireccion.rupturaRetenes" class="rounded">
                    <span class="text-sm">Ruptura de retenes</span>
                  </label>
                </div>
              </div>

              <!-- Subcategoría: Dirección -->
              <div class="border-b border-orange-200 pb-4">
                <h5 class="text-md font-medium text-orange-700 mb-2">Dirección</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.suspensionDireccion.terminales" class="rounded">
                    <span class="text-sm">Terminales dañados</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.suspensionDireccion.cremalleras" class="rounded">
                    <span class="text-sm">Cremalleras desgastadas</span>
                  </label>
                </div>
              </div>

              <!-- Subcategoría: Suspensión General -->
              <div class="border-b border-orange-200 pb-4">
                <h5 class="text-md font-medium text-orange-700 mb-2">Suspensión</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.suspensionDireccion.bujesDanados" class="rounded">
                    <span class="text-sm">Bujes dañados</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.suspensionDireccion.rotulasDanadas" class="rounded">
                    <span class="text-sm">Rótulas dañadas</span>
                  </label>
                </div>
              </div>

              <!-- Comentario general para Suspensión y Dirección -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Comentarios generales sobre Suspensión y Dirección:</label>
                <textarea 
                  v-model="formData.suspensionDireccion.comentarios"
                  class="input w-full resize-none"
                  rows="4"
                  placeholder="Observaciones generales sobre suspensión y dirección..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Sistema de enfriamiento -->
        <div v-else-if="isCurrentCategoryStep('sistemaEnfriamiento')">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Sistema de Enfriamiento</h3>
          
          <!-- Sección: Sistema de Enfriamiento (único recuadro) -->
          <div class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-l-4 border-blue-500">
            <h4 class="text-lg font-semibold text-blue-800 mb-4">Sistema de Enfriamiento</h4>
            <div class="space-y-6">
              
              <!-- Tipo de Mantenimiento -->
              <div class="mb-4 p-4 bg-white rounded-lg border border-blue-200">
                <label class="block text-sm font-medium text-gray-700 mb-3">Tipo de Mantenimiento:</label>
                <div class="flex space-x-6">
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.sistemaEnfriamiento.tipo_mantenimiento" 
                      value="correctivo"
                      class="text-blue-600 focus:ring-blue-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Correctivo</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.sistemaEnfriamiento.tipo_mantenimiento" 
                      value="preventivo"
                      class="text-blue-600 focus:ring-blue-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Preventivo</span>
                  </label>
                </div>
              </div>
              
              <!-- Subcategoría: Radiador -->
              <div class="border-b border-blue-200 pb-4">
                <h5 class="text-md font-medium text-blue-700 mb-2">Radiador</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaEnfriamiento.manguerasPerforadas" class="rounded">
                    <span class="text-sm">Mangueras perforadas</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaEnfriamiento.nucleoPerforado" class="rounded">
                    <span class="text-sm">Núcleo perforado</span>
                  </label>
                </div>
              </div>

              <!-- Subcategoría: Bomba de Agua -->
              <div class="border-b border-blue-200 pb-4">
                <h5 class="text-md font-medium text-blue-700 mb-2">Bomba de Agua</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaEnfriamiento.desgasteReten" class="rounded">
                    <span class="text-sm">Desgaste del retén</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaEnfriamiento.desgasteRodamiento" class="rounded">
                    <span class="text-sm">Desgaste rodamiento</span>
                  </label>
                </div>
              </div>

              <!-- Subcategoría: Control de Temperatura -->
              <div class="border-b border-blue-200 pb-4">
                <h5 class="text-md font-medium text-blue-700 mb-2">Control de Temperatura</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaEnfriamiento.termostatoBloqueado" class="rounded">
                    <span class="text-sm">Termostato bloqueado (Sobrecalentamiento)</span>
                  </label>
                </div>
              </div>

              <!-- Comentario general para Sistema de Enfriamiento -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Comentarios generales sobre el Sistema de Enfriamiento:</label>
                <textarea 
                  v-model="formData.sistemaEnfriamiento.comentarios"
                  class="input w-full resize-none"
                  rows="4"
                  placeholder="Observaciones generales sobre el sistema de enfriamiento..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Sistema de Escape -->
        <div v-else-if="isCurrentCategoryStep('sistemaEscape')">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Sistema de Escape</h3>
          
          <!-- Sección: Sistema de Escape (único recuadro) -->
          <div class="mb-8 p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border-l-4 border-purple-500">
            <h4 class="text-lg font-semibold text-purple-800 mb-4">Sistema de Escape</h4>
            <div class="space-y-6">
              
              <!-- Tipo de Mantenimiento -->
              <div class="mb-4 p-4 bg-white rounded-lg border border-purple-200">
                <label class="block text-sm font-medium text-gray-700 mb-3">Tipo de Mantenimiento:</label>
                <div class="flex space-x-6">
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.sistemaEscape.tipo_mantenimiento" 
                      value="correctivo"
                      class="text-purple-600 focus:ring-purple-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Correctivo</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.sistemaEscape.tipo_mantenimiento" 
                      value="preventivo"
                      class="text-purple-600 focus:ring-purple-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Preventivo</span>
                  </label>
                </div>
              </div>
              
              <!-- Subcategoría: Escape -->
              <div class="border-b border-purple-200 pb-4">
                <h5 class="text-md font-medium text-purple-700 mb-2">Escape</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaEscape.corrosion" class="rounded">
                    <span class="text-sm">Corrosión</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaEscape.impacto" class="rounded">
                    <span class="text-sm">Impacto</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaEscape.silenciadorRoto" class="rounded">
                    <span class="text-sm">Silenciador roto</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaEscape.silenciadorSuelto" class="rounded">
                    <span class="text-sm">Silenciador suelto</span>
                  </label>
                </div>
              </div>

              <!-- Subcategoría: Catalizador -->
              <div class="border-b border-purple-200 pb-4">
                <h5 class="text-md font-medium text-purple-700 mb-2">Catalizador</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaEscape.malaCombustion" class="rounded">
                    <span class="text-sm">Mala combustión</span>
                  </label>
                </div>
              </div>

              <!-- Comentario general para Sistema de Escape -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Comentarios generales sobre el Sistema de Escape:</label>
                <textarea 
                  v-model="formData.sistemaEscape.comentarios"
                  class="input w-full resize-none"
                  rows="4"
                  placeholder="Observaciones generales sobre el sistema de escape..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Sistema de Climatización -->
        <div v-else-if="isCurrentCategoryStep('sistemaClimatizacion')">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Sistema de Climatización</h3>
          
          <!-- Sección: Sistema de Climatización (único recuadro) -->
          <div class="mb-8 p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border-l-4 border-teal-500">
            <h4 class="text-lg font-semibold text-teal-800 mb-4">Sistema de Climatización (A/C y Calefacción)</h4>
            <div class="space-y-6">
              
              <!-- Tipo de Mantenimiento -->
              <div class="mb-4 p-4 bg-white rounded-lg border border-teal-200">
                <label class="block text-sm font-medium text-gray-700 mb-3">Tipo de Mantenimiento:</label>
                <div class="flex space-x-6">
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.sistemaClimatizacion.tipo_mantenimiento" 
                      value="correctivo"
                      class="text-teal-600 focus:ring-teal-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Correctivo</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.sistemaClimatizacion.tipo_mantenimiento" 
                      value="preventivo"
                      class="text-teal-600 focus:ring-teal-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Preventivo</span>
                  </label>
                </div>
              </div>
              
              <!-- Subcategoría: A/C -->
              <div class="border-b border-teal-200 pb-4">
                <h5 class="text-md font-medium text-teal-700 mb-2">Aire Acondicionado (A/C)</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaClimatizacion.fugaGas" class="rounded">
                    <span class="text-sm">Fuga de gas</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaClimatizacion.compresorDanado" class="rounded">
                    <span class="text-sm">Compresor dañado</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaClimatizacion.filtroCabinaSucio" class="rounded">
                    <span class="text-sm">Filtro de cabina sucio</span>
                  </label>
                </div>
              </div>

              <!-- Subcategoría: Calefacción -->
              <div class="border-b border-teal-200 pb-4">
                <h5 class="text-md font-medium text-teal-700 mb-2">Calefacción</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaClimatizacion.fallaTermostato" class="rounded">
                    <span class="text-sm">Falla en termostato</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.sistemaClimatizacion.radiadorInterior" class="rounded">
                    <span class="text-sm">Falla en el Radiador interior</span>
                  </label>
                </div>
              </div>

              <!-- Comentario general para Sistema de Climatización -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Comentarios generales sobre el Sistema de Climatización:</label>
                <textarea 
                  v-model="formData.sistemaClimatizacion.comentarios"
                  class="input w-full resize-none"
                  rows="4"
                  placeholder="Observaciones generales sobre el sistema de climatización..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Carrocería y Accesorios -->
        <div v-else-if="isCurrentCategoryStep('carroceriaAccesorios')">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Carrocería y Accesorios</h3>
          
          <!-- Sección: Carrocería y Accesorios (único recuadro) -->
          <div class="mb-8 p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border-l-4 border-pink-500">
            <h4 class="text-lg font-semibold text-pink-800 mb-4">Carrocería y Accesorios</h4>
            <div class="space-y-6">
              
              <!-- Tipo de Mantenimiento -->
              <div class="mb-4 p-4 bg-white rounded-lg border border-pink-200">
                <label class="block text-sm font-medium text-gray-700 mb-3">Tipo de Mantenimiento:</label>
                <div class="flex space-x-6">
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.carroceriaAccesorios.tipo_mantenimiento" 
                      value="correctivo"
                      class="text-pink-600 focus:ring-pink-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Correctivo</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.carroceriaAccesorios.tipo_mantenimiento" 
                      value="preventivo"
                      class="text-pink-600 focus:ring-pink-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Preventivo</span>
                  </label>
                </div>
              </div>
              
              <!-- Subcategoría: Carrocería -->
              <div class="border-b border-pink-200 pb-4">
                <h5 class="text-md font-medium text-pink-700 mb-2">Carrocería</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.carroceriaAccesorios.golpes" class="rounded">
                    <span class="text-sm">Golpes</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.carroceriaAccesorios.roces" class="rounded">
                    <span class="text-sm">Roces</span>
                  </label>
                </div>
              </div>

              <!-- Subcategoría: Puertas -->
              <div class="border-b border-pink-200 pb-4">
                <h5 class="text-md font-medium text-pink-700 mb-2">Puertas</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.carroceriaAccesorios.cerraduras" class="rounded">
                    <span class="text-sm">Cerraduras defectuosas</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.carroceriaAccesorios.bisagraDesajustada" class="rounded">
                    <span class="text-sm">Bisagra desajustada</span>
                  </label>
                </div>
              </div>

              <!-- Subcategoría: Cristales -->
              <div class="border-b border-pink-200 pb-4">
                <h5 class="text-md font-medium text-pink-700 mb-2">Cristales</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.carroceriaAccesorios.impactoCristal" class="rounded">
                    <span class="text-sm">Impacto</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.carroceriaAccesorios.tensionTermica" class="rounded">
                    <span class="text-sm">Tensión térmica</span>
                  </label>
                </div>
              </div>

              <!-- Subcategoría: Limpia parabrisas -->
              <div class="border-b border-pink-200 pb-4">
                <h5 class="text-md font-medium text-pink-700 mb-2">Limpia parabrisas</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.carroceriaAccesorios.motorDanado" class="rounded">
                    <span class="text-sm">Motor dañado</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.carroceriaAccesorios.fusibleDanado" class="rounded">
                    <span class="text-sm">Fusible dañado</span>
                  </label>
                </div>
              </div>

              <!-- Comentario general para Carrocería y Accesorios -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Comentarios generales sobre Carrocería y Accesorios:</label>
                <textarea 
                  v-model="formData.carroceriaAccesorios.comentarios"
                  class="input w-full resize-none"
                  rows="4"
                  placeholder="Observaciones generales sobre carrocería y accesorios..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Llantas y Rines -->
        <div v-else-if="isCurrentCategoryStep('llantasRines')">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Llantas y Rines</h3>
          
          <!-- Sección: Llantas y Rines (único recuadro) -->
          <div class="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border-l-4 border-indigo-500">
            <h4 class="text-lg font-semibold text-indigo-800 mb-4">Llantas y Rines</h4>
            <div class="space-y-6">
              
              <!-- Tipo de Mantenimiento -->
              <div class="mb-4 p-4 bg-white rounded-lg border border-indigo-200">
                <label class="block text-sm font-medium text-gray-700 mb-3">Tipo de Mantenimiento:</label>
                <div class="flex space-x-6">
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.llantasRines.tipo_mantenimiento" 
                      value="correctivo"
                      class="text-indigo-600 focus:ring-indigo-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Correctivo</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      v-model="formData.llantasRines.tipo_mantenimiento" 
                      value="preventivo"
                      class="text-indigo-600 focus:ring-indigo-500"
                    >
                    <span class="text-sm font-medium text-gray-700">Preventivo</span>
                  </label>
                </div>
              </div>
              
              <!-- Subcategoría: Llantas -->
              <div class="border-b border-indigo-200 pb-4">
                <h5 class="text-md font-medium text-indigo-700 mb-2">Llantas</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.llantasRines.alineacion" class="rounded">
                    <span class="text-sm">Alineación</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.llantasRines.balanceoDeficiente" class="rounded">
                    <span class="text-sm">Balanceo deficiente</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.llantasRines.presionIncorrecta" class="rounded">
                    <span class="text-sm">Presión incorrecta</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.llantasRines.revisionFechaFabricacion" class="rounded">
                    <span class="text-sm">Revisión de fecha de fabricación</span>
                  </label>
                </div>
              </div>

              <!-- Subcategoría: Rines -->
              <div class="border-b border-indigo-200 pb-4">
                <h5 class="text-md font-medium text-indigo-700 mb-2">Rines</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.llantasRines.impactoBaches" class="rounded">
                    <span class="text-sm">Impacto con baches</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.llantasRines.impactoBanquetas" class="rounded">
                    <span class="text-sm">Impacto banquetas</span>
                  </label>
                </div>
              </div>

              <!-- Comentario general para Llantas y Rines -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Comentarios generales sobre Llantas y Rines:</label>
                <textarea 
                  v-model="formData.llantasRines.comentarios"
                  class="input w-full resize-none"
                  rows="4"
                  placeholder="Observaciones generales sobre llantas y rines..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Recuadro de validación -->
        <div v-if="!isStepValid" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Complete los campos obligatorios</h3>
              <div class="mt-2 text-sm text-red-700">
                <ul class="list-disc pl-5 space-y-1">
                  <li v-for="error in validationErrors" :key="error">{{ error }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Navegación entre pasos -->
        <div class="mt-8 flex justify-between">
          <BaseButton 
            v-if="currentStep > 1" 
            @click="handlePrevStep" 
            variant="secondary"
          >
            Anterior
          </BaseButton>
          <div v-else></div>
          
          <BaseButton 
            v-if="currentStep < dynamicTotalSteps" 
            @click="handleNextStep"
            variant="primary"
            :disabled="!isStepValid"
          >
            Siguiente
          </BaseButton>
          
          <BaseButton 
            v-if="currentStep === dynamicTotalSteps"
            @click="handleFinalSubmit"
            variant="success"
            :disabled="!isStepValid"
            custom-loading-text="Guardando diagnóstico"
            :min-delay="1500"
          >
            Completar Diagnóstico
          </BaseButton>
        </div>
        
        <!-- Información del progreso -->
        <div v-if="selectedCategories.length > 0" class="mt-4 text-center text-sm text-gray-600">
          <span v-if="currentStep === 1">
            Sistemas seleccionados: {{ selectedCategories.length }}
          </span>
          <span v-else>
            Paso {{ currentStep - 1 }} de {{ selectedCategories.length }}: {{ getCategoryDisplayName(currentCategory) }}
          </span>
        </div>
        
        <!-- Indicador de progreso -->
        <div class="mt-6 flex justify-center gap-2">
          <div v-for="step in dynamicTotalSteps" :key="step" 
               :class="[
                 'w-3 h-3 rounded-full transition-colors',
                 step === currentStep ? 'bg-blue-600' : 
                 step < currentStep ? 'bg-green-500' : 'bg-gray-300'
               ]">
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import BaseButton from '../global/BaseButton.vue';
import PhotoUploadAndPreview from '../global/PhotoUploadAndPreview.vue';
import { useSubmitButton } from '../../composables/useSubmitButton.js';
import { useToastStore } from '../../stores/toast.js';
import apiClient from '../../services/api.js'

export default {
  name: 'DiagnosticosFormModal',
  components: {
    BaseButton,
    PhotoUploadAndPreview
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    diagnosticoData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['close', 'diagnostico-guardado'],
  setup() {
    const { executeSubmit } = useSubmitButton();
    const toastStore = useToastStore();
    return {
      executeSubmit,
      toastStore
    };
  },
  data() {
    return {
      currentStep: 1,
      totalSteps: 10,
      
      // Categorías disponibles para diagnóstico
      categoriesSelection: {
        motor: false,
        transmision: false,
        frenos: false,
        sistemaElectrico: false,
        suspensionDireccion: false,
        sistemaEnfriamiento: false,
        sistemaEscape: false,
        sistemaClimatizacion: false,
        carroceriaAccesorios: false,
        llantasRines: false
      },
      
      // Datos del formulario organizados por categorías
      formData: {
        // STEP 1: Motor
        motor: {
          tipo_mantenimiento: 'correctivo', // preventivo o correctivo
          empaques: false,
          sellos: false,
          desgasteAnillos: false,
          desgasteValvulas: false,
          faltaLubricacion: false,
          piezasSueltas: false,
          bujias: false,
          bateria: false,
          bombaGasolina: false,
          fallaRadiador: false,
          fallaTermostato: false,
          soportes: false,
          comentarios: '',
          // Campos de imagen opcionales
          empaquesImagen: null,
          sellosImagen: null,
          desgasteAnillosImagen: null,
          desgasteValvulasImagen: null,
          faltaLubricacionImagen: null,
          piezasSueltasImagen: null,
          bujiasImagen: null,
          bateriaImagen: null,
          bombaGasolinaImagen: null,
          fallaRadiadorImagen: null,
          fallaTermostatoImagen: null,
          soportesImagen: null
        },
        
        // STEP 2: Sistema de Transmisión
        transmision: {
          tipo_mantenimiento: 'correctivo', // preventivo o correctivo
          retenesDanados: false,
          juntasDanadas: false,
          nivelBajoFlujo: false,
          desgasteInterno: false,
          desgasteDiscos: false,
          convertidorTorque: false,
          mantenimientoProgramado: false,
          comentarios: '',
          // Campos de imagen opcionales
          retenesDanadosImagen: null,
          juntasDanadasImagen: null,
          nivelBajoFlujoImagen: null,
          desgasteInternoImagen: null,
          desgasteDiscosImagen: null,
          convertidorTorqueImagen: null
        },
        
        // STEP 3: Sistema de frenos
        frenos: {
          tipo_mantenimiento: 'correctivo', // preventivo o correctivo
          aireEnSistema: false,
          fugaLiquido: false,
          balatasDesgastadas: false,
          discoDesgastado: false,
          clipers: false,
          manguerasDefectuosas: false,
          controlDesgastePeriodico: false,
          comentarios: '',
          // Campos de imagen opcionales
          aireEnSistemaImagen: null,
          fugaLiquidoImagen: null,
          balatasDesgastadasImagen: null,
          discoDesgastadoImagen: null,
          clipersImagen: null,
          manguerasDefectuosasImagen: null
        },
        
        // STEP 4: Sistema eléctrico (unificado)
        sistemaElectrico: {
          tipo_mantenimiento: 'correctivo', // preventivo o correctivo
          // Batería
          celdasDanadas: false,
          alternadorDefectuoso: false,
          // Alternador
          bandaSuelta: false,
          alternadorDanado: false,
          // Luces y conexiones
          focoFundido: false,
          conectoresSulfatados: false,
          inspeccionPeriodica: false,
          comentarios: '',
          // Campos de imagen opcionales
          celdasDanadasImagen: null,
          alternadorDefectuosoImagen: null,
          bandaSueltaImagen: null,
          alternadorDanadoImagen: null,
          focoFundidoImagen: null,
          conectoresSulfatadosImagen: null
        },
        
        // STEP 5: Suspensión y Dirección (unificado)
        suspensionDireccion: {
          tipo_mantenimiento: 'correctivo', // preventivo o correctivo
          // Amortiguadores
          desgaste: false,
          rupturaRetenes: false,
          // Dirección
          terminales: false,
          cremalleras: false,
          // Suspensión
          bujesDanados: false,
          rotulasDanadas: false,
          ajusteProgramado: false,
          comentarios: '',
          // Campos de imagen opcionales
          desgasteImagen: null,
          rupturaRetenesImagen: null,
          terminalesImagen: null,
          cremallerasImagen: null,
          bujesDanadosImagen: null,
          rotulasDanadasImagen: null
        },
        
        // STEP 6: Sistema de enfriamiento (unificado)
        sistemaEnfriamiento: {
          tipo_mantenimiento: 'correctivo', // preventivo o correctivo
          // Radiador
          manguerasPerforadas: false,
          nucleoPerforado: false,
          // Bomba de agua
          desgasteReten: false,
          desgasteRodamiento: false,
          // Control de temperatura
          termostatoBloqueado: false,
          controlTemperatura: false,
          comentarios: '',
          // Campos de imagen opcionales
          manguerasPerforadasImagen: null,
          nucleoPerforadoImagen: null,
          desgasteRetenImagen: null,
          desgasteRodamientoImagen: null,
          termostatoBloqueadoImagen: null
        },
        
        // STEP 7: Sistema de Escape (unificado)
        sistemaEscape: {
          tipo_mantenimiento: 'correctivo', // preventivo o correctivo
          // Escape
          fugasPerforaciones: false,
          corrosion: false,
          impacto: false,
          ruidoExcesivo: false,
          silenciadorRoto: false,
          silenciadorSuelto: false,
          // Catalizador
          catalizadorObstruido: false,
          malaCombustion: false,
          comentarios: '',
          // Campos de imagen opcionales
          fugasPerforacionesImagen: null,
          corrosionImagen: null,
          impactoImagen: null,
          ruidoExcesivoImagen: null,
          silenciadorRotoImagen: null,
          silenciadorSueltoImagen: null,
          catalizadorObstruidoImagen: null,
          malaCombustionImagen: null
        },
        
        // STEP 8: Sistema de Climatización (unificado)
        sistemaClimatizacion: {
          tipo_mantenimiento: 'correctivo', // preventivo o correctivo
          // A/C
          acNoEnfria: false,
          fugaGas: false,
          compresorDanado: false,
          malOlorVentilacion: false,
          filtroCabinaSucio: false,
          revisionPresionesGas: false,
          // Calefacción
          noCalienta: false,
          fallaTermostato: false,
          radiadorInterior: false,
          comentarios: '',
          // Campos de imagen opcionales
          acNoEnfriaImagen: null,
          fugaGasImagen: null,
          compresorDanadoImagen: null,
          malOlorVentilacionImagen: null,
          filtroCabinaSucioImagen: null,
          noCalientaImagen: null,
          fallaTermostatoImagen: null,
          radiadorInteriorImagen: null
        },
        
        // STEP 9: Carrocería y Accesorios (unificado)
        carroceriaAccesorios: {
          tipo_mantenimiento: 'correctivo', // preventivo o correctivo
          // Carrocería
          rayonesAbolladuras: false,
          golpes: false,
          roces: false,
          // Puertas
          cierreDeficiente: false,
          cerraduras: false,
          bisagraDesajustada: false,
          // Cristales
          grietasAstilladuras: false,
          impactoCristal: false,
          tensionTermica: false,
          // Limpia parabrisas
          limpiaNoFunciona: false,
          motorDanado: false,
          fusibleDanado: false,
          comentarios: '',
          // Campos de imagen opcionales
          rayonesAbolladurasImagen: null,
          golpesImagen: null,
          rocesImagen: null,
          cierreDeficienteImagen: null,
          cerradurasImagen: null,
          bisagraDesajustadaImagen: null,
          grietasAstilladurasImagen: null,
          impactoCristalImagen: null,
          tensionTermicaImagen: null,
          limpiaNoFuncionaImagen: null,
          motorDanadoImagen: null,
          fusibleDanadoImagen: null
        },
        
        // STEP 10: Llantas y Rines (unificado)
        llantasRines: {
          tipo_mantenimiento: 'correctivo', // preventivo o correctivo
          // Llantas
          desgasteIrregular: false,
          alineacion: false,
          balanceoDeficiente: false,
          presionIncorrecta: false,
          revisionPeriodica: false,
          revisionFechaFabricacion: false,
          controlVidaUtil: false,
          // Rines
          rinesGolpeadosDeformados: false,
          impactoBaches: false,
          impactoBanquetas: false,
          comentarios: '',
          // Campos de imagen opcionales
          desgasteIrregularImagen: null,
          alineacionImagen: null,
          balanceoDeficienteImagen: null,
          presionIncorrectaImagen: null,
          rinesGolpeadosDeformadosImagen: null,
          impactoBachesImagen: null,
          impactoBanquetasImagen: null
        }
      }
    };
  },
  
  computed: {
    // Obtener las categorías seleccionadas en orden
    selectedCategories() {
      const categories = [
        'motor',
        'transmision', 
        'frenos',
        'sistemaElectrico',
        'suspensionDireccion',
        'sistemaEnfriamiento',
        'sistemaEscape',
        'sistemaClimatizacion',
        'carroceriaAccesorios',
        'llantasRines'
      ];
      
      return categories.filter(category => this.categoriesSelection[category]);
    },
    
    // Calcular el total de pasos dinámicamente
    dynamicTotalSteps() {
      return this.selectedCategories.length + 1; // +1 for selection step
    },
    
    // Obtener la categoría actual basada en el step
    currentCategory() {
      if (this.currentStep === 1) return null; // Selection step
      const categoryIndex = this.currentStep - 2; // -2 because step 1 is selection, step 2 is first category
      return this.selectedCategories[categoryIndex] || null;
    },
    
    isStepValid() {
      // Step 1: Validar selección de categorías
      if (this.currentStep === 1) {
        return this.selectedCategories.length > 0;
      }
      
      // Steps de categorías: Validar que tenga al menos una selección o comentario
      const category = this.currentCategory;
      if (!category || !this.formData[category]) return false;
      
      const categoryData = this.formData[category];
      const hasSelection = Object.keys(categoryData).some(key => 
        key !== 'comentarios' && categoryData[key]
      );
      const hasComments = categoryData.comentarios && categoryData.comentarios.trim();
      
      return hasSelection || hasComments;

    },
    
    validationErrors() {
      const errors = [];
      
      // Step 1: Validar selección de categorías
      if (this.currentStep === 1) {
        if (this.selectedCategories.length === 0) {
          errors.push('Debe seleccionar al menos un sistema para diagnosticar');
        }
        return errors;
      }
      
      // Steps de categorías
      const category = this.currentCategory;
      if (!category || !this.formData[category]) return errors;
      
      const categoryData = this.formData[category];
      const hasSelection = Object.keys(categoryData).some(key => 
        key !== 'comentarios' && categoryData[key]
      );
      const hasComments = categoryData.comentarios && categoryData.comentarios.trim();
      
      if (!hasSelection && !hasComments) {
        const categoryNames = {
          motor: 'Motor',
          transmision: 'Sistema de Transmisión',
          frenos: 'Sistema de Frenos',
          sistemaElectrico: 'Sistema Eléctrico',
          suspensionDireccion: 'Suspensión y Dirección',
          sistemaEnfriamiento: 'Sistema de Enfriamiento',
          sistemaEscape: 'Sistema de Escape',
          sistemaClimatizacion: 'Sistema de Climatización',
          carroceriaAccesorios: 'Carrocería y Accesorios',
          llantasRines: 'Llantas y Rines'
        };
        errors.push(`Debe seleccionar al menos una falla o agregar comentarios en ${categoryNames[category]}`);
      }
      
      return errors;

    },
    
    finalFormData() {
      // Crear estructura JSON final con objetos anidados para cada sistema
      const result = {
        fechaCompletado: new Date().toISOString()
      };
      
      // --- MOTOR ---
      if (this.categoriesSelection.motor) {
        result.detalleMotor = {
          tipo_mantenimiento: this.formData.motor?.tipo_mantenimiento || 'correctivo',
          motorEmpaques: this.formData.motor?.empaques || false,
          motorSellos: this.formData.motor?.sellos || false,
          motorDesgasteAnillos: this.formData.motor?.desgasteAnillos || false,
          motorDesgasteValvulas: this.formData.motor?.desgasteValvulas || false,
          motorFaltaLubricacion: this.formData.motor?.faltaLubricacion || false,
          motorPiezasSueltas: this.formData.motor?.piezasSueltas || false,
          motorBujias: this.formData.motor?.bujias || false,
          motorBateria: this.formData.motor?.bateria || false,
          motorBombaGasolina: this.formData.motor?.bombaGasolina || false,
          motorFallaRadiador: this.formData.motor?.fallaRadiador || false,
          motorFallaTermostato: this.formData.motor?.fallaTermostato || false,
          motorSoportes: this.formData.motor?.soportes || false,
          motorComentarios: this.formData.motor?.comentarios || '',
          // Imágenes opcionales
          motorEmpaquesImagen: this.formData.motor?.empaquesImagen || null,
          motorSellosImagen: this.formData.motor?.sellosImagen || null,
          motorDesgasteAnillosImagen: this.formData.motor?.desgasteAnillosImagen || null,
          motorDesgasteValvulasImagen: this.formData.motor?.desgasteValvulasImagen || null,
          motorFaltaLubricacionImagen: this.formData.motor?.faltaLubricacionImagen || null,
          motorPiezasSueltasImagen: this.formData.motor?.piezasSueltasImagen || null,
          motorBujiasImagen: this.formData.motor?.bujiasImagen || null,
          motorBateriaImagen: this.formData.motor?.bateriaImagen || null,
          motorBombaGasolinaImagen: this.formData.motor?.bombaGasolinaImagen || null,
          motorFallaRadiadorImagen: this.formData.motor?.fallaRadiadorImagen || null,
          motorFallaTermostatoImagen: this.formData.motor?.fallaTermostatoImagen || null,
          motorSoportesImagen: this.formData.motor?.soportesImagen || null
        };
      }
      
      // --- TRANSMISION ---
      if (this.categoriesSelection.transmision) {
        result.detalleTransmision = {
          tipo_mantenimiento: this.formData.transmision?.tipo_mantenimiento || 'correctivo',
          transmisionRetenesDanados: this.formData.transmision?.retenesDanados || false,
          transmisionJuntasDanadas: this.formData.transmision?.juntasDanadas || false,
          transmisionNivelBajoFlujo: this.formData.transmision?.nivelBajoFlujo || false,
          transmisionDesgasteInterno: this.formData.transmision?.desgasteInterno || false,
          transmisionDesgasteDiscos: this.formData.transmision?.desgasteDiscos || false,
          transmisionConvertidorTorque: this.formData.transmision?.convertidorTorque || false,
          transmisionMantenimientoProgramado: this.formData.transmision?.mantenimientoProgramado || false,
          transmisionComentarios: this.formData.transmision?.comentarios || '',
          // Imágenes opcionales
          transmisionRetenesDanadosImagen: this.formData.transmision?.retenesDanadosImagen || null,
          transmisionJuntasDanadasImagen: this.formData.transmision?.juntasDanadasImagen || null,
          transmisionNivelBajoFlujoImagen: this.formData.transmision?.nivelBajoFlujoImagen || null,
          transmisionDesgasteInternoImagen: this.formData.transmision?.desgasteInternoImagen || null,
          transmisionDesgasteDiscosImagen: this.formData.transmision?.desgasteDiscosImagen || null,
          transmisionConvertidorTorqueImagen: this.formData.transmision?.convertidorTorqueImagen || null
        };
      }
      
      // --- FRENOS ---
      if (this.categoriesSelection.frenos) {
        result.detalleFrenos = {
          tipo_mantenimiento: this.formData.frenos?.tipo_mantenimiento || 'correctivo',
          frenosAireEnSistema: this.formData.frenos?.aireEnSistema || false,
          frenosFugaLiquido: this.formData.frenos?.fugaLiquido || false,
          frenosBalatasDesgastadas: this.formData.frenos?.balatasDesgastadas || false,
          frenosDiscoDesgastado: this.formData.frenos?.discoDesgastado || false,
          frenosClipers: this.formData.frenos?.clipers || false,
          frenosManguerasDefectuosas: this.formData.frenos?.manguerasDefectuosas || false,
          frenosControlDesgastePeriodico: this.formData.frenos?.controlDesgastePeriodico || false,
          frenosComentarios: this.formData.frenos?.comentarios || '',
          // Imágenes opcionales
          frenosAireEnSistemaImagen: this.formData.frenos?.aireEnSistemaImagen || null,
          frenosFugaLiquidoImagen: this.formData.frenos?.fugaLiquidoImagen || null,
          frenosBalatasDesgastadasImagen: this.formData.frenos?.balatasDesgastadasImagen || null,
          frenosDiscoDesgastadoImagen: this.formData.frenos?.discoDesgastadoImagen || null,
          frenosClipersImagen: this.formData.frenos?.clipersImagen || null,
          frenosManguerasDefectuosasImagen: this.formData.frenos?.manguerasDefectuosasImagen || null
        };
      }
      
      // --- SISTEMA ELECTRICO ---
      if (this.categoriesSelection.sistemaElectrico) {
        result.detalleSistemaElectrico = {
          tipo_mantenimiento: this.formData.sistemaElectrico?.tipo_mantenimiento || 'correctivo',
          electricoCeldasDanadas: this.formData.sistemaElectrico?.celdasDanadas || false,
          electricoAlternadorDefectuoso: this.formData.sistemaElectrico?.alternadorDefectuoso || false,
          electricoBandaSuelta: this.formData.sistemaElectrico?.bandaSuelta || false,
          electricoAlternadorDanado: this.formData.sistemaElectrico?.alternadorDanado || false,
          electricoFocoFundido: this.formData.sistemaElectrico?.focoFundido || false,
          electricoConectoresSulfatados: this.formData.sistemaElectrico?.conectoresSulfatados || false,
          electricoInspeccionPeriodica: this.formData.sistemaElectrico?.inspeccionPeriodica || false,
          electricoComentarios: this.formData.sistemaElectrico?.comentarios || '',
          // Imágenes opcionales
          electricoCeldasDanadasImagen: this.formData.sistemaElectrico?.celdasDanadasImagen || null,
          electricoAlternadorDefectuosoImagen: this.formData.sistemaElectrico?.alternadorDefectuosoImagen || null,
          electricoBandaSueltaImagen: this.formData.sistemaElectrico?.bandaSueltaImagen || null,
          electricoAlternadorDanadoImagen: this.formData.sistemaElectrico?.alternadorDanadoImagen || null,
          electricoFocoFundidoImagen: this.formData.sistemaElectrico?.focoFundidoImagen || null,
          electricoConectoresSulfatadosImagen: this.formData.sistemaElectrico?.conectoresSulfatadosImagen || null
        };
      }
      
      // --- SUSPENSION Y DIRECCION ---
      if (this.categoriesSelection.suspensionDireccion) {
        result.detalleSuspensionDireccion = {
          tipo_mantenimiento: this.formData.suspensionDireccion?.tipo_mantenimiento || 'correctivo',
          suspensionDesgaste: this.formData.suspensionDireccion?.desgaste || false,
          suspensionRupturaRetenes: this.formData.suspensionDireccion?.rupturaRetenes || false,
          direccionTerminales: this.formData.suspensionDireccion?.terminales || false,
          direccionCremalleras: this.formData.suspensionDireccion?.cremalleras || false,
          suspensionBujesDanados: this.formData.suspensionDireccion?.bujesDanados || false,
          suspensionRotulasDanadas: this.formData.suspensionDireccion?.rotulasDanadas || false,
          suspensionAjusteProgramado: this.formData.suspensionDireccion?.ajusteProgramado || false,
          suspensionComentarios: this.formData.suspensionDireccion?.comentarios || ''
        };
      }
      
      // --- SISTEMA ENFRIAMIENTO ---
      if (this.categoriesSelection.sistemaEnfriamiento) {
        result.detalleSistemaEnfriamiento = {
          tipo_mantenimiento: this.formData.sistemaEnfriamiento?.tipo_mantenimiento || 'correctivo',
          enfriamientoManguerasPerforadas: this.formData.sistemaEnfriamiento?.manguerasPerforadas || false,
          enfriamientoNucleoPerforado: this.formData.sistemaEnfriamiento?.nucleoPerforado || false,
          enfriamientoDesgasteReten: this.formData.sistemaEnfriamiento?.desgasteReten || false,
          enfriamientoDesgasteRodamiento: this.formData.sistemaEnfriamiento?.desgasteRodamiento || false,
          enfriamientoTermostatoBloqueado: this.formData.sistemaEnfriamiento?.termostatoBloqueado || false,
          enfriamientoControlTemperatura: this.formData.sistemaEnfriamiento?.controlTemperatura || false,
          enfriamientoComentarios: this.formData.sistemaEnfriamiento?.comentarios || ''
        };
      }
      
      // --- SISTEMA ESCAPE ---
      if (this.categoriesSelection.sistemaEscape) {
        result.detalleSistemaEscape = {
          tipo_mantenimiento: this.formData.sistemaEscape?.tipo_mantenimiento || 'correctivo',
          escapeFugasPerforaciones: this.formData.sistemaEscape?.fugasPerforaciones || false,
          escapeCorrosion: this.formData.sistemaEscape?.corrosion || false,
          escapeImpacto: this.formData.sistemaEscape?.impacto || false,
          escapeRuidoExcesivo: this.formData.sistemaEscape?.ruidoExcesivo || false,
          escapeSilenciadorRoto: this.formData.sistemaEscape?.silenciadorRoto || false,
          escapeSilenciadorSuelto: this.formData.sistemaEscape?.silenciadorSuelto || false,
          escapeCatalizadorObstruido: this.formData.sistemaEscape?.catalizadorObstruido || false,
          escapeMalaCombustion: this.formData.sistemaEscape?.malaCombustion || false,
          escapeComentarios: this.formData.sistemaEscape?.comentarios || ''
        };
      }
      
      // --- SISTEMA CLIMATIZACION ---
      if (this.categoriesSelection.sistemaClimatizacion) {
        result.detalleSistemaClimatizacion = {
          tipo_mantenimiento: this.formData.sistemaClimatizacion?.tipo_mantenimiento || 'correctivo',
          climatizacionAcNoEnfria: this.formData.sistemaClimatizacion?.acNoEnfria || false,
          climatizacionFugaGas: this.formData.sistemaClimatizacion?.fugaGas || false,
          climatizacionCompresorDanado: this.formData.sistemaClimatizacion?.compresorDanado || false,
          climatizacionMalOlorVentilacion: this.formData.sistemaClimatizacion?.malOlorVentilacion || false,
          climatizacionFiltroCabinaSucio: this.formData.sistemaClimatizacion?.filtroCabinaSucio || false,
          climatizacionRevisionPresionesGas: this.formData.sistemaClimatizacion?.revisionPresionesGas || false,
          climatizacionNoCalienta: this.formData.sistemaClimatizacion?.noCalienta || false,
          climatizacionFallaTermostato: this.formData.sistemaClimatizacion?.fallaTermostato || false,
          climatizacionRadiadorInterior: this.formData.sistemaClimatizacion?.radiadorInterior || false,
          climatizacionComentarios: this.formData.sistemaClimatizacion?.comentarios || ''
        };
      }
      
      // --- CARROCERIA Y ACCESORIOS ---
      if (this.categoriesSelection.carroceriaAccesorios) {
        result.detalleCarroceriaAccesorios = {
          tipo_mantenimiento: this.formData.carroceriaAccesorios?.tipo_mantenimiento || 'correctivo',
          carroceriaRayonesAbolladuras: this.formData.carroceriaAccesorios?.rayonesAbolladuras || false,
          carroceriaGolpes: this.formData.carroceriaAccesorios?.golpes || false,
          carroceriaRoces: this.formData.carroceriaAccesorios?.roces || false,
          puertasCierreDeficiente: this.formData.carroceriaAccesorios?.cierreDeficiente || false,
          puertasCerraduras: this.formData.carroceriaAccesorios?.cerraduras || false,
          puertasBisagraDesajustada: this.formData.carroceriaAccesorios?.bisagraDesajustada || false,
          cristalesGrietasAstilladuras: this.formData.carroceriaAccesorios?.grietasAstilladuras || false,
          cristalesImpactoCristal: this.formData.carroceriaAccesorios?.impactoCristal || false,
          cristalesTensionTermica: this.formData.carroceriaAccesorios?.tensionTermica || false,
          limpiaParabrisasNoFunciona: this.formData.carroceriaAccesorios?.limpiaNoFunciona || false,
          limpiaParabrisasMotorDanado: this.formData.carroceriaAccesorios?.motorDanado || false,
          limpiaParabrisasFusibleDanado: this.formData.carroceriaAccesorios?.fusibleDanado || false,
          carroceriaComentarios: this.formData.carroceriaAccesorios?.comentarios || ''
        };
      }
      
      // --- LLANTAS Y RINES ---
      if (this.categoriesSelection.llantasRines) {
        result.detalleLlantasRines = {
          tipo_mantenimiento: this.formData.llantasRines?.tipo_mantenimiento || 'correctivo',
          llantasDesgasteIrregular: this.formData.llantasRines?.desgasteIrregular || false,
          llantasAlineacion: this.formData.llantasRines?.alineacion || false,
          llantasBalanceoDeficiente: this.formData.llantasRines?.balanceoDeficiente || false,
          llantasPresionIncorrecta: this.formData.llantasRines?.presionIncorrecta || false,
          llantasRevisionPeriodica: this.formData.llantasRines?.revisionPeriodica || false,
          llantasRevisionFechaFabricacion: this.formData.llantasRines?.revisionFechaFabricacion || false,
          llantasControlVidaUtil: this.formData.llantasRines?.controlVidaUtil || false,
          rinesGolpeadosDeformados: this.formData.llantasRines?.rinesGolpeadosDeformados || false,
          rinesImpactoBaches: this.formData.llantasRines?.impactoBaches || false,
          rinesImpactoBanquetas: this.formData.llantasRines?.impactoBanquetas || false,
          llantasComentarios: this.formData.llantasRines?.comentarios || ''
        };
      }
      
      // Log del JSON completo para debug
      console.log('=== JSON DIAGNOSTICO CON OBJETOS ANIDADOS ===');
      console.log(JSON.stringify(result, null, 2));
      console.log('=============================================');
      
      return result;
    }
  },
  
  created() {
    this.loadDiagnosticoData();
  },
  
  watch: {
    diagnosticoData: {
      handler() {
        this.loadDiagnosticoData();
      },
      deep: true
    },
    
    selectedCategories: {
      handler(newCategories, oldCategories) {
        // Si estamos en un paso que ya no es válido debido a cambios en las categorías
        if (this.currentStep > 1 && this.currentStep > newCategories.length + 1) {
          this.currentStep = newCategories.length + 1; // Ir al último paso válido
        }
      },
      deep: true
    },
    
    // Watcher para mostrar el JSON en tiempo real cuando cambian los datos
    formData: {
      deep: true,
      handler(newVal) {
        console.log('=== CAMBIO EN FORM DATA DETECTADO ===');
        console.log('Datos del formulario actualizados:', newVal);
        
        // Forzar recálculo del JSON final
        this.$nextTick(() => {
          const currentJson = this.finalFormData;
          console.log('=== JSON ACTUALIZADO EN TIEMPO REAL ===');
          console.log(JSON.stringify(currentJson, null, 2));
          console.log('=========================================');
        });
      }
    },
    
    // Watcher para las selecciones de categorías
    categoriesSelection: {
      deep: true,
      handler(newVal) {
        console.log('=== CAMBIO EN CATEGORÍAS DETECTADO ===');
        console.log('Categorías seleccionadas:', newVal);
        console.log('selectedCategories computed:', this.selectedCategories);
        console.log('currentStep:', this.currentStep);
        console.log('dynamicTotalSteps:', this.dynamicTotalSteps);
        console.log('currentCategory:', this.currentCategory);
        
        // Mostrar el JSON actualizado cuando cambian las categorías
        this.$nextTick(() => {
          const currentJson = this.finalFormData;
          console.log('=== JSON ACTUALIZADO POR CAMBIO DE CATEGORÍAS ===');
          console.log(JSON.stringify(currentJson, null, 2));
          console.log('===============================================');
        });
      }
    }
  },
  
  methods: {
    // Método helper para obtener observaciones generales
    getObservacionesGeneralesHelper() {
      const todasLasObservaciones = [];
      
      // Solo incluir comentarios de las secciones seleccionadas
      if (this.categoriesSelection.motor && this.formData.motor?.comentarios?.trim()) {
        todasLasObservaciones.push(`Motor: ${this.formData.motor.comentarios.trim()}`);
      }
      if (this.categoriesSelection.transmision && this.formData.transmision?.comentarios?.trim()) {
        todasLasObservaciones.push(`Transmisión: ${this.formData.transmision.comentarios.trim()}`);
      }
      if (this.categoriesSelection.frenos && this.formData.frenos?.comentarios?.trim()) {
        todasLasObservaciones.push(`Frenos: ${this.formData.frenos.comentarios.trim()}`);
      }
      if (this.categoriesSelection.sistemaElectrico && this.formData.sistemaElectrico?.comentarios?.trim()) {
        todasLasObservaciones.push(`Sistema Eléctrico: ${this.formData.sistemaElectrico.comentarios.trim()}`);
      }
      if (this.categoriesSelection.suspensionDireccion && this.formData.suspensionDireccion?.comentarios?.trim()) {
        todasLasObservaciones.push(`Suspensión y Dirección: ${this.formData.suspensionDireccion.comentarios.trim()}`);
      }
      if (this.categoriesSelection.sistemaEnfriamiento && this.formData.sistemaEnfriamiento?.comentarios?.trim()) {
        todasLasObservaciones.push(`Sistema de Enfriamiento: ${this.formData.sistemaEnfriamiento.comentarios.trim()}`);
      }
      if (this.categoriesSelection.sistemaEscape && this.formData.sistemaEscape?.comentarios?.trim()) {
        todasLasObservaciones.push(`Sistema de Escape: ${this.formData.sistemaEscape.comentarios.trim()}`);
      }
      if (this.categoriesSelection.sistemaClimatizacion && this.formData.sistemaClimatizacion?.comentarios?.trim()) {
        todasLasObservaciones.push(`Sistema de Climatización: ${this.formData.sistemaClimatizacion.comentarios.trim()}`);
      }
      if (this.categoriesSelection.carroceriaAccesorios && this.formData.carroceriaAccesorios?.comentarios?.trim()) {
        todasLasObservaciones.push(`Carrocería y Accesorios: ${this.formData.carroceriaAccesorios.comentarios.trim()}`);
      }
      if (this.categoriesSelection.llantasRines && this.formData.llantasRines?.comentarios?.trim()) {
        todasLasObservaciones.push(`Llantas y Rines: ${this.formData.llantasRines.comentarios.trim()}`);
      }
      
      return todasLasObservaciones.join('. ');
    },

    isCurrentCategoryStep(category) {
      return this.currentCategory === category;
    },
    
    getCategoryDisplayName(category) {
      const categoryNames = {
        motor: 'Motor',
        transmision: 'Sistema de Transmisión',
        frenos: 'Sistema de Frenos',
        sistemaElectrico: 'Sistema Eléctrico',
        suspensionDireccion: 'Suspensión y Dirección',
        sistemaEnfriamiento: 'Sistema de Enfriamiento',
        sistemaEscape: 'Sistema de Escape',
        sistemaClimatizacion: 'Sistema de Climatización',
        carroceriaAccesorios: 'Carrocería y Accesorios',
        llantasRines: 'Llantas y Rines'
      };
      return categoryNames[category] || category;
    },
    
    // Método para manejar las fotografías capturadas
    handlePhotoCaptured(field, photoData) {
      console.log(`=== INICIO handlePhotoCaptured ===`);
      console.log(`Field: ${field}`);
      console.log(`PhotoData:`, photoData);
      
      // Si es el nuevo formato con base64, usar esos datos
      if (photoData && typeof photoData === 'object' && photoData.base64) {
        // Mapear los sistemas
        const sistemaMapping = {
          'motor': 'motor',
          'transmision': 'transmision', 
          'frenos': 'frenos',
          'sistemaElectrico': 'sistemaElectrico',
          'suspensionDireccion': 'suspensionDireccion',
          'sistemaEnfriamiento': 'sistemaEnfriamiento',
          'sistemaEscape': 'sistemaEscape',
          'sistemaClimatizacion': 'sistemaClimatizacion',
          'carroceriaAccesorios': 'carroceriaAccesorios',
          'llantasRines': 'llantasRines'
        };
        
        // Buscar a qué sistema pertenece el field
        for (const [sistemaKey, sistemaName] of Object.entries(sistemaMapping)) {
          if (field.includes(sistemaKey)) {
            const imagenField = field.replace(sistemaKey, '').toLowerCase();
            if (this.formData[sistemaName]) {
              this.formData[sistemaName][imagenField] = photoData.base64;
              console.log(`Imagen asignada: ${sistemaName}.${imagenField}`);
              break;
            }
          }
        }
      } else {
        console.warn('Formato de foto no reconocido:', photoData);
      }
      
      console.log(`=== FIN handlePhotoCaptured ===`);
    },

    loadDiagnosticoData() {
      if (!this.diagnosticoData || Object.keys(this.diagnosticoData).length === 0) return;
      
      console.log('Cargando datos del diagnóstico:', this.diagnosticoData);
      
      // Si hay datos existentes, cargarlos (para modo edición)
      // Por ahora solo reseteamos ya que estamos en modo crear
      this.resetForm();
    },
    
    handleNextStep() {
      if (this.currentStep < this.dynamicTotalSteps) {
        this.currentStep++;
        this.scrollToTop();
      }
    },
    
    handlePrevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
        this.scrollToTop();
      }
    },
    
    scrollToTop() {
      this.$nextTick(() => {
        const modalContent = this.$el.querySelector('.overflow-y-auto');
        if (modalContent) {
          modalContent.scrollTop = 0;
        }
      });
    },
    
    async handleFinalSubmit() {
      if (!this.isStepValid) return;
      
      try {
        await this.executeSubmit(async () => {
          await this.submitFormData();
          
          this.toastStore.addToast({
            message: 'Diagnóstico completado exitosamente',
            type: 'success',
            duration: 3000
          });
          
          // Emitir el evento con los datos del diagnóstico completado
          this.$emit('diagnostico-guardado', this.diagnosticoData);
        });
        
        this.$emit('close');
      } catch (error) {
        console.error('Error al guardar diagnóstico:', error);
        
        let errorMessage = 'Error al guardar el diagnóstico';
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        this.toastStore.addToast({
          message: errorMessage,
          type: 'error',
          duration: 5000
        });
      }
    },
    
    async submitFormData() {
      console.log('Enviando diagnóstico completo al API...');
      console.log('Datos finales:', JSON.stringify(this.finalFormData, null, 2));
      
      try {
        // Preparar los datos para enviar a la API
        const dataToSend = {
          fechaCompletado: new Date().toISOString(),
          ...this.finalFormData
        };
        
        // Enviar a la API usando POST para actualizar el diagnóstico
        const response = await apiClient.post(`/update/diagnosticos/${this.diagnosticoData.id}`, dataToSend);
        
        console.log('Respuesta de la API:', response.data);
        console.log('Diagnóstico completado exitosamente');
      } catch (error) {
        console.error('Error en submitFormData:', error);
        throw error; // Re-lanzar el error para que lo maneje handleFinalSubmit
      }
    },
    
    resetForm() {
      // Resetear selección de categorías
      Object.keys(this.categoriesSelection).forEach(category => {
        this.categoriesSelection[category] = false;
      });
      
      // Resetear todos los valores del formulario a su estado inicial
      Object.keys(this.formData).forEach(seccion => {
        Object.keys(this.formData[seccion]).forEach(campo => {
          if (campo === 'comentarios') {
            this.formData[seccion][campo] = '';
          } else if (campo === 'tipo_mantenimiento') {
            this.formData[seccion][campo] = 'correctivo';
          } else {
            this.formData[seccion][campo] = false;
          }
        });
      });
      
      // Resetear al primer paso
      this.currentStep = 1;
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

.close-button {
  background-color: #f87171;
  color: white;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #ef4444;
}

/* Estilos para los checkboxes */
input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
}

/* Animación suave entre steps */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
