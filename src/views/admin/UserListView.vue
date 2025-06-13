<script setup>
import { ref, onMounted } from 'vue';
import UserService from '@/services/UserService'; // Import the updated service

const users = ref([]);
const loading = ref(true);
const error = ref(null);

const showEditModal = ref(false);
const editingUser = ref(null);
const saveError = ref(null);

const showDetailsModal = ref(false);
const viewingUser = ref(null);

const showDeleteConfirmModal = ref(false);
const userToDelete = ref(null);
const deleteError = ref(null);


// Hardcode available roles based on your backend enum (USER, ADMIN)
const availableRoles = ['USER', 'ADMIN'];

// Updated with ALL specified nationalities
const availableNationalities = [
  'ALBANIAN',
  'BOSNIAN',
  'TURKISH',
  'ASKHALI',
  'EGYPTIAN',
  'ROMANIAN'
];

// Updated with ALL specified cities
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
    // Construct the payload with ALL editable attributes, including the newly added ones.
    const payload = {
      id: editingUser.value.id, // ID is needed for the PUT request URL
      email: editingUser.value.email,
      personalNo: editingUser.value.personalNo, // Added for editing
      firstName: editingUser.value.firstName,   // Added for editing
      lastName: editingUser.value.lastName,     // Added for editing
      birthDate: editingUser.value.birthDate,   // Added for editing
      role: editingUser.value.role,
      hasVoted: editingUser.value.hasVoted, // Keep hasVoted in payload if your backend uses it for updates
    };

    // Conditionally add other fields if the user is NOT an admin in the modal
    if (editingUser.value.role !== 'ADMIN') {
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

// --- New: View Details functionality ---
const openDetailsModal = (user) => {
  viewingUser.value = user;
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  viewingUser.value = null;
};

// --- New: Delete User functionality ---
const openDeleteConfirmModal = (user) => {
  userToDelete.value = user;
  deleteError.value = null; // Clear previous errors
  showDeleteConfirmModal.value = true;
};

const closeDeleteConfirmModal = () => {
  showDeleteConfirmModal.value = false;
  userToDelete.value = null;
};

const deleteUser = async () => {
  deleteError.value = null;
  if (!userToDelete.value) return;

  // --- NEW: Prevent deletion of ADMIN users ---
  if (userToDelete.value.role === 'ADMIN') {
    deleteError.value = 'Cannot delete an administrator account.';
    return; // Stop the function execution
  }
  // --- END NEW ---

  try {
    await UserService.deleteUser(userToDelete.value.id);
    // Remove the user from the local `users` array
    users.value = users.value.filter(u => u.id !== userToDelete.value.id);
    closeDeleteConfirmModal();
    // Success message
  } catch (err) {
    console.error('Failed to delete user:', err);
    deleteError.value = err.response?.data?.message || err.message || 'Failed to delete user.';
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
                <button @click="openDetailsModal(user)" class="btn btn-sm btn-info me-2">
                  <i class="bi bi-info-circle"></i> Details
                </button>
                <button @click="openEditModal(user)" class="btn btn-sm btn-primary me-2">
                  <i class="bi bi-pencil-square"></i> Edit
                </button>
                <!-- NEW: Disable delete button for ADMIN roles -->
                <button
                    @click="openDeleteConfirmModal(user)"
                    class="btn btn-sm"
                    :class="{'btn-danger': user.role !== 'ADMIN', 'btn-secondary disabled': user.role === 'ADMIN'}"
                    :disabled="user.role === 'ADMIN'"
                    :title="user.role === 'ADMIN' ? 'Cannot delete administrator' : 'Delete user'"
                >
                  <i class="bi bi-trash"></i> Delete
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

              <!-- NEW: Personal Number -->
              <div class="mb-3">
                <label for="editPersonalNo" class="form-label">Personal No:</label>
                <input
                    type="text"
                    id="editPersonalNo"
                    v-model="editingUser.personalNo"
                    class="form-control"
                    required
                />
              </div>

              <!-- NEW: First Name -->
              <div class="mb-3">
                <label for="editFirstName" class="form-label">First Name:</label>
                <input
                    type="text"
                    id="editFirstName"
                    v-model="editingUser.firstName"
                    class="form-control"
                    required
                />
              </div>

              <!-- NEW: Last Name -->
              <div class="mb-3">
                <label for="editLastName" class="form-label">Last Name:</label>
                <input
                    type="text"
                    id="editLastName"
                    v-model="editingUser.lastName"
                    class="form-control"
                    required
                />
              </div>

              <!-- NEW: Birth Date -->
              <div class="mb-3">
                <label for="editBirthDate" class="form-label">Birth Date:</label>
                <input
                    type="date"
                    id="editBirthDate"
                    v-model="editingUser.birthDate"
                    class="form-control"
                    required
                />
              </div>

              <!-- Conditional rendering: Show Nationality, City ONLY if NOT Admin -->
              <template v-if="editingUser.role !== 'ADMIN'">
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

    <!-- User Details Modal -->
    <div v-if="showDetailsModal" class="modal fade show" style="display: block;" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">User Details: {{ viewingUser.email }}</h5>
            <button type="button" class="btn-close" @click="closeDetailsModal"></button>
          </div>
          <div class="modal-body">
            <dl class="row">
              <dt class="col-sm-4">ID:</dt>
              <dd class="col-sm-8">{{ viewingUser.id }}</dd>

              <dt class="col-sm-4">Personal No:</dt>
              <dd class="col-sm-8">{{ viewingUser.personalNo }}</dd>

              <dt class="col-sm-4">First Name:</dt>
              <dd class="col-sm-8">{{ viewingUser.firstName }}</dd>

              <dt class="col-sm-4">Last Name:</dt>
              <dd class="col-sm-8">{{ viewingUser.lastName }}</dd>

              <dt class="col-sm-4">Email:</dt>
              <dd class="col-sm-8">{{ viewingUser.email }}</dd>

              <dt class="col-sm-4">Birth Date:</dt>
              <dd class="col-sm-8">{{ viewingUser.birthDate }}</dd>

              <dt class="col-sm-4">Nationality:</dt>
              <dd class="col-sm-8">{{ viewingUser.nationality || 'N/A' }}</dd>

              <dt class="col-sm-4">City:</dt>
              <dd class="col-sm-8">{{ viewingUser.city || 'N/A' }}</dd>

              <dt class="col-sm-4">Has Voted:</dt>
              <dd class="col-sm-8">
                <span :class="{'badge bg-success': viewingUser.hasVoted, 'badge bg-secondary': !viewingUser.hasVoted}">
                  {{ viewingUser.hasVoted ? 'Yes' : 'No' }}
                </span>
              </dd>

              <dt class="col-sm-4">Role:</dt>
              <dd class="col-sm-8">{{ viewingUser.role || 'N/A' }}</dd>

              <dt class="col-sm-4">Registered At:</dt>
              <dd class="col-sm-8">{{ viewingUser.registeredAt }}</dd>

              <dt class="col-sm-4">Updated At:</dt>
              <dd class="col-sm-8">{{ viewingUser.updatedAt || 'N/A' }}</dd>

              <dt class="col-sm-4">Updated By:</dt>
              <dd class="col-sm-8">{{ viewingUser.updatedBy || 'N/A' }}</dd>
            </dl>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDetailsModal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- User Delete Confirmation Modal -->
    <div v-if="showDeleteConfirmModal" class="modal fade show" style="display: block;" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Deletion</h5>
            <button type="button" class="btn-close" @click="closeDeleteConfirmModal"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete user: <strong>{{ userToDelete.email }}</strong> (ID: {{ userToDelete.id }})?</p>
            <!-- Display the error message here -->
            <div v-if="deleteError" class="alert alert-danger mt-3" role="alert">
              {{ deleteError }}
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDeleteConfirmModal">Cancel</button>
            <button
                type="button"
                class="btn btn-danger"
                @click="deleteUser"
                :disabled="userToDelete && userToDelete.role === 'ADMIN'"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div v-if="showEditModal || showDetailsModal || showDeleteConfirmModal" class="modal-backdrop fade show"></div>
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