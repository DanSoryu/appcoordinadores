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
									<label class="block mb-2 font-semibold text-gray-700">Cliente *</label>
									<select 
										v-model="formData.cliente_id" 
										:class="[
											'input mb-2 w-full transition-colors',
											formData.cliente_id ? (clienteValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
										]"
										required
									>
										<option value="">Selecciona un cliente</option>
										<option v-for="cliente in clientesWithDetails" :key="cliente.id" :value="cliente.id">
                  							{{ cliente.displayName }}
										</option>
									</select>
									<div v-if="formData.cliente_id && !clienteValid" class="text-red-500 text-xs mt-1">
										Debe seleccionar un cliente
									</div>
									<!-- Eliminado botón de registrar cliente -->
								</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<div class="flex justify-between items-center mb-2">
									<label class="font-semibold text-gray-700">Marca *</label>
									<button 
										v-if="isAdministrador"
										@click="openAdminModal"
										type="button"
										class="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
										title="Administrar marcas y modelos"
									>
										<font-awesome-icon icon="cog" class="mr-1" />
										Admin
									</button>
								</div>
								<select 
									v-model="formData.marca" 
									:class="[
										'input mb-2 w-full transition-colors',
										formData.marca ? (marcaValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
									]"
									required
								>
									<option value="">Selecciona una marca</option>
									<option v-for="marca in marcas" :key="marca" :value="marca">
										{{ marca }}
									</option>
								</select>
								<div v-if="formData.marca && !marcaValid" class="text-red-500 text-xs mt-1">
									Debe seleccionar una marca
								</div>
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Modelo *</label>
								<select 
									v-model="formData.modelo"
									:class="[
										'input mb-2 w-full transition-colors',
										formData.modelo ? (modeloValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
									]"
									:disabled="!formData.marca || modelosDisponibles.length === 0"
									required
								>
									<option value="">
										{{ !formData.marca ? 'Selecciona una marca primero' : 
											modelosDisponibles.length === 0 ? 'No hay modelos disponibles' : 'Selecciona un modelo' }}
									</option>
									<option v-for="modelo in modelosDisponibles" :key="modelo" :value="modelo">
										{{ modelo }}
									</option>
								</select>
								<div v-if="formData.modelo && !modeloValid" class="text-red-500 text-xs mt-1">
									Debe seleccionar un modelo
								</div>
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Placas *</label>
								<input 
									v-model="formData.placas" 
									@input="formatPlacas"
									:class="[
										'input mb-2 w-full transition-colors',
										formData.placas ? (placasValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
									]"
									placeholder="Placas" 
									maxlength="12"
									required
								/>
								<div v-if="formData.placas && !placasValid" class="text-red-500 text-xs mt-1">
									Este campo es obligatorio
								</div>
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Año *</label>
								<select 
									v-model="formData.año" 
									:class="[
										'input mb-2 w-full transition-colors',
										formData.año ? (añoValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
									]"
									required
								>
									<option value="">Selecciona un año</option>
									<option v-for="año in años" :key="año" :value="año">
										{{ año }}
									</option>
								</select>
								<div v-if="formData.año && !añoValid" class="text-red-500 text-xs mt-1">
									Debe seleccionar un año
								</div>
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">VIN *</label>
								<input 
									v-model="formData.numero_serie" 
									@input="formatNumeroSerie"
									:class="[
										'input mb-2 w-full transition-colors',
										formData.numero_serie ? (numeroSerieValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
									]"
									placeholder="VIN - 17 caracteres alfanuméricos" 
									pattern="[A-Za-z0-9]{17}"
									title="Debe contener exactamente 17 caracteres alfanuméricos, sin espacios"
									maxlength="17"
									required
								/>
								<div class="text-xs text-gray-500 mt-1">
									{{ formData.numero_serie.length }}/17 caracteres
								</div>
								<div v-if="formData.numero_serie && !numeroSerieValid" class="text-red-500 text-xs mt-1">
									Debe contener exactamente 17 caracteres alfanuméricos
								</div>
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Número Económico *</label>
								<input 
									v-model="formData.numero_economico" 
									@input="formatNumeroEconomico"
									:class="[
										'input mb-2 w-full transition-colors',
										formData.numero_economico ? (numeroEconomicoValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
									]"
									placeholder="Número Económico" 
									maxlength="30"
									required
								/>
								<div v-if="formData.numero_economico && !numeroEconomicoValid" class="text-red-500 text-xs mt-1">
									Este campo es obligatorio
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
	
	<!-- Modal de administración de vehículos -->
	<VehiculosAdminModal 
		:show="showAdminModal"
		@close="showAdminModal = false"
		@update-data="updateVehiculosData"
	/>
</template>

<script>
import BaseButton from '../global/BaseButton.vue';
import ClientesFormModal from '../clientes/ClientesFormModal.vue';
import VehiculosAdminModal from './VehiculosAdminModal.vue';
import { useSubmitButton } from '../../composables/useSubmitButton.js';
import { useToastStore } from '../../stores/toast.js';
import { useAuthStore } from '../../stores/auth.js';
import apiClient from '../../services/api.js';
import vehiculosDataJson from '../../data/vehiculos-data.json';

