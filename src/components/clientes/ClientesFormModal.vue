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
								<label class="block mb-2 font-semibold text-gray-700">Nombre</label>
								<input v-model="formData.nombre" class="input mb-2 w-full" placeholder="Nombre" />
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Teléfono</label>
								<input v-model="formData.telefono" class="input mb-2 w-full" placeholder="Teléfono" />
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Domicilio</label>
								<input v-model="formData.domicilio" class="input mb-2 w-full" placeholder="Domicilio" />
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Calle</label>
								<input v-model="formData.calle" class="input mb-2 w-full" placeholder="Calle" />
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">No Exterior/interior</label>
								<input v-model="formData.numeroExtInt" class="input mb-2 w-full" placeholder="No Exterior/interior" />
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Colonia</label>
								<input v-model="formData.colonia" class="input mb-2 w-full" placeholder="Colonia" />
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">C.P. (Código Postal)</label>
								<input v-model="formData.cp" class="input mb-2 w-full" placeholder="Código Postal" />
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Delegación/Municipio</label>
								<input v-model="formData.delegacionMunicipio" class="input mb-2 w-full" placeholder="Delegación/Municipio" />
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Estado</label>
								<input v-model="formData.estado" class="input mb-2 w-full" placeholder="Estado" />
							</div>
							<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
								<label class="block mb-2 font-semibold text-gray-700">Correo Electrónico</label>
								<input v-model="formData.email" class="input mb-2 w-full" placeholder="Correo Electrónico" />
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
				nombre: '',
				telefono: '',
				domicilio: '',
				calle: '',
				numeroExtInt: '',
				colonia: '',
				cp: '',
				delegacionMunicipio: '',
				estado: '',
				email: ''
			}
		};
	},
	created() {
		this.loadClienteData();
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
			// Todos los campos requeridos deben estar completos
			return (
				this.formData.nombre && this.formData.nombre.trim() !== '' &&
				this.formData.telefono && this.formData.telefono.trim() !== '' &&
				this.formData.domicilio && this.formData.domicilio.trim() !== '' &&
				this.formData.calle && this.formData.calle.trim() !== '' &&
				this.formData.numeroExtInt && this.formData.numeroExtInt.trim() !== '' &&
				this.formData.colonia && this.formData.colonia.trim() !== '' &&
				this.formData.cp && this.formData.cp.trim() !== '' &&
				this.formData.delegacionMunicipio && this.formData.delegacionMunicipio.trim() !== '' &&
				this.formData.estado && this.formData.estado.trim() !== '' &&
				this.formData.email && this.formData.email.trim() !== ''
			);
		},
		finalFormData() {
			// Devuelve solo los datos relevantes
			return {
				nombre: this.formData.nombre,
				telefono: this.formData.telefono,
				domicilio: this.formData.domicilio,
				calle: this.formData.calle,
				numeroExtInt: this.formData.numeroExtInt,
				colonia: this.formData.colonia,
				cp: this.formData.cp,
				delegacionMunicipio: this.formData.delegacionMunicipio,
				estado: this.formData.estado,
				email: this.formData.email
			};
		}
	},
	methods: {
		loadClienteData() {
			if (!this.clienteData || Object.keys(this.clienteData).length === 0) return;
			this.formData.nombre = this.clienteData.nombre || '';
			this.formData.telefono = this.clienteData.telefono || '';
			this.formData.domicilio = this.clienteData.domicilio || '';
			this.formData.calle = this.clienteData.calle || '';
			this.formData.numeroExtInt = this.clienteData.numeroExtInt || '';
			this.formData.colonia = this.clienteData.colonia || '';
			this.formData.cp = this.clienteData.cp || '';
			this.formData.delegacionMunicipio = this.clienteData.delegacionMunicipio || '';
			this.formData.estado = this.clienteData.estado || '';
			this.formData.email = this.clienteData.email || '';
		},
			async handleFinalSubmit() {
				if (!this.isStepValid) return;
				try {
					await this.saveCurrentStepData();
					
					// Preparar los datos del cliente para emitir
					const nuevoCliente = {
						id: Date.now().toString(), // Generamos un ID único basado en timestamp
						nombre: this.formData.nombre,
						...this.finalFormData
					};
					
					// Emitir el evento con los datos del cliente
					this.$emit('cliente-guardado', nuevoCliente);
					
					this.toastStore.addToast({
						message: 'Datos del cliente guardados correctamente',
						type: 'success',
						duration: 3500
					});
					
					this.$emit('close');
					this.resetForm();
					console.log('Datos del cliente enviados:', JSON.stringify(nuevoCliente, null, 2));
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
					nombre: '',
					telefono: '',
					domicilio: '',
					calle: '',
					numeroExtInt: '',
					colonia: '',
					cp: '',
					delegacionMunicipio: '',
					estado: '',
					email: ''
				};
			},
		async saveCurrentStepData() {
			// Simular guardado de datos
			console.log('Guardando datos del cliente...');
			console.log('Datos actuales:', JSON.stringify(this.finalFormData, null, 2));
			await new Promise(resolve => setTimeout(resolve, 500));
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
