<template>
	<div v-if="show" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
		<div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative border border-gray-200 overflow-y-auto max-h-[90vh]">
			<button @click="$emit('close')" class="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-md p-2">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
				</svg>
			</button>
			<h2 class="text-2xl font-bold mb-6 text-blue-600 text-center">Nuevo COPE</h2>
			<form @submit.prevent="handleSubmit">
				<!-- SECCIÓN ÚNICA: DATOS DE COPE -->
				<div class="mb-8 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border-l-4 border-primary-500">
					<div class="flex items-center mb-4">
						<div class="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center mr-3">
							<font-awesome-icon icon="tags" class="w-4 h-4" />
						</div>
						<h3 class="text-xl font-bold text-primary-700">Información del COPE</h3>
					</div>
					<div class="space-y-4">
						<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
							<label class="block mb-2 font-semibold text-gray-700">Área *</label>
							<select
								v-model="formData.area_id"
								:class="[
									'input mb-2 w-full',
									formData.area_id ? (areaIdValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
								]"
								required
							>
								<option value="">Seleccione un área</option>
								<option v-for="area in areasWithDivision" :key="area.id" :value="area.id">
									{{ area.displayName }}
								</option>
							</select>
							<div v-if="formData.area_id && !areaIdValid" class="text-red-500 text-xs mt-1">
								Debe seleccionar un área
							</div>
							<div class="mt-2">
								<button type="button" @click="abrirAreaModal" class="text-blue-600 hover:underline focus:outline-none">
									¿No existe el área? Crea una aquí
								</button>
							</div>
						</div>
						
						<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
							<label class="block mb-2 font-semibold text-gray-700">Nombre del COPE *</label>
							<div class="relative">
								<input 
									v-model="formData.nombre"
									type="text"
									:class="[
										'input w-full pl-10',
										formData.nombre ? (nombreValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-gray-300'
									]"
									placeholder="Ingrese el nombre del COPE"
									@input="formatNombre"
									@keydown="preventPrefixDeletion"
									required
									maxlength="255"
								>
								<div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium pointer-events-none">
									CT 
								</div>
							</div>
							<div v-if="formData.nombre && !nombreValid" class="text-red-500 text-xs mt-1">
								El nombre del COPE es requerido (debe contener texto después de "CT ")
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
						Crear COPE
					</BaseButton>
				</div>
			</form>
		</div>
	</div>
	
	<AreasFormModal 
		:show="showAreaModal" 
		@close="showAreaModal = false"
		@area-guardada="handleAreaGuardada"
	/>
</template>

<script>
import BaseButton from '../global/BaseButton.vue'
import AreasFormModal from './AreasFormModal.vue'
import { useSubmitButton } from '../../composables/useSubmitButton.js'
import { useToastStore } from '../../stores/toast.js'
import apiClient from '../../services/api.js'

export default {
	name: 'CopesFormModal',
	components: {
		BaseButton,
		AreasFormModal
	},
	props: {
		show: {
			type: Boolean,
			required: true
		}
	},
	emits: ['close', 'cope-guardado'],
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
				nombre: 'CT ',
				area_id: ''
			},
			areas: [],
			divisiones: [],
			areasWithDivision: [],
			showAreaModal: false
		};
	},
	computed: {
		// Validaciones individuales de cada campo
		nombreValid() {
			return this.formData.nombre && 
				   this.formData.nombre.startsWith('CT ') && 
				   this.formData.nombre.trim().length > 3;
		},
		
		areaIdValid() {
			return this.formData.area_id && this.formData.area_id !== '';
		},
		
		isFormValid() {
			return this.nombreValid && this.areaIdValid;
		},
		
		finalFormData() {
			return {
				nombre: this.formData.nombre.trim(),
				area_id: parseInt(this.formData.area_id)
			};
		}
	},
	created() {
		this.loadData();
	},
	watch: {
		show(value) {
			if (value) {
				// Cargar datos si no están cargados
				if (this.areas.length === 0) {
					this.loadData();
				}
				this.resetForm();
			}
		}
	},
	methods: {
		async loadData() {
			try {
				console.log('Cargando áreas y divisiones...');
				const [areasResponse, divisionesResponse] = await Promise.all([
					apiClient.get('/areas'),
					apiClient.get('/divisiones')
				]);
				
				this.areas = areasResponse.data;
				this.divisiones = divisionesResponse.data;
				
				// Crear array con información concatenada división - área
				this.areasWithDivision = this.areas.map(area => {
					const division = this.divisiones.find(d => d.id === area.division_id);
					return {
						...area,
						displayName: `${division?.nombre || 'N/A'} - ${area.nombre}`
					};
				});
				
				console.log('Áreas cargadas:', this.areas.length);
				console.log('Divisiones cargadas:', this.divisiones.length);
			} catch (error) {
				console.error('Error al cargar datos:', error);
				this.toastStore.addToast({
					message: 'Error al cargar la lista de áreas y divisiones',
					type: 'error',
					duration: 5000
				});
			}
		},
		
		abrirAreaModal() {
			this.showAreaModal = true;
		},
		
		// Formatear nombre: mantener prefijo CT y convertir el resto a mayúsculas
		formatNombre(event) {
			let value = event.target.value || '';
			
			// Asegurar que siempre empiece con "CT "
			if (!value.startsWith('CT ')) {
				value = 'CT ' + value.replace(/^CT\s*/, '');
			}
			
			// Limitar longitud total
			if (value.length > 255) {
				value = value.substring(0, 255);
			}
			
			// Dividir en prefijo y contenido
			const prefix = 'CT ';
			const content = value.substring(3);
			
			// Convertir solo el contenido a mayúsculas
			this.formData.nombre = prefix + content.toUpperCase();
			
			// Actualizar el valor del input
			event.target.value = this.formData.nombre;
		},
		
		// Prevenir la eliminación del prefijo "CT "
		preventPrefixDeletion(event) {
			const input = event.target;
			const cursorPosition = input.selectionStart;
			
			// Si el usuario trata de eliminar dentro del prefijo "CT ", prevenir
			if (cursorPosition <= 3) {
				if (event.key === 'Backspace' || event.key === 'Delete') {
					event.preventDefault();
				}
				// Si trata de mover el cursor dentro del prefijo, moverlo al final del prefijo
				setTimeout(() => {
					if (input.selectionStart < 3) {
						input.setSelectionRange(3, 3);
					}
				}, 0);
			}
		},
		
		async handleSubmit() {
			if (!this.isFormValid) return;
			
			try {
				await this.executeSubmit(async () => {
					console.log('Creando nuevo COPE...');
					
					const response = await apiClient.post('/copes', this.finalFormData);
					console.log('COPE creado:', response.data);
					
					// Emitir evento con el nuevo COPE
					this.$emit('cope-guardado', response.data.cope);
					
					this.toastStore.addToast({
						message: 'COPE creado exitosamente',
						type: 'success',
						duration: 3000
					});
				});
				
				// Cerrar el modal al finalizar
				this.$emit('close');
			} catch (error) {
				console.error('Error al crear COPE:', error);
				
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
						message: 'Error al crear el COPE. Por favor, intente nuevamente.',
						type: 'error',
						duration: 5000
					});
				}
			}
		},
		
		resetForm() {
			this.formData = {
				nombre: 'CT ',
				area_id: ''
			};
		},
		
		async handleAreaGuardada(nuevaArea) {
			// Recargar la lista de áreas para incluir la nueva
			await this.loadData();
			// Seleccionar automáticamente la nueva área
			this.formData.area_id = nuevaArea.id;
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
