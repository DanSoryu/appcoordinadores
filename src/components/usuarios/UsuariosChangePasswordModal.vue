<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative border border-gray-200">
      <button @click="$emit('close')" class="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-md p-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      
      <h2 class="text-2xl font-bold mb-6 text-blue-600 text-center">
        Cambiar Contraseña
      </h2>
      
      <!-- Información del usuario -->
      <div v-if="usuario" class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-6">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10">
            <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span class="text-white text-sm font-bold">
                {{ usuario.usuario.charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>
          <div class="ml-3">
            <div class="text-sm font-medium text-gray-900">
              Cambiar contraseña para: <strong>{{ usuario.usuario }}</strong>
            </div>
            <div class="text-sm text-gray-500">
              {{ getRoleDisplayName(usuario.rol) }}
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="mb-6">
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <label class="block mb-2 font-semibold text-gray-700">Nueva Contraseña *</label>
            <div class="relative">
              <input 
                v-model="formData.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                minlength="8"
                placeholder="Mínimo 8 caracteres"
                class="input mb-2 w-full pr-10"
                required
                :class="{ 'border-red-500': errors.newPassword }"
              >
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="!showNewPassword" class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
              </button>
            </div>
            <p v-if="errors.newPassword" class="text-red-500 text-sm mt-1">{{ errors.newPassword }}</p>
            
            <!-- Indicador de fortaleza de contraseña -->
            <div class="mt-2">
              <div class="text-sm text-gray-600 mb-1">Fortaleza de la contraseña:</div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  :class="getPasswordStrengthClass()" 
                  class="h-2 rounded-full transition-all duration-300"
                  :style="{ width: getPasswordStrengthWidth() }"
                ></div>
              </div>
              <div class="text-xs mt-1" :class="getPasswordStrengthTextClass()">
                {{ getPasswordStrengthText() }}
              </div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-4">
            <label class="block mb-2 font-semibold text-gray-700">Confirmar Nueva Contraseña *</label>
            <div class="relative">
              <input 
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                minlength="8"
                placeholder="Confirme la nueva contraseña"
                class="input mb-2 w-full pr-10"
                required
                :class="{ 'border-red-500': errors.confirmPassword }"
              >
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg v-if="!showConfirmPassword" class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</p>
          </div>

          <!-- Información de seguridad -->
          <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">Recomendaciones de seguridad:</h3>
                <div class="mt-2 text-sm text-yellow-700">
                  <ul class="list-disc list-inside space-y-1">
                    <li>Use al menos 8 caracteres</li>
                    <li>Combine letras mayúsculas y minúsculas</li>
                    <li>Incluya números y símbolos</li>
                    <li>Evite información personal</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <BaseButton 
            variant="secondary"
            @click="$emit('close')"
            type="button"
          >
            Cancelar
          </BaseButton>
          <BaseButton 
            type="submit" 
            variant="success"
            :disabled="!isFormValid"
            :onClick="handleSubmit"
            custom-loading-text="Cambiando"
            :min-delay="1500"
          >
            Cambiar Contraseña
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import BaseButton from '../global/BaseButton.vue'
import { useSubmitButton } from '../../composables/useSubmitButton.js'
import { useToastStore } from '../../stores/toast.js'
import apiClient from '../../services/api.js'

export default {
  name: 'UsuariosChangePasswordModal',
  components: {
    BaseButton
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    usuario: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['close', 'password-changed'],
  setup(props, { emit }) {
    const { executeSubmit } = useSubmitButton();
    const toastStore = useToastStore();

    const formData = ref({
      newPassword: '',
      confirmPassword: ''
    });

    const errors = ref({});
    const showNewPassword = ref(false);
    const showConfirmPassword = ref(false);

    // Computed properties
    const isFormValid = computed(() => {
      return formData.value.newPassword.length >= 8 && 
             formData.value.confirmPassword.length >= 8 &&
             formData.value.newPassword === formData.value.confirmPassword;
    });

    const passwordStrength = computed(() => {
      const password = formData.value.newPassword;
      if (!password) return 0;
      
      let strength = 0;
      
      // Longitud
      if (password.length >= 8) strength += 1;
      if (password.length >= 12) strength += 1;
      
      // Caracteres
      if (/[a-z]/.test(password)) strength += 1;
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;
      
      return Math.min(strength, 5);
    });

    // Watchers
    watch(() => props.show, (value) => {
      if (value) {
        resetForm();
      }
    });

    // Methods
    const resetForm = () => {
      formData.value = {
        newPassword: '',
        confirmPassword: ''
      };
      errors.value = {};
    };

    const getRoleDisplayName = (rol) => {
      const roles = {
        'admin': 'Administrador',
        'mecanico': 'Mecánico',
        'tecnico': 'Técnico'
      }
      return roles[rol] || rol
    };

    const getPasswordStrengthWidth = () => {
      return `${(passwordStrength.value / 5) * 100}%`;
    };

    const getPasswordStrengthClass = () => {
      if (passwordStrength.value <= 1) return 'bg-red-500';
      if (passwordStrength.value <= 2) return 'bg-orange-500';
      if (passwordStrength.value <= 3) return 'bg-yellow-500';
      if (passwordStrength.value <= 4) return 'bg-blue-500';
      return 'bg-green-500';
    };

    const getPasswordStrengthText = () => {
      if (passwordStrength.value <= 1) return 'Muy débil';
      if (passwordStrength.value <= 2) return 'Débil';
      if (passwordStrength.value <= 3) return 'Regular';
      if (passwordStrength.value <= 4) return 'Fuerte';
      return 'Muy fuerte';
    };

    const getPasswordStrengthTextClass = () => {
      if (passwordStrength.value <= 1) return 'text-red-600';
      if (passwordStrength.value <= 2) return 'text-orange-600';
      if (passwordStrength.value <= 3) return 'text-yellow-600';
      if (passwordStrength.value <= 4) return 'text-blue-600';
      return 'text-green-600';
    };

    const validateForm = () => {
      errors.value = {};

      // Validar nueva contraseña
      if (!formData.value.newPassword) {
        errors.value.newPassword = 'La nueva contraseña es requerida';
      } else if (formData.value.newPassword.length < 8) {
        errors.value.newPassword = 'La contraseña debe tener al menos 8 caracteres';
      }

      // Validar confirmación de contraseña
      if (!formData.value.confirmPassword) {
        errors.value.confirmPassword = 'Debe confirmar la nueva contraseña';
      } else if (formData.value.newPassword !== formData.value.confirmPassword) {
        errors.value.confirmPassword = 'Las contraseñas no coinciden';
      }

      return Object.keys(errors.value).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateForm() || !isFormValid.value) return;
      
      try {
        await executeSubmit(async () => {
          // Llamar a la API para cambiar la contraseña
          const changePasswordData = {
            new_password: formData.value.newPassword
          };
          
          await apiClient.post(`/users/${props.usuario.id}/change-password`, changePasswordData);
          
          console.log('Contraseña cambiada para usuario:', props.usuario);
          
          // Emitir evento de éxito
          emit('password-changed');
        });
        
        // Cerrar el modal al finalizar
        emit('close');
      } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        
        // Manejar errores específicos
        if (error.response?.data?.error) {
          const serverErrors = error.response.data.error;
          
          if (typeof serverErrors === 'object') {
            Object.keys(serverErrors).forEach(field => {
              if (serverErrors[field] && Array.isArray(serverErrors[field])) {
                if (field === 'new_password') {
                  errors.value.newPassword = serverErrors[field][0];
                }
              }
            });
          } else if (typeof serverErrors === 'string') {
            toastStore.addToast({
              message: serverErrors,
              type: 'error',
              duration: 5000
            });
          }
        } else if (error.response?.status === 404) {
          toastStore.addToast({
            message: 'Usuario no encontrado',
            type: 'error',
            duration: 5000
          });
        } else {
          toastStore.addToast({
            message: 'Error al cambiar la contraseña. Por favor, intente nuevamente.',
            type: 'error',
            duration: 5000
          });
        }
      }
    };

    return {
      formData,
      errors,
      showNewPassword,
      showConfirmPassword,
      isFormValid,
      passwordStrength,
      executeSubmit,
      toastStore,
      handleSubmit,
      resetForm,
      getRoleDisplayName,
      getPasswordStrengthWidth,
      getPasswordStrengthClass,
      getPasswordStrengthText,
      getPasswordStrengthTextClass
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
</style>