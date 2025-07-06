<script setup>
import {reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/authStore.js'
import {useAppToast} from '@/composables/useAppToast.js'
import {useLoading} from "@/composables/useLoading.js"
import userService from "@/services/userService.js"

const router = useRouter()
const authStore = useAuthStore()
const toast = useAppToast()
const {isLoading, withLoading} = useLoading()

const form = reactive({
  personalNo: {val: '', isValid: true},
  firstName: {val: '', isValid: true},
  lastName: {val: '', isValid: true},
  email: {val: '', isValid: true},
  password: {val: '', isValid: true},
  confirmPassword: {val: '', isValid: true},
  birthDate: {val: '', isValid: true},
  nationality: {val: '', isValid: true},
  city: {val: '', isValid: true},
  role: 'USER'
})

const formIsValid = ref(true)

const validateForm = () => {
  formIsValid.value = true
  for (const key in form) {
    if (form[key].val !== undefined && !form[key].val) {
      form[key].isValid = false
      formIsValid.value = false
    }
  }
}

const clearValidity = (key) => {
  form[key].isValid = true
}

const handleSubmit = async () => {
  validateForm()
  if (!formIsValid.value) {
    toast.showWarning('Please fill all fields!')
    return
  }
  if (form.password.val !== form.confirmPassword.val) {
    toast.showWarning('Passwords do not match!')
    return
  }

  const obj = {
    personalNo: form.personalNo.val,
    firstName: form.firstName.val,
    lastName: form.lastName.val,
    email: form.email.val,
    password: form.password.val,
    confirmPassword: form.confirmPassword.val,
    birthDate: form.birthDate.val,
    nationality: form.nationality.val,
    city: form.city.val,
    role: form.role
  }

  await withLoading(async () => {
    try {

      const response = await userService.registerUser(obj)
      if (response) {
        toast.showSuccess("Registration successful!")
        await router.push({name: 'login'})
      }
    } catch (err) {
      toast.showError(err.response?.data?.birthDate || err.response?.data?.message || 'Registration failed!')
      console.error("Registration error:", err)
    }
  })
}

const availableCities = [
  'PODUJEVO', 'PRISTINA', 'FERIZAJ', 'GJILAN', 'MITROVICA',
  'PRIZREN', 'GJAKOVE', 'MALISHEVE', 'PEJE', 'DRENICE', 'DRENAS', 'SKENDERAJ'
];
</script>

<template>
  <section class="register-section vh-100 d-flex align-items-center justify-content-center">
    <div class="card shadow p-4" style="max-width: 600px; width: 100%;">
      <div class="text-center mb-4">
        <img src="@/assets/img/foto/ks.jpeg" alt="Logo" class="img-fluid mb-3" style="max-height: 100px;"/>
        <h2 class="fw-bold">Sign Up</h2>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">First Name</label>
            <input v-model="form.firstName.val" class="form-control" :class="{ 'is-invalid': !form.firstName.isValid }"
                   @blur="clearValidity('firstName')"/>
            <div class="invalid-feedback">Please enter a first name.</div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Last Name</label>
            <input v-model="form.lastName.val" class="form-control" :class="{ 'is-invalid': !form.lastName.isValid }"
                   @blur="clearValidity('lastName')"/>
            <div class="invalid-feedback">Please enter a last name.</div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Email</label>
            <input type="email" v-model="form.email.val" class="form-control"
                   :class="{ 'is-invalid': !form.email.isValid }" @blur="clearValidity('email')"/>
            <div class="invalid-feedback">Please enter a valid email address.</div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Personal No</label>
            <input v-model="form.personalNo.val" class="form-control"
                   :class="{ 'is-invalid': !form.personalNo.isValid }" @blur="clearValidity('personalNo')"/>
            <div class="invalid-feedback">Please enter a valid personal number.</div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Password</label>
            <input type="password" v-model="form.password.val" class="form-control"
                   :class="{ 'is-invalid': !form.password.isValid }" @blur="clearValidity('password')"/>
            <div class="invalid-feedback">Please enter a password.</div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Confirm Password</label>
            <input type="password" v-model="form.confirmPassword.val" class="form-control"
                   :class="{ 'is-invalid': !form.confirmPassword.isValid }" @blur="clearValidity('confirmPassword')"/>
            <div class="invalid-feedback">Please confirm your password.</div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Birth Date</label>
            <input type="date" v-model="form.birthDate.val" class="form-control"
                   :class="{ 'is-invalid': !form.birthDate.isValid }" @blur="clearValidity('birthDate')"/>
            <div class="invalid-feedback">Please enter your birth date.</div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Nationality</label>
            <select v-model="form.nationality.val" class="form-select"
                    :class="{ 'is-invalid': !form.nationality.isValid }" @blur="clearValidity('nationality')">
              <option value="">Select nationality</option>
              <option value="ALBANIAN">Albanian</option>
              <option value="EGYPTIAN">Egyptian</option>
              <option value="ROMANI">Romani</option>
              <option value="BOSNIAN">Bosnian</option>
              <!-- Add more as needed -->
            </select>
            <div class="invalid-feedback">Please select your nationality.</div>
          </div>

          <!-- City Dropdown -->
          <div class="col-md-6">
            <label class="form-label">City</label>
            <select v-model="form.city.val" class="form-select" :class="{ 'is-invalid': !form.city.isValid }"
                    @blur="clearValidity('city')">
              <option value="">Select city</option>
              <option v-for="cityOption in availableCities" :key="cityOption" :value="cityOption">
                {{ cityOption }}
              </option>
            </select>
            <div class="invalid-feedback">Please select your city.</div>
          </div>
        </div>

        <div class="d-grid mt-4">
          <button type="submit" class="btn btn-primary btn-lg" :disabled="isLoading">
            Sign Up
          </button>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-3">
          <span class="text-muted">Already have an account?
            <router-link to="/auth/login" class="text-decoration-none">Login</router-link><br>

        <router-link :to="{name:'citizens'}">How to register</router-link>
          </span>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.register-section {
  background: linear-gradient(to bottom right, #e0eafc, #cfdef3);
}

.card {
  border-radius: 1rem;
}
</style>
