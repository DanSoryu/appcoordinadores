<template>
	<div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
		<div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative border border-gray-200 overflow-y-auto max-h-[90vh]">
			<button @click="$emit('close')" class="close-button absolute top-4 right-4">
				<font-awesome-icon icon="times" />
			</button>
			<h2 class="text-2xl font-bold mb-6 text-blue-600 text-center">Datos del Cliente</h2>
			<form @submit.prevent="handleFinalSubmit">
				<div>
					<!-- SECCIÓN ÚNICA: DATOS DEL CLIENTE -->
					<div class="mb-8 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border-l-4 border-primary-500">
						<div class="flex items-center mb-4">
							<div class="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center mr-3">
								<font-awesome-icon icon="user" class="w-4 h-4" />
							</div>
							<h3 class="text-xl font-bold text-primary-700">Información del Cliente</h3>
						</div>
						<div class="space-y-4">
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Teléfono *</label>
								<input 
									v-model="formData.telefono" 
									:class="[
										'input mb-2 w-full transition-colors',
										formData.telefono ? (telefonoValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
									]"
									placeholder="Número de teléfono" 
									maxlength="14"
									@input="formatTelefono"
									required
								/>
								<div v-if="formData.telefono && !telefonoValid" class="text-red-500 text-xs mt-1">
									El teléfono debe tener al menos 10 dígitos
								</div>
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Correo Electrónico *</label>
								<input 
									v-model="formData.correo" 
									type="email" 
									:class="[
										'input mb-2 w-full transition-colors',
										formData.correo ? (correoValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
									]"
									placeholder="Correo electrónico"
									@input="formatCorreoEvent($event, 'correo')"
									required
								/>
								<div v-if="formData.correo && !correoValid" class="text-red-500 text-xs mt-1">
									Ingrese un correo electrónico válido
								</div>
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Responsable Automotriz *</label>
								<input 
									v-model="formData.responsable_automotriz" 
									@input="formatNombreField('responsable_automotriz')" 
									:class="[
										'input mb-2 w-full transition-colors',
										formData.responsable_automotriz ? (responsableAutomotrizValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
									]"
									placeholder="Nombre del responsable automotriz"
									required
								/>
								<div v-if="formData.responsable_automotriz && !responsableAutomotrizValid" class="text-red-500 text-xs mt-1">
									Este campo es obligatorio
								</div>
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Supervisor *</label>
								<input 
									v-model="formData.supervisor" 
									@input="formatNombreField('supervisor')" 
									:class="[
										'input mb-2 w-full transition-colors',
										formData.supervisor ? (supervisorValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
									]"
									placeholder="Nombre del supervisor" 
									required 
								/>
								<div v-if="formData.supervisor && !supervisorValid" class="text-red-500 text-xs mt-1">
									Este campo es obligatorio
								</div>
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Correo del Supervisor *</label>
								<input 
									v-model="formData.correo_supervisor" 
									type="email" 
									:class="[
										'input mb-2 w-full transition-colors',
										formData.correo_supervisor ? (correoSupervisorValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
									]"
									placeholder="Correo electrónico del supervisor"
									@input="formatCorreoEvent($event, 'correo_supervisor')"
									required
								/>
								<div v-if="formData.correo_supervisor && !correoSupervisorValid" class="text-red-500 text-xs mt-1">
									Ingrese un correo electrónico válido
								</div>
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">COPE *</label>
								<select 
									v-model="formData.cope_id" 
									:class="[
										'input mb-2 w-full transition-colors',
										formData.cope_id ? (copeValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
									]"
									required
								>
									<option value="">Seleccione una COPE</option>
									<option v-for="cope in copesWithDetails" :key="cope.id" :value="cope.id">
										{{ cope.displayName }}
									</option>
								</select>
								<div v-if="formData.cope_id && !copeValid" class="text-red-500 text-xs mt-1">
									Debe seleccionar una COPE
								</div>
								<div class="mt-2">
									<button type="button" @click="abrirCopeModal" class="text-blue-600 hover:underline focus:outline-none">
										¿No encuentras el COPE? Crea uno aquí
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="flex justify-end mt-8">
					<BaseButton 
						type="submit" 
						variant="success"
						:disabled="!isStepValid"
						:onClick="handleFinalSubmit"
						custom-loading-text="Procesando"
						:min-delay="1500"
					>
						Guardar
					</BaseButton>
				</div>
			</form>
		</div>
	</div>
	
	<CopesFormModal 
		:show="showCopeModal" 
		@close="showCopeModal = false"
		@cope-guardado="handleCopeGuardado"
	/>
</template>

<script>
import BaseButton from '../global/BaseButton.vue';
import CopesFormModal from '../dac/CopesFormModal.vue';
import { useSubmitButton } from '../../composables/useSubmitButton.js';
import { useToastStore } from '../../stores/toast.js';
import apiClient from '../../services/api.js';

