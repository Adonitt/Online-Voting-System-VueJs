<script setup>
import { defineEmits, computed } from "vue";
import { useAuthStore } from "@/stores/authStore.js";
import { useRouter } from "vue-router";
import { useAppToast } from "@/composables/useAppToast.js";

const emit = defineEmits(["toggle-sidebar"]);
const authStore = useAuthStore();
const router = useRouter();
const toast = useAppToast();

const onLogout = () => {
  authStore.logout();
  router.push({ name: "login" });
  toast.showSuccess("You're logged out!");
};
</script>

<template>
  <div class="main-header">
    <nav class="navbar">
      <button @click="emit('toggle-sidebar')">Toggle Sidebar</button>

      <!-- User dropdown etj... -->
      <ul>
        <li>
          Hi, {{ authStore.loggedInUser?.firstName }}
          <ul>
            <li><router-link to="/my-profile">My Profile</router-link></li>
            <li><router-link to="/change-password">Change Password</router-link></li>
            <li><a href="#" @click.prevent="onLogout">Logout</a></li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>
