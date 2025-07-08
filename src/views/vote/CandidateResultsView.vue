<script setup>
import {ref, computed, watch, onMounted} from 'vue'
import {useLoading} from '@/composables/useLoading.js'
import VoteService from '@/services/voteService.js'
import PartyChart from '@/components/shared/PartyChart.vue'

const candidateResults = ref([])
const selectedParty = ref('')
const votingDay = ref(null)
const showFutureVotingMessage = ref(false)

const {withLoading} = useLoading()

const loadCandidateResults = async () => {
  candidateResults.value = await VoteService.getCandidateResults()
}

const partyOptions = computed(() => {
  const uniqueParties = new Set(candidateResults.value.map(c => c.partyName))
  return Array.from(uniqueParties)
})

watch(partyOptions, (newParties) => {
  if (newParties.length && !selectedParty.value) {
    selectedParty.value = newParties[0]
  }
})

const filteredCandidates = computed(() => {
  if (!selectedParty.value) return []
  return candidateResults.value.filter(c => c.partyName === selectedParty.value)
})

const candidateChartData = computed(() => {
  const candidates = filteredCandidates.value
  return {
    labels: candidates.map(c => c.firstName),
    datasets: [{
      label: `Votes for ${selectedParty.value}`,
      data: candidates.map(c => c.totalVotes),
      backgroundColor: candidates.map(() => `hsl(${Math.random() * 360}, 70%, 70%)`)
    }]
  }
})

const candidateChartOptions = {
  indexAxis: 'y',
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Candidate Vote Results'
    },
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Votes'
      }
    }
  }
}

// Helper to parse "YYYY-MM-DD" into Date object
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split('-')
  return new Date(parts[0], parts[1] - 1, parts[2])
}

onMounted(async () => {
  await withLoading(async () => {
    // Merr daten e votimit
    const votingDatesRes = await VoteService.getVotingDates()
    if (votingDatesRes.length) {
      votingDay.value = parseDate(votingDatesRes[0].votingDay)
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const voteDate = new Date(votingDay.value.getFullYear(), votingDay.value.getMonth(), votingDay.value.getDate())

      // Kontrollo nëse votimi është në të ardhmen
      showFutureVotingMessage.value = today < voteDate
    }

    if (!showFutureVotingMessage.value) {
      await loadCandidateResults()
    }
  })
})
</script>

<template>
  <div class="mt-4 container">
    <h2 class="mb-3">Candidate Vote Results</h2>

    <div v-if="showFutureVotingMessage" class="alert alert-info" role="alert">
      Voting day is on <strong>{{ votingDay?.toLocaleDateString() }}</strong>. Results will be available after that date.
    </div>

    <div v-else>
      <div>
        <label for="party-select" class="form-label">Select Party:</label>
        <select id="party-select" v-model="selectedParty" class="form-select mb-4">
          <option disabled value="">-- Select Party --</option>
          <option v-for="party in partyOptions" :key="party" :value="party">
            {{ party }}
          </option>
        </select>
        <div v-if="filteredCandidates.length">
          <ul class="list-group mb-4">
            <li
                class="list-group-item d-flex justify-content-between align-items-center"
                v-for="candidate in filteredCandidates"
                :key="candidate.candidateId"
            >
              {{ candidate.firstName + ' ' + (candidate.lastName || '') }}
              <span class="badge bg-primary rounded-pill">{{ candidate.totalVotes }}</span>
            </li>
          </ul>

          <div class="d-flex justify-content-center">
            <div style="max-width: 600px; width: 100%;">
              <PartyChart :data="candidateChartData" :options="candidateChartOptions" />
            </div>
          </div>
        </div>

        <div v-else>
          <p>No candidates found for this party.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
=  .list-group-item {
    font-size: 0.9rem;
  }
  select.form-select {
    font-size: 0.9rem;
  }
}
</style>
