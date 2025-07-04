<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useLoading } from "@/composables/useLoading.js";
import PartyService from "@/services/partyService.js";
import { useAppToast } from "@/composables/useAppToast.js";
import VoteService from "@/services/voteService.js";
import { useAuthStore } from "@/stores/authStore.js";
import router from "@/router/index.js";
import UserService from "@/services/userService.js";
import BreadCrumb from "@/components/shared/BreadCrumb.vue";

const breadcrumb = [
  { label: "Dashboard", to: "/" },
  { label: "Cast Vote" }
];

const parties = ref([]);
const candidates = ref([]);
const selectedParty = ref(null);
const selectedCandidates = ref([]);
const { isLoading, withLoading } = useLoading();
const store = useAuthStore();
const hasVoted = computed(() => store.loggedInUser?.hasVoted);
const user = ref(null);

const votingDay = ref(null);

onMounted(async () => {
  try {
    await withLoading(async () => {
      parties.value = await PartyService.getAllParties();
      user.value = await UserService.getUserById(store.loggedInUser?.id);
    });
  } catch (error) {
    console.log(error.response?.data);
  }
  const res = await VoteService.getVotingDates();
  votingDay.value = res.votingDay;
});

watch(selectedParty, async (partyId) => {
  if (!partyId) {
    candidates.value = [];
    return;
  }

  await withLoading(async () => {
    try {
      const party = await PartyService.getPartyById(partyId);
      candidates.value = party.candidates || [];
      console.log("Candidates:", party.candidates);
      console.log("Party:", party);
    } catch (error) {
      toast.showError(error.response?.data?.message || "Error occurred!");
      console.log("Error fetching party:", error);
    }
  });
});

const getFullImageUrl = (path) => {
  if (!path || typeof path !== "string") return null;
  return "https://online-voting-system-rest-api-5.onrender.com/" + path;
};

const selectParty = (partyId) => {
  if (selectedParty.value === partyId) {
    selectedParty.value = null;
    selectedCandidates.value = [];
  } else {
    selectedParty.value = partyId;
    selectedCandidates.value = [];
  }
};

const toast = useAppToast();

const submitVote = async () => {
  await withLoading(async () => {
    if (!selectedParty.value) {
      toast.showWarning("Please select a party!");
      return;
    }

    if (
        selectedCandidates.value.length === 0 ||
        selectedCandidates.value.length > 5
    ) {
      toast.showWarning("Please select between 1 and 5 candidates.");
      return;
    }

    const votePayload = {
      party: selectedParty.value,
      candidates: selectedCandidates.value
    };
    try {
      await VoteService.castVote(votePayload);
      toast.showSuccess("You have successfully voted!");
      selectedParty.value = null;
      selectedCandidates.value = [];
      await router.push({
        name: "my-vote-details",
        params: { id: store.loggedInUser?.id }
      });
    } catch (error) {
      if (hasVoted.value === true) {
        toast.showError("You have already voted!");
        await router.push({
          name: "my-vote-details",
          params: { id: store.loggedInUser?.id }
        });
      }
      console.error("Vote error response:", error);
      toast.showError(
          error.response?.data?.message || "There was an error casting your vote!"
      );
    }
  });
};

const daysLeft = computed(() => {
  const today = new Date();
  const voteDate = new Date(votingDay.value);
  const diffTime = voteDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});
</script>