export default {
	name: 'ClientesFormModal',
	components: {
		BaseButton,
		CopesFormModal
	},
	props: {
		show: {
			type: Boolean,
			required: true
		},
		clienteData: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ['close', 'cliente-guardado'],
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
			formData: {
				telefono: '',
				correo: '',
				responsable_automotriz: '',
				supervisor: '',
				correo_supervisor: '',
				cope_id: ''
			},
			copes: [],
			areas: [],
			divisiones: [],
			copesWithDetails: [], // Para mostrar división-área-cope concatenado
			showCopeModal: false
		};
	},
	created() {
		this.loadClienteData();
		this.loadCopesData();
	},
	watch: {
		clienteData: {
			handler() {
				this.loadClienteData();
			},
			deep: true
		},
		formData: {
			deep: true,
			handler(newVal) {
				// Log para depuración
				console.log('FormData changed:', newVal);
			}
		}
	},
	computed: {
		// Validaciones individuales de cada campo
		telefonoValid() {
			if (!this.formData.telefono || this.formData.telefono.trim() === '') return false;
			// Validar formato de teléfono: debe tener al menos 10 dígitos
			const digitsOnly = this.formData.telefono.replace(/[^0-9]/g, '');
			return digitsOnly.length >= 10;
		},
		correoValid() {
			if (!this.formData.correo || this.formData.correo.trim() === '') return false;
			// Validar formato de email
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(this.formData.correo);
		},
		responsableAutomotrizValid() {
			return this.formData.responsable_automotriz && this.formData.responsable_automotriz.trim() !== '';
		},
		supervisorValid() {
			return this.formData.supervisor && this.formData.supervisor.trim() !== '';
		},
		correoSupervisorValid() {
			if (!this.formData.correo_supervisor || this.formData.correo_supervisor.trim() === '') return false;
			// Validar formato de email
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(this.formData.correo_supervisor);
		},
		copeValid() {
			return this.formData.cope_id && this.formData.cope_id !== '';
		},
		
		isStepValid() {
			// Todos los campos son obligatorios y deben ser válidos
			return (
				this.telefonoValid &&
				this.correoValid &&
				this.responsableAutomotrizValid &&
				this.supervisorValid &&
				this.correoSupervisorValid &&
				this.copeValid
			);
		},
		finalFormData() {
			// Devuelve solo los datos relevantes con trim para eliminar espacios al final
			return {
				telefono: this.formData.telefono,
				correo: this.formData.correo,
				responsable_automotriz: this.formData.responsable_automotriz.trim(),
				supervisor: this.formData.supervisor.trim(),
				correo_supervisor: this.formData.correo_supervisor,
				cope_id: parseInt(this.formData.cope_id)
			};
		}
	},
	methods: {
		async loadCopesData() {
			try {
				// Cargar copes, áreas y divisiones
				const [copesResponse, areasResponse, divisionesResponse] = await Promise.all([
					apiClient.get('/copes'),
					apiClient.get('/areas'),
					apiClient.get('/divisiones')
				]);

				this.copes = copesResponse.data;
				this.areas = areasResponse.data;
				this.divisiones = divisionesResponse.data;

				// Crear array con información concatenada
				this.copesWithDetails = this.copes.map(cope => {
					const area = this.areas.find(a => a.id === cope.area_id);
					const division = area ? this.divisiones.find(d => d.id === area.division_id) : null;
					
					return {
						...cope,
						displayName: `${division?.nombre || 'N/A'} - ${area?.nombre || 'N/A'} - ${cope.nombre}`
					};
				});
			} catch (error) {
				console.error('Error al cargar datos:', error);
				this.toastStore.addToast({
					message: 'Error al cargar los datos de COPEs',
					type: 'error',
					duration: 5000
				});
			}
		},
		loadClienteData() {
			if (!this.clienteData || Object.keys(this.clienteData).length === 0) return;
			this.formData.telefono = this.clienteData.telefono || '';
			this.formData.correo = this.clienteData.correo || '';
			// Normalizar nombres: solo capitalizar la primera letra de cada palabra
			this.formData.responsable_automotriz = this.capitalizeWords(this.clienteData.responsable_automotriz || '');
			this.formData.supervisor = this.capitalizeWords(this.clienteData.supervisor || '');
			this.formData.correo_supervisor = this.clienteData.correo_supervisor || '';
			this.formData.cope_id = this.clienteData.cope_id || '';
		},

		// Capitalizar la primera letra de cada palabra en una cadena
		capitalizeWords(value) {
			if (!value) return '';
			return value.toString().split(' ').map(word => {
				if (!word) return '';
				return word.charAt(0).toUpperCase() + word.slice(1);
			}).join(' ');
		},

		// Handler genérico para inputs de nombre que capitaliza mientras se escribe
		formatNombreField(field) {
			let value = this.formData[field] || '';
			// Mantener el límite de caracteres razonable si fuese necesario
			if (value.length > 100) {
				value = value.substring(0, 100);
			}
			// Solo capitalizar palabras, NO eliminar espacios al final mientras se escribe
			this.formData[field] = this.capitalizeWords(value);
		},
			async handleFinalSubmit() {
				if (!this.isStepValid) return;
				try {
					await this.saveCurrentStepData();
					
					// Preparar los datos del cliente para emitir
					const clienteGuardado = {
						id: this.clienteData?.id || null,
						...this.finalFormData
					};
					
					// Emitir el evento con los datos del cliente
					this.$emit('cliente-guardado', clienteGuardado);
					
					this.$emit('close');
					this.resetForm();
					console.log('Datos del cliente enviados:', JSON.stringify(clienteGuardado, null, 2));
				} catch (error) {
					console.error('Error al guardar datos:', error);
					
					// Manejar errores específicos del servidor
					if (error.response?.data?.error) {
						const serverErrors = error.response.data.error;
						let errorMessage = 'Error de validación:';
						
						if (typeof serverErrors === 'object') {
							Object.keys(serverErrors).forEach(field => {
								errorMessage += `\n${field}: ${serverErrors[field][0]}`;
							});
						} else if (typeof serverErrors === 'string') {
							errorMessage = serverErrors;
						}
						
						this.toastStore.addToast({
							message: errorMessage,
							type: 'error',
							duration: 7000
						});
					} else {
						this.toastStore.addToast({
							message: 'Error al guardar los datos. Por favor, intente nuevamente.',
							type: 'error',
							duration: 5000
						});
					}
				}
			},

			resetForm() {
				this.formData = {
					telefono: '',
					correo: '',
					responsable_automotriz: '',
					supervisor: '',
					correo_supervisor: '',
					cope_id: ''
				};
			},
		formatTelefono(event) {
			// Obtener el valor actual
			let value = event.target.value;
			
			// Remover todos los caracteres excepto números y el símbolo +
			value = value.replace(/[^0-9+]/g, '');
			
			// Asegurar que el + solo esté al inicio
			if (value.includes('+')) {
				const plusCount = (value.match(/\+/g) || []).length;
				if (plusCount > 1) {
					// Si hay múltiples +, mantener solo el primero
					value = '+' + value.replace(/\+/g, '');
				}
				// Si el + no está al inicio, moverlo al inicio
				if (value.indexOf('+') !== 0) {
					value = '+' + value.replace(/\+/g, '');
				}
			}
			
			// Limitar a 14 caracteres
			if (value.length > 14) {
				value = value.substring(0, 14);
			}
			
			// Actualizar el valor
			this.formData.telefono = value;
			event.target.value = value;
		},
		formatCorreo(field) {
			// Convertir a minúsculas y eliminar espacios en tiempo real
			if (this.formData[field]) {
				this.formData[field] = this.formData[field].toLowerCase().replace(/\s/g, '');
			}
		},
		
		// Método específico para manejar el evento de input en correos
		formatCorreoEvent(event, field) {
			let value = event.target.value || '';
			// Convertir a minúsculas y eliminar espacios en tiempo real
			value = value.toLowerCase().replace(/\s/g, '');
			this.formData[field] = value;
			// Actualizar el valor del input para que el usuario vea el cambio inmediatamente
			event.target.value = value;
		},
		
		abrirCopeModal() {
			this.showCopeModal = true;
		},
		
		async handleCopeGuardado(nuevoCope) {
			// Recargar la lista de COPEs para incluir el nuevo
			await this.loadCopesData();
			// Seleccionar automáticamente el nuevo COPE
			this.formData.cope_id = nuevoCope.id;
		},
		
		async saveCurrentStepData() {
			console.log('Guardando datos del cliente...');
			console.log('Datos actuales:', JSON.stringify(this.finalFormData, null, 2));
			
			if (this.clienteData?.id) {
				// Actualizar cliente existente
				const response = await apiClient.post(`/update/clientes/${this.clienteData.id}`, this.finalFormData);
				console.log('Cliente actualizado:', response.data);
			} else {
				// Crear nuevo cliente
				const response = await apiClient.post('/clientes', this.finalFormData);
				console.log('Cliente creado:', response.data);
			}
			
			console.log('Datos del cliente guardados correctamente');
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
	transition: border-color 0.2s, background-color 0.2s;
}
.input:focus {
	border-color: #3b82f6;
	outline: none;
}
.input.border-green-500 {
	border-color: #10b981;
}
.input.border-red-500 {
	border-color: #ef4444;
}
.input.bg-green-50 {
	background-color: #f0fdf4;
}
.input.bg-red-50 {
	background-color: #fef2f2;
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
</style>
