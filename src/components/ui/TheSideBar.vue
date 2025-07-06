
<script setup>
import { useAuthStore } from "@/stores/authStore.js";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.isAdmin);
const isSidebarVisible = ref(false);
const route = useRoute();

watch(route, () => {
  isSidebarVisible.value = false;
});
</script>

<template>
  <div :class="['sidebar bg-white border-end', 'd-none d-lg-block', { 'd-block': isSidebarVisible }]" id="sidebarCollapse">
    <div class="sidebar-header p-3 border-bottom">
      <router-link :to="{ name: 'home' }">
        <img src="@/assets/img/foto/ks.jpeg" alt="Logo" width="40" height="40" />
        <span class="ms-2 fw-bold">KQZ</span>
      </router-link>
    </div>

    <ul class="list-unstyled px-2">
      <li><router-link class="nav-link" :to="{ name: 'home' }">Results</router-link></li>
      <li><router-link class="nav-link" :to="{ name: 'party' }">Parties</router-link></li>
      <li><router-link class="nav-link" :to="{ name: 'candidates' }">Candidates</router-link></li>
      <li><router-link class="nav-link" :to="{ name: 'cast-vote' }">Cast Vote</router-link></li>
      <li v-if="isAdmin"><router-link class="nav-link" :to="{ name: 'admin-users' }">All Registered Users</router-link></li>
      <li v-if="isAdmin"><router-link class="nav-link" :to="{ name: 'admin-votes' }">All Users That Voted</router-link></li>
      <li v-if="isAdmin"><router-link class="nav-link" :to="{ name: 'candidate-results' }">Candidate Results</router-link></li>
      <li><router-link class="nav-link" :to="{ name: 'my-profile' }">My Profile</router-link></li>
    </ul>
  </div>
</template>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  z-index: 1030;
}

@media (max-width: 991px) {
  .sidebar {
    display: none;
    position: absolute;
    background-color: white;
  }
  .sidebar.d-block {
    display: block !important;
  }
}
</style>