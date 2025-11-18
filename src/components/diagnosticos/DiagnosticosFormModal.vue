<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
    <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl relative border border-gray-200 overflow-y-auto max-h-[90vh]">
      <button @click="$emit('close')" class="close-button absolute top-4 right-4">
        <font-awesome-icon icon="times" />
      </button>
      <h2 class="text-2xl font-bold mb-6 text-blue-600 text-center">Diagnóstico Técnico</h2>
      
      <form @submit.prevent="">
        <!-- STEP 1: Motor -->
        <div v-if="currentStep === 1">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Motor</h3>
          
          <!-- Sección: Motor -->
          <div class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
            <h4 class="text-lg font-semibold text-blue-800 mb-4">Motor</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Seleccione las fallas detectadas:</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.motor.empaques" class="rounded">
                    <span class="text-sm">Empaques dañados</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.motor.sellos" class="rounded">
                    <span class="text-sm">Sellos dañados</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.motor.desgasteAnillos" class="rounded">
                    <span class="text-sm">Desgaste de anillos</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.motor.desgasteValvulas" class="rounded">
                    <span class="text-sm">Desgaste válvulas</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.motor.faltaLubricacion" class="rounded">
                    <span class="text-sm">Falta de lubricación</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.motor.piezasSueltas" class="rounded">
                    <span class="text-sm">Piezas sueltas</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.motor.bujias" class="rounded">
                    <span class="text-sm">Bujías defectuosas</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.motor.bateria" class="rounded">
                    <span class="text-sm">Problemas con la Batería</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.motor.bombaGasolina" class="rounded">
                    <span class="text-sm">Problemas con la Bomba de Gasolina</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.motor.fallaRadiador" class="rounded">
                    <span class="text-sm">Falla en el radiador</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.motor.fallaTermostato" class="rounded">
                    <span class="text-sm">Falla termostato</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input type="checkbox" v-model="formData.motor.soportes" class="rounded">
                    <span class="text-sm">Soportes de bujías defectuosas</span>
                  </label>
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

        <!-- STEP 2: Sistema de Transmisión -->
        <div v-else-if="currentStep === 2">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Sistema de Transmisión</h3>
          
          <!-- Sección: Sistema de Transmisión -->
          <div class="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
            <h4 class="text-lg font-semibold text-green-800 mb-4">Sistema de Transmisión</h4>
            <div class="space-y-4">
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

        <!-- STEP 3: Sistema de frenos -->
        <div v-else-if="currentStep === 3">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Sistema de Frenos</h3>
          
          <!-- Sección: Frenos -->
          <div class="mb-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border-l-4 border-red-500">
            <h4 class="text-lg font-semibold text-red-800 mb-4">Frenos</h4>
            <div class="space-y-4">
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

        <!-- STEP 4: Sistema eléctrico -->
        <div v-else-if="currentStep === 4">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Sistema Eléctrico</h3>
          
          <!-- Sección: Sistema Eléctrico (único recuadro) -->
          <div class="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-l-4 border-yellow-500">
            <h4 class="text-lg font-semibold text-yellow-800 mb-4">Sistema Eléctrico</h4>
            <div class="space-y-6">
              
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

        <!-- STEP 5: Suspensión y Dirección -->
        <div v-else-if="currentStep === 5">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Suspensión y Dirección</h3>
          
          <!-- Sección: Suspensión y Dirección (único recuadro) -->
          <div class="mb-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-l-4 border-orange-500">
            <h4 class="text-lg font-semibold text-orange-800 mb-4">Suspensión y Dirección</h4>
            <div class="space-y-6">
              
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

        <!-- STEP 6: Sistema de enfriamiento -->
        <div v-else-if="currentStep === 6">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Sistema de Enfriamiento</h3>
          
          <!-- Sección: Sistema de Enfriamiento (único recuadro) -->
          <div class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-l-4 border-blue-500">
            <h4 class="text-lg font-semibold text-blue-800 mb-4">Sistema de Enfriamiento</h4>
            <div class="space-y-6">
              
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

        <!-- STEP 7: Sistema de Escape -->
        <div v-else-if="currentStep === 7">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Sistema de Escape</h3>
          
          <!-- Sección: Sistema de Escape (único recuadro) -->
          <div class="mb-8 p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border-l-4 border-purple-500">
            <h4 class="text-lg font-semibold text-purple-800 mb-4">Sistema de Escape</h4>
            <div class="space-y-6">
              
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

        <!-- STEP 8: Sistema de Climatización -->
        <div v-else-if="currentStep === 8">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Sistema de Climatización</h3>
          
          <!-- Sección: Sistema de Climatización (único recuadro) -->
          <div class="mb-8 p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border-l-4 border-teal-500">
            <h4 class="text-lg font-semibold text-teal-800 mb-4">Sistema de Climatización (A/C y Calefacción)</h4>
            <div class="space-y-6">
              
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

        <!-- STEP 9: Carrocería y Accesorios -->
        <div v-else-if="currentStep === 9">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Carrocería y Accesorios</h3>
          
          <!-- Sección: Carrocería y Accesorios (único recuadro) -->
          <div class="mb-8 p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border-l-4 border-pink-500">
            <h4 class="text-lg font-semibold text-pink-800 mb-4">Carrocería y Accesorios</h4>
            <div class="space-y-6">
              
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

        <!-- STEP 10: Llantas y Rines -->
        <div v-else-if="currentStep === 10">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Llantas y Rines</h3>
          
          <!-- Sección: Llantas y Rines (único recuadro) -->
          <div class="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border-l-4 border-indigo-500">
            <h4 class="text-lg font-semibold text-indigo-800 mb-4">Llantas y Rines</h4>
            <div class="space-y-6">
              
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
            v-if="currentStep < totalSteps" 
            @click="handleNextStep"
            variant="primary"
            :disabled="!isStepValid"
          >
            Siguiente
          </BaseButton>
          
          <BaseButton 
            v-if="currentStep === totalSteps"
            @click="handleFinalSubmit"
            variant="success"
            :disabled="!isStepValid"
            custom-loading-text="Guardando diagnóstico"
            :min-delay="1500"
          >
            Completar Diagnóstico
          </BaseButton>
        </div>
        
        <!-- Indicador de progreso -->
        <div class="mt-6 flex justify-center gap-2">
          <div v-for="step in totalSteps" :key="step" 
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
import { useSubmitButton } from '../../composables/useSubmitButton.js';
import { useToastStore } from '../../stores/toast.js';
// import apiClient from '../../services/api.js'; // Comentado hasta implementar el endpoint

