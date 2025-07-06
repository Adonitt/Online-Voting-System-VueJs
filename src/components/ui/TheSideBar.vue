<script setup>
import { useAuthStore } from "@/stores/authStore.js";
import { computed } from "vue";

const authStore = useAuthStore();

const isAdmin = computed(() => authStore.isAdmin);
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-wrapper scrollbar scrollbar-inner">
      <div class="sidebar-content">
        <!-- User Profile in Sidebar (Optional, if you want it here) -->
        <!-- You had a user section here previously, re-adding it based on your original code -->
        <div class="user">
          <div class="avatar-sm float-left mr-2">
            <img
                src="assets/img/profile.jpg"
                alt="..."
                class="avatar-img rounded-circle"
            />
          </div>
          <div class="info">
            <a
                data-toggle="collapse"
                href="#collapseExample"
                aria-expanded="true"
            >
              <span>
                {{ authStore.loggedInUser?.firstName }}
                <span class="user-level">{{ authStore.loggedInUser?.sub }}</span>
                <span class="caret"></span>
              </span>
            </a>
            <div class="clearfix"></div>

            <div class="collapse in" id="collapseExample">
              <ul class="nav">
                <li>
                  <router-link :to="{ name: 'my-profile' }">
                    <span class="link-collapse">My Profile</span>
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'change-password' }">
                    <span class="link-collapse">Change Password</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <ul class="nav nav-secondary">
          <li class="nav-item">
            <router-link :to="{ name: 'home' }">
              <i class="fas fa-home"></i>
              <p>Results</p>
            </router-link>
          </li>

          <li class="nav-section">
            <h4 class="text-section">Components</h4>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'party' }">
              <i class="bi-flag"></i>
              <p>Parties</p>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link :to="{ name: 'candidates' }">
              <i class="bi-file-person"></i>
              <p>Candidates</p>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link :to="{ name: 'cast-vote' }">
              <i class="bi-pen"></i>
              <p>Cast Vote</p>
            </router-link>
          </li>

          <li class="nav-item" v-if="isAdmin">
            <router-link :to="{ name: 'admin-users' }">
              <i class="bi bi-people"></i>
              <p>All Registered Users</p>
            </router-link>
          </li>

          <li class="nav-item" v-if="isAdmin">
            <router-link :to="{ name: 'admin-votes' }">
              <i class="bi bi-check-all"></i>
              <p>All Users that has Voted</p>
            </router-link>
          </li>

          <li class="nav-item" v-if="isAdmin">
            <router-link :to="{ name: 'candidate-results' }">
              <i class="bi bi-person"></i>
              <p>Candidate Results</p>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link :to="{ name: 'my-profile' }">
              <i class="bi-person"></i>
              <p>My Profile</p>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles for TheSideBar here if needed, or rely on global CSS */
</style>