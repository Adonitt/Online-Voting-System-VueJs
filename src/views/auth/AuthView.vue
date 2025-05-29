<script setup>
import {useRoute, useRouter} from "vue-router";
import {useAuthStore} from "@/stores/authStore.js";
import {reactive, ref} from "vue";
import {useAppToast} from "@/composables/useAppToast.js";

const router = useRouter()
const route = useRoute();
const authStore = useAuthStore();
const toast = useAppToast()

const user = reactive({
  email: '',
  password: ''
})
const isLoading = ref(false)

const handleSubmit = async () => {
  if (!user.email || !user.password) {
    // alert('Please fill all fields.');
    toast.showWarning("Please fill all fields!");
    return
  }
  try {
    isLoading.value = true
    const response = await authStore.login(user)
    const redirect = `${route.query.redirect || '/'}`
    await router.push(redirect)
    // toast.showSuccess("You're logged in!");
  } catch (error) {
    toast.showError(error.response?.data?.message || "An error has occured!");
    console.log(error)
  } finally {
    isLoading.value = false
  }
}


</script>

<template>
  <section class="login-section vh-100 d-flex align-items-center justify-content-center">
    <div class="card shadow p-4" style="max-width: 500px; width: 100%;">
      <div class="text-center mb-4">
        <img src="@/assets/img/foto/ks.jpeg" alt="Logo" class="img-fluid mb-3" style="max-height: 150px;">
        <h2 class="fw-bold">Login to Voting System</h2>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input
              id="email"
              type="email"
              class="form-control"
              v-model.trim="user.email"
              placeholder="Enter a valid email address"
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
              id="password"
              type="password"
              class="form-control"
              placeholder="Enter your password"
              v-model.trim="user.password"
          />
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
          <router-link to="/forgot-password" class="text-decoration-none small">Forgot password?</router-link>
        </div>

        <div class="d-grid">
          <button type="submit" class="btn btn-primary btn-lg">
            Login
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>

</style>
