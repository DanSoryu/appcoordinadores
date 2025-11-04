<template>
	<div v-if="show" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
		<div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative border border-gray-200 overflow-y-auto max-h-[90vh]">
			<button @click="$emit('close')" class="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-md p-2">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
				</svg>
			</button>
			<h2 class="text-2xl font-bold mb-6 text-blue-600 text-center">Datos de Recepción</h2>
			<form @submit.prevent="handleSubmit">
				<!-- SECCIÓN ÚNICA: DATOS DE RECEPCIÓN -->
				<div class="mb-8 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border-l-4 border-primary-500">
					<div class="flex items-center mb-4">
						<div class="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center mr-3">
							<font-awesome-icon icon="clipboard-list" class="w-4 h-4" />
						</div>
						<h3 class="text-xl font-bold text-primary-700">Información de Recepción</h3>
					</div>
					<div class="space-y-4">
						<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
							<label class="block mb-2 font-semibold text-gray-700">Fecha Recepción</label>
							<input 
								v-model="formData.fecha_recepcion"
								type="date"
								:max="currentDate"
								:class="[
									'input mb-2 w-full transition-colors',
									formData.fecha_recepcion ? (fechaRecepcionValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
								]"
								required
							>
							<div v-if="formData.fecha_recepcion && !fechaRecepcionValid" class="text-red-500 text-xs mt-1">
								Debe seleccionar una fecha
							</div>
						</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Kilometraje</label>
								<input 
									v-model="formData.kilometraje"
									type="text"
									maxlength="7"
									inputmode="numeric"
									pattern="[0-9]*"
									placeholder="Ejemplo: 15000"
									:class="[
										'input mb-2 w-full transition-colors',
										formData.kilometraje ? (kilometrajeValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
									]"
									required
									@input="validarKilometraje"
								>
								<div v-if="formData.kilometraje && !kilometrajeValid" class="text-red-500 text-xs mt-1">
									Debe ingresar un valor válido entre 0 y 2,000,000
								</div>
							</div>
						<div v-if="authStore.isAdmin" class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
							<label class="block mb-2 font-semibold text-gray-700">Taller Recepción</label>
							<select
								v-model="formData.taller_recepcion"
								:class="[
									'input mb-2 w-full transition-colors',
									formData.taller_recepcion ? (tallerRecepcionValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
								]"
								required
							>
								<option value="">Seleccione un taller</option>
								<option v-for="taller in talleres" :key="taller.id" :value="taller.nombre">
									{{ taller.nombre }}
								</option>
							</select>
							<div v-if="formData.taller_recepcion && !tallerRecepcionValid" class="text-red-500 text-xs mt-1">
								Debe seleccionar un taller
							</div>
						</div>
						<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
							<label class="block mb-2 font-semibold text-gray-700">Entregado por</label>
							<input 
								v-model="formData.entregado_por"
								type="text"
								placeholder="Nombre de quien entrega el vehículo"
								:class="[
									'input mb-2 w-full transition-colors',
									formData.entregado_por ? (entregadoPorValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
								]"
								maxlength="75"
								required
								@input="formatEntregadoPor"
							>
							<div v-if="formData.entregado_por && !entregadoPorValid" class="text-red-500 text-xs mt-1">
								Este campo es obligatorio
							</div>
						</div>
						<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
							<label class="block mb-2 font-semibold text-gray-700">Vehículo</label>
							<select
								v-model="formData.vehiculo_id"
								:class="[
									'input mb-2 w-full transition-colors',
									formData.vehiculo_id ? (vehiculoIdValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
								]"
								required
							>
								<option value="">Seleccione un vehículo</option>
								<option v-for="veh in vehiculos" :key="veh.id" :value="veh.id">
									{{ veh.placas }} - {{ veh.numero_economico }} - {{ veh.marca }} {{ veh.modelo }} {{ veh.año }}
								</option>
							</select>
							<div v-if="formData.vehiculo_id && !vehiculoIdValid" class="text-red-500 text-xs mt-1">
								Debe seleccionar un vehículo
							</div>
							<div class="mt-2">
								<button type="button" @click="abrirVehiculoModal" class="text-blue-600 hover:underline focus:outline-none">
									¿No encuentras el vehículo? Regístralo aquí
								</button>
							</div>
						</div>
					</div>
				</div>
				<div class="flex justify-end mt-8">
					<BaseButton 
						type="submit" 
						variant="success"
						:disabled="!isFormValid"
						:onClick="handleSubmit"
						custom-loading-text="Procesando"
						:min-delay="1500"
					>
						Guardar
					</BaseButton>
				</div>
			</form>
		</div>
	</div>
		
	<VehiculosFormModal 
		:show="showVehiculoModal" 
		@close="showVehiculoModal = false"
		@vehiculo-guardado="handleVehiculoGuardado"
	/>
