<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/authStore.js";

const authStore = useAuthStore();

const isAdmin = computed(() => authStore.isAdmin);

// Kontrolli i sidebar toggle në mobile
const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

// Kontroll dropdown profile navbar
const profileDropdownOpen = ref(false);

const toggleProfileDropdown = () => {
  profileDropdownOpen.value = !profileDropdownOpen.value;
};

const closeProfileDropdown = () => {
  profileDropdownOpen.value = false;
};
</script>

<template>
  <div id="app" class="d-flex">
    <!-- Hamburger butoni per mobile -->
    <button
        class="btn btn-primary d-lg-none m-2"
        @click="toggleSidebar"
        aria-label="Toggle sidebar"
    >
      <i class="fas fa-bars"></i>
    </button>

    <!-- Sidebar -->
    <aside
        class="sidebar bg-light"
        :class="{'d-none': !sidebarOpen && window.innerWidth < 992, 'd-block': sidebarOpen || window.innerWidth >= 992}"
        style="width: 250px; min-height: 100vh;"
    >
      <!-- Sidebar content si më lart -->
      <!-- ...kopjo contentin tënd të sidebar këtu... -->
    </aside>

    <div class="flex-grow-1 d-flex flex-column">
      <!-- Navbar -->
      <nav
          class="navbar navbar-expand-lg navbar-light bg-white border-bottom"
      >
        <div class="container-fluid">
          <!-- Në desktop e mobile, mund të ketë search ose logo -->

          <ul class="navbar-nav ms-auto align-items-center">
            <li class="nav-item dropdown" :class="{show: profileDropdownOpen}">
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
              <ul
                  class="dropdown-menu dropdown-menu-end"
                  :class="{show: profileDropdownOpen}"
                  @click.outside="closeProfileDropdown"
                  style="min-width: 200px;"
              >
                <li>
                  <h6 class="dropdown-header">{{ authStore.loggedInUser?.firstName }} {{ authStore.loggedInUser?.lastName }}</h6>
                </li>
                <li><router-link class="dropdown-item" :to="{name:'my-profile'}">View Profile</router-link></li>
                <li><router-link class="dropdown-item" :to="{name:'change-password'}">Change Password</router-link></li>
                <li><hr class="dropdown-divider"/></li>
                <li><a href="#" class="dropdown-item" @click.prevent="authStore.logout(); profileDropdownOpen=false;">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-grow-1 p-3">
        <router-view/>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Sidebar dhe layout bazik */
.sidebar {
  transition: all 0.3s ease;
  overflow-y: auto;
}

/* Dropdown custom */
.dropdown-menu {
  transition: opacity 0.15s ease-in-out;
  opacity: 0;
  pointer-events: none;
  display: block;
  position: absolute;
  will-change: transform;
}

.dropdown-menu.show {
  opacity: 1;
  pointer-events: auto;
}

@media(min-width: 992px) {
  /* Sidebar gjithmonë visible desktop */
  .sidebar {
    display: block !important;
  }
}
</style>
