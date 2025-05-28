// TheNavBar.vue
<script setup>

import {useAuthStore} from "@/stores/authStore.js";
import {useRouter} from "vue-router";
import {useAppToast} from "@/composables/useAppToast.js";
import {toFormData} from "axios";

const authStore = useAuthStore();
const router = useRouter()
const toast = useAppToast()

const onLogout = () => {
  authStore.logout()
  router.push({name: 'login'})
  toast.showSuccess("You're logged out!");
}


</script>

<template>
  <div class="main-header">
    <!-- Navbar Header -->
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
          <li
              class="nav-item topbar-icon dropdown hidden-caret d-flex d-lg-none"
          >
            <a
                class="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-expanded="false"
                aria-haspopup="true"
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
          <li class="nav-item topbar-user dropdown hidden-caret">
            <a
                class="dropdown-toggle profile-pic"
                data-bs-toggle="dropdown"
                href="#"
                aria-expanded="false"
            >

              <span class="profile-username">
                      <span class="op-7">Hi, </span>
                      <span class="fw-bold">{{
                          authStore.loggedInUser?.firstName + " " + authStore.loggedInUser?.lastName
                        }}</span>
                    </span>
            </a>
            <ul class="dropdown-menu dropdown-user animated fadeIn">
              <div class="dropdown-user-scroll scrollbar-outer">
                <li>
                  <div class="user-box">

                    <div class="u-text">
                      <h4>{{ authStore.loggedInUser?.firstName + " " + authStore.loggedInUser?.lastName }}</h4>
                      <p class="text-muted">{{ authStore.loggedInUser?.sub }}</p>
                      <router-link
                          :to="{name:'my-profile'}"
                          class="btn btn-xs btn-secondary btn-sm"
                      >View Profile
                      </router-link
                      >
                    </div>
                  </div>
                </li>
                <li>
                  <div class="dropdown-divider"></div>

                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" @click="onLogout">Logout</a>
                </li>
              </div>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
    <!-- End Navbar -->
  </div>

</template>