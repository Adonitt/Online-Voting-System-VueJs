<script setup lang="ts">
import {ref, onMounted} from 'vue'
import VoteService from '@/services/voteService.js'
import {useAppToast} from '@/composables/useAppToast.js'
import {useLoading} from '@/composables/useLoading.js'

const {isLoading, withLoading} = useLoading()
const toast = useAppToast()

const votingDates = ref([])

onMounted(async () => {
  await withLoading(async () => {
    try {
      const res = await VoteService.getVotingDates()
      votingDates.value = res
    } catch (error: any) {
      toast.showError(error.response?.data?.message || 'Failed to fetch voting dates')
    }
  })
})

const updateVotingDate = async (index: number) => {
  const date = votingDates.value[index]
  date.id = 1

  await withLoading(async () => {
    try {
      await VoteService.updateVotingDate(date.id, {
        partyCreationDeadline: date.partyCreationDeadline,
        votingDay: date.votingDay
      })
      toast.showSuccess('Voting date updated successfully')
    } catch (error: any) {
      toast.showError(error.response?.data?.message || 'Failed to update voting date')
    }
  })
}
</script>
<template>
  <div>
    <h2>Voting Dates</h2>
    <table class="table table-bordered">
      <thead>
      <tr>
        <th>Party Creation Deadline</th>
        <th>Voting Day</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(date, index) in votingDates" :key="index">
        <td>
          <input v-model="date.partyCreationDeadline" type="date" class="form-control"/>
        </td>
        <td>
          <input v-model="date.votingDay" type="date" class="form-control"/>
        </td>
        <td>
          <button class="btn btn-sm btn-primary" @click="updateVotingDate(index)">Update</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>


<style scoped>
</style>
