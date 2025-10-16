<template>
  <div class="bg-white p-4 rounded-lg shadow mb-6">
    <h2 class="text-2xl font-bold mb-6 text-blue-600">CheckList Recepción</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse table-fixed">
        <thead class="bg-gray-50">
          <tr class="divide-x divide-gray-200">
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad de Llaves</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Póliza de Seguro</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarjeta Circulación</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Otro Documento</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Llave Birlo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in fakeData" :key="item.id" class="hover:bg-gray-50 divide-x divide-gray-200">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <span v-if="item.cantidadLlaves !== null && item.cantidadLlaves !== 0">{{ item.cantidadLlaves }}</span>
            <span v-else class="text-gray-400 italic">No se proporcionaron las llaves</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span v-if="item.polizaSeguro">
                <button class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded" @click="verArchivo(item.polizaSeguro)">Ver imagen/archivo</button>
              </span>
              <span v-else class="text-gray-400 italic">No se ha proporcionado aún</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span v-if="item.tarjetaCirculacion !== null">{{ item.tarjetaCirculacion ? 'SI' : 'NO' }}</span>
              <span v-else class="text-gray-400 italic">No se ha proporcionado aún</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span v-if="item.otroDocumento">
                <button class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded" @click="verArchivo(item.otroDocumento)">Ver imagen/archivo</button>
              </span>
              <span v-else class="text-gray-400 italic">No se ha proporcionado aún</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span v-if="item.accesoriosHerramienta">
                <button class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded" @click="verArchivo(item.accesoriosHerramienta)">Ver imagen/archivo</button>
              </span>
              <span v-else class="text-gray-400 italic">No se ha proporcionado aún</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button 
                @click="$emit('abrir-checklist-modal', item)"
                :class="[
                  'px-4 py-2 rounded-md flex items-center space-x-2 transition-colors text-white',
                  item.terminado 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-green-600 hover:bg-green-700'
                ]"
              >
                <span>{{ item.terminado ? 'Editar Checklist' : 'Terminar Checklist' }}</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
// Este componente emite el evento 'abrir-checklist-modal' al hacer click en el botón
import { ref } from 'vue'

// Datos simulados como si vinieran de la API (ejemplo de Final Form Data)
const fakeData = ref([
{
    id: 1,
    cantidadLlaves: 10,
    polizaSeguro: '1355110.jpeg',
    tarjetaCirculacion: true,
    otroDocumento: 'Mapeo proceso taller vehicular.pdf',
    accesoriosHerramienta: 'gaelillo.jpeg',
    direccion: 'Calle Falsa 123',
    telefono: '555-1234',
    comentario: 'Todo en orden',
    terminado: true
},
{
    id: 2,
    cantidadLlaves: 2,
    polizaSeguro: 'seguro2.pdf',
    tarjetaCirculacion: false,
    otroDocumento: 'manual_usuario.docx',
    accesoriosHerramienta: 'llave_rueda.png',
    direccion: 'Av. Principal 456',
    telefono: '555-5678',
    comentario: 'Faltan documentos',
    terminado: false
},
{
    id: 3,
    cantidadLlaves: 1,
    polizaSeguro: 'archivo3.png',
    tarjetaCirculacion: true,
    otroDocumento: 'factura_auto.pdf',
    accesoriosHerramienta: 'destornillador.jpg',
    direccion: 'Boulevard Central 789',
    telefono: '555-9012',
    comentario: 'Revisar accesorios',
    terminado: false
}
])

function verArchivo(nombreArchivo) {
  // Aquí podrías abrir un modal, mostrar una imagen, descargar, etc.
  alert('Simulación: mostrar archivo ' + nombreArchivo)
}
</script>
