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
									<select v-model="formData.cliente" class="input mb-2 w-full">
										<option value="">Selecciona un cliente</option>
										<option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
											{{ cliente.nombre }}
										</option>
									</select>
									<div class="mt-2">
										<button type="button" @click="abrirClienteModal" class="text-blue-600 hover:underline focus:outline-none">
											¿No encuentras el cliente? Regístralo aquí
										</button>
									</div>
								</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Marca</label>
								<input v-model="formData.marca" class="input mb-2 w-full" placeholder="Marca" />
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Tipo/Versión</label>
								<input v-model="formData.tipoVersion" class="input mb-2 w-full" placeholder="Tipo/Versión" />
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Color</label>
								<input v-model="formData.color" class="input mb-2 w-full" placeholder="Color" />
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Año/Modelo</label>
								<input v-model="formData.anioModelo" class="input mb-2 w-full" placeholder="Año/Modelo" />
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Número de Serie</label>
								<input v-model="formData.numeroSerie" class="input mb-2 w-full" placeholder="Número de Serie" />
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Número Económico</label>
								<input v-model="formData.numeroEconomico" class="input mb-2 w-full" placeholder="Número Económico" />
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
	<ClientesFormModal 
		:show="showClienteModal" 
		@close="showClienteModal = false"
		@cliente-guardado="handleClienteGuardado"
	/>
</template>

<script>
import BaseButton from '../global/BaseButton.vue';
import ClientesFormModal from '../clientes/ClientesFormModal.vue';
import { useSubmitButton } from '../../composables/useSubmitButton.js';
import { useToastStore } from '../../stores/toast.js';

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
						cliente: '',
						marca: '',
						tipoVersion: '',
						color: '',
						anioModelo: '',
						numeroSerie: '',
						numeroEconomico: ''
					},
					clientes: [
						{ id: '1', nombre: 'Juan Pérez' },
						{ id: '2', nombre: 'María López' },
						{ id: '3', nombre: 'Carlos Sánchez' },
						{ id: '4', nombre: 'Ana Torres' }
					],
					showClienteModal: false
		};
	},
	created() {
		this.loadVehiculoData();
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
					this.formData.cliente && this.formData.cliente !== '' &&
					this.formData.marca && this.formData.marca.trim() !== '' &&
					this.formData.tipoVersion && this.formData.tipoVersion.trim() !== '' &&
					this.formData.color && this.formData.color.trim() !== '' &&
					this.formData.anioModelo && this.formData.anioModelo.trim() !== '' &&
					this.formData.numeroSerie && this.formData.numeroSerie.trim() !== '' &&
					this.formData.numeroEconomico && this.formData.numeroEconomico.trim() !== ''
				);
			},
			finalFormData() {
				// Devuelve solo los datos relevantes
				return {
					cliente: this.formData.cliente,
					marca: this.formData.marca,
					tipoVersion: this.formData.tipoVersion,
					color: this.formData.color,
					anioModelo: this.formData.anioModelo,
					numeroSerie: this.formData.numeroSerie,
					numeroEconomico: this.formData.numeroEconomico
				};
			}
	},
	methods: {
		loadVehiculoData() {
			if (!this.vehiculoData || Object.keys(this.vehiculoData).length === 0) return;
			this.formData.marca = this.vehiculoData.marca || '';
			this.formData.tipoVersion = this.vehiculoData.tipoVersion || '';
			this.formData.color = this.vehiculoData.color || '';
			this.formData.anioModelo = this.vehiculoData.anioModelo || '';
			this.formData.numeroSerie = this.vehiculoData.numeroSerie || '';
			this.formData.numeroEconomico = this.vehiculoData.numeroEconomico || '';
		},
			async handleFinalSubmit() {
				if (!this.isStepValid) return;
				try {
					await this.saveCurrentStepData();
					
					// Preparar los datos del vehículo para emitir
					const nuevoVehiculo = {
						numeroControl: this.formData.numeroSerie, // Usando numeroSerie como numeroControl
						nombre: `${this.formData.marca} ${this.formData.tipoVersion}`,
						...this.finalFormData
					};
					
					// Emitir el evento con los datos del vehículo
					this.$emit('vehiculo-guardado', nuevoVehiculo);
					
					this.toastStore.addToast({
						message: 'Datos del vehículo guardados correctamente',
						type: 'success',
						duration: 3500
					});
					
					this.$emit('close');
					this.resetForm();
					console.log('Datos del vehículo enviados:', JSON.stringify(nuevoVehiculo, null, 2));
				} catch (error) {
					console.error('Error al guardar datos:', error);
					this.toastStore.addToast({
						message: 'Error al guardar los datos. Por favor, intente nuevamente.',
						type: 'error',
						duration: 5000
					});
				}
			},

			resetForm() {
				this.formData = {
					cliente: '',
					marca: '',
					tipoVersion: '',
					color: '',
					anioModelo: '',
					numeroSerie: '',
					numeroEconomico: ''
				};
			},
		async saveCurrentStepData() {
			// Simular guardado de datos
			console.log('Guardando datos del vehículo...');
			console.log('Datos actuales:', JSON.stringify(this.finalFormData, null, 2));
			await new Promise(resolve => setTimeout(resolve, 500));
			console.log('Datos del vehículo guardados correctamente');
		},
		abrirClienteModal() {
			this.showClienteModal = true;
		},
		handleClienteGuardado(nuevoCliente) {
			// Agregar el nuevo cliente a la lista y seleccionarlo
			this.clientes.push(nuevoCliente);
			this.formData.cliente = nuevoCliente.id;
			this.showClienteModal = false;
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