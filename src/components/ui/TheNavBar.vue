<script setup>
import { ref, watch } from "vue";
import { useAuthStore } from "@/stores/authStore.js";

const props = defineProps({
  closeSidebar: Function,
});

const authStore = useAuthStore();

const profileDropdownOpen = ref(false);

const toggleProfileDropdown = () => {
  profileDropdownOpen.value = !profileDropdownOpen.value;
  if (profileDropdownOpen.value) {
    props.closeSidebar && props.closeSidebar(); // mbyll sidebar-in nëse është hapur
  }
};

const closeProfileDropdown = () => {
  profileDropdownOpen.value = false;
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
    <div class="container-fluid">
      <ul class="navbar-nav ms-auto align-items-center">
        <li class="nav-item dropdown" :class="{ show: profileDropdownOpen }">
          <a
              href="#"
              class="nav-link dropdown-toggle"
              role="button"
              @click.prevent="toggleProfileDropdown"
              aria-expanded="profileDropdownOpen"
          >
            <span class="profile-username">
              Hi, <strong>{{ authStore.loggedInUser?.firstName }} {{ authStore.loggedInUser?.lastName }}</strong>
            </span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end" :class="{ show: profileDropdownOpen }">
            <li>
              <h6 class="dropdown-header">{{ authStore.loggedInUser?.firstName }} {{ authStore.loggedInUser?.lastName }}</h6>
            </li>
            <li><router-link class="dropdown-item" :to="{ name: 'my-profile' }">View Profile</router-link></li>
            <li><router-link class="dropdown-item" :to="{ name: 'change-password' }">Change Password</router-link></li>
            <li><hr class="dropdown-divider" /></li>
            <li><a href="#" class="dropdown-item" @click.prevent="authStore.logout()">Logout</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>
