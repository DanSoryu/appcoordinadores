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
								<label class="block mb-2 font-semibold text-gray-700">Teléfono</label>
								<input 
									v-model="formData.telefono" 
									class="input mb-2 w-full" 
									placeholder="Número de teléfono" 
									maxlength="14"
									@input="formatTelefono"
								/>
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Correo Electrónico</label>
								<input 
									v-model="formData.correo" 
									type="email" 
									class="input mb-2 w-full" 
									placeholder="Correo electrónico"
									@input="formatCorreo('correo')"
								/>
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Responsable Automotriz</label>
								<input v-model="formData.responsable_automotriz" class="input mb-2 w-full" placeholder="Nombre del responsable automotriz" />
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Supervisor *</label>
								<input v-model="formData.supervisor" class="input mb-2 w-full" placeholder="Nombre del supervisor" required />
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Correo del Supervisor</label>
								<input 
									v-model="formData.correo_supervisor" 
									type="email" 
									class="input mb-2 w-full" 
									placeholder="Correo electrónico del supervisor"
									@input="formatCorreo('correo_supervisor')"
								/>
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">COPE *</label>
								<select v-model="formData.cope_id" class="input mb-2 w-full" required>
									<option value="">Seleccione una COPE</option>
									<option v-for="cope in copesWithDetails" :key="cope.id" :value="cope.id">
										{{ cope.displayName }}
									</option>
								</select>
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
</template>

<script>
import BaseButton from '../global/BaseButton.vue';
import { useSubmitButton } from '../../composables/useSubmitButton.js';
import { useToastStore } from '../../stores/toast.js';
import apiClient from '../../services/api.js';

export default {
	name: 'ClientesFormModal',
	components: {
		BaseButton
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
			copesWithDetails: [] // Para mostrar división-área-cope concatenado
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
		isStepValid() {
			// Campos requeridos: supervisor y cope_id
			return (
				this.formData.supervisor && this.formData.supervisor.trim() !== '' &&
				this.formData.cope_id && this.formData.cope_id !== ''
			);
		},
		finalFormData() {
			// Devuelve solo los datos relevantes
			return {
				telefono: this.formData.telefono || null,
				correo: this.formData.correo || null,
				responsable_automotriz: this.formData.responsable_automotriz || null,
				supervisor: this.formData.supervisor,
				correo_supervisor: this.formData.correo_supervisor || null,
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
			this.formData.responsable_automotriz = this.clienteData.responsable_automotriz || '';
			this.formData.supervisor = this.clienteData.supervisor || '';
			this.formData.correo_supervisor = this.clienteData.correo_supervisor || '';
			this.formData.cope_id = this.clienteData.cope_id || '';
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
			// Convertir a minúsculas
			if (this.formData[field]) {
				this.formData[field] = this.formData[field].toLowerCase();
			}
		},
		async saveCurrentStepData() {
			console.log('Guardando datos del cliente...');
			console.log('Datos actuales:', JSON.stringify(this.finalFormData, null, 2));
			
			if (this.clienteData?.id) {
				// Actualizar cliente existente
				const response = await apiClient.put(`/clientes/${this.clienteData.id}`, this.finalFormData);
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
</style>
