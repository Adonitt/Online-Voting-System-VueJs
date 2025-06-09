// TheSideBar.vue
<script setup>

</script>

<template>
  <div class="sidebar">
    <div class="sidebar-logo">
      <!-- Logo Header -->
      <div class="logo-header" data-background-color="white">
        <router-link :to="{name:'home'}" class="logo">
          <img
              src="@/assets/img/foto/ks.jpeg"
              alt="navbar brand"
              class="navbar-brand"
              height="50px"
              width="50px"/>
        </router-link>


        <!--        <div class="nav-toggle">-->
        <!--          <button class="btn btn-toggle toggle-sidebar">-->
        <!--            <i class="gg-menu-right"></i>-->
        <!--          </button>-->
        <!--          <button class="btn btn-toggle sidenav-toggler">-->
        <!--            <i class="gg-menu-left"></i>-->
        <!--          </button>-->
        <!--        </div>-->
        <!--        <button class="topbar-toggler more">-->
        <!--          <i class="gg-more-vertical-alt"></i>-->
        <!--        </button>-->
        <!--      -->
      </div>
      <!-- End Logo Header -->
    </div>
    <div class="sidebar-wrapper scrollbar scrollbar-inner">
      <div class="sidebar-content">
        <ul class="nav nav-secondary">
          <li class="nav-item ">

            <router-link :to="{name:'home'}">
              <i class="fas fa-home"></i>
              <p>Dashboard</p>
            </router-link>
          </li>

          <li class="nav-section">
            <h4 class="text-section">Components</h4>
          </li>
          <li class="nav-item">
            <router-link
                :to="{name:'party'}">
              <i class="bi-flag"></i>
              <p>Parties</p>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
                :to="{name:'candidates'}">
              <i class="bi-file-person"></i>
              <p>Candidates</p>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
                :to="{name:'cast-vote'}">
              <i class="bi-pen"></i>
              <p>Cast Vote</p>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
                :to="{name:'my-profile'}">
              <i class="bi-person"></i>
              <p>My Profile</p>
            </router-link>
          </li>


        </ul>
      </div>
    </div>
  </div>
</template>
