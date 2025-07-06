<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore.js";
import { useRouter } from "vue-router";
import { useAppToast } from "@/composables/useAppToast.js";

const authStore = useAuthStore();
const router = useRouter();
const toast = useAppToast();

const showProfileDropdown = ref(false);

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value;
};

const onLogout = () => {
  authStore.logout();
  router.push({ name: "login" });
  toast.showSuccess("You're logged out!");
  showProfileDropdown.value = false;
};
</script>

<template>
  <nav class="navbar mobile-navbar d-lg-none">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <!-- Logo -->
      <router-link to="/" class="navbar-brand">
        <img src="@/assets/img/foto/ks.jpeg" alt="Logo" height="40" />
      </router-link>

      <!-- Profile button -->
      <button
          @click="toggleProfileDropdown"
          class="btn btn-link text-dark position-relative"
          aria-label="Toggle profile menu"
      >
        <i class="bi bi-person-circle fs-4"></i>
      </button>

      <!-- Profile dropdown -->
      <ul
          v-if="showProfileDropdown"
          class="profile-dropdown position-absolute bg-white shadow rounded p-2"
          style="top: 50px; right: 10px; width: 180px; z-index: 1050;"
      >
        <li class="mb-2 fw-semibold">
          {{ authStore.loggedInUser?.firstName }} {{ authStore.loggedInUser?.lastName }}
        </li>
        <li class="mb-2 text-muted small">{{ authStore.loggedInUser?.sub }}</li>
        <li>
          <router-link @click="showProfileDropdown = false" class="dropdown-item" :to="{ name: 'my-profile' }">
            View Profile
          </router-link>
        </li>
        <li>
          <router-link @click="showProfileDropdown = false" class="dropdown-item" :to="{ name: 'change-password' }">
            Change Password
          </router-link>
        </li>
        <li>
          <a href="#" @click.prevent="onLogout" class="dropdown-item text-danger">
            Logout
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.mobile-navbar {
  position: relative;
  background: white;
  border-bottom: 1px solid #ddd;
  padding: 0.5rem 1rem;
}

.profile-dropdown {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
}

.profile-dropdown li {
  padding: 0.3rem 0.5rem;
}

.dropdown-item {
  display: block;
  color: #333;
  text-decoration: none;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}
</style>