<template>
  <bread-crumb :items="breadcrumb" />

  <div v-if="user">
    <div class="alert alert-warning mt-3" v-if="daysLeft > 0">
      🗓️ <strong>{{ daysLeft }}</strong>
      day<span v-if="daysLeft > 1">s</span> left until voting day! Voting day is
      on: <b>{{ votingDay }}</b>
    </div>

    <div class="alert alert-success mt-3" v-else-if="daysLeft === 0">
      🗳️ <strong>Today is the voting day! </strong>
      <b>{{ votingDay }}</b>
    </div>

    <div class="alert alert-secondary mt-3" v-else>
      🕓 Voting day has passed. Voting day was on: <b>{{ votingDay }}</b>
    </div>
  </div>

  <section id="vote-section" v-if="daysLeft === 0">
    <div v-if="user && user.hasVoted === true" class="flex justify-center mt-10">
      <div
          class="bg-green-50 border border-green-400 text-green-700 p-6 rounded-xl shadow-md w-full max-w-xl text-center"
      >
        <div class="flex items-center justify-center mb-4">
          <svg
              class="w-6 h-6 text-green-600 mr-2"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="height: 40px"
          >
            <path d="M9 12l2 2l4 -4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <h2 class="text-xl font-semibold">You have already voted</h2>
        </div>
        <p class="mb-3">✅ Thank you for participating in the election.</p>
        <p class="mb-2 text-sm">Want to review your vote?</p>
        <router-link
            :to="{ name: 'my-vote-details', params: { id: store.loggedInUser?.id } }"
            class="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition btn btn-secondary"
        >
          View Vote Details
        </router-link>
      </div>
    </div>

    <section id="vote-section" v-else>
      <div class="row">
        <div class="col-md-4">
          <h2 class="text-2xl font-bold mb-3">Select a Party</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div
                v-for="party in parties"
                :key="party.id"
                @click="selectParty(party.id)"
                class="card cursor-pointer border rounded-xl hover:shadow-lg transition-all"
                :class="[
                'card',
                selectedParty === party.id ? 'border border-primary shadow' : 'border'
              ]"
                style="cursor: pointer;"
            >
              <div class="card-body p-4 flex flex-col items-center text-center">
                <img
                    v-if="party.symbol"
                    :src="getFullImageUrl(party.symbol)"
                    alt="Party symbol"
                    :width="50"
                    height="50"
                />
                <h3 class="text-lg font-semibold">{{ party.name }}</h3>
                <span class="text-lg font-semibold"
                >Party Number: <b>{{ party.id }}</b></span
                ><br /><br />
                <router-link
                    :to="{ name: 'partyDetails', params: { id: party.id } }"
                    class="btn btn-secondary"
                >Details</router-link
                >
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedParty" class="col-md-8">
          <div class="row">
            <div v-if="candidates.length === 0" class="text-muted text-center p-4">
              No candidates available for the selected party.
            </div>
            <div v-else>
              <h1 class="w-full mb-3">Select Candidates</h1>
              <div class="col-12">
                <div class="d-flex flex-wrap gap-3">
                  <label
                      v-for="candidate in candidates"
                      :key="candidate.id"
                      class="card p-3"
                      :class="{
                      'border border-2 border-primary shadow': selectedCandidates.includes(candidate.id),
                      'border border-light': !selectedCandidates.includes(candidate.id)
                    }"
                      style="width: 200px; min-width: 180px; cursor: pointer;"
                  >
                    <input
                        type="checkbox"
                        :value="candidate.id"
                        v-model="selectedCandidates"
                        class="d-none"
                    />

                    <div>
                      <div class="media d-flex align-items-center">
                        <small class="text-muted m-3"><b>{{ candidate.candidateNumber }}</b></small>
                        <div class="me-3">
                          <img
                              :src="getFullImageUrl(candidate.photo)"
                              width="50"
                              height="50"
                              style="border-radius: 50%"
                              alt="Candidate"
                          />
                        </div>
                        <div class="media-body">
                          <p class="mb-1">
                            {{ candidate.firstName }} {{ candidate.lastName }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="selectedParty" class="text-center mt-6">
        <button
            @click="submitVote"
            :disabled="isLoading"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition btn btn-primary mb-3"
        >
          {{ isLoading ? "Submitting..." : "Submit Vote" }}
        </button>
      </div>
    </section>
  </section>

  <section v-else-if="daysLeft < 0 && user && user.hasVoted === true">
    <div class="flex justify-center mt-10">
      <div
          class="bg-green-50 border border-green-400 text-green-700 p-6 rounded-xl shadow-md w-full max-w-xl text-center"
      >
        <div class="flex items-center justify-center mb-4">
          <svg
              class="w-6 h-6 text-green-600 mr-2"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="height: 40px"
          >
            <path d="M9 12l2 2l4 -4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <h2 class="text-xl font-semibold">You voted on {{ votingDay }}</h2>
        </div>
        <p class="mb-3">✅ Thank you for participating in the election.</p>
        <p class="mb-2 text-sm">Want to review your vote?</p>
        <router-link
            :to="{ name: 'my-vote-details', params: { id: store.loggedInUser?.id } }"
            class="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition btn btn-secondary"
        >
          View Vote Details
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped></style>