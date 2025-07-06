<script setup>
import { useAuthStore } from "@/stores/authStore.js";
import { useRouter } from "vue-router";
import { useAppToast } from "@/composables/useAppToast.js";

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
    <nav
        class="navbar navbar-expand-lg navbar-light bg-white border-bottom"
    >
      <div class="container-fluid d-flex align-items-center justify-content-between">
        <!-- Hamburger toggle for mobile -->
        <button
            class="btn btn-toggle d-lg-none"
            type="button"
            aria-label="Toggle sidebar"
            @click="$emit('toggle-sidebar')"
        >
          <i class="fas fa-bars"></i>
        </button>

        <!-- Optional: search icon for mobile -->
        <ul class="navbar-nav d-flex align-items-center d-lg-none">
          <li class="nav-item dropdown">
            <a
                class="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
                role="button"
                aria-expanded="false"
            >
              <i class="fa fa-search"></i>
            </a>
            <ul class="dropdown-menu dropdown-search animated fadeIn">
              <form class="navbar-left navbar-form nav-search">
                <div class="input-group">
                  <input
                      type="text"
                      placeholder="Search ..."
                      class="form-control"
                  />
                </div>
              </form>
            </ul>
          </li>
        </ul>

        <!-- Profile dropdown -->
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item dropdown">
            <a
                class="nav-link dropdown-toggle profile-pic"
                href="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
              <span class="profile-username">
                <span class="op-7">Hi, </span>
                <span class="fw-bold">
                  {{
                    authStore.loggedInUser?.firstName +
                    " " +
                    authStore.loggedInUser?.lastName
                  }}
                </span>
              </span>
            </a>
            <ul class="dropdown-menu dropdown-user animated fadeIn dropdown-menu-end">
              <li>
                <div class="user-box px-3 py-2">
                  <div class="u-text">
                    <h6 class="mb-0">
                      {{
                        authStore.loggedInUser?.firstName +
                        " " +
                        authStore.loggedInUser?.lastName
                      }}
                    </h6>
                    <p class="text-muted small mb-1">
                      {{ authStore.loggedInUser?.sub }}
                    </p>
                    <router-link
                        :to="{ name: 'my-profile' }"
                        class="btn btn-sm btn-secondary"
                    >
                      View Profile
                    </router-link>
                  </div>
                </div>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <router-link
                    class="dropdown-item"
                    :to="{ name: 'change-password' }"
                >
                  Change Password
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a class="dropdown-item" @click.prevent="onLogout">
                  Logout
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.btn-toggle {
  border: none;
  background: transparent;
  font-size: 1.25rem;
  color: #333;
}
.profile-username {
  font-size: 0.9rem;
}
.user-box {
  text-align: left;
}
</style>
