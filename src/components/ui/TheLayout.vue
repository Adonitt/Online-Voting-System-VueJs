<script setup>
import { ref, computed } from "vue";
import TheSideBar from "./TheSideBar.vue";
import TheNavBar from "./TheNavBar.vue";
import TheFooter from "@/components/ui/TheFooter.vue";
import { useAuthStore } from "@/stores/authStore.js";
import { useRouter } from "vue-router";
import { useAppToast } from "@/composables/useAppToast.js";

const authStore = useAuthStore();
const router = useRouter();
const toast = useAppToast();

const showProfileDropdown = ref(false);
const sidebarVisible = ref(false);

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value;
};

const onLogout = () => {
  authStore.logout();
  router.push({ name: "login" });
  toast.showSuccess("You're logged out!");
};

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};

const isAdmin = computed(() => authStore.isAdmin);
</script>

<template>
  <div id="app" class="d-flex">
    <!-- Sidebar, i merr prop visible për toggle -->
    <the-side-bar :visible="sidebarVisible" :is-admin="isAdmin" />

    <!-- Main panel -->
    <div class="main-panel" :class="{ 'full-width': !sidebarVisible }">
      <!-- Navbar -->
      <the-nav-bar
          @toggle-sidebar="toggleSidebar"
          :show-profile-dropdown="showProfileDropdown"
          @toggle-profile-dropdown="toggleProfileDropdown"
          :auth-store="authStore"
          @logout="onLogout"
      />

      <!-- Main content -->
      <div class="container">
        <router-view />
      </div>

      <!-- Footer -->
      <the-footer />
    </div>
  </div>
</template>

<style scoped>
.d-flex {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-panel {
  flex-grow: 1;
  transition: margin-left 0.3s ease;
  margin-left: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
}

@media (min-width: 992px) {
  .main-panel {
    margin-left: 250px;
  }
}

.full-width {
  margin-left: 0 !important;
}
</style>