</template>
<script>
import { computed } from 'vue'
import VehiculosFormModal from '../vehiculos/VehiculosFormModal.vue'
import BaseButton from '../global/BaseButton.vue'
import { useSubmitButton } from '../../composables/useSubmitButton.js'
import { useToastStore } from '../../stores/toast.js'
import { useAuthStore } from '../../stores/auth.js'
import apiClient from '../../services/api.js'

export default {
	name: 'DatosRecepcionFormModal',
	components: {
		VehiculosFormModal,
		BaseButton
	},
	props: {
		show: {
			type: Boolean,
			required: true
		},
		recepcionData: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ['close', 'recepcion-guardada'],
	setup() {
		const { executeSubmit } = useSubmitButton();
		const toastStore = useToastStore();
		const authStore = useAuthStore();
		return {
			executeSubmit,
			toastStore,
			authStore
		};
	},
	data() {
		return {
			formData: {
				fecha_recepcion: '',
				kilometraje: '',
				taller_recepcion: '',
				entregado_por: '',
				vehiculo_id: ''
			},
			vehiculos: [],
			talleres: [
				{ id: 1, nombre: 'Taller 1' },
				{ id: 2, nombre: 'Taller 2' },
				{ id: 3, nombre: 'Taller 3' },
				{ id: 4, nombre: 'Taller 4' },
				{ id: 5, nombre: 'Taller 5' },
				{ id: 6, nombre: 'Taller 6' },
				{ id: 7, nombre: 'Taller 7' },
				{ id: 8, nombre: 'Taller 8' }
			],
			showVehiculoModal: false
		};
	},
	computed: {
		currentDate() {
			const today = new Date();
			return today.toISOString().split('T')[0];
		},
		
		// Validaciones individuales de cada campo
		fechaRecepcionValid() {
			return this.formData.fecha_recepcion && this.formData.fecha_recepcion !== '';
		},
		kilometrajeValid() {
			return this.formData.kilometraje !== '' && 
				   !isNaN(this.formData.kilometraje) && 
				   Number(this.formData.kilometraje) >= 0 && 
				   Number(this.formData.kilometraje) <= 2000000;
		},
		tallerRecepcionValid() {
			// Solo validar si el usuario es admin
			if (!this.authStore.isAdmin) return true;
			return this.formData.taller_recepcion && this.formData.taller_recepcion.trim() !== '';
		},
		entregadoPorValid() {
			return this.formData.entregado_por && this.formData.entregado_por.trim() !== '';
		},
		vehiculoIdValid() {
			return this.formData.vehiculo_id && this.formData.vehiculo_id !== '';
		},
		
		isFormValid() {
			// Todos los campos requeridos deben estar completos
			return (
				this.fechaRecepcionValid &&
				this.tallerRecepcionValid &&
				this.entregadoPorValid &&
				this.vehiculoIdValid &&
				this.kilometrajeValid
			);
		},
		
		finalFormData() {
			// Devuelve solo los datos relevantes con trim para eliminar espacios al final
			const baseData = {
				kilometraje: parseInt(this.formData.kilometraje),
				fecha_recepcion: this.formData.fecha_recepcion,
				entregado_por: this.formData.entregado_por.trim(),
				vehiculo_id: parseInt(this.formData.vehiculo_id)
			};
			
			// Solo incluir taller_recepcion si el usuario es admin
			if (this.authStore.isAdmin) {
				baseData.taller_recepcion = this.formData.taller_recepcion;
			}
			
			return baseData;
		}
	},
	created() {
		// Cargar vehículos al crear el componente
		this.loadVehiculos();
	},
	watch: {
		recepcionData: {
			handler(newData) {
				if (newData && Object.keys(newData).length > 0) {
					this.formData = { 
						...newData,
						// Convertir fecha de formato 'YYYY-MM-DD HH:mm:ss' a 'YYYY-MM-DD'
						fecha_recepcion: newData.fecha_recepcion ? newData.fecha_recepcion.split(' ')[0] : '',
						// Normalizar entregado_por: primera letra de cada palabra en mayúscula
						entregado_por: newData.entregado_por ? this.capitalizeWords(newData.entregado_por) : ''
					};
					console.log('Datos de recepción cargados para edición:', this.formData);
				}
			},
			immediate: true
		},
		show(value) {
			if (value) {
				// Cargar vehículos si no están cargados
				if (this.vehiculos.length === 0) {
					this.loadVehiculos();
				}
				if (!Object.keys(this.recepcionData).length) {
					this.resetForm();
				}
			}
		}
	},
	methods: {
		async loadVehiculos() {
			try {
				console.log('Cargando vehículos...');
				const response = await apiClient.get('/vehiculos');
				console.log('Respuesta de vehículos:', response.data);
				this.vehiculos = response.data;
				console.log('Vehículos cargados:', this.vehiculos.length);
			} catch (error) {
				console.error('Error al cargar vehículos:', error);
				this.toastStore.addToast({
					message: 'Error al cargar la lista de vehículos',
					type: 'error',
					duration: 5000
				});
			}
		},
		abrirVehiculoModal() {
			this.showVehiculoModal = true;
		},
		// Capitalizar la primera letra de cada palabra para el campo 'entregado_por'
		formatEntregadoPor(event) {
			let value = event.target.value || '';
			// Limitar longitud
			if (value.length > 75) {
				value = value.substring(0, 75);
			}
			// Solo capitalizar palabras, NO eliminar espacios al final mientras se escribe
			this.formData.entregado_por = this.capitalizeWords(value);
		},

		// Helper: capitaliza la primera letra de cada palabra (separa por espacios)
		capitalizeWords(value) {
			if (!value) return '';
			return value.toString().split(' ').map(w => {
				if (!w) return '';
				return w.charAt(0).toUpperCase() + w.slice(1);
			}).join(' ');
		},
			validarKilometraje(event) {
				let valor = event.target.value;
				// Eliminar cualquier caracter que no sea dígito
				valor = valor.replace(/[^0-9]/g, '');
				// Limitar a 7 caracteres
				if (valor.length > 7) {
					valor = valor.slice(0, 7);
				}
				this.formData.kilometraje = valor;
			},
		async handleSubmit() {
			if (!this.isFormValid) return;
			
			try {
				await this.executeSubmit(async () => {
					console.log('Guardando datos de recepción...');
					
					// Usar finalFormData que ya aplica trim
					const datosParaAPI = this.finalFormData;
					
					let response;
					if (this.recepcionData?.id) {
						// Actualizar recepción existente
						response = await apiClient.put(`/recepcion/${this.recepcionData.id}`, datosParaAPI);
						console.log('Recepción actualizada:', response.data);
					} else {
						// Crear nueva recepción
						response = await apiClient.post('/recepcion', datosParaAPI);
						console.log('Recepción creada:', response.data);
					}
					
					// Preparar datos para enviar al componente padre
					const datosGuardados = {
						id: this.recepcionData?.id || response.data.recepcion?.id,
						...datosParaAPI,
						// Agregar datos del vehículo para mostrar en tabla
						numero_economico: this.vehiculos.find(v => v.id == this.formData.vehiculo_id)?.numero_economico || '',
						placa: this.vehiculos.find(v => v.id == this.formData.vehiculo_id)?.placa || '',
						cliente_nombre: this.vehiculos.find(v => v.id == this.formData.vehiculo_id)?.cliente_nombre || ''
					};
					
					console.log('Datos guardados:', JSON.stringify(datosGuardados, null, 2));
					
					// Emitir evento con los datos guardados
					this.$emit('recepcion-guardada', datosGuardados);
				});
				
				// Cerrar el modal al finalizar
				this.$emit('close');
			} catch (error) {
				console.error('Error al guardar datos:', error);
				
				// Manejar errores específicos del servidor
				if (error.response?.data?.error) {
					const serverErrors = error.response.data.error;
					let errorMessage = 'Error de validación:';
					
					if (typeof serverErrors === 'object') {
						Object.keys(serverErrors).forEach(field => {
							if (serverErrors[field] && Array.isArray(serverErrors[field])) {
								errorMessage += `\n${field}: ${serverErrors[field][0]}`;
							}
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
				fecha_recepcion: '',
				kilometraje: '',
				taller_recepcion: '',
				entregado_por: '',
				vehiculo_id: ''
			};
		},
		async handleVehiculoGuardado(nuevoVehiculo) {
			// Recargar la lista de vehículos para incluir el nuevo
			await this.loadVehiculos();
			// Seleccionar automáticamente el nuevo vehículo
			this.formData.vehiculo_id = nuevoVehiculo.id;
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
</style>