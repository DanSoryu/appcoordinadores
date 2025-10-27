<template>
  <div class="photo-upload-preview">
    <!-- Botón para activar la cámara -->
    <button @click="openCamera" class="camera-button">
      <slot>Tomar fotografía</slot>
    </button>
    
    <!-- Video feed para la cámara -->
    <div v-if="isCameraOpen" class="camera-container">
      <video ref="videoElement" autoplay playsinline class="camera-feed"></video>
    </div>
    
    <!-- Controles de cámara (ahora fuera del contenedor de video) -->
    <div v-if="isCameraOpen" class="camera-controls-outside mt-3">
      <button @click="capturePhoto" class="capture-button">
        <font-awesome-icon icon="camera" /> Capturar
      </button>
      <button @click="closeCamera" class="close-camera-button-outside">
        <font-awesome-icon icon="times" /> Cancelar
      </button>
    </div>
    
    <!-- Contenedor de la vista previa -->
    <div v-if="photoPreview || (isPreloadedPhoto && photoName)" class="preview-container" @click="openPhotoModal">
      <div class="w-full flex flex-col items-center">
        <img :src="photoUrl" alt="Vista previa" class="preview-image mb-2 cursor-pointer" />
        <div v-if="photoName" class="photo-name text-sm text-gray-700 text-center">{{ displayPhotoName }}</div>
        <div v-if="isPreloadedPhoto" class="text-xs text-blue-600 mt-1">(Fotografía existente)</div>
      </div>
    </div>
    
    <!-- Modal para mostrar la imagen ampliada -->
    <div v-if="isModalOpen" class="photo-modal-overlay" @click="closePhotoModal">
      <div class="photo-modal-content" @click.stop>
        <img :src="photoUrl" alt="Imagen ampliada" class="photo-modal-image" />
        <button @click="closePhotoModal" class="photo-modal-close">
          <font-awesome-icon icon="times" />
        </button>
      </div>
    </div>
    
    <!-- Mensaje de error de permisos -->
    <div v-if="permissionError" class="error-message">
      {{ permissionError }}
    </div>
  </div>
</template>

<script>
import { useToastStore } from '../../stores/toast.js';

