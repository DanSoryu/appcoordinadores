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
          <label class="block mb-2 font-semibold text-gray-700">Dirección</label>
          <input v-model="formData.direccion" class="input mb-4 w-full" placeholder="Dirección" />
          <label class="block mb-2 font-semibold text-gray-700">Teléfono</label>
          <input v-model="formData.telefono" class="input mb-4 w-full" placeholder="Teléfono" type="tel" />
        </div>
        <div v-else-if="currentStep === 3">
          <label class="block mb-2 font-semibold text-gray-700">Comentario</label>
          <input v-model="formData.comentario" class="input mb-4 w-full" placeholder="Comentario" />
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
              Anterior
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
            custom-loading-text="Procesando"
            :min-delay="2500"
          >
            Enviar
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
        llavesRecibidas: '',
        polizaSeguro: '',
        tarjetaCirculacion: '',
        otroDocumento: '',
        accesoriosHerramienta: ''
      },
      // Datos reales que se enviarán en el JSON
      formData: {
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
        // Otros campos de pasos siguientes
        nombre: null,
        email: null,
        direccion: null,
        telefono: null,
        comentario: null
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
        // Validar que los campos del paso 2 estén completos
        return (this.formData.direccion && this.formData.direccion.trim() !== '') && 
               (this.formData.telefono && this.formData.telefono.trim() !== '');
      }

      if (this.currentStep === 3) {
        // Validar que los campos del paso 3 estén completos
        return (this.formData.comentario && this.formData.comentario.trim() !== '');
      }

      return false;
    },
    // Crear un JSON final que solo incluya los valores relevantes según los controles
    finalFormData() {
      const result = {
        // Inicializar todas las claves con null por defecto
        cantidadLlaves: null,
        polizaSeguro: null,
        tarjetaCirculacion: null,
        otroDocumento: null,
        accesoriosHerramienta: null,
        direccion: this.formData.direccion,
        telefono: this.formData.telefono,
        comentario: this.formData.comentario
      };
      
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
      
      // Cargar datos del formulario
      this.formData.cantidadLlaves = this.checklistData.cantidadLlaves || null;
      this.formData.direccion = this.checklistData.direccion || null;
      this.formData.telefono = this.checklistData.telefono || null;
      this.formData.comentario = this.checklistData.comentario || null;
      
      // Configurar controles de UI basados en los datos
      this.uiControls.llavesRecibidas = this.checklistData.cantidadLlaves !== null ? 'true' : 'false';
      this.uiControls.polizaSeguro = this.checklistData.polizaSeguro ? 'true' : 'false';
      this.uiControls.tarjetaCirculacion = this.checklistData.tarjetaCirculacion !== null ? 'true' : 'false';
      this.uiControls.otroDocumento = this.checklistData.otroDocumento ? 'true' : 'false';
      this.uiControls.accesoriosHerramienta = this.checklistData.accesoriosHerramienta ? 'true' : 'false';
      
      // Configurar valores booleanos
      this.formData.tarjetaCirculacion = this.checklistData.tarjetaCirculacion;
      
      // Simular archivos (en una app real, mostrarías la información del archivo existente)
      if (this.checklistData.polizaSeguro) {
        this.formData.polizaSeguroArchivo = { name: this.checklistData.polizaSeguro };
      }
      if (this.checklistData.otroDocumento) {
        this.formData.otroDocumentoArchivo = { name: this.checklistData.otroDocumento };
      }
      if (this.checklistData.accesoriosHerramienta) {
        this.formData.accesoriosHerramientaArchivo = { name: this.checklistData.accesoriosHerramienta };
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