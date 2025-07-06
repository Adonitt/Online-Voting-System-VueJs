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

const closeDropdown = () => {
  showProfileDropdown.value = false;
};

const onLogout = () => {
  authStore.logout();
  router.push({ name: "login" });
  toast.showSuccess("You're logged out!");
  closeDropdown();
};

// Optional: close dropdown when clicked outside
// You can add this if you want — më thuaj nëse ta shtoj

</script>

<template>
  <div class="main-header">
    <nav
        class="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom"
        data-background-color="white"
    >
      <div class="container-fluid">
        <nav
            class="navbar navbar-header-left navbar-expand-lg navbar-form nav-search p-0 d-none d-lg-flex"
        >
        </nav>

        <ul class="navbar-nav topbar-nav ms-md-auto align-items-center">

          <!-- Search icon for mobile, leave as is or remove if you want -->

          <li class="nav-item topbar-user dropdown hidden-caret" style="position: relative;">
            <a
                href="#"
                class="dropdown-toggle profile-pic"
                @click.prevent="toggleProfileDropdown"
                style="cursor: pointer;"
                :aria-expanded="showProfileDropdown.toString()"
            >
              <span class="profile-username">
                <span class="op-7">Hi, </span>
                <span class="fw-bold">
                  {{ authStore.loggedInUser?.firstName + " " + authStore.loggedInUser?.lastName }}
                </span>
              </span>
              <i class="bi bi-caret-down-fill ms-1"></i>
            </a>

            <ul
                v-if="showProfileDropdown"
                class="dropdown-menu dropdown-user animated fadeIn"
                style="display: block; position: absolute; right: 0; top: 100%; z-index: 1050;"
            >
              <div class="dropdown-user-scroll scrollbar-outer">
                <li>
                  <div class="user-box">
                    <div class="u-text">
                      <h4>{{ authStore.loggedInUser?.firstName + " " + authStore.loggedInUser?.lastName }}</h4>
                      <p class="text-muted">{{ authStore.loggedInUser?.sub }}</p>
                      <router-link
                          :to="{ name: 'my-profile' }"
                          class="btn btn-xs btn-secondary btn-sm"
                          @click="closeDropdown"
                      >
                        View Profile
                      </router-link>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="dropdown-divider"></div>
                  <router-link
                      :to="{ name: 'change-password' }"
                      class="dropdown-item"
                      @click="closeDropdown"
                  >
                    Change Password
                  </router-link>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#" @click.prevent="onLogout">Logout</a>
                </li>
              </div>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
