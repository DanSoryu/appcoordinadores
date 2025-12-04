<template>
	<div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
		<div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative border border-gray-200 overflow-y-auto max-h-[90vh]">
			<button @click="$emit('close')" class="close-button absolute top-4 right-4">
				<font-awesome-icon icon="times" />
			</button>
			<h2 class="text-2xl font-bold mb-6 text-blue-600 text-center">Administrar Marcas y Modelos</h2>
			
			<!-- Pestañas -->
			<div class="flex mb-6 border-b">
				<button 
					@click="activeTab = 'marcas'"
					:class="[
						'px-4 py-2 font-medium transition-colors',
						activeTab === 'marcas' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
					]"
				>
					Agregar Marca
				</button>
				<button 
					@click="activeTab = 'modelos'"
					:class="[
						'px-4 py-2 font-medium transition-colors',
						activeTab === 'modelos' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
					]"
				>
					Agregar Modelo
				</button>
			</div>

			<!-- Agregar Marca -->
			<div v-if="activeTab === 'marcas'" class="space-y-4">
				<div class="bg-blue-50 p-4 rounded-lg">
					<h3 class="text-lg font-semibold text-blue-800 mb-3">Nueva Marca</h3>
					<div class="flex gap-2">
						<input 
							v-model="nuevaMarca"
							@keyup.enter="agregarMarca"
							class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Nombre de la nueva marca"
							maxlength="50"
						/>
						<BaseButton 
							@click="agregarMarca"
							variant="primary"
							:disabled="!nuevaMarca.trim()"
						>
							<font-awesome-icon icon="plus" class="mr-2" />
							Agregar
						</BaseButton>
					</div>
				</div>

				<!-- Lista de marcas actuales -->
				<div class="bg-gray-50 p-4 rounded-lg">
					<h4 class="font-semibold text-gray-700 mb-3">Marcas Existentes:</h4>
					<div class="grid grid-cols-2 gap-2">
						<div v-for="marca in marcasData" :key="marca" class="flex items-center justify-between bg-white p-2 rounded border">
							<span>{{ marca }}</span>
							<button 
								@click="eliminarMarca(marca)"
								class="text-red-500 hover:text-red-700 text-sm"
								title="Eliminar marca"
							>
								<font-awesome-icon icon="trash" />
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Agregar Modelo -->
			<div v-if="activeTab === 'modelos'" class="space-y-4">
				<div class="bg-green-50 p-4 rounded-lg">
					<h3 class="text-lg font-semibold text-green-800 mb-3">Nuevo Modelo</h3>
					<div class="space-y-3">
						<select 
							v-model="marcaSeleccionada"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
							required
						>
							<option value="">Selecciona una marca</option>
							<option v-for="marca in marcasData" :key="marca" :value="marca">
								{{ marca }}
							</option>
						</select>
						<div class="flex gap-2">
							<input 
								v-model="nuevoModelo"
								@keyup.enter="agregarModelo"
								:disabled="!marcaSeleccionada"
								class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
								placeholder="Nombre del nuevo modelo"
								maxlength="50"
							/>
							<BaseButton 
								@click="agregarModelo"
								variant="success"
								:disabled="!nuevoModelo.trim() || !marcaSeleccionada"
							>
								<font-awesome-icon icon="plus" class="mr-2" />
								Agregar
							</BaseButton>
						</div>
					</div>
				</div>

				<!-- Lista de modelos por marca -->
				<div v-if="marcaSeleccionada" class="bg-gray-50 p-4 rounded-lg">
					<h4 class="font-semibold text-gray-700 mb-3">
						Modelos de {{ marcaSeleccionada }}:
					</h4>
					<div v-if="modelosDelasMarca.length > 0" class="grid grid-cols-1 gap-2">
						<div v-for="modelo in modelosDelasMarca" :key="modelo" class="flex items-center justify-between bg-white p-2 rounded border">
							<span>{{ modelo }}</span>
							<button 
								@click="eliminarModelo(marcaSeleccionada, modelo)"
								class="text-red-500 hover:text-red-700 text-sm"
								title="Eliminar modelo"
							>
								<font-awesome-icon icon="trash" />
							</button>
						</div>
					</div>
					<div v-else class="text-gray-500 text-center py-4">
						No hay modelos registrados para esta marca
					</div>
				</div>
			</div>

			<!-- Botones de acción -->
			<div class="flex justify-between mt-8">
				<BaseButton 
					@click="$emit('close')"
					variant="secondary"
				>
					Cancelar
				</BaseButton>
				<BaseButton 
					@click="guardarCambios"
					variant="success"
					:disabled="!hayCompajosCambios"
					custom-loading-text="Guardando..."
					:min-delay="1000"
				>
					<font-awesome-icon icon="save" class="mr-2" />
					Guardar Cambios
				</BaseButton>
			</div>
		</div>
	</div>
</template>

<script>
import BaseButton from '../global/BaseButton.vue';
import { useToastStore } from '../../stores/toast.js';
import vehiculosDataOriginal from '../../data/vehiculos-data.json';

