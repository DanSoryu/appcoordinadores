<template>
	<div v-if="show" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
		<div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative border border-gray-200 overflow-y-auto max-h-[90vh]">
			<button @click="$emit('close')" class="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-md p-2">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
				</svg>
			</button>
			<h2 class="text-2xl font-bold mb-6 text-blue-600 text-center">Nuevo Taller</h2>
			<form @submit.prevent="handleSubmit">
				<!-- SECCIÓN ÚNICA: DATOS DE TALLER -->
				<div class="mb-8 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border-l-4 border-primary-500">
					<div class="flex items-center mb-4">
						<div class="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center mr-3">
							<font-awesome-icon icon="wrench" class="w-4 h-4" />
						</div>
						<h3 class="text-xl font-bold text-primary-700">Información del Taller</h3>
					</div>
					<div class="space-y-4">
						<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
							<label class="block mb-2 font-semibold text-gray-700">Nombre del Taller *</label>
							<input 
								v-model="formData.nombre"
								type="text"
								:class="[
									'input w-full',
									formData.nombre ? (nombreValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
								]"
								placeholder="Ingrese el nombre del taller"
								@input="formatNombre"
								required
								maxlength="255"
							>
							<div v-if="formData.nombre && !nombreValid" class="text-red-500 text-xs mt-1">
								El nombre del taller es requerido
							</div>
						</div>
						
						<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
							<label class="block mb-2 font-semibold text-gray-700">COPE *</label>
							<select 
								v-model="formData.cope_id" 
								:class="[
									'input w-full',
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
				<div class="flex justify-end mt-8">
					<BaseButton 
						type="submit" 
						variant="success"
						:disabled="!isFormValid"
						:onClick="handleSubmit"
						custom-loading-text="Procesando"
						:min-delay="1500"
					>
						Crear Taller
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
import BaseButton from '../global/BaseButton.vue'
import CopesFormModal from '../dac/CopesFormModal.vue'
import { useSubmitButton } from '../../composables/useSubmitButton.js'
import { useToastStore } from '../../stores/toast.js'
import apiClient from '../../services/api.js'

export default {
	name: 'TallerFormModal',
	components: {
		BaseButton,
		CopesFormModal
	},
	props: {
		show: {
			type: Boolean,
			required: true
		}
	},
	emits: ['close', 'taller-guardado'],
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
				nombre: '',
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
		this.loadCopesData();
	},
	computed: {
		// Validaciones individuales de cada campo
		nombreValid() {
			return this.formData.nombre && this.formData.nombre.trim() !== '';
		},
		
		copeValid() {
			return this.formData.cope_id && this.formData.cope_id !== '';
		},
		
		isFormValid() {
			return this.nombreValid && this.copeValid;
		},
		
		finalFormData() {
			return {
				nombre: this.formData.nombre.trim(),
				cope_id: parseInt(this.formData.cope_id)
			};
		}
	},
	watch: {
		show(value) {
			if (value) {
				this.resetForm();
			}
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
		
		abrirCopeModal() {
			this.showCopeModal = true;
		},
		
		async handleCopeGuardado(nuevoCope) {
			// Recargar la lista de COPEs para incluir el nuevo
			await this.loadCopesData();
			// Seleccionar automáticamente el nuevo COPE
			this.formData.cope_id = nuevoCope.id;
		},
		
		// Formatear nombre: mantener formato original
		formatNombre(event) {
			let value = event.target.value || '';
			// Limitar longitud
			if (value.length > 255) {
				value = value.substring(0, 255);
			}
			this.formData.nombre = value;
		},
		
		async handleSubmit() {
			if (!this.isFormValid) return;
			
			try {
				await this.executeSubmit(async () => {
					console.log('Creando nuevo taller...');
					
					const response = await apiClient.post('/talleres', this.finalFormData);
					console.log('Taller creado:', response.data);
					
					// Emitir evento con el nuevo taller
					this.$emit('taller-guardado', response.data.taller);
					
					this.toastStore.addToast({
						message: 'Taller creado exitosamente',
						type: 'success',
						duration: 3000
					});
				});
				
				// Cerrar el modal al finalizar
				this.$emit('close');
			} catch (error) {
				console.error('Error al crear taller:', error);
				
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
						message: 'Error al crear el taller. Por favor, intente nuevamente.',
						type: 'error',
						duration: 5000
					});
				}
			}
		},
		
		resetForm() {
			this.formData = {
				nombre: '',
				cope_id: ''
			};
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
