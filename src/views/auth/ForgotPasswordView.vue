<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppToast } from '@/composables/useAppToast.js'
import userService from '@/services/userService.js'

const email = ref('')
const toast = useAppToast()
const router = useRouter()
const isLoading = ref(false)

const handleSubmit = async () => {
  if (!email.value) {
    toast.showWarning("Please enter your email address.");
    return;
  }

  isLoading.value = true;

  try {
    const response = await userService.forgotPassword(email.value);
    toast.showSuccess(response.success);
    await router.push({ name: 'login' });

  } catch (error) {
    toast.showError(error.message);
    console.error("Password reset error:", error);

  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <section class="forgot-password-section vh-100 d-flex align-items-center justify-content-center">
    <div class="card shadow p-4" style="max-width: 500px; width: 100%;">
      <div class="text-center mb-4">
        <img src="@/assets/img/foto/ks.jpeg" alt="Logo" class="img-fluid mb-3" style="max-height: 150px;">
        <h2 class="fw-bold">Reset Your Password</h2>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="reset-email" class="form-label">Email address</label>
          <input
              id="reset-email"
              type="email"
              class="form-control"
              v-model.trim="email"
              placeholder="Enter your registered email"
              :disabled="isLoading"
          />
        </div>

        <div class="d-grid mb-3">
          <button
              type="submit"
              class="btn btn-primary btn-lg"
              :disabled="isLoading"
          >
            <span v-if="!isLoading">Send Reset Instructions</span>
            <span v-else>Sending...
              <span class="spinner-border spinner-border-sm" role="status"></span>
            </span>
          </button>
        </div>

        <div class="text-center">
          <router-link
              :to="{ name: 'login' }"
              class="btn btn-link text-decoration-none"
              :disabled="isLoading"
          >
            ← Back to Login
          </router-link>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.forgot-password-section {
  background-color: #f8f9fa;
}

.btn-link {
  color: #6c757d;
}

.btn-link:hover {
  color: #0d6efd;
}
</style>