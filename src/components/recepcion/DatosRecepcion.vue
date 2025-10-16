<template>
	<div>
		<div class="bg-white p-8 rounded-2xl shadow-xl mb-6 max-w-xl mx-auto border border-gray-200">
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
								v-model="formData.fechaRecepcion"
								type="date"
								:max="currentDate"
								class="input mb-2 w-full"
								required
							>
						</div>
						<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
							<label class="block mb-2 font-semibold text-gray-700">Lugar Recepción</label>
							<input 
								v-model="formData.lugarRecepcion"
								type="text"
								placeholder="Ejemplo: Sucursal Centro"
								class="input mb-2 w-full"
								required
							>
						</div>
						<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
							<label class="block mb-2 font-semibold text-gray-700">Taller Recepción</label>
							<input 
								v-model="formData.tallerRecepcion"
								type="text"
								placeholder="Ejemplo: Taller Principal"
								class="input mb-2 w-full"
								required
							>
						</div>
						<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
							<label class="block mb-2 font-semibold text-gray-700">Vehículo</label>
							<select
								v-model="formData.vehiculo"
								class="input mb-2 w-full"
								required
							>
								<option value="">Seleccione un vehículo</option>
								<option v-for="veh in vehiculos" :key="veh.numeroControl" :value="veh.numeroControl">
									{{ veh.numeroControl }} - {{ veh.nombre }}
								</option>
							</select>
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
		<VehiculosFormModal 
			:show="showVehiculoModal" 
			@close="showVehiculoModal = false"
			@vehiculo-guardado="handleVehiculoGuardado"
		/>
	</div>
</template>
<script>
import { computed } from 'vue'
import VehiculosFormModal from '../vehiculos/VehiculosFormModal.vue'
import BaseButton from '../global/BaseButton.vue'
import { useSubmitButton } from '../../composables/useSubmitButton.js'
import { useToastStore } from '../../stores/toast.js'

export default {
	name: 'DatosRecepcion',
	components: {
		VehiculosFormModal,
		BaseButton
	},
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
				fechaRecepcion: '',
				lugarRecepcion: '',
				tallerRecepcion: '',
				vehiculo: ''
			},
			vehiculos: [
				{ numeroControl: '123123', nombre: 'Volkswagen' },
				{ numeroControl: '456456', nombre: 'Toyota Corolla' },
				{ numeroControl: '789789', nombre: 'Ford Fiesta' },
				{ numeroControl: '321321', nombre: 'Chevrolet Spark' }
			],
			showVehiculoModal: false
		};
	},
	computed: {
		currentDate() {
			const today = new Date();
			return today.toISOString().split('T')[0];
		},
		isFormValid() {
			// Todos los campos requeridos deben estar completos
			return (
				this.formData.fechaRecepcion && this.formData.fechaRecepcion !== '' &&
				this.formData.lugarRecepcion && this.formData.lugarRecepcion.trim() !== '' &&
				this.formData.tallerRecepcion && this.formData.tallerRecepcion.trim() !== '' &&
				this.formData.vehiculo && this.formData.vehiculo !== ''
			);
		}
	},
	methods: {
		abrirVehiculoModal() {
			this.showVehiculoModal = true;
		},
		async handleSubmit() {
			if (!this.isFormValid) return;
			
			try {
				await this.executeSubmit(async () => {
					// Simulamos el guardado de datos
					console.log('Guardando datos de recepción...');
					await new Promise(resolve => setTimeout(resolve, 500));
					console.log('Datos guardados:', JSON.stringify(this.formData, null, 2));
				});
				
				this.toastStore.addToast({
					message: 'Datos de recepción guardados correctamente',
					type: 'success',
					duration: 3500
				});
				
				this.resetForm();
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
				fechaRecepcion: '',
				lugarRecepcion: '',
				tallerRecepcion: '',
				vehiculo: ''
			};
		},
		handleVehiculoGuardado(nuevoVehiculo) {
			// Agregar el nuevo vehículo a la lista y seleccionarlo
			this.vehiculos.push(nuevoVehiculo);
			this.formData.vehiculo = nuevoVehiculo.numeroControl;
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
</style>