export default {
  name: 'DiagnosticosFormModal',
  components: {
    BaseButton
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
      
      // Datos del formulario organizados por categorías
      formData: {
        // STEP 1: Motor
        motor: {
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
          comentarios: ''
        },
        
        // STEP 2: Sistema de Transmisión
        transmision: {
          retenesDanados: false,
          juntasDanadas: false,
          nivelBajoFlujo: false,
          desgasteInterno: false,
          desgasteDiscos: false,
          convertidorTorque: false,
          mantenimientoProgramado: false,
          comentarios: ''
        },
        
        // STEP 3: Sistema de frenos
        frenos: {
          aireEnSistema: false,
          fugaLiquido: false,
          balatasDesgastadas: false,
          discoDesgastado: false,
          clipers: false,
          manguerasDefectuosas: false,
          controlDesgastePeriodico: false,
          comentarios: ''
        },
        
        // STEP 4: Sistema eléctrico (unificado)
        sistemaElectrico: {
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
          comentarios: ''
        },
        
        // STEP 5: Suspensión y Dirección (unificado)
        suspensionDireccion: {
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
          comentarios: ''
        },
        
        // STEP 6: Sistema de enfriamiento (unificado)
        sistemaEnfriamiento: {
          // Radiador
          manguerasPerforadas: false,
          nucleoPerforado: false,
          // Bomba de agua
          desgasteReten: false,
          desgasteRodamiento: false,
          // Control de temperatura
          termostatoBloqueado: false,
          controlTemperatura: false,
          comentarios: ''
        },
        
        // STEP 7: Sistema de Escape (unificado)
        sistemaEscape: {
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
          comentarios: ''
        },
        
        // STEP 8: Sistema de Climatización (unificado)
        sistemaClimatizacion: {
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
          comentarios: ''
        },
        
        // STEP 9: Carrocería y Accesorios (unificado)
        carroceriaAccesorios: {
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
          comentarios: ''
        },
        
        // STEP 10: Llantas y Rines (unificado)
        llantasRines: {
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
          comentarios: ''
        }
      }
    };
  },
  
  computed: {
    isStepValid() {
      // Para este formulario, consideramos válido si al menos hay alguna selección o comentario en la sección del step actual
      if (this.currentStep === 1) {
        const motorHasSelection = Object.keys(this.formData.motor).some(key => 
          key !== 'comentarios' && this.formData.motor[key]
        );
        const hasComments = this.formData.motor.comentarios.trim();
        
        return motorHasSelection || hasComments;
      }
      
      if (this.currentStep === 2) {
        const transmisionHasSelection = Object.keys(this.formData.transmision).some(key => 
          key !== 'comentarios' && this.formData.transmision[key]
        );
        const hasComments = this.formData.transmision.comentarios.trim();
        
        return transmisionHasSelection || hasComments;
      }
      
      if (this.currentStep === 3) {
        const frenosHasSelection = Object.keys(this.formData.frenos).some(key => 
          key !== 'comentarios' && this.formData.frenos[key]
        );
        const hasComments = this.formData.frenos.comentarios.trim();
        
        return frenosHasSelection || hasComments;
      }
      
      if (this.currentStep === 4) {
        const sistemaElectricoHasSelection = Object.keys(this.formData.sistemaElectrico).some(key => 
          key !== 'comentarios' && this.formData.sistemaElectrico[key]
        );
        const hasComments = this.formData.sistemaElectrico.comentarios.trim();
        
        return sistemaElectricoHasSelection || hasComments;
      }
      
      if (this.currentStep === 5) {
        const suspensionDireccionHasSelection = Object.keys(this.formData.suspensionDireccion).some(key => 
          key !== 'comentarios' && this.formData.suspensionDireccion[key]
        );
        const hasComments = this.formData.suspensionDireccion.comentarios.trim();
        
        return suspensionDireccionHasSelection || hasComments;
      }
      
      if (this.currentStep === 6) {
        const sistemaEnfriamientoHasSelection = Object.keys(this.formData.sistemaEnfriamiento).some(key => 
          key !== 'comentarios' && this.formData.sistemaEnfriamiento[key]
        );
        const hasComments = this.formData.sistemaEnfriamiento.comentarios.trim();
        
        return sistemaEnfriamientoHasSelection || hasComments;
      }
      
      if (this.currentStep === 7) {
        const sistemaEscapeHasSelection = Object.keys(this.formData.sistemaEscape).some(key => 
          key !== 'comentarios' && this.formData.sistemaEscape[key]
        );
        const hasComments = this.formData.sistemaEscape.comentarios.trim();
        
        return sistemaEscapeHasSelection || hasComments;
      }
      
      if (this.currentStep === 8) {
        const sistemaClimatizacionHasSelection = Object.keys(this.formData.sistemaClimatizacion).some(key => 
          key !== 'comentarios' && this.formData.sistemaClimatizacion[key]
        );
        const hasComments = this.formData.sistemaClimatizacion.comentarios.trim();
        
        return sistemaClimatizacionHasSelection || hasComments;
      }
      
      if (this.currentStep === 9) {
        const carroceriaAccesoriosHasSelection = Object.keys(this.formData.carroceriaAccesorios).some(key => 
          key !== 'comentarios' && this.formData.carroceriaAccesorios[key]
        );
        const hasComments = this.formData.carroceriaAccesorios.comentarios.trim();
        
        return carroceriaAccesoriosHasSelection || hasComments;
      }
      
      if (this.currentStep === 10) {
        const llantasRinesHasSelection = Object.keys(this.formData.llantasRines).some(key => 
          key !== 'comentarios' && this.formData.llantasRines[key]
        );
        const hasComments = this.formData.llantasRines.comentarios.trim();
        
        return llantasRinesHasSelection || hasComments;
      }
      
      return false;
    },
    
    validationErrors() {
      const errors = [];
      
      if (this.currentStep === 1) {
        const motorHasData = Object.keys(this.formData.motor).some(key => 
          key !== 'comentarios' ? this.formData.motor[key] : this.formData.motor[key].trim()
        );
        
        if (!motorHasData) {
          errors.push('Debe seleccionar al menos una falla o agregar comentarios en el Motor');
        }
      }
      
      if (this.currentStep === 2) {
        const transmisionHasData = Object.keys(this.formData.transmision).some(key => 
          key !== 'comentarios' ? this.formData.transmision[key] : this.formData.transmision[key].trim()
        );
        
        if (!transmisionHasData) {
          errors.push('Debe seleccionar al menos una falla o agregar comentarios en el Sistema de Transmisión');
        }
      }
      
      if (this.currentStep === 3) {
        const frenosHasData = Object.keys(this.formData.frenos).some(key => 
          key !== 'comentarios' ? this.formData.frenos[key] : this.formData.frenos[key].trim()
        );
        
        if (!frenosHasData) {
          errors.push('Debe seleccionar al menos una falla o agregar comentarios en el Sistema de Frenos');
        }
      }
      
      if (this.currentStep === 4) {
        const hasElectricalData = Object.keys(this.formData.sistemaElectrico).some(key => 
          key !== 'comentarios' ? this.formData.sistemaElectrico[key] : this.formData.sistemaElectrico[key].trim()
        );
        
        if (!hasElectricalData) {
          errors.push('Debe seleccionar al menos una falla o agregar comentarios en el Sistema Eléctrico');
        }
      }
      
      if (this.currentStep === 5) {
        const hasSuspensionData = Object.keys(this.formData.suspensionDireccion).some(key => 
          key !== 'comentarios' ? this.formData.suspensionDireccion[key] : this.formData.suspensionDireccion[key].trim()
        );
        
        if (!hasSuspensionData) {
          errors.push('Debe seleccionar al menos una falla o agregar comentarios en Suspensión y Dirección');
        }
      }
      
      if (this.currentStep === 6) {
        const hasCoolingData = Object.keys(this.formData.sistemaEnfriamiento).some(key => 
          key !== 'comentarios' ? this.formData.sistemaEnfriamiento[key] : this.formData.sistemaEnfriamiento[key].trim()
        );
        
        if (!hasCoolingData) {
          errors.push('Debe seleccionar al menos una falla o agregar comentarios en el Sistema de Enfriamiento');
        }
      }
      
      if (this.currentStep === 7) {
        const hasEscapeData = Object.keys(this.formData.sistemaEscape).some(key => 
          key !== 'comentarios' ? this.formData.sistemaEscape[key] : this.formData.sistemaEscape[key].trim()
        );
        
        if (!hasEscapeData) {
          errors.push('Debe seleccionar al menos una falla o agregar comentarios en el Sistema de Escape');
        }
      }
      
      if (this.currentStep === 8) {
        const hasClimatizacionData = Object.keys(this.formData.sistemaClimatizacion).some(key => 
          key !== 'comentarios' ? this.formData.sistemaClimatizacion[key] : this.formData.sistemaClimatizacion[key].trim()
        );
        
        if (!hasClimatizacionData) {
          errors.push('Debe seleccionar al menos una falla o agregar comentarios en el Sistema de Climatización');
        }
      }
      
      if (this.currentStep === 9) {
        const hasCarroceriaData = Object.keys(this.formData.carroceriaAccesorios).some(key => 
          key !== 'comentarios' ? this.formData.carroceriaAccesorios[key] : this.formData.carroceriaAccesorios[key].trim()
        );
        
        if (!hasCarroceriaData) {
          errors.push('Debe seleccionar al menos una falla o agregar comentarios en Carrocería y Accesorios');
        }
      }
      
      if (this.currentStep === 10) {
        const hasLlantasData = Object.keys(this.formData.llantasRines).some(key => 
          key !== 'comentarios' ? this.formData.llantasRines[key] : this.formData.llantasRines[key].trim()
        );
        
        if (!hasLlantasData) {
          errors.push('Debe seleccionar al menos una falla o agregar comentarios en Llantas y Rines');
        }
      }
      
      return errors;
    },
    
    finalFormData() {
      // Crear estructura JSON final con solo los datos relevantes
      const result = {
        folioRecepcion: this.diagnosticoData.folioRecepcion || '',
        fechaCompletado: new Date().toISOString(),
        estado: 'completado',
        diagnosticos: [],
        observacionesGenerales: ''
      };
      
      // Procesar cada sección y agregar solo las fallas seleccionadas
      const secciones = [
        { key: 'motor', nombre: 'Motor' },
        { key: 'transmision', nombre: 'Sistema de Transmisión' },
        { key: 'frenos', nombre: 'Sistema de Frenos' },
        { key: 'sistemaElectrico', nombre: 'Sistema Eléctrico' },
        { key: 'suspensionDireccion', nombre: 'Suspensión y Dirección' },
        { key: 'sistemaEnfriamiento', nombre: 'Sistema de Enfriamiento' },
        { key: 'sistemaEscape', nombre: 'Sistema de Escape' },
        { key: 'sistemaClimatizacion', nombre: 'Sistema de Climatización' },
        { key: 'carroceriaAccesorios', nombre: 'Carrocería y Accesorios' },
        { key: 'llantasRines', nombre: 'Llantas y Rines' }
      ];
      
      // Mapeo de nombres técnicos a nombres legibles
      const fallaNames = {
        empaques: 'Empaques dañados',
        sellos: 'Sellos dañados',
        desgasteAnillos: 'Desgaste de anillos',
        desgasteValvulas: 'Desgaste válvulas',
        faltaLubricacion: 'Falta de lubricación',
        piezasSueltas: 'Piezas sueltas',
        bujias: 'Bujías defectuosas',
        bateria: 'Problemas de batería',
        bombaGasolina: 'Bomba de gasolina',
        fallaRadiador: 'Falla en radiador',
        fallaTermostato: 'Falla en termostato',
        soportes: 'Soportes de motor',
        retenesDanados: 'Retenes dañados',
        juntasDanadas: 'Juntas dañadas',
        nivelBajoFlujo: 'Nivel bajo de flujo',
        desgasteInterno: 'Desgaste interno',
        desgasteDiscos: 'Desgaste de discos',
        convertidorTorque: 'Convertidor de torque',
        mantenimientoProgramado: 'Mantenimiento programado',
        aireEnSistema: 'Aire en el sistema',
        fugaLiquido: 'Fuga de líquido',
        balatasDesgastadas: 'Balatas desgastadas',
        discoDesgastado: 'Disco desgastado',
        clipers: 'Problema en calipers',
        manguerasDefectuosas: 'Mangueras defectuosas',
        controlDesgastePeriodico: 'Control de desgaste periódico',
        celdasDanadas: 'Celdas dañadas',
        alternadorDefectuoso: 'Alternador defectuoso',
        bandaSuelta: 'Banda suelta',
        alternadorDanado: 'Alternador dañado',
        focoFundido: 'Foco fundido',
        conectoresSulfatados: 'Conectores sulfatados o flojos',
        inspeccionPeriodica: 'Inspección periódica',
        desgaste: 'Desgaste',
        rupturaRetenes: 'Ruptura de retenes',
        terminales: 'Terminales dañados',
        cremalleras: 'Cremalleras desgastadas',
        bujesDanados: 'Bujes dañados',
        rotulasDanadas: 'Rótulas dañadas',
        ajusteProgramado: 'Ajuste programado',
        manguerasPerforadas: 'Mangueras perforadas',
        nucleoPerforado: 'Núcleo perforado',
        desgasteReten: 'Desgaste del retén',
        desgasteRodamiento: 'Desgaste de rodamiento',
        termostatoBloqueado: 'Termostato bloqueado',
        controlTemperatura: 'Control de temperatura óptima',
        // Sistema de Escape
        fugasPerforaciones: 'Fugas o perforaciones',
        corrosion: 'Corrosión',
        impacto: 'Impacto',
        ruidoExcesivo: 'Ruido excesivo',
        silenciadorRoto: 'Silenciador roto',
        silenciadorSuelto: 'Silenciador suelto',
        catalizadorObstruido: 'Catalizador obstruido o dañado',
        malaCombustion: 'Mala combustión',
        // Sistema de Climatización
        acNoEnfria: 'A/C no enfría',
        fugaGas: 'Fuga de gas',
        compresorDanado: 'Compresor dañado',
        malOlorVentilacion: 'Mal olor en ventilación',
        filtroCabinaSucio: 'Filtro de cabina sucio',
        revisionPresionesGas: 'Revisión de presiones y gas',
        noCalienta: 'No calienta',
        radiadorInterior: 'Radiador interior',
        // Carrocería y Accesorios
        rayonesAbolladuras: 'Rayones o abolladuras',
        golpes: 'Golpes',
        roces: 'Roces',
        cierreDeficiente: 'Cierre deficiente',
        cerraduras: 'Cerraduras',
        bisagraDesajustada: 'Bisagra desajustada',
        grietasAstilladuras: 'Grietas o astilladuras',
        impactoCristal: 'Impacto en cristal',
        tensionTermica: 'Tensión térmica',
        limpiaNoFunciona: 'Limpia parabrisas no funciona',
        motorDanado: 'Motor dañado',
        fusibleDanado: 'Fusible dañado',
        // Llantas y Rines
        desgasteIrregular: 'Desgaste irregular',
        alineacion: 'Problemas de alineación',
        balanceoDeficiente: 'Balanceo deficiente',
        presionIncorrecta: 'Presión incorrecta',
        revisionPeriodica: 'Revisión periódica',
        revisionFechaFabricacion: 'Revisión de fecha de fabricación',
        controlVidaUtil: 'Control de vida útil',
        rinesGolpeadosDeformados: 'Rines golpeados o deformados',
        impactoBaches: 'Impacto con baches',
        impactoBanquetas: 'Impacto con banquetas'
      };
      
      secciones.forEach(seccion => {
        const seccionData = this.formData[seccion.key];
        if (seccionData) {
          let tieneSelecciones = false;
          let descripcionSeccion = `${seccion.nombre}: `;
          let fallasEncontradas = [];
          
          // Revisar cada campo excepto comentarios
          Object.keys(seccionData).forEach(campo => {
            if (campo !== 'comentarios' && seccionData[campo]) {
              fallasEncontradas.push(fallaNames[campo] || campo);
              tieneSelecciones = true;
            }
          });
          
          // Si hay selecciones o comentarios, agregar al diagnóstico
          if (tieneSelecciones || seccionData.comentarios?.trim()) {
            if (fallasEncontradas.length > 0) {
              descripcionSeccion += fallasEncontradas.join(', ');
            }
            
            if (seccionData.comentarios?.trim()) {
              if (fallasEncontradas.length > 0) {
                descripcionSeccion += '. Observaciones: ' + seccionData.comentarios.trim();
              } else {
                descripcionSeccion += 'Observaciones: ' + seccionData.comentarios.trim();
              }
            }
            
            result.diagnosticos.push({
              seccion: seccion.nombre,
              descripcion: descripcionSeccion
            });
          }
        }
      });
      
      // Crear observaciones generales
      const todasLasObservaciones = Object.values(this.formData)
        .map(seccion => seccion.comentarios)
        .filter(comentario => comentario && comentario.trim())
        .join('. ');
      
      if (todasLasObservaciones) {
        result.observacionesGenerales = todasLasObservaciones;
      }
      
      console.log('Datos finales del diagnóstico:', result);
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
    }
  },
  
  methods: {
    loadDiagnosticoData() {
      if (!this.diagnosticoData || Object.keys(this.diagnosticoData).length === 0) return;
      
      console.log('Cargando datos del diagnóstico:', this.diagnosticoData);
      
      // Si hay datos existentes, cargarlos (para modo edición)
      // Por ahora solo reseteamos ya que estamos en modo crear
      this.resetForm();
    },
    
    handleNextStep() {
      if (this.currentStep < this.totalSteps) {
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
        });
        
        this.$emit('close');
      } catch (error) {
        console.error('Error al completar diagnóstico:', error);
      }
    },
    
    async submitFormData() {
      console.log('Enviando diagnóstico completo al API...');
      console.log('Datos finales:', JSON.stringify(this.finalFormData, null, 2));
      
      try {
        // TODO: Reemplazar con llamada real a la API
        // const response = await apiClient.put(`/diagnosticos/${this.diagnosticoData.id}`, this.finalFormData);
        
        // Simulación de guardado
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.toastStore.addToast({
          message: 'Diagnóstico completado exitosamente',
          type: 'success',
          duration: 3000
        });
        
        // Emitir evento con los datos guardados
        this.$emit('diagnostico-guardado', {
          id: this.diagnosticoData.id,
          ...this.finalFormData
        });
        
        console.log('Diagnóstico completado exitosamente');
      } catch (error) {
        console.error('Error al completar diagnóstico:', error);
        this.toastStore.addToast({
          message: 'Error al completar el diagnóstico',
          type: 'error',
          duration: 5000
        });
        throw error;
      }
    },
    
    resetForm() {
      // Resetear todos los valores a su estado inicial
      Object.keys(this.formData).forEach(seccion => {
        Object.keys(this.formData[seccion]).forEach(campo => {
          if (campo === 'comentarios') {
            this.formData[seccion][campo] = '';
          } else {
            this.formData[seccion][campo] = false;
          }
        });
      });
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
