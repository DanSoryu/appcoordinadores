<template>
	<div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
		<div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative border border-gray-200 overflow-y-auto max-h-[90vh]">
			<button @click="$emit('close')" class="close-button absolute top-4 right-4">
				<font-awesome-icon icon="times" />
			</button>
			<h2 class="text-2xl font-bold mb-6 text-blue-600 text-center">Datos del Vehículo</h2>
			<form @submit.prevent="handleFinalSubmit">
				<div>
					<!-- SECCIÓN ÚNICA: DATOS DEL VEHÍCULO -->
					<div class="mb-8 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border-l-4 border-primary-500">
						<div class="flex items-center mb-4">
							<div class="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center mr-3">
								<font-awesome-icon icon="car" class="w-4 h-4" />
							</div>
							<h3 class="text-xl font-bold text-primary-700">Información del Vehículo</h3>
						</div>
						<div class="space-y-4">
								<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
									<label class="block mb-2 font-semibold text-gray-700">Cliente</label>
									<select v-model="formData.cliente_id" class="input mb-2 w-full">
										<option value="">Selecciona un cliente</option>
										<option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                  							{{ cliente.responsable_automotriz }} - {{ cliente.supervisor }}
										</option>
									</select>
									<!-- Eliminado botón de registrar cliente -->
								</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Marca</label>
								<select v-model="formData.marca" class="input mb-2 w-full">
									<option value="">Selecciona una marca</option>
									<option v-for="marca in marcas" :key="marca" :value="marca">
										{{ marca }}
									</option>
								</select>
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Modelo</label>
								<input 
									v-model="formData.modelo" 
									@input="formatModelo"
									class="input mb-2 w-full" 
									placeholder="Modelo" 
									maxlength="30"
								/>
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Placas</label>
								<input 
									v-model="formData.placas" 
									@input="formatPlacas"
									class="input mb-2 w-full" 
									placeholder="Placas" 
									maxlength="12"
								/>
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Año</label>
								<select v-model="formData.año" class="input mb-2 w-full">
									<option value="">Selecciona un año</option>
									<option v-for="año in años" :key="año" :value="año">
										{{ año }}
									</option>
								</select>
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">VIN</label>
								<input 
									v-model="formData.numero_serie" 
									@input="formatNumeroSerie"
									class="input mb-2 w-full" 
									placeholder="VIN - 17 caracteres alfanuméricos" 
									pattern="[A-Za-z0-9]{17}"
									title="Debe contener exactamente 17 caracteres alfanuméricos, sin espacios"
									maxlength="17"
								/>
								<div class="text-xs text-gray-500 mt-1">
									{{ formData.numero_serie.length }}/17 caracteres
								</div>
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Número Económico</label>
								<input 
									v-model="formData.numero_economico" 
									@input="formatNumeroEconomico"
									class="input mb-2 w-full" 
									placeholder="Número Económico" 
									maxlength="30"
								/>
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
<!-- Eliminado modal de registrar cliente -->
</template>

<script>
import BaseButton from '../global/BaseButton.vue';
import ClientesFormModal from '../clientes/ClientesFormModal.vue';
import { useSubmitButton } from '../../composables/useSubmitButton.js';
import { useToastStore } from '../../stores/toast.js';
import apiClient from '../../services/api.js';

