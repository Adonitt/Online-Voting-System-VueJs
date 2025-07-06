<template>

  <p class="mb-6 text-gray-700">
    Here are the citizens data to register as user, or to register a candidate.<br/>
    You must use all data for user, such as personal number, first name, last name, birth date to register.<br/>
    They must be the same.<br/>
    The logic is that only citizens of Kosovo can be registered.<br/>
    This was a mock table.
  </p>

  <div class="container mx-auto p-4 font-sans">
    <h2 class="text-2xl font-bold mb-4">Citizens List</h2>

    <input
        v-model="search"
        type="search"
        placeholder="Search by first or last name..."
        class="mb-4 p-2 border rounded w-full max-w-md"
    />

    <table class="min-w-full border-collapse border border-gray-300">
      <thead class="bg-gray-100">
      <tr>
        <th class="border border-gray-300 p-2 text-left">ID</th>
        <th class="border border-gray-300 p-2 text-left">Personal No</th>
        <th class="border border-gray-300 p-2 text-left">First Name</th>
        <th class="border border-gray-300 p-2 text-left">Last Name</th>
        <th class="border border-gray-300 p-2 text-left">Birth Date</th>
        <th class="border border-gray-300 p-2 text-left">Nationality</th>
        <th class="border border-gray-300 p-2 text-left">City</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="person in paginatedData" :key="person.id" class="hover:bg-gray-50">
        <td class="border border-gray-300 p-2">{{ person.id }}</td>
        <td class="border border-gray-300 p-2">{{ person.personalNo }}</td>
        <td class="border border-gray-300 p-2">{{ person.firstName }}</td>
        <td class="border border-gray-300 p-2">{{ person.lastName }}</td>
        <td class="border border-gray-300 p-2">{{ formatDate(person.birthDate) }}</td>
        <td class="border border-gray-300 p-2">{{ person.nationality }}</td>
        <td class="border border-gray-300 p-2">{{ person.city }}</td>
      </tr>
      <tr v-if="filteredData.length === 0">
        <td class="p-4 text-center" colspan="7">No results found.</td>
      </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="mt-4 flex justify-center items-center space-x-3">
      <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      <span>Page {{ currentPage }} of {{ totalPages }}</span>

      <button
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from "vue";
import axios from "axios";

const data = ref([]);
const search = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;

async function getAllCitizens() {
  try {
    const response = await axios.get(
        "https://online-voting-system-rest-api-1-xvys.onrender.com/rks/suffrages"
    );
    data.value = response.data;
  } catch (error) {
    console.error("Failed to fetch citizens:", error);
  }
}

onMounted(() => {
  getAllCitizens();
});

const filteredData = computed(() => {
  if (!search.value) return data.value;
  const s = search.value.toLowerCase();
  return data.value.filter(
      (p) =>
          p.firstName.toLowerCase().includes(s) ||
          p.lastName.toLowerCase().includes(s)
  );
});

const totalPages = computed(() =>
    Math.ceil(filteredData.value.length / itemsPerPage)
);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredData.value.slice(start, start + itemsPerPage);
});

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

<style scoped>
.container {
  max-width: 900px;
}
</style>
