<script setup>
import { ref, onMounted } from 'vue';
// We'll import UserService later when we add data fetching
// import UserService from '@/services/UserService';

const votes = ref([]); // This will hold your vote data
const loading = ref(true); // To show a loading indicator
const error = ref(null); // To display any errors

// A placeholder for fetching votes. This will be updated later.
const fetchVotes = async () => {
  loading.value = true;
  error.value = null;
  try {
    // This is where you'll call your backend service to get votes
    // For now, we'll simulate a delay and some dummy data
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call delay
    votes.value = [
      { id: 1, user: { id: 101, firstName: 'John', lastName: 'Doe', email: 'john@example.com' }, candidate: { id: 1, name: 'Alice', party: 'Green Party' }, voteTimestamp: '2024-01-15T10:00:00' },
      { id: 2, user: { id: 102, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' }, candidate: { id: 2, name: 'Bob', party: 'Blue Party' }, voteTimestamp: '2024-01-15T10:05:00' },
      { id: 3, user: { id: 101, firstName: 'John', lastName: 'Doe', email: 'john@example.com' }, candidate: { id: 2, name: 'Bob', party: 'Blue Party' }, voteTimestamp: '2024-01-15T10:10:00' },
    ];
    console.log("Dummy votes loaded.");
  } catch (err) {
    console.error('Failed to fetch votes:', err);
    error.value = 'Failed to load votes. (Backend not connected yet)';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchVotes();
});
</script>

<template>
  <div class="admin-votes-view">
    <div class="card">
      <div class="card-header">
        <div class="card-title">All Registered Votes</div>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center text-info">
          <i class="bi bi-arrow-clockwise bi-spin"></i> Loading votes...
        </div>
        <div v-if="error" class="alert alert-danger" role="alert">
          <strong>Error:</strong> {{ error }}
        </div>

        <div class="table-responsive" v-if="!loading && !error && votes.length">
          <table class="table table-hover">
            <thead>
            <tr>
              <th>ID</th>
              <th>Voter Name</th>
              <th>Voter Email</th>
              <th>Candidate Name</th>
              <th>Candidate Party</th>
              <th>Vote Timestamp</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="vote in votes" :key="vote.id">
              <td>{{ vote.id }}</td>
              <td>{{ vote.user ? `${vote.user.firstName} ${vote.user.lastName}` : 'N/A' }}</td>
              <td>{{ vote.user?.email || 'N/A' }}</td>
              <td>{{ vote.candidate?.name || 'N/A' }}</td>
              <td>{{ vote.candidate?.party || 'N/A' }}</td>
              <td>{{ vote.voteTimestamp ? new Date(vote.voteTimestamp).toLocaleString() : 'N/A' }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <p v-else-if="!loading && !error" class="text-center text-muted">No votes registered yet.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Basic styling for the card and padding */
.admin-votes-view {
  padding: 20px;
}
.card {
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  padding: 1rem 1.5rem;
}
.card-title {
  font-size: 1.25rem;
  font-weight: 600;
}
.card-body {
  padding: 1.5rem;
}
.table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
}
.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.075);
}
.text-center {
  text-align: center;
}
.text-info {
  color: #0dcaf0;
}
.alert-danger {
  color: #842029;
  background-color: #f8d7da;
  border-color: #f5c2c7;
  padding: 1rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}
.bi-spin {
  animation: bi-spin 1s linear infinite;
}
@keyframes bi-spin {
  to { transform: rotate(360deg); }
}
</style>