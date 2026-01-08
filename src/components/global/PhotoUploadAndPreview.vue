<template>
  <div class="photo-upload-preview">
    <!-- Botón para activar la cámara -->
    <button @click="openCamera" class="camera-button" :disabled="isLoadingCamera">
      <span v-if="isLoadingCamera">⏳ Cargando cámara...</span>
      <slot v-else>Tomar fotografía</slot>
    </button>
    
    <!-- Video feed para la cámara -->
    <div v-if="isCameraOpen" class="camera-container">
      <video ref="videoElement" autoplay playsinline muted class="camera-feed"></video>
      <div v-if="!streamReady" class="camera-loading-overlay">
        <div class="camera-loading-spinner"></div>
        <p>Preparando cámara...</p>
      </div>
    </div>
    
    <!-- Controles de cámara (ahora fuera del contenedor de video) -->
    <div v-if="isCameraOpen" class="camera-controls-outside mt-3">
      <button @click="capturePhoto" class="capture-button" :disabled="!streamReady">
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
    },
    customFilename: {
      type: String,
      default: null
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
      isModalOpen: false,
      isLoadingCamera: false,
      streamReady: false
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
        // Evitar múltiples aperturas simultáneas
        if (this.isLoadingCamera || this.isCameraOpen) {
          console.log('Cámara ya está abierta o cargando');
          return;
        }
        
        this.isLoadingCamera = true;
        console.log('🎥 Iniciando apertura de cámara...');
        
        // Verificar si el navegador soporta getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Tu navegador no soporta acceso a la cámara');
        }
        
        // Intentar primero con cámara trasera, luego cualquier cámara disponible
        const constraints = [
          { video: { facingMode: { exact: 'environment' } } }, // Cámara trasera exacta
          { video: { facingMode: 'environment' } }, // Cámara trasera preferida
          { video: true } // Cualquier cámara
        ];
        
        let stream = null;
        let lastError = null;
        
        for (const constraint of constraints) {
          try {
            console.log('📹 Intentando con constraint:', constraint);
            stream = await navigator.mediaDevices.getUserMedia(constraint);
            if (stream) {
              console.log('✅ Stream obtenido exitosamente');
              break;
            }
          } catch (err) {
            console.warn('⚠️ Falló constraint:', constraint, err.message);
            lastError = err;
          }
        }
        
        if (!stream) {
          throw lastError || new Error('No se pudo acceder a ninguna cámara');
        }
        
        this.stream = stream;
        this.permissionError = null;
        this.streamReady = false;
        
        // Mostrar la interfaz de la cámara ANTES de conectar el stream
        this.isCameraOpen = true;
        console.log('📺 Interfaz de cámara abierta');
        
        // Esperar múltiples ticks del DOM para asegurar que el elemento video existe
        await this.$nextTick();
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Verificar que el elemento de video existe
        const videoElement = this.$refs.videoElement;
        if (!videoElement) {
          throw new Error('Elemento de video no encontrado en el DOM');
        }
        
        console.log('🎬 Conectando stream al elemento de video...');
        videoElement.srcObject = this.stream;
        
        // Esperar a que el video esté listo con timeout
        await Promise.race([
          new Promise((resolve, reject) => {
            videoElement.onloadedmetadata = () => {
              console.log('✅ Metadata del video cargada');
              resolve();
            };
            videoElement.onerror = (e) => {
              console.error('❌ Error en elemento de video:', e);
              reject(new Error('Error al cargar el video'));
            };
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout esperando metadata del video')), 10000)
          )
        ]);
        
        // Intentar reproducir el video explícitamente
        try {
          await videoElement.play();
          console.log('▶️ Video reproduciendo');
        } catch (playError) {
          console.warn('⚠️ No se pudo reproducir automáticamente:', playError.message);
          // No lanzar error, algunos navegadores requieren interacción del usuario
        }
        
        this.streamReady = true;
        console.log('✅ Cámara lista para capturar');
        
        this.toastStore.addToast({
          type: 'success',
          message: 'Cámara activada correctamente',
          duration: 2000
        });
        
      } catch (error) {
        console.error('❌ Error completo al acceder a la cámara:', error);
        
        let errorMessage = 'Error al acceder a la cámara';
        
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage = 'Permiso de cámara denegado. Por favor, habilite el acceso a la cámara en la configuración de su navegador.';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          errorMessage = 'No se encontró ninguna cámara en su dispositivo.';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
          errorMessage = 'La cámara está siendo usada por otra aplicación. Por favor, cierre otras aplicaciones que usen la cámara.';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = 'No se encontró una cámara que cumpla con los requisitos.';
        } else if (error.name === 'SecurityError') {
          errorMessage = 'Acceso a la cámara bloqueado por seguridad. Asegúrese de estar usando HTTPS.';
        } else {
          errorMessage = `Error al acceder a la cámara: ${error.message}`;
        }
        
        this.handlePermissionError(errorMessage);
        this.closeCamera();
      } finally {
        this.isLoadingCamera = false;
      }
    },
    
    closeCamera() {
      console.log('🔴 Cerrando cámara...');
      
      try {
        if (this.stream) {
          const tracks = this.stream.getTracks();
          tracks.forEach(track => {
            track.stop();
            console.log('⏹️ Track detenido:', track.kind);
          });
          this.stream = null;
        }
        
        // Limpiar el elemento de video
        if (this.$refs.videoElement) {
          this.$refs.videoElement.srcObject = null;
        }
      } catch (error) {
        console.error('Error al cerrar cámara:', error);
      } finally {
        this.isCameraOpen = false;
        this.streamReady = false;
        this.isLoadingCamera = false;
        console.log('✅ Cámara cerrada');
      }
    },
    
    capturePhoto() {
      console.log('📸 Intentando capturar foto...');
      
      try {
        const video = this.$refs.videoElement;
        
        // Validaciones exhaustivas
        if (!video) {
          throw new Error('Elemento de video no encontrado');
        }
        
        if (!this.stream) {
          throw new Error('Stream de cámara no disponible');
        }
        
        if (!this.streamReady) {
          throw new Error('La cámara aún no está lista. Por favor, espere un momento.');
        }
        
        if (video.readyState !== video.HAVE_ENOUGH_DATA) {
          throw new Error('El video aún no tiene datos suficientes. Por favor, intente nuevamente.');
        }
        
        if (!video.videoWidth || !video.videoHeight) {
          throw new Error('Dimensiones del video no disponibles');
        }
        
        console.log('📐 Dimensiones del video:', video.videoWidth, 'x', video.videoHeight);
        
        // Crear un canvas del mismo tamaño que el video
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Dibujar la imagen actual del video en el canvas
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('No se pudo obtener el contexto del canvas');
        }
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        console.log('🎨 Imagen dibujada en canvas');
        
        // Convertir el canvas a una URL de datos para la vista previa
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        if (!dataUrl || dataUrl.length < 100) {
          throw new Error('Error al generar la imagen');
        }
        
        this.photoPreview = dataUrl;
        
        // Generar nombre para la foto (sin timestamp)
        if (this.customFilename) {
          this.photoName = `${this.customFilename}.jpg`;
        } else {
          this.photoName = `${this.fileNamePrefix}.jpg`;
        }
        this.isPreloadedPhoto = false;
        
        console.log('💾 Nombre de archivo:', this.photoName);
        
        // Convertir el canvas a un blob con manejo de errores
        canvas.toBlob((blob) => {
          try {
            if (!blob) {
              throw new Error('Error al crear el blob de la imagen');
            }
            
            console.log('📦 Blob creado:', blob.size, 'bytes');
            
            // Crear un objeto File a partir del Blob para mantener compatibilidad
            const file = new File([blob], this.photoName, { type: 'image/jpeg' });
            
            // Emitir tanto el archivo como el base64 para máxima flexibilidad
            this.$emit('photo-captured', {
              file: file,
              base64: dataUrl,
              fileName: this.photoName
            });
            
            console.log('✅ Foto capturada y emitida exitosamente');
            
            this.toastStore.addToast({
              type: 'success',
              message: 'Fotografía capturada correctamente',
              duration: 2000
            });
            
          } catch (blobError) {
            console.error('Error al procesar blob:', blobError);
            this.toastStore.addToast({
              type: 'error',
              message: 'Error al procesar la imagen capturada',
              duration: 3000
            });
          }
        }, 'image/jpeg', 0.9);
        
        // Cerrar la cámara después de tomar la foto
        this.closeCamera();
        
      } catch (error) {
        console.error('❌ Error al capturar foto:', error);
        
        this.toastStore.addToast({
          type: 'error',
          message: error.message || 'Error al capturar la fotografía',
          duration: 4000
        });
      }
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
  transition: background-color 0.3s, opacity 0.3s;
  border: none;
}

.camera-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.camera-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #6b7280;
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
  background-color: #000;
}

.camera-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 10;
}

.camera-loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  transition: opacity 0.3s, background-color 0.3s;
}

.capture-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #9ca3af;
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