export default {
	name: 'VehiculosAdminModal',
	components: {
		BaseButton
	},
	props: {
		show: {
			type: Boolean,
			required: true
		}
	},
	emits: ['close', 'update-data'],
	data() {
		return {
			activeTab: 'marcas',
			nuevaMarca: '',
			nuevoModelo: '',
			marcaSeleccionada: '',
			marcasData: [],
			modelosData: {},
			datosOriginales: {}
		};
	},
	computed: {
		modelosDelasMarca() {
			if (!this.marcaSeleccionada) return [];
			return this.modelosData[this.marcaSeleccionada] || [];
		},
		hayCompajosCambios() {
			// Verificar si hay cambios en marcas
			const marcasOriginales = JSON.stringify([...this.datosOriginales.marcas].sort());
			const marcasActuales = JSON.stringify([...this.marcasData].sort());
			
			// Verificar si hay cambios en modelos
			const modelosOriginales = JSON.stringify(this.datosOriginales.modelosPorMarca);
			const modelosActuales = JSON.stringify(this.modelosData);
			
			return marcasOriginales !== marcasActuales || modelosOriginales !== modelosActuales;
		}
	},
	mounted() {
		this.cargarDatos();
	},
	methods: {
		cargarDatos() {
			// Cargar datos desde localStorage o archivo JSON
			const datosGuardados = localStorage.getItem('vehiculos-data');
			if (datosGuardados) {
				const datos = JSON.parse(datosGuardados);
				this.marcasData = [...datos.marcas];
				this.modelosData = { ...datos.modelosPorMarca };
			} else {
				this.marcasData = [...vehiculosDataOriginal.marcas];
				this.modelosData = { ...vehiculosDataOriginal.modelosPorMarca };
			}
			
			// Guardar estado original para comparar cambios
			this.datosOriginales = {
				marcas: [...this.marcasData],
				modelosPorMarca: { ...this.modelosData }
			};
		},
		
		agregarMarca() {
			const marca = this.nuevaMarca.trim().toUpperCase();
			if (!marca) return;
			
			if (this.marcasData.includes(marca)) {
				useToastStore().showToast('Esta marca ya existe', 'warning');
				return;
			}
			
			this.marcasData.push(marca);
			this.marcasData.sort();
			
			// Inicializar array de modelos para la nueva marca
			if (!this.modelosData[marca]) {
				this.modelosData[marca] = [];
			}
			
			this.nuevaMarca = '';
			useToastStore().showToast('Marca agregada exitosamente', 'success');
		},
		
		eliminarMarca(marca) {
			if (confirm(`¿Estás seguro de eliminar la marca "${marca}" y todos sus modelos?`)) {
				this.marcasData = this.marcasData.filter(m => m !== marca);
				delete this.modelosData[marca];
				
				// Si era la marca seleccionada, limpiar selección
				if (this.marcaSeleccionada === marca) {
					this.marcaSeleccionada = '';
				}
				
				useToastStore().showToast('Marca eliminada exitosamente', 'success');
			}
		},
		
		agregarModelo() {
			const modelo = this.nuevoModelo.trim().toUpperCase();
			if (!modelo || !this.marcaSeleccionada) return;
			
			if (!this.modelosData[this.marcaSeleccionada]) {
				this.modelosData[this.marcaSeleccionada] = [];
			}
			
			if (this.modelosData[this.marcaSeleccionada].includes(modelo)) {
				useToastStore().showToast('Este modelo ya existe para esta marca', 'warning');
				return;
			}
			
			this.modelosData[this.marcaSeleccionada].push(modelo);
			this.modelosData[this.marcaSeleccionada].sort();
			
			this.nuevoModelo = '';
			useToastStore().showToast('Modelo agregado exitosamente', 'success');
		},
		
		eliminarModelo(marca, modelo) {
			if (confirm(`¿Estás seguro de eliminar el modelo "${modelo}" de la marca "${marca}"?`)) {
				this.modelosData[marca] = this.modelosData[marca].filter(m => m !== modelo);
				useToastStore().showToast('Modelo eliminado exitosamente', 'success');
			}
		},
		
		async guardarCambios() {
			try {
				const nuevosDatos = {
					marcas: this.marcasData,
					modelosPorMarca: this.modelosData
				};
				
				// Guardar en localStorage
				localStorage.setItem('vehiculos-data', JSON.stringify(nuevosDatos));
				
				// Emitir evento para actualizar datos en el componente padre
				this.$emit('update-data', nuevosDatos);
				
				useToastStore().showToast('Cambios guardados exitosamente', 'success');
				this.$emit('close');
				
			} catch (error) {
				console.error('Error al guardar cambios:', error);
				useToastStore().showToast('Error al guardar los cambios', 'error');
			}
		}
	}
};
</script>

<style scoped>
.close-button {
	width: 2rem;
	height: 2rem;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #6b7280;
	border-radius: 9999px;
	transition: all 0.2s;
	border: none;
	background: transparent;
	cursor: pointer;
}
.close-button:hover {
	color: #374151;
	background-color: #f3f4f6;
}
</style>