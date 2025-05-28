<script setup>

import UserService from "@/services/userService.js";
import {useAuthStore} from "@/stores/authStore.js";
import userService from "@/services/userService.js";

const authStore = useAuthStore();
console.log(UserService.getAllUsers())
console.log(UserService.getUserById(authStore.loggedInUser?.id))



</script>

<template>
  <!--  <h1>Welcome to Profile View</h1>-->


  <div class="page-inner">
    <div class="container" id="main-body">
      <div class="main-body">
        <div class="row gutters-sm">

          <div class="col-md-6">
            <div class="card mb-5">
              <div class="card-body">
                <div class="row">
                  <div class="col-sm-3"><h6 class="mb-0">First Name</h6></div>
                  <div class="col-sm-9 text-secondary">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card mb-5">
              <div class="card-body">
                <div class="row">
                  <div class="col-sm-3"><h6 class="mb-0">First Name</h6></div>
                  <div class="col-sm-9 text-secondary">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card mb-5">
              <div class="card-body">
                <div class="row">
                  <div class="col-sm-3"><h6 class="mb-0">First Name</h6></div>
                  <div class="col-sm-9 text-secondary">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card mb-5">
              <div class="card-body">
                <div class="row">
                  <div class="col-sm-3"><h6 class="mb-0">First Name</h6></div>
                  <div class="col-sm-9 text-secondary">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card mb-5">
              <div class="card-body">
                <div class="row">
                  <div class="col-sm-3"><h6 class="mb-0">First Name</h6></div>
                  <div class="col-sm-9 text-secondary">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card mb-5">
              <div class="card-body">
                <div class="row">
                  <div class="col-sm-3"><h6 class="mb-0">First Name</h6></div>
                  <div class="col-sm-9 text-secondary">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card mb-5">
              <div class="card-body">
                <div class="row">
                  <div class="col-sm-3"><h6 class="mb-0">First Name</h6></div>
                  <div class="col-sm-9 text-secondary">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card mb-5">
              <div class="card-body">
                <div class="row">
                  <div class="col-sm-3"><h6 class="mb-0">First Name</h6></div>
                  <div class="col-sm-9 text-secondary">
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  </div>


</template>

<style scoped>

</style>