export default {
  name: 'PhotoUploadAndPreview',
  props: {
    id: {
      type: String,
      required: true
    },
    preloadedPhoto: {
      type: String,
      default: null
    },
    fileNamePrefix: {
      type: String,
      default: 'photo'
    }
  },
  setup() {
    const toastStore = useToastStore();
    return {
      toastStore
    };
  },
  data() {
    return {
      stream: null,
      isCameraOpen: false,
      photoPreview: null,
      photoName: '',
      photoBlob: null,
      permissionError: null,
      isPreloadedPhoto: false,
      isModalOpen: false
    };
  },
  mounted() {
    this.loadPreloadedPhoto();
  },
  beforeUnmount() {
    this.closeCamera();
  },
  watch: {
    preloadedPhoto: {
      handler() {
        this.loadPreloadedPhoto();
      },
      immediate: true
    }
  },
  computed: {
    photoUrl() {
      if (this.isPreloadedPhoto && this.photoName) {
        return `http://127.0.0.1:8000/Mecasoft/detalles_ordenes/${this.photoName}`;
      }
      return this.photoPreview;
    },
    
    // Computed para mostrar el nombre limpio en la vista previa
    displayPhotoName() {
      if (!this.photoName) return '';
      return this.cleanImageName(this.photoName);
    }
  },
  methods: {
    // Función para limpiar nombres de archivo eliminando números extras
    cleanImageName(fileName) {
      if (!fileName || typeof fileName !== 'string') return '';
      
      // Extraer la extensión del archivo
      const extension = fileName.split('.').pop();
      
      // Remover la extensión temporalmente
      const nameWithoutExtension = fileName.replace(`.${extension}`, '');
      
      // Remover números extras al final (patrón: _seguido de números)
      const cleanName = nameWithoutExtension.replace(/_\d+$/, '');
      
      // Retornar el nombre limpio con la extensión
      return `${cleanName}.${extension}`;
    },

    loadPreloadedPhoto() {
      if (this.preloadedPhoto && typeof this.preloadedPhoto === 'string') {
        this.photoName = this.preloadedPhoto;
        this.isPreloadedPhoto = true;
        this.photoPreview = null;
        console.log('Fotografía pre-cargada:', this.preloadedPhoto);
      } else {
        this.isPreloadedPhoto = false;
        this.photoName = '';
        this.photoPreview = null;
      }
    },
    
    async openCamera() {
      try {
        // Verificar si el navegador soporta getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          this.handlePermissionError('Tu navegador no soporta acceso a la cámara');
          return;
        }
        
        // Solicitar permisos de cámara
        this.stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } // Usar cámara trasera si está disponible
        });
        
        this.isCameraOpen = true;
        this.permissionError = null;
        
        // En el siguiente tick del DOM, conectar el stream al elemento de video
        this.$nextTick(() => {
          if (this.$refs.videoElement) {
            this.$refs.videoElement.srcObject = this.stream;
          }
        });
      } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          this.handlePermissionError('Permiso de cámara denegado. Por favor, habilite el acceso a la cámara en la configuración de su navegador.');
        } else {
          this.handlePermissionError('Error al acceder a la cámara: ' + error.message);
        }
      }
    },
    
    closeCamera() {
      if (this.stream) {
        const tracks = this.stream.getTracks();
        tracks.forEach(track => track.stop());
        this.stream = null;
      }
      this.isCameraOpen = false;
    },
    
    capturePhoto() {
      const video = this.$refs.videoElement;
      
      if (!video || !this.stream) return;
      
      // Crear un canvas del mismo tamaño que el video
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Dibujar la imagen actual del video en el canvas
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convertir el canvas a una URL de datos para la vista previa
      this.photoPreview = canvas.toDataURL('image/jpeg');
      
      // Generar un nombre único para la foto usando el prefijo personalizado
      const timestamp = new Date().getTime();
      this.photoName = `${this.fileNamePrefix}_${timestamp}.jpg`;
      this.isPreloadedPhoto = false;
      
      // Obtener la imagen en formato base64 para el API
      const base64Image = canvas.toDataURL('image/jpeg', 0.9);
      
      // Convertir el canvas a un blob para mantener compatibilidad con FileUploadPreview
      canvas.toBlob((blob) => {
        if (blob) {
          // Crear un objeto File a partir del Blob para mantener compatibilidad
          const file = new File([blob], this.photoName, { type: 'image/jpeg' });
          
          // Emitir tanto el archivo como el base64 para máxima flexibilidad
          this.$emit('photo-captured', {
            file: file,
            base64: base64Image,
            fileName: this.photoName
          });
        }
      }, 'image/jpeg', 0.9);
      
      // Cerrar la cámara después de tomar la foto
      this.closeCamera();
    },
    
    handlePermissionError(message) {
      this.permissionError = message;
      
      // Mostrar toast de error
      this.toastStore.addToast({
        type: 'error',
        message: message,
        duration: 5000
      });
      
      this.closeCamera();
    },
    
    // Métodos para el modal de foto ampliada
    openPhotoModal() {
      if (this.photoPreview || (this.isPreloadedPhoto && this.photoName)) {
        this.isModalOpen = true;
        document.body.style.overflow = 'hidden'; // Evitar scroll en el fondo
      }
    },
    
    closePhotoModal() {
      this.isModalOpen = false;
      document.body.style.overflow = ''; // Restaurar scroll
    }
  }
};
</script>

<style scoped>
.photo-upload-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.camera-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  border-radius: 0.5rem;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s;
}

.camera-button:hover {
  background-color: #2563eb;
}

.camera-container {
  position: relative;
  width: 100%;
  border: 2px solid #3b82f6;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 0;
}

.camera-feed {
  width: 100%;
  display: block;
}

/* Nuevos controles fuera del contenedor de video */
.camera-controls-outside {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.capture-button {
  padding: 0.5rem 1.5rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
}

.close-camera-button-outside {
  padding: 0.5rem 1.5rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
}

.preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #cbd5e1;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  cursor: pointer;
}

.preview-image {
  max-width: 100%;
  max-height: 10rem;
  object-fit: contain;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* Estilos para el modal de foto */
.photo-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.photo-modal-content {
  position: relative;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.photo-modal-image {
  max-width: 100%;
  max-height: calc(90vh - 2rem);
  object-fit: contain;
}

.photo-modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background-color: #ef4444;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.photo-modal-close:hover {
  background-color: #dc2626;
}
</style>