<script setup>
import {useAuthStore} from "@/stores/authStore.js";
import {useRouter} from "vue-router";
import {useAppToast} from "@/composables/useAppToast.js";

const emit = defineEmits(["toggle-sidebar"]);

const authStore = useAuthStore();
const router = useRouter();
const toast = useAppToast();

const onLogout = () => {
  authStore.logout();
  router.push({name: "login"});
  toast.showSuccess("You're logged out!");
};
</script>

<template>
  <div class="main-header border-bottom bg-white px-3 py-2 d-flex justify-content-between align-items-center">
    <button
        class="navbar-toggler sidenav-toggler"
        @click="emit('toggle-sidebar')"
        type="button"
    >
      <span class="navbar-toggler-icon">
        <i class="icon-menu"></i>
      </span>
    </button>

    <div class="dropdown">
      <a
          class="dropdown-toggle d-flex align-items-center mr-1"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
      >
        <span class="me-2 d-none d-md-inline text-muted">Hi,</span>
        <span class="fw-bold me-2">
          {{ authStore.loggedInUser?.firstName + " " + authStore.loggedInUser?.lastName }}
        </span>
        <i class="fa fa-user-circle"></i>
      </a>

      <ul class="dropdown-menu dropdown-menu-end animated fadeIn mt-2">
        <li class="px-3 py-2">
          <h6 class="mb-0">
            {{ authStore.loggedInUser?.firstName + " " + authStore.loggedInUser?.lastName }}
          </h6>
          <small class="text-muted">{{ authStore.loggedInUser?.sub }}</small>
        </li>
        <li>
          <hr class="dropdown-divider"/>
        </li>
        <li>
          <router-link class="dropdown-item" :to="{ name: 'my-profile' }">
            View Profile
          </router-link>
        </li>
        <li>
          <router-link class="dropdown-item" :to="{ name: 'change-password' }">
            Change Password
          </router-link>
        </li>
        <li>
          <hr class="dropdown-divider"/>
        </li>
        <li>
          <a class="dropdown-item text-danger" @click="onLogout">Logout</a>
        </li>
      </ul>
    </div>
  </div>
</template>
