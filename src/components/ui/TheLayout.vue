<script setup>
import TheSideBar from "./TheSideBar.vue";
import TheNavBar from "./TheNavBar.vue";
import TheFooter from "@/components/ui/TheFooter.vue";
import {ref, onMounted, onUnmounted, watch} from "vue";
import {useRoute} from "vue-router";

const isSidebarOpen = ref(false);
const isUserMenuOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  // Toggle the class on the body element for CSS-driven sidebar visibility
  if (isSidebarOpen.value) {
    document.body.classList.add("sidenav-toggled");
  } else {
    document.body.classList.remove("sidenav-toggled");
  }
};

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

// Close sidebar and user menu on route change for better mobile UX
const route = useRoute();
watch(route, () => {
  isSidebarOpen.value = false;
  isUserMenuOpen.value = false;
  document.body.classList.remove("sidenav-toggled");
});

onMounted(() => {
  // Add a click listener to the document to close the user menu when clicking outside
  document.addEventListener('click', handleOutsideClick);

  // Ensure that if the page is loaded on a small screen, the sidebar is initially closed
  // and the body class is set accordingly.
  if (window.innerWidth < 992) {
    isSidebarOpen.value = false;
    document.body.classList.remove('sidenav-toggled');
  }
});

onUnmounted(() => {
  // Clean up body classes and event listener when the component is unmounted
  document.body.classList.remove("sidenav-toggled");
  document.removeEventListener('click', handleOutsideClick);
});

const handleOutsideClick = (event) => {
  // Close user menu if click is outside the user dropdown
  const userDropdown = document.querySelector('.topbar-user.dropdown');
  if (userDropdown && !userDropdown.contains(event.target)) {
    isUserMenuOpen.value = false;
  }
};
</script>

<template>
  <div id="app" :class="{ 'sidenav-toggled': isSidebarOpen }">
    <the-side-bar/>

    <div class="main-panel">
      <div class="main-header">
        <!-- Logo Header -->
        <div class="logo-header" data-background-color="dark">
          <router-link :to="{ name: 'home' }" class="logo">
            <img
                src="@/assets/img/foto/ks.jpeg"
                alt="navbar brand"
                class="navbar-brand"
                height="50px"
                width="50px"
            />
          </router-link>
          <div class="nav-toggle">
            <button class="btn btn-toggle toggle-sidebar" @click="toggleSidebar">
              <i class="gg-menu-right"></i>
            </button>
            <button class="btn btn-toggle sidenav-toggler" @click="toggleSidebar">
              <i class="gg-menu-left"></i>
            </button>
          </div>
          <button class="topbar-toggler more" @click="toggleUserMenu">
            <i class="gg-more-vertical-alt"></i>
          </button>
        </div>
        <!-- End Logo Header -->
        <the-nav-bar :is-user-menu-open="isUserMenuOpen"/>
      </div>

      <div class="container">
        <router-view/>
      </div>
      <the-footer/>
    </div>
  </div>
</template>

<style scoped>
/* In your main CSS file (e.g., assets/css/kaiadmin.min.css or a custom one) */

/* Default state for sidebar on larger screens */
.sidebar {
  /* ... existing styles ... */
  transition: transform 0.3s ease-in-out, margin-left 0.3s ease-in-out;
}

/* For smaller screens (e.g., below 992px) */
@media (max-width: 991.98px) {
  .sidebar {
    position: fixed; /* Make it overlay */
    top: 0;
    left: 0;
    height: 100%;
    z-index: 1030; /* Ensure it's above other content */
    transform: translateX(-100%); /* Hide by default */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  body.sidenav-toggled .sidebar {
    transform: translateX(0); /* Show when toggled */
  }

  .main-panel {
    margin-left: 0; /* No push on mobile */
  }
}</style>