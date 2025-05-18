// TheSideBar.vue
<script setup>

</script>

<template>
  <div id="sidebar" class="active">
    <div class="sidebar-wrapper">
      <div class="sidebar-header position-relative">
        <div class="d-flex justify-content-between align-items-center">
          <div class="logo">
<!--            <a href="#"><img src="@/assets/images/bg/kqz.jpeg" alt="Logo" style="height: 100px" class="" srcset=""/></a>-->
       Logo   </div>

          <div class="sidebar-toggler x">
            <a href="#" class="sidebar-hide d-xl-none d-block"><i class="bi bi-x bi-middle"></i></a>
          </div>
        </div>
      </div>
      <div class="sidebar-menu">
        <ul class="menu">
          <li class="sidebar-title">Menu</li>

          <li class="sidebar-item">
            <router-link to="/" class="sidebar-link">
              <i class="bi bi-grid-fill"></i>
              <span>Dashboard</span>
            </router-link>
          </li>
          <li class="sidebar-item">
            <router-link :to="{name:'employees'}" class="sidebar-link">
              <i class="bi bi-people-fill"></i>
              <span>Employees</span>
            </router-link>
          </li>

          <li class="sidebar-item has-sub">
            <a href="#" class="sidebar-link">
              <i class="bi bi-stack"></i>
              <span>Components</span>
            </a>
            <ul class="submenu">
              <li class="submenu-item">
                <a href="component-alert.html">Alert</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
