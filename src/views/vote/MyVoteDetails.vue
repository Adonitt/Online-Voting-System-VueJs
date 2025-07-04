<script setup>
import {onMounted, ref} from "vue";
import VoteService from "@/services/voteService.js";
import {useAuthStore} from "@/stores/authStore.js";
import {useLoading} from "@/composables/useLoading.js";
import AppCard from "@/components/app/AppCard.vue";

const voteDetails = ref([]);
const store = useAuthStore();

const {isLoading, withLoading} = useLoading()
onMounted(async () => {
  await withLoading(async () => {
    try {
      const result = await VoteService.getVoteById(store.loggedInUser?.id);
      if (result) {
        voteDetails.value = result;
        console.log("Vote details:", voteDetails.value);
      }
    } catch (error) {
      console.error("Error fetching vote details:", error);
    }
  })
});
</script>
<template>

  <app-card
      class="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl p-8 max-w-5xl mx-auto mt-10 col-md-5 mt-5">
    <template #header>
      <h2 class="text-3xl font-bold text-blue-800 mb-8 text-center">
        🗳️ Your Vote Details
      </h2>
    </template>
    <div v-if="voteDetails.length">
      <div
          v-for="vote in voteDetails"
          :key="vote.partyId"
          class="bg-white bg-opacity-90 shadow rounded-2xl p-6 border border-gray-200 mb-6 transition hover:shadow-lg"
      >
        <div class="space-y-3 text-gray-700">
          <p>
            <span class="font-medium text-gray-800">👤 User: </span>
            <span class="ml-1 text-blue-900"><b>{{ vote.user }}</b></span>
          </p>

          <p>
            <span class="font-medium text-gray-800">🏷️ Selected Party Nr: </span>
            <span class="ml-1"><b>{{ vote.partyId }}</b></span>
          </p>

          <p>
            <span class="font-medium text-gray-800">🎉 Party Name: </span>
            <span class="ml-1"><b>{{ vote.party }}}</b></span>
          </p>

          <div>
            <p class="font-medium text-gray-800 mb-1">🧑‍🤝‍🧑 Selected Candidates: </p>
            <ol class="list-disc list-inside ml-4 text-gray-800">
              <li v-for="name in vote.candidateNames" :key="name"><b>{{ name }}</b></li>
            </ol>
          </div>

          <p>
            <span class="font-medium text-gray-800">⏰ Voting Time: </span>
            <span class="ml-1"><b>{{ new Date(vote.voteTimestamp).toLocaleString() }}</b></span>
          </p>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 mt-12">
      <p class="text-lg font-medium">🕒 You have not voted yet or no vote data was found.</p>
      <router-link :to="{name:'cast-vote'}">Vote now</router-link>
    </div>
  </app-card>
</template>


<style scoped>

</style>