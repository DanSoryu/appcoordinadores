<template>
  <div class="file-upload-preview">
    <label :for="id" class="upload-button">
      <slot>Subir archivo</slot>
      <input
        :id="id"
        type="file"
        class="hidden"
        @change="handleFileChange"
        :accept="accept"
      />
    </label>
    <div v-if="preview || (isPreloadedFile && fileName)" class="preview-container">
      <div class="w-full flex flex-col items-center">
        <img v-if="isImage" :src="imageUrl" alt="Vista previa" class="preview-image mb-2" />
        <img v-else-if="isDocument" :src="documentDefault" alt="Documento" class="preview-image mb-2" />
        <p v-else class="preview-text mb-2">Vista previa: {{ fileName }}</p>
        <div v-if="fileName" class="file-name text-sm text-gray-700 text-center">{{ fileName }}</div>
        <div v-if="isPreloadedFile" class="text-xs text-blue-600 mt-1">(Archivo existente)</div>
      </div>
    </div>
  </div>
</template>

<script>
import documentDefault from '../../assets/document-default.jpg';

export default {
  name: 'FileUploadPreview',
  props: {
    id: {
      type: String,
      required: true
    },
    accept: {
      type: String,
      default: ''
    },
    preloadedFile: {
      type: String,
      default: null
    },
    documentType: {
      type: String,
      default: 'orden', // 'orden' o 'mecanico'
      validator: value => ['orden', 'mecanico'].includes(value)
    }
  },
  data() {
    return {
      preview: null,
      fileName: '',
      documentDefault,
      isPreloadedFile: false
    };
  },
  mounted() {
    this.loadPreloadedFile();
  },
  watch: {
    preloadedFile: {
      handler() {
        this.loadPreloadedFile();
      },
      immediate: true
    }
  },
  computed: {
    isImage() {
      if (this.isPreloadedFile && this.fileName) {
        const ext = this.fileName.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
      }
      return this.preview && this.preview.startsWith('data:image');
    },
    isDocument() {
      if (!this.fileName) return false;
      const ext = this.fileName.split('.').pop().toLowerCase();
      return ['pdf', 'csv', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext);
    },
    imageUrl() {
      if (this.isPreloadedFile && this.fileName && this.isImage) {
        // Usar la URL correcta según el tipo de documento
        if (this.documentType === 'mecanico') {
          return `https://api.ed-intra.com/Mecasoft/documentos_mecanico/${this.fileName}`;
        } else {
          return `http://127.0.0.1:8000/Mecasoft/detalles_ordenes/${this.fileName}`;
        }
      }
      return this.preview;
    }
  },
  methods: {
    loadPreloadedFile() {
      if (this.preloadedFile) {
        this.fileName = this.preloadedFile;
        this.isPreloadedFile = true;
        this.preview = null; // No necesitamos preview para archivos pre-cargados ya que usamos imageUrl
        console.log('Archivo pre-cargado:', this.preloadedFile);
      } else {
        this.isPreloadedFile = false;
      }
    },
    
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.fileName = file.name;
        this.isPreloadedFile = false; // Nuevo archivo subido
        const reader = new FileReader();
        reader.onload = (e) => {
          this.preview = e.target.result;
        };
        reader.readAsDataURL(file);
        // Emit only the file object directly
        this.$emit('file-selected', file);
      } else {
        // Si no hay archivo, mantener el preloadedFile si existe
        if (!this.preloadedFile) {
          this.preview = null;
          this.fileName = '';
          this.isPreloadedFile = false;
        }
        this.$emit('file-selected', null);
      }
    }
  }
};
</script>

<style scoped>
.file-upload-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.upload-button {
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

.upload-button:hover {
  background-color: #2563eb;
}

.hidden {
  display: none;
}

.preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #cbd5e1;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: #f9fafb;
}

.preview-image {
  max-width: 100%;
  max-height: 10rem;
  object-fit: contain;
}

.preview-text {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>