export default {
	name: 'VehiculosFormModal',
	components: {
		BaseButton,
		ClientesFormModal,
		VehiculosAdminModal
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
						cliente_id: '',
						marca: '',
						modelo: '',
						placas: '',
						año: '',
						numero_serie: '',
						numero_economico: ''
					},
								clientes: [],
								copes: [],
								areas: [],
								divisiones: [],
								talleres: [],
								clientesWithDetails: [], // Para mostrar supervisor y cope concatenado
								tallerDelMecanico: null, // Para almacenar el taller del mecánico logueado
								marcas: [],
								modelosPorMarca: {},
								años: [],
								showAdminModal: false
		};
	},
	async created() {
		this.loadVehiculosData();
		this.loadVehiculoData();
		await this.loadTallerInfo();
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
		},
		'formData.marca'() {
			// Resetear modelo cuando cambie la marca
			if (this.formData.modelo && !this.modelosDisponibles.includes(this.formData.modelo)) {
				this.formData.modelo = '';
			}
		}
	},
	computed: {
		// Validaciones individuales de cada campo
		clienteValid() {
			return this.formData.cliente_id && this.formData.cliente_id !== '';
		},
		marcaValid() {
			return this.formData.marca && this.formData.marca.trim() !== '';
		},
		modeloValid() {
			return this.formData.modelo && this.formData.modelo !== '';
		},
		placasValid() {
			return this.formData.placas && this.formData.placas.trim() !== '';
		},
		añoValid() {
			return this.formData.año && this.formData.año !== '';
		},
		numeroSerieValid() {
			return this.formData.numero_serie && this.formData.numero_serie.trim() !== '' && this.formData.numero_serie.length === 17;
		},
		numeroEconomicoValid() {
			return this.formData.numero_economico && this.formData.numero_economico.trim() !== '';
		},

		// Modelos disponibles según la marca seleccionada
		modelosDisponibles() {
			if (!this.formData.marca) return [];
			return this.modelosPorMarca[this.formData.marca] || [];
		},

		isStepValid() {
			// Todos los campos son obligatorios y deben ser válidos
			return (
				this.clienteValid &&
				this.marcaValid &&
				this.modeloValid &&
				this.placasValid &&
				this.añoValid &&
				this.numeroSerieValid &&
				this.numeroEconomicoValid
			);
		},
		finalFormData() {
			// Devuelve solo los datos relevantes con trim para eliminar espacios al final
			return {
				cliente_id: parseInt(this.formData.cliente_id),
				marca: this.formData.marca,
				modelo: this.formData.modelo,
				placas: this.formData.placas,
				año: parseInt(this.formData.año),
				numero_serie: this.formData.numero_serie,
				numero_economico: this.formData.numero_economico.trim()
			};
		},
		isAdministrador() {
			return this.authStore.isAdmin;
		},
		isAdministrador() {
			return this.authStore.isAdmin;
		}
	},
	methods: {
		// Cargar datos de vehículos desde localStorage o JSON
		loadVehiculosData() {
			const datosGuardados = localStorage.getItem('vehiculos-data');
			if (datosGuardados) {
				const datos = JSON.parse(datosGuardados);
				this.marcas = [...datos.marcas];
				this.modelosPorMarca = { ...datos.modelosPorMarca };
			} else {
				this.marcas = [...vehiculosDataJson.marcas];
				this.modelosPorMarca = { ...vehiculosDataJson.modelosPorMarca };
			}
		},
		// Actualizar datos cuando el administrador haga cambios
		updateVehiculosData(nuevosDatos) {
			this.marcas = [...nuevosDatos.marcas];
			this.modelosPorMarca = { ...nuevosDatos.modelosPorMarca };
		},
		// Mostrar modal de administración
		// Cargar datos de vehículos desde localStorage o JSON
		loadVehiculosData() {
			const datosGuardados = localStorage.getItem('vehiculos-data');
			if (datosGuardados) {
				const datos = JSON.parse(datosGuardados);
				this.marcas = [...datos.marcas];
				this.modelosPorMarca = { ...datos.modelosPorMarca };
			} else {
				this.marcas = [...vehiculosDataJson.marcas];
				this.modelosPorMarca = { ...vehiculosDataJson.modelosPorMarca };
			}
		},
		// Actualizar datos cuando el administrador haga cambios
		updateVehiculosData(nuevosDatos) {
			this.marcas = [...nuevosDatos.marcas];
			this.modelosPorMarca = { ...nuevosDatos.modelosPorMarca };
			
			// Si la marca seleccionada ya no existe, resetearla
			if (this.formData.marca && !this.marcas.includes(this.formData.marca)) {
				this.formData.marca = '';
				this.formData.modelo = '';
			}
		},
		openAdminModal() {
			this.showAdminModal = true;
		},
		// Helper: capitaliza la primera letra de cada palabra (separa por espacios)
		capitalizeWords(value) {
			if (!value) return '';
			return value.toString().split(' ').map(w => {
				if (!w) return '';
				return w.charAt(0).toUpperCase() + w.slice(1);
			}).join(' ');
		},
		generateYears() {
			const currentYear = new Date().getFullYear();
			for (let year = 1980; year <= currentYear; year++) {
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
			// Convertir a mayúsculas y eliminar espacios en tiempo real
			value = value.toUpperCase().replace(/\s/g, '');
			if (value.length <= 12) {
				this.formData.placas = value;
			} else {
				event.target.value = this.formData.placas;
			}
		},

		formatNumeroEconomico(event) {
			let value = event.target.value || '';
			if (value.length <= 30) {
				// Eliminar espacios al final automáticamente
				this.formData.numero_economico = value.trimEnd();
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
			// El modelo ahora viene directamente del select, sin modificaciones
			this.formData.modelo = this.vehiculoData.modelo || '';
			// Asegurar que las placas cargadas estén en mayúsculas
			this.formData.placas = (this.vehiculoData.placas || '').toString().toUpperCase();
			this.formData.año = this.vehiculoData.año || '';
			// Asegurar que el número de serie (VIN) esté en mayúsculas sin caracteres inválidos
			this.formData.numero_serie = (this.vehiculoData.numero_serie || '').toString().toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0,17);
			// Aplicar trim al número económico
			this.formData.numero_economico = (this.vehiculoData.numero_economico || '').toString().trimEnd();
			this.formData.cliente_id = this.vehiculoData.cliente_id || '';
		},
		
		async loadTallerInfo() {
			try {
				// Solo cargar información del taller si el usuario es mecánico
				if (this.authStore.user && this.authStore.user.rol === 'mecanico') {
					console.log('Usuario mecánico detectado, cargando información del taller...');
					console.log('ID del usuario:', this.authStore.user.id);
					
					// Primero obtener los detalles del mecánico usando su ID
					const detalleMecanicoResponse = await apiClient.get(`/detalle-mecanico/${this.authStore.user.id}`);
					console.log('Detalles del mecánico obtenidos:', detalleMecanicoResponse.data);
					
					const detalleMecanico = detalleMecanicoResponse.data;
					const tallerId = detalleMecanico.taller_id;
					
					if (tallerId) {
						// Cargar todos los talleres para encontrar el del mecánico
						const talleresResponse = await apiClient.get('/talleres');
						this.talleres = talleresResponse.data;
						
						// Encontrar el taller asignado al mecánico
						this.tallerDelMecanico = this.talleres.find(taller => taller.id === tallerId);
						
						if (this.tallerDelMecanico) {
							console.log('Taller del mecánico encontrado:', this.tallerDelMecanico);
							console.log('COPE del taller:', this.tallerDelMecanico.cope_id);
						} else {
							console.warn('No se encontró el taller con ID:', tallerId);
						}
					} else {
						console.warn('El mecánico no tiene taller_id asignado en su detalle');
					}
				}
			} catch (error) {
				console.error('Error al cargar información del taller:', error);
				if (error.response?.status === 404) {
					console.warn('No se encontró detalle del mecánico para el usuario ID:', this.authStore.user.id);
					this.toastStore.addToast({
						message: 'No se encontró información del taller asignado',
						type: 'warning',
						duration: 4000
					});
				} else {
					this.toastStore.addToast({
						message: 'Error al cargar información del taller',
						type: 'error',
						duration: 5000
					});
				}
			}
		},
		
		async loadClientes() {
			try {
				// Cargar clientes, copes, áreas y divisiones
				const [clientesResponse, copesResponse, areasResponse, divisionesResponse] = await Promise.all([
					apiClient.get('/clientes'),
					apiClient.get('/copes'),
					apiClient.get('/areas'),
					apiClient.get('/divisiones')
				]);

				this.clientes = clientesResponse.data;
				this.copes = copesResponse.data;
				this.areas = areasResponse.data;
				this.divisiones = divisionesResponse.data;

				// Mostrar TODOS los clientes para todos los usuarios (sin filtrar por rol)
				// Crear array con información concatenada
				this.clientesWithDetails = this.clientes.map(cliente => {
					const cope = this.copes.find(c => c.id === cliente.cope_id);
					const area = cope ? this.areas.find(a => a.id === cope.area_id) : null;
					const division = area ? this.divisiones.find(d => d.id === area.division_id) : null;
					
					const copeInfo = cope ? `${division?.nombre || 'N/A'} - ${area?.nombre || 'N/A'} - ${cope.nombre}` : 'Sin COPE';
					
					return {
						...cliente,
						displayName: `${cliente.supervisor} - ${copeInfo}`
					};
				});
				
				console.log(`Total de clientes disponibles: ${this.clientesWithDetails.length}`);
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
				const response = await apiClient.post(`/update/vehiculos/${this.vehiculoData.id}`, this.finalFormData);
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