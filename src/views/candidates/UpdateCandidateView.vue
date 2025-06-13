<script setup>
import {onMounted, reactive, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {usePartyStore} from "@/stores/partyStore"
import {useEnumStore} from "@/stores/enumStore"
import {useAppToast} from "@/composables/useAppToast"
import {useLoading} from "@/composables/useLoading"
import CandidateService from "@/services/candidateService"
import AppCard from "@/components/app/AppCard.vue"
import AppInput from "@/components/app/AppInput.vue"
import AppSelect from "@/components/app/AppSelect.vue"
import BreadCrumb from "@/components/shared/BreadCrumb.vue"

const breadcrumb = [
  {label: 'Dashboard', to: '/'},
  {label: 'Candidates', to: '/candidates'},
  {label: 'Edit Candidate'}
]

const candidate = ref(null)

const loadCandidateById = async (id) => {
  await withLoading(async () => {
    candidate.value = await CandidateService.getCandidateById(id)
  })
}

const {showSuccess, showDialog} = useAppToast()


const route = useRoute()
const router = useRouter()
const toast = useAppToast()
const {isLoading, withLoading} = useLoading()
const partyStore = usePartyStore()
const enumStore = useEnumStore()

const candidateId = +route.params.id

const formData = reactive({
  party: {val: '', isValid: true},
  nationality: {val: '', isValid: true},
  photo: null
})

const formIsValid = ref(true)
const previewImage = ref(null)

const validateForm = () => {
  formIsValid.value = true
  for (const key in formData) {
    if (formData[key] && typeof formData[key] === 'object' && 'val' in formData[key]) {
      formData[key].isValid = !!formData[key].val
      if (!formData[key].isValid) formIsValid.value = false
    }
  }
}

const onFileChange = (e) => {
  const file = (e.target.files?.[0] || null)
  formData.photo = file
  previewImage.value = file ? URL.createObjectURL(file) : null
}

const loadCandidate = async () => {
  const candidate = await CandidateService.getCandidateById(candidateId)
  formData.party.val = candidate.party
  formData.nationality.val = candidate.nationality
}
const onHandleSubmit = async () => {
  validateForm();
  if (!formIsValid.value) return;

  const dto = {
    party: formData.party.val,
    nationality: formData.nationality.val,
  };

  const formDataToSend = new FormData();
  formDataToSend.append(
      "dto",
      new Blob([JSON.stringify(dto)], {type: "application/json"})
  );

  if (formData.photo) {
    formDataToSend.append("photo", formData.photo);
  }

  await withLoading(async () => {
    try {
      await CandidateService.updateCandidate(candidateId, formDataToSend);
      toast.showSuccess(`Candidate with id: ${candidateId} updated successfully`);
      await router.push({name: "candidates"});
    } catch (err) {
      toast.showError(err.response?.data?.message || "Update failed");
      console.log(err)
    }
  });
};

const getFullImageUrl = (path) => {
  // console.log("Symbol path:", path);
  if (!path || typeof path !== "string") return null;

  return "http://localhost:8080/" + path;
};
console.log(candidate.value)

onMounted(async () => {
  await partyStore.getParties()
  await enumStore.loadNationalities()
  await loadCandidateById(candidateId)
  await loadCandidate()
})
</script>
<template>
  <bread-crumb :items="breadcrumb"/>
  <app-card>
    <template #header>
      <h1>Edit Candidate</h1>
    </template>

    <!-- Wait until candidate is loaded -->
    <div v-if="candidate">
      <div class="card">
        <div class="card-body">
          <div class="d-flex flex-column align-items-center text-center">
            <div class="card-body">
              <div class="row">
                <div class="col-sm-3"><h6 class="mb-0">Candidate Number</h6></div>
                <div class="col-sm-9 text-secondary">
                  {{ candidate.candidateNumber }}
                </div>
                <hr>
                <div class="col-sm-3"><h6 class="mb-0">Personal Number</h6></div>
                <div class="col-sm-9 text-secondary">
                  {{ candidate.personalNo }}
                </div>
                <hr>
                <div class="col-sm-3"><h6 class="mb-0">Full Name</h6></div>
                <div class="col-sm-9 text-secondary">
                  {{ candidate.firstName + ' ' + candidate.lastName }}
                </div>
                <hr>
                <div class="col-sm-3"><h6 class="mb-0">Birthdate</h6></div>
                <div class="col-sm-9 text-secondary">
                  {{ candidate.birthDate }}
                </div>
                <hr>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="onHandleSubmit" class="row g-4 p-3">
        <div class="col-md-4 d-flex flex-column align-items-center text-center">
          <img
              v-if="previewImage || candidate.photo"
              :src="previewImage || getFullImageUrl(candidate.photo)"
              :alt="`Image of ${candidate.firstName} ${candidate.lastName}`"
              class="rounded-circle mb-3"
              width="200"
              height="200"
              style="max-width: 300px"
          />

          <p class="fw-semibold">Candidate Photo</p>

          <input
              type="file"
              class="form-control"
              accept="image/*"
              @change="onFileChange"
          />
        </div>

        <div class="col-md-8">
          <div class="row g-3">
            <app-select id="party"
                        label="Party"
                        v-model="formData.party.val"
                        :is-valid="formData.party.isValid"
                        :options="partyStore.partiesForDropdown"/>

            <app-select id="nationality"
                        label="Nationality"
                        v-model="formData.nationality.val"
                        :is-valid="formData.nationality.isValid"
                        :options="enumStore.nationalitiesForDropdown"/>

            <button type="submit" class="btn btn-primary m-3">
              <i class="fas fa-save me-2"></i>
              Update Candidate
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Optionally show loading or error -->
    <div v-else class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3">Loading candidate...</p>
    </div>
  </app-card>
</template>
