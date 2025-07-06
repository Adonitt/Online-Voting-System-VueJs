<template>
  <div class="max-w-5xl mx-auto p-6 font-sans">
    <div class="bg-white shadow-lg rounded-xl p-6">
      <p class="mb-6 text-gray-600 leading-relaxed">
        <strong class="text-gray-800">Note:</strong> Here are the citizens' data used to register a user or a candidate.<br />
        You must use <strong>exact matching data</strong> (personal number, first name, last name, birth date) to register.<br />
        Only citizens of Kosovo can be registered. This table is based on a mock dataset.
      </p>

      <h2 class="text-2xl font-semibold text-gray-800 mb-4">🧑‍🤝‍🧑 Citizens List</h2>

      <!-- Search -->
      <input
          v-model="search"
          type="search"
          placeholder="🔍 Search by name..."
          class="mb-6 w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <!-- Table -->
      <div class="overflow-x-auto rounded-lg border border-gray-200">
        <table class="min-w-full text-sm text-left">
          <thead class="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
          <tr>
            <th class="px-4 py-3">ID</th>
            <th class="px-4 py-3">Personal No</th>
            <th class="px-4 py-3">First Name</th>
            <th class="px-4 py-3">Last Name</th>
            <th class="px-4 py-3">Birth Date</th>
            <th class="px-4 py-3">Nationality</th>
            <th class="px-4 py-3">City</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="person in paginatedData"
              :key="person.id"
              class="border-t hover:bg-gray-100 transition"
          >
            <td class="px-4 py-2">{{ person.id }}</td>
            <td class="px-4 py-2">{{ person.personalNo }}</td>
            <td class="px-4 py-2">{{ person.firstName }}</td>
            <td class="px-4 py-2">{{ person.lastName }}</td>
            <td class="px-4 py-2">{{ formatDate(person.birthDate) }}</td>
            <td class="px-4 py-2">{{ person.nationality }}</td>
            <td class="px-4 py-2">{{ person.city }}</td>
          </tr>
          <tr v-if="filteredData.length === 0">
            <td colspan="7" class="text-center py-6 text-gray-500">
              No results found.
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex justify-between items-center text-sm">
        <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded disabled:opacity-50"
        >
          ⬅ Prev
        </button>

        <span class="text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>

        <button
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
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
