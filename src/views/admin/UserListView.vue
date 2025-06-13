<script setup>
import { ref, onMounted } from 'vue';
import UserService from '@/services/UserService'; // Import the updated service

const users = ref([]);
const loading = ref(true);
const error = ref(null);
const showEditModal = ref(false);
const editingUser = ref(null);
const saveError = ref(null);

const availableRoles = ['USER', 'ADMIN'];

const availableNationalities = [
  'ALBANIAN',
  'BOSNIAN',
  'TURKISH',
  'ASKHALI',
  'EGYPTIAN',
  'ROMANIAN'
];

const availableCities = [
  'PODUJEVO',
  'PRISTINA',
  'FERIZAJ',
  'GJILAN',
  'MITROVICA',
  'PRIZREN',
  'GJAKOVE',
  'MALISHEVE',
  'PEJE',
  'DRENICE',
  'DRENAS',
  'SKENDERAJ'
];

const fetchUsers = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await UserService.getAllUsers();
    users.value = data;
  } catch (err) {
    console.error('Failed to fetch users:', err);
    error.value = err.response?.data?.message || err.message || 'An unknown error occurred.';
  } finally {
    loading.value = false;
  }
};

const openEditModal = (user) => {
  // Create a deep copy to avoid direct mutation of the original user object in the list
  editingUser.value = {
    ...user,
    // Ensure all editable fields exist and are correctly initialized.
    nationality: user.nationality || null, // Initialize with user's nationality or null
    city: user.city || null, // Initialize with user's city or null
  };
  saveError.value = null; // Clear previous errors
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingUser.value = null;
};

const saveUserChanges = async () => {
  saveError.value = null;
  if (!editingUser.value) return;

  try {
    // Construct the payload with all editable attributes
    // Only send the fields that are being displayed/edited based on the role
    const payload = {
      id: editingUser.value.id, // ID is needed for the PUT request URL
      email: editingUser.value.email,
      role: editingUser.value.role,
    };

    // Conditionally add other fields if the user is NOT an admin in the modal
    // hasVoted is explicitly excluded from this section now
    if (editingUser.value.role !== 'ADMIN') {
      // payload.hasVoted = editingUser.value.hasVoted; // Removed
      payload.nationality = editingUser.value.nationality;
      payload.city = editingUser.value.city;
    }

    const updatedData = await UserService.updateUser(editingUser.value.id, payload);

    // Update the user in the local `users` array with the data returned from the backend
    const index = users.value.findIndex(u => u.id === updatedData.id);
    if (index !== -1) {
      users.value[index] = updatedData;
    }

    closeEditModal();
    // In a real application, you'd show a success message here, e.g., using a toast library.
  } catch (err) {
    console.error('Failed to save user changes:', err);
    saveError.value = err.response?.data?.message || err.message || 'Failed to save changes.';
  }
};

onMounted(() => {
  fetchUsers();
  // TODO: Add logic here to fetch availableNationalities and availableCities
  // from your backend's enum endpoints, if you have them.
  // For example, if you have an EnumService:
  // const enums = await EnumService.getEnums();
  // availableNationalities.value = enums.nationalities;
  // availableCities.value = enums.cities;
});
</script>

<template>
  <div class="admin-users-view">
    <div class="card">
      <div class="card-header">
        <div class="card-title">All Registered Users</div>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center text-info">
          <i class="bi bi-arrow-clockwise bi-spin"></i> Loading users...
        </div>
        <div v-if="error" class="alert alert-danger" role="alert">
          <strong>Error:</strong> {{ error }}
        </div>

        <div class="table-responsive" v-if="!loading && !error && users.length">
          <table class="table table-hover">
            <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Has Voted</th>
              <th>Role</th>
              <th>Nationality</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.email }}</td>
              <td>
                  <span :class="{'badge bg-success': user.hasVoted, 'badge bg-secondary': !user.hasVoted}">
                    {{ user.hasVoted ? 'Yes' : 'No' }}
                  </span>
              </td>
              <td>
                <span v-if="user.role" class="badge bg-primary me-1">
                  {{ user.role }}
                </span>
                <span v-else class="text-muted">N/A</span>
              </td>
              <td>{{ user.nationality || 'N/A' }}</td>
              <td>{{ user.city || 'N/A' }}</td>
              <td>
                <button @click="openEditModal(user)" class="btn btn-sm btn-primary">
                  <i class="bi bi-pencil-square"></i> Edit
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <p v-else-if="!loading && !error" class="text-center text-muted">No users registered yet.</p>
      </div>
    </div>

    <!-- User Edit Modal -->
    <div v-if="showEditModal" class="modal fade show" style="display: block;" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit User: {{ editingUser.email }}</h5>
            <button type="button" class="btn-close" @click="closeEditModal"></button>
          </div>
          <form @submit.prevent="saveUserChanges">
            <div class="modal-body">
              <div class="mb-3">
                <label for="editEmail" class="form-label">Email:</label>
                <input
                    type="email"
                    id="editEmail"
                    v-model="editingUser.email"
                    class="form-control"
                    required
                />
              </div>

              <!-- Conditional rendering: Show Nationality, City ONLY if NOT Admin -->
              <template v-if="editingUser.role !== 'ADMIN'">
                <!-- The 'hasVoted' input field has been removed from here -->
                <div class="mb-3">
                  <label for="editNationality" class="form-label">Nationality:</label>
                  <select
                      id="editNationality"
                      v-model="editingUser.nationality"
                      class="form-select"
                  >
                    <option :value="null" disabled>Select Nationality</option>
                    <option v-for="natOption in availableNationalities" :key="natOption" :value="natOption">
                      {{ natOption }}
                    </option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="editCity" class="form-label">City:</label>
                  <select
                      id="editCity"
                      v-model="editingUser.city"
                      class="form-select"
                  >
                    <option :value="null" disabled>Select City</option>
                    <option v-for="cityOption in availableCities" :key="cityOption" :value="cityOption">
                      {{ cityOption }}
                    </option>
                  </select>
                </div>
              </template>

              <div class="mb-3">
                <label class="form-label">Role:</label>
                <div v-for="roleOption in availableRoles" :key="roleOption" class="form-check">
                  <input
                      class="form-check-input"
                      type="radio"
                      :id="`role-${roleOption}`"
                      :value="roleOption"
                      v-model="editingUser.role"
                      name="userRole"
                  />
                  <label class="form-check-label" :for="`role-${roleOption}`">
                    {{ roleOption }}
                  </label>
                </div>
              </div>

              <div v-if="saveError" class="alert alert-danger mt-3" role="alert">
                {{ saveError }}
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeEditModal">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- Modal Backdrop -->
    <div v-if="showEditModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<style scoped>
/* Add any specific styles here if needed, otherwise rely on Bootstrap */
.admin-users-view {
  padding: 20px; /* Example padding */
}

/* Modal specific overrides if needed */
.modal.show {
  display: block; /* Ensure the modal is visible */
}
.modal-backdrop.show {
  opacity: 0.5; /* Ensure backdrop is visible */
}
</style>
