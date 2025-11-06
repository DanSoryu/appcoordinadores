<template>
	<div v-if="show" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
		<div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative border border-gray-200 overflow-y-auto max-h-[90vh]">
			<button @click="$emit('close')" class="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-md p-2">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
				</svg>
			</button>
			<h2 class="text-2xl font-bold mb-6 text-blue-600 text-center">
				{{ isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}
			</h2>
			<form @submit.prevent="handleSubmit">
				<!-- SECCIÓN: DATOS DE USUARIO -->
				<div class="mb-8 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border-l-4 border-primary-500">
					<div class="flex items-center mb-4">
						<div class="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center mr-3">
							<font-awesome-icon icon="user" class="w-4 h-4" />
						</div>
						<h3 class="text-xl font-bold text-primary-700">Información del Usuario</h3>
					</div>
					<div class="space-y-4">
						<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
							<label class="block mb-2 font-semibold text-gray-700">Usuario *</label>
							<input 
								v-model="formData.usuario"
								type="text"
								maxlength="30"
								placeholder="Ejemplo: admin123"
								class="input mb-2 w-full"
								required
								:class="{ 'border-red-500': errors.usuario }"
							>
							<p v-if="errors.usuario" class="text-red-500 text-sm mt-1">{{ errors.usuario }}</p>
						</div>

						<!-- Campo de contraseña solo para crear usuario -->
						<div v-if="!isEdit" class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
							<label class="block mb-2 font-semibold text-gray-700">Contraseña *</label>
							<div class="relative">
								<input 
									v-model="formData.password"
									:type="showPassword ? 'text' : 'password'"
									minlength="8"
									placeholder="Mínimo 8 caracteres"
									class="input mb-2 w-full pr-10"
									required
									:class="{ 'border-red-500': errors.password }"
								>
								<button
									type="button"
									@click="showPassword = !showPassword"
									class="absolute inset-y-0 right-0 pr-3 flex items-center"
								>
									<svg v-if="!showPassword" class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
									</svg>
									<svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
									</svg>
								</button>
							</div>
							<p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
							<p class="text-gray-500 text-sm mt-1">La contraseña debe tener al menos 8 caracteres</p>
						</div>

						<div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
							<label class="block mb-2 font-semibold text-gray-700">Rol *</label>
							<select
								v-model="formData.rol"
								class="input mb-2 w-full"
								required
								:class="{ 'border-red-500': errors.rol }"
							>
								<option value="">Seleccione un rol</option>
								<option value="admin">Administrador</option>
								<option value="mecanico">Mecánico</option>
								<option value="tecnico">Técnico</option>
							</select>
							<p v-if="errors.rol" class="text-red-500 text-sm mt-1">{{ errors.rol }}</p>
							<div class="mt-2 text-sm text-gray-600">
								<div class="space-y-1">
									<p><strong>Administrador:</strong> Acceso completo al sistema</p>
									<p><strong>Mecánico:</strong> Gestión de vehículos y reparaciones</p>
									<p><strong>Técnico:</strong> Consulta y actualización de servicios</p>
								</div>
							</div>
						</div>

						<!-- Campo de taller solo para mecánicos -->
						<div v-if="formData.rol === 'mecanico'" class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-fade-in">
							<label class="block mb-2 font-semibold text-gray-700">
								<span class="flex items-center">
									<svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
									</svg>
									Taller *
								</span>
							</label>
							<select
								v-model="formData.taller"
								class="input mb-2 w-full"
								required
								:class="{ 'border-red-500': errors.taller }"
							>
								<option value="">Seleccione un taller</option>
								<option v-for="taller in talleres" :key="taller.id" :value="taller.id">
									{{ taller.nombre }}
								</option>
							</select>
							<p v-if="errors.taller" class="text-red-500 text-sm mt-1">{{ errors.taller }}</p>
							<p class="text-gray-500 text-sm mt-1">Seleccione el taller asignado al mecánico</p>
							<div class="mt-2">
								<button type="button" @click="abrirTallerModal" class="text-blue-600 hover:underline focus:outline-none">
									¿No encuentras el taller? Regístralo aquí
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
						{{ isEdit ? 'Actualizar' : 'Crear Usuario' }}
					</BaseButton>
				</div>
			</form>
		</div>
	</div>
	
	<TallerFormModal 
		:show="showTallerModal" 
		@close="showTallerModal = false"
		@taller-guardado="handleTallerGuardado"
	/>
</template>

<script>
import { computed, ref, watch } from 'vue'
import BaseButton from '../global/BaseButton.vue'
import TallerFormModal from '../talleres/TallerFormModal.vue'
import { useSubmitButton } from '../../composables/useSubmitButton.js'
import { useToastStore } from '../../stores/toast.js'
import apiClient from '../../services/api.js'

export default {
	name: 'UsuariosFormModal',
	components: {
		BaseButton,
		TallerFormModal
	},
	props: {
		show: {
			type: Boolean,
			required: true
		},
		usuarioData: {
			type: Object,
			default: () => ({})
		},
		isEdit: {
			type: Boolean,
			default: false
		}
	},
	emits: ['close', 'usuario-guardado'],
	setup(props, { emit }) {
		const { executeSubmit } = useSubmitButton();
		const toastStore = useToastStore();

		const formData = ref({
			usuario: '',
			password: '',
			rol: '',
			taller: ''
		});

		const errors = ref({});
		const showPassword = ref(false);
		const talleres = ref([]);
		const showTallerModal = ref(false);

		// Computed properties
		const isFormValid = computed(() => {
			if (props.isEdit) {
				// Para edición solo requiere usuario y rol
				const baseValid = formData.value.usuario.trim() !== '' && 
								 formData.value.rol !== '' &&
								 formData.value.usuario.length <= 30;
								 
				// Si es mecánico, también requiere taller
				if (formData.value.rol === 'mecanico') {
					return baseValid && formData.value.taller !== '';
				}
				
				return baseValid;
			} else {
				// Para creación requiere usuario, contraseña y rol
				const baseValid = formData.value.usuario.trim() !== '' && 
								 formData.value.password.length >= 8 && 
								 formData.value.rol !== '' &&
								 formData.value.usuario.length <= 30;
								 
				// Si es mecánico, también requiere taller
				if (formData.value.rol === 'mecanico') {
					return baseValid && formData.value.taller !== '';
				}
				
				return baseValid;
			}
		});

		// Watchers
		watch(() => props.usuarioData, (newData) => {
			if (newData && Object.keys(newData).length > 0) {
				formData.value = {
					usuario: newData.usuario || '',
					password: '', // Nunca cargar contraseña existente
					rol: newData.rol || '',
					taller: newData.taller || ''
				};
			}
		}, { immediate: true });

		watch(() => props.show, (value) => {
			if (value && !Object.keys(props.usuarioData).length) {
				resetForm();
			}
			if (value) {
				errors.value = {};
				// Siempre asegurar que los talleres estén cargados cuando se abre el modal
				loadTalleres();
			}
		});

		// Limpiar campo taller cuando el rol no sea mecánico
		watch(() => formData.value.rol, (newRol) => {
			if (newRol !== 'mecanico') {
				formData.value.taller = '';
				if (errors.value.taller) {
					delete errors.value.taller;
				}
			} else {
				// Si cambia a mecánico y no hay talleres cargados, cargarlos
				if (talleres.value.length === 0) {
					loadTalleres();
				}
			}
		});

		// Methods
		const loadTalleres = async () => {
			try {
				console.log('Cargando talleres...');
				const response = await apiClient.get('/talleres');
				console.log('Respuesta de talleres:', response.data);
				talleres.value = response.data;
				console.log('Talleres cargados:', talleres.value.length);
			} catch (error) {
				console.error('Error al cargar talleres:', error);
				toastStore.addToast({
					message: 'Error al cargar la lista de talleres',
					type: 'error',
					duration: 5000
				});
			}
		};

		// Cargar talleres cuando el componente se monta
		loadTalleres();

		const abrirTallerModal = () => {
			showTallerModal.value = true;
		};

		const handleTallerGuardado = async (nuevoTaller) => {
			// Recargar la lista de talleres para incluir el nuevo
			await loadTalleres();
			// Seleccionar automáticamente el nuevo taller
			formData.value.taller = nuevoTaller.id;
		};

		const resetForm = () => {
			formData.value = {
				usuario: '',
				password: '',
				rol: '',
				taller: ''
			};
			errors.value = {};
		};

		const validateForm = () => {
			errors.value = {};

			// Validar usuario
			if (!formData.value.usuario.trim()) {
				errors.value.usuario = 'El usuario es requerido';
			} else if (formData.value.usuario.length > 30) {
				errors.value.usuario = 'El usuario no puede tener más de 30 caracteres';
			}

			// Validar contraseña (solo para crear)
			if (!props.isEdit) {
				if (!formData.value.password) {
					errors.value.password = 'La contraseña es requerida';
				} else if (formData.value.password.length < 8) {
					errors.value.password = 'La contraseña debe tener al menos 8 caracteres';
				}
			}

			// Validar rol
			if (!formData.value.rol) {
				errors.value.rol = 'El rol es requerido';
			}

			// Validar taller (solo si el rol es mecánico)
			if (formData.value.rol === 'mecanico' && !formData.value.taller) {
				errors.value.taller = 'El taller es requerido para mecánicos';
			}

			return Object.keys(errors.value).length === 0;
		};

		const handleSubmit = async () => {
			if (!validateForm() || !isFormValid.value) return;
			
			try {
				await executeSubmit(async () => {
					let response;
					let usuarioCreado = null;
					
					if (props.isEdit) {
						// Actualizar usuario existente
						const updateData = {
							usuario: formData.value.usuario,
							rol: formData.value.rol
						};
						
						response = await apiClient.put(`/users/${props.usuarioData.id}`, updateData);
						console.log('Usuario actualizado:', response.data);
						
						// Si el usuario es mecánico, también actualizar su taller
						if (formData.value.rol === 'mecanico' && formData.value.taller) {
							try {
								console.log('Actualizando taller del mecánico...');
								
								// Primero obtener el detalle mecánico existente
								const detalleMecanicoResponse = await apiClient.get('/detalle-mecanico');
								console.log('Detalles mecánicos obtenidos:', detalleMecanicoResponse.data);
								
								// Buscar el detalle del mecánico actual
								const detalleMecanico = detalleMecanicoResponse.data.find(
									detalle => detalle.usuario_mecasoft_id === props.usuarioData.id
								);
								
								if (detalleMecanico) {
									console.log('Detalle mecánico encontrado:', detalleMecanico);
									
									// Actualizar el taller del mecánico
									const updateDetalleData = {
										taller_id: formData.value.taller
									};
									
									console.log('Actualizando detalle mecánico con:', updateDetalleData);
									
									const updateDetalleResponse = await apiClient.put(
										`/detalle-mecanico/${detalleMecanico.id}`, 
										updateDetalleData
									);
									
									console.log('Taller del mecánico actualizado exitosamente:', updateDetalleResponse.data);
								} else {
									console.warn('No se encontró detalle mecánico para el usuario:', props.usuarioData.id);
									// Si no existe detalle, crear uno nuevo
									const createDetalleData = {
										usuario_mecasoft_id: props.usuarioData.id,
										taller_id: formData.value.taller
									};
									
									console.log('Creando nuevo detalle mecánico:', createDetalleData);
									
									const createDetalleResponse = await apiClient.post('/detalle-mecanico', createDetalleData);
									console.log('Nuevo detalle mecánico creado:', createDetalleResponse.data);
								}
								
							} catch (detalleError) {
								console.error('Error al actualizar taller del mecánico:', detalleError);
								toastStore.addToast({
									message: 'Usuario actualizado, pero hubo un problema al actualizar el taller asignado.',
									type: 'warning',
									duration: 7000
								});
							}
						}
					} else {
						// Crear nuevo usuario
						const createData = {
							usuario: formData.value.usuario,
							password: formData.value.password,
							rol: formData.value.rol
						};
						
						response = await apiClient.post('/users', createData);
						usuarioCreado = response.data;
						
						console.log('Usuario creado - respuesta:', response.data);
						
						// Si el rol es mecánico, necesitamos obtener el ID del usuario creado y crear el detalle
						if (formData.value.rol === 'mecanico') {
							try {
								// Hacer GET para obtener la lista de usuarios y buscar el recién creado
								console.log('Obteniendo lista de usuarios para encontrar el ID...');
								const usersResponse = await apiClient.get('/users');
								console.log('Lista de usuarios obtenida:', usersResponse.data);
								
								// Buscar el usuario recién creado por nombre de usuario
								const usuarioEncontrado = usersResponse.data.find(u => u.usuario === formData.value.usuario);
								
								if (!usuarioEncontrado) {
									throw new Error('No se pudo encontrar el usuario recién creado en la lista');
								}
								
								console.log('Usuario encontrado:', usuarioEncontrado);
								const usuarioId = usuarioEncontrado.id;
								
								const detalleMecanicoData = {
									usuario_mecasoft_id: usuarioId,
									taller_id: formData.value.taller
								};
								
								console.log('Creando detalle mecánico con datos:', detalleMecanicoData);
								
								const detalleResponse = await apiClient.post('/detalle-mecanico', detalleMecanicoData);
								
								console.log('Detalle mecánico creado exitosamente:', detalleResponse.data);
								
								// Actualizar usuarioCreado con el ID correcto
								usuarioCreado = usuarioEncontrado;
								
							} catch (detalleError) {
								console.error('Error al crear detalle mecánico:', detalleError);
								
								// No lanzar error aquí, solo loguearlo
								// El usuario ya fue creado exitosamente
								toastStore.addToast({
									message: 'Usuario creado exitosamente, pero hubo un problema al asignar el taller. Contacte al administrador.',
									type: 'warning',
									duration: 7000
								});
							}
						}
					}
					
					// Preparar datos para emitir - usar datos del servidor o reconstruir
					const usuarioGuardado = {
						id: props.isEdit ? props.usuarioData.id : (usuarioCreado?.id),
						usuario: formData.value.usuario,
						rol: formData.value.rol,
						// Incluir taller si es mecánico
						...(formData.value.rol === 'mecanico' && { taller: formData.value.taller })
					};
					
					console.log('Datos del usuario a emitir:', usuarioGuardado);
					
					// Emitir evento con los datos guardados
					emit('usuario-guardado', usuarioGuardado);
				});
				
				// Cerrar el modal al finalizar
				emit('close');
			} catch (error) {
				console.error('Error al guardar usuario:', error);
				
				// Manejar errores específicos del servidor
				if (error.response?.data?.error) {
					const serverErrors = error.response.data.error;
					
					// Si el servidor devuelve errores de validación
					if (typeof serverErrors === 'object') {
						Object.keys(serverErrors).forEach(field => {
							if (serverErrors[field] && Array.isArray(serverErrors[field])) {
								errors.value[field] = serverErrors[field][0];
							}
						});
					} else if (typeof serverErrors === 'string') {
						toastStore.addToast({
							message: serverErrors,
							type: 'error',
							duration: 5000
						});
					}
				} else if (error.response?.status === 422) {
					// Error de validación del servidor
					console.error('Error de validación (422):', error.response.data);
					toastStore.addToast({
						message: 'Error de validación: Verifique que todos los campos estén correctos.',
						type: 'error',
						duration: 5000
					});
				} else {
					// Error genérico o de conexión
					let errorMessage = `Error al ${props.isEdit ? 'actualizar' : 'crear'} el usuario.`;
					
					// Si contiene información sobre el error específico
					if (error.message && error.message.includes('No se pudo encontrar el usuario')) {
						errorMessage = 'Usuario creado, pero error al asignar taller. Contacte al administrador.';
					} else if (formData.value.rol === 'mecanico' && !props.isEdit) {
						errorMessage = 'Error al crear el usuario o asignar el taller. Por favor, intente nuevamente.';
					}
					
					toastStore.addToast({
						message: errorMessage,
						type: 'error',
						duration: 5000
					});
				}
			}
		};

		return {
			formData,
			errors,
			showPassword,
			talleres,
			showTallerModal,
			isFormValid,
			executeSubmit,
			toastStore,
			handleSubmit,
			resetForm,
			loadTalleres,
			abrirTallerModal,
			handleTallerGuardado
		};
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
.border-red-500 {
	border-color: #ef4444;
}

.animate-fade-in {
	animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
