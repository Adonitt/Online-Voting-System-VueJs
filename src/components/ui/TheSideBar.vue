
<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/authStore.js";

const props = defineProps({ open: Boolean });
const emit = defineEmits(["close"]);
const authStore = useAuthStore();
const isAdmin = computed(() => authStore.isAdmin);
</script>

<template>
  <div
      class="sidebar bg-white shadow fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out"
      :class="{
      'translate-x-0': open,
      '-translate-x-full': !open,
      'sm:translate-x-0 sm:static sm:block': true
    }"
  >
    <div class="sidebar-logo p-3 border-bottom">
      <router-link :to="{ name: 'home' }">
        <img src="@/assets/img/foto/ks.jpeg" alt="KS Logo" width="50" height="50" />
      </router-link>
    </div>
    <div class="sidebar-content overflow-y-auto p-3">
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link :to="{ name: 'home' }" @click="emit('close')" class="nav-link">
            <i class="fas fa-home me-2"></i> Results
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'party' }" @click="emit('close')" class="nav-link">
            <i class="bi bi-flag me-2"></i> Parties
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'candidates' }" @click="emit('close')" class="nav-link">
            <i class="bi bi-file-person me-2"></i> Candidates
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'cast-vote' }" @click="emit('close')" class="nav-link">
            <i class="bi bi-pen me-2"></i> Cast Vote
          </router-link>
        </li>
        <li class="nav-item" v-if="isAdmin">
          <router-link :to="{ name: 'admin-users' }" @click="emit('close')" class="nav-link">
            <i class="bi bi-people me-2"></i> All Registered Users
          </router-link>
        </li>
        <li class="nav-item" v-if="isAdmin">
          <router-link :to="{ name: 'admin-votes' }" @click="emit('close')" class="nav-link">
            <i class="bi bi-check-all me-2"></i> All Voted Users
          </router-link>
        </li>
        <li class="nav-item" v-if="isAdmin">
          <router-link :to="{ name: 'candidate-results' }" @click="emit('close')" class="nav-link">
            <i class="bi bi-person me-2"></i> Candidate Results
          </router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{ name: 'my-profile' }" @click="emit('close')" class="nav-link">
            <i class="bi bi-person me-2"></i> My Profile
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 260px;
  background-color: #fff;
}
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
  }
  .sidebar.translate-x-0 {
    transform: translateX(0);
  }
}
</style>