export default {
	name: 'VehiculosFormModal',
	components: {
		BaseButton,
		ClientesFormModal
	},
	props: {
		show: {
			type: Boolean,
			required: true
		},
		vehiculoData: {
			type: Object,
			default: () => ({})
		}
	},
	emits: ['close', 'vehiculo-guardado'],
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
						cliente_id: '',
						marca: '',
						modelo: '',
						placas: '',
						año: '',
						numero_serie: '',
						numero_economico: ''
					},
								clientes: [],
								marcas: [
									'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Hyundai', 'Kia',
									'Volkswagen', 'Jeep', 'Dodge'
								],
								años: []
		};
	},
	created() {
		this.loadVehiculoData();
		this.loadClientes();
		this.generateYears();
	},
	watch: {
		vehiculoData: {
			handler() {
				this.loadVehiculoData();
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
				// Todos los campos requeridos deben estar completos
				return (
					this.formData.cliente_id && this.formData.cliente_id !== '' &&
					this.formData.marca && this.formData.marca.trim() !== '' &&
					this.formData.modelo && this.formData.modelo.trim() !== '' &&
					this.formData.placas && this.formData.placas.trim() !== '' &&
					this.formData.año && this.formData.año !== '' &&
					this.formData.numero_serie && this.formData.numero_serie.trim() !== '' && this.formData.numero_serie.length === 17 &&
					this.formData.numero_economico && this.formData.numero_economico.trim() !== ''
				);
			},
			finalFormData() {
				// Devuelve solo los datos relevantes
				return {
					cliente_id: parseInt(this.formData.cliente_id),
					marca: this.formData.marca,
					modelo: this.formData.modelo,
					placas: this.formData.placas,
					año: parseInt(this.formData.año),
					numero_serie: this.formData.numero_serie,
					numero_economico: this.formData.numero_economico
				};
			}
	},
	methods: {
		generateYears() {
			const currentYear = new Date().getFullYear();
			for (let year = 2000; year <= currentYear; year++) {
				this.años.push(year);
			}
		},
		validatePlacas(value) {
			// Máximo 12 caracteres
			if (value.length > 12) {
				return false;
			}
			return true;
		},
		validateModelo(value) {
			// Máximo 30 caracteres
			if (value.length > 30) {
				return false;
			}
			return true;
		},
		validateNumeroEconomico(value) {
			// Máximo 30 caracteres
			if (value.length > 30) {
				return false;
			}
			return true;
		},
		validateNumeroSerie(value) {
			// Exactamente 17 caracteres alfanuméricos, sin espacios
			const regex = /^[A-Za-z0-9]{17}$/;
			return regex.test(value);
		},
		formatPlacas(event) {
			let value = event.target.value || '';
			// Convertir a mayúsculas y remover espacios excesivos
			value = value.toUpperCase();
			if (value.length <= 12) {
				this.formData.placas = value;
			} else {
				event.target.value = this.formData.placas;
			}
		},
		formatModelo(event) {
			let value = event.target.value || '';
			// Limitar longitud
			if (value.length > 30) {
				event.target.value = this.formData.modelo;
				return;
			}
			// Capitalizar el primer carácter y mantener el resto como el usuario lo escribió
			if (value.length > 0) {
				this.formData.modelo = value.charAt(0).toUpperCase() + value.slice(1);
			} else {
				this.formData.modelo = value;
			}
		},
		formatNumeroEconomico(event) {
			const value = event.target.value;
			if (value.length <= 30) {
				this.formData.numero_economico = value;
			} else {
				event.target.value = this.formData.numero_economico;
			}
		},
		formatNumeroSerie(event) {
			let value = event.target.value || '';
			// Convertir a mayúsculas, remover espacios y caracteres especiales, máximo 17 caracteres
			value = value.toUpperCase();
			const cleanValue = value.replace(/[^A-Z0-9]/g, '').substring(0, 17);
			this.formData.numero_serie = cleanValue;
			event.target.value = cleanValue;
		},
		loadVehiculoData() {
			if (!this.vehiculoData || Object.keys(this.vehiculoData).length === 0) return;
			this.formData.marca = this.vehiculoData.marca || '';
			this.formData.modelo = this.vehiculoData.modelo || '';
			// Asegurar que las placas cargadas estén en mayúsculas
			this.formData.placas = (this.vehiculoData.placas || '').toString().toUpperCase();
			this.formData.año = this.vehiculoData.año || '';
			// Asegurar que el número de serie (VIN) esté en mayúsculas sin caracteres inválidos
			this.formData.numero_serie = (this.vehiculoData.numero_serie || '').toString().toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0,17);
			this.formData.numero_economico = this.vehiculoData.numero_economico || '';
			this.formData.cliente_id = this.vehiculoData.cliente_id || '';
		},
		async loadClientes() {
			try {
				const response = await apiClient.get('/clientes');
				this.clientes = response.data;
			} catch (error) {
				console.error('Error al cargar clientes:', error);
				this.toastStore.addToast({
					message: 'Error al cargar la lista de clientes',
					type: 'error',
					duration: 5000
				});
			}
		},
			async handleFinalSubmit() {
				if (!this.isStepValid) return;
				try {
					await this.saveCurrentStepData();
					
					// Preparar los datos del vehículo para emitir
					const vehiculoGuardado = {
						id: this.vehiculoData?.id || null,
						...this.finalFormData
					};
					
					// Emitir el evento con los datos del vehículo
					this.$emit('vehiculo-guardado', vehiculoGuardado);
					
					this.$emit('close');
					this.resetForm();
					console.log('Datos del vehículo enviados:', JSON.stringify(vehiculoGuardado, null, 2));
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
					cliente_id: '',
					marca: '',
					modelo: '',
					placas: '',
					año: '',
					numero_serie: '',
					numero_economico: ''
				};
			},
		async saveCurrentStepData() {
			console.log('Guardando datos del vehículo...');
			console.log('Datos actuales:', JSON.stringify(this.finalFormData, null, 2));
			
			if (this.vehiculoData?.id) {
				// Actualizar vehículo existente
				const response = await apiClient.put(`/vehiculos/${this.vehiculoData.id}`, this.finalFormData);
				console.log('Vehículo actualizado:', response.data);
			} else {
				// Crear nuevo vehículo
				const response = await apiClient.post('/vehiculos', this.finalFormData);
				console.log('Vehículo creado:', response.data);
			}
			
			console.log('Datos del vehículo guardados correctamente');
		},
		// Eliminados métodos de cliente
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