<!-- get monsters, add monster, detail 1 monster, update monster, delete monster -->

<template>
  <div class="p-8 bg-slate-50 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-slate-800 font-extrabold text-3xl mb-1">Monster Management</h1>
      <button
        @click="openModal()"
        class="bg-blue-600 text-white px-4 py-2 shadow-md rounded-lg hover:bg-blue-700 transition-all hover:translate-y-0.5"
      >
        + Add Monster
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <div v-else class="p-8">
      <div
        class="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm border border-slate-200"
      >
        <Searchbar v-model="searchQuery" placeholder="Cari monster..." />
        <!-- To do: tambahkan fitur sorting based on level -wiko -->
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-blue-400 text-slate-800 uppercase text-xs font-semibold">
            <tr>
              <th class="px-6 py-3">Name</th>
              <th class="px-6 py-3">HP</th>
              <th class="px-6 py-3">Level</th>
              <th class="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="monster in filterMonsters" :key="monster.id" class="hover:bg-slate-50">
              <td class="px-6 py-4 font-medium text-slate-800">{{ monster.name }}</td>
              <td class="px-6 py-4 text-slate-500">{{ monster.hp }}</td>
              <td class="px-6 py-4 text-slate-500">{{ monster.level }}</td>
              <td class="px-6 py-4">
                <button
                  @click="viewDetail(monster.id)"
                  class="text-blue-600 hover:underline font-medium"
                >
                  View Detail
                </button>
                <button
                  @click="openModal(monster)"
                  class="p-2 ml-7 shadow-md text-blue-950 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  @click="deleteMonster(monster.id)"
                  class="p-2 ml-7 shadow-md text-red-950 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Detail Monster -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl border border-slate-200">
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-2xl font-bold text-slate-800">Monster Detail</h2>
          <button
            @click="showDetailModal = false"
            class="text-slate-400 hover:text-slate-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <div v-if="detailLoading" class="flex justify-center py-5">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <div v-else-if="selectedMonster" class="space-y-4">
          <div class="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <div
              class="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold"
            >
              {{ selectedMonster.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-slate-500 text-sm">Monster Name</p>
              <p class="text-xl font-bold text-slate-800">{{ selectedMonster.name }}</p>
            </div>
          </div>

          <!-- To do: atur warna-->
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 border border-slate-100 rounded-lg">
              <p class="text-slate-500 text-sm font-medium">HP</p>
              <p class="text-lg font-bold text-blue-600">
                {{ selectedMonster.hp }}
              </p>
            </div>
            <div class="p-4 border border-slate-100 rounded-lg">
              <p class="text-slate-500 text-sm font-medium">Attack</p>
              <p class="text-lg font-bold text-blue-600">
                {{ selectedMonster.attack }}
              </p>
            </div>
            <div class="p-4 border border-slate-100 rounded-lg">
              <p class="text-slate-500 text-sm font-medium">Defense</p>
              <p class="text-lg font-bold text-blue-600">
                {{ selectedMonster.defense }}
              </p>
            </div>
            <div class="p-4 border border-slate-100 rounded-lg">
              <p class="text-slate-500 text-sm font-medium">XP Reward</p>
              <p class="text-lg font-bold text-blue-600">
                {{ selectedMonster.xp_reward }}
              </p>
            </div>
            <div class="p-4 border border-slate-100 rounded-lg">
              <p class="text-slate-500 text-sm font-medium">Gold Reward</p>
              <p class="text-lg font-bold text-blue-600">
                {{ selectedMonster.gold_reward }}
              </p>
            </div>
            <div class="p-4 border border-slate-100 rounded-lg">
              <p class="text-slate-500 text-sm font-medium">Level</p>
              <p class="text-lg font-bold text-blue-600">
                {{ selectedMonster.level }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-end">
          <button
            @click="showDetailModal = false"
            class="bg-slate-800 text-white px-6 py-2 rounded-lg shadow-md hover:bg-slate-900 transition-all hover:translate-y-0.5"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Tambah Monster -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-blue-50 rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 class="text-xl font-bold text-slate-800 mb-4">
          {{ isEdit ? 'Edit' : 'Add New' }} Monster
        </h2>
        <label text-md text-slate-800 mb-5>Monster Name:</label>
        <input
          v-model="newMonster.name"
          type="text"
          placeholder="Monster Name"
          class="w-full border border-slate-300 rounded-lg p-2 mb-4 mt-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <div class="flex items-center mb-4">
          <label text-md text-slate-800 mb-5>Monster HP:</label>
          <input
            v-model="newMonster.hp"
            type="integer"
            placeholder="Monster Health Point"
            class="border border-slate-300 rounded-lg p-2 ml-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div class="flex items-center mb-4">
          <label text-md text-slate-800 mb-5>Monster Attack:</label>
          <input
            v-model="newMonster.attack"
            type="integer"
            placeholder="Monster Attack"
            class="border border-slate-300 rounded-lg p-2 ml-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div class="flex items-center mb-4">
          <label text-md text-slate-800 mb-5>Monster Defense:</label>
          <input
            v-model="newMonster.defense"
            type="integer"
            placeholder="Monster Defense"
            class="border border-slate-300 rounded-lg p-2 ml-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div class="flex items-center mb-4">
          <label text-md text-slate-800 mb-5>Monster XP Reward:</label>
          <input
            v-model="newMonster.xp_reward"
            type="integer"
            placeholder="Monster XP Reward"
            class="border border-slate-300 rounded-lg p-2 ml-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div class="flex items-center mb-4">
          <label text-md text-slate-800 mb-5>Monster Gold Reward:</label>
          <input
            v-model="newMonster.gold_reward"
            type="integer"
            placeholder="Monster Gold Reward"
            class="border border-slate-300 rounded-lg p-2 ml-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div class="flex items-center mb-4">
          <label text-md text-slate-800 mb-5>Monster Level:</label>
          <input
            v-model="newMonster.level"
            type="integer"
            placeholder="Monster Level"
            class="border border-slate-300 rounded-lg p-2 ml-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div class="flex justify-end space-x-3">
          <button @click="showModal = false" class="text-slate-500 hover:text-slate-700">
            Cancel
          </button>
          <button
            @click="saveMonster"
            :disabled="isSubmit"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 hover:translate-y-0.5 transition-all"
          >
            Add Monster
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Searchbar from '@/components/Searchbar.vue'

const monsters = ref([])
const searchQuery = ref('')
const loading = ref(true)

const isEdit = ref(false)
const showModal = ref(false)
const newMonster = ref({
  name: '',
  hp: 50,
  attack: 10,
  defense: 2,
  xp_reward: 0,
  gold_reward: 0,
  level: 1,
})
const isSubmit = ref(false)

const showDetailModal = ref(false)
const selectedMonster = ref(null)
const detailLoading = ref(false)

const fetchMonsters = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:8000/api/monsters')
    monsters.value = res.data.data
  } catch (error) {
    console.error('Gagal memuat data monsters', error)
  } finally {
    loading.value = false
  }
}

const viewDetail = async (id) => {
  showDetailModal.value = true
  detailLoading.value = true
  try {
    const res = await axios.get(`http://localhost:8000/api/monsters/${id}`)
    selectedMonster.value = res.data.data
  } catch (error) {
    console.error('Gagal mengambil detail monster')
    alert('Data monster tidak ditemukan')
    showDetailModal.value = false
  } finally {
    detailLoading.value = false
  }
}

const deleteMonster = async (id) => {
  if (confirm('Hapus monster ini?')) {
    try {
      await axios.delete(`http://localhost:8000/api/monsters/${id}`)
      fetchMonsters()
    } catch (error) {
      console.error('Delete error:', error.response)
    }
  }
}

const openModal = (data = null) => {
  isEdit.value = !!data
  newMonster.value = data
    ? { ...data }
    : { name: '', hp: 50, attack: 10, defense: 2, xp_reward: 0, gold_reward: 0, level: 1 }
  showModal.value = true
}

const saveMonster = async () => {
  if (isSubmit.return) return (isSubmit.value = true)
  try {
    if (isEdit.value) {
      await axios.put(`http://localhost:8000/api/monsters/${newMonster.value.id}`, newMonster.value)
    } else {
      await axios.post('http://localhost:8000/api/monsters', newMonster.value)
    }
    showModal.value = false
    // newMonster.value.name = ''
    // newMonster.value.hp = 50
    // newMonster.value.attack = 10
    // newMonster.value.defense = 2
    // newMonster.value.xp_reward = 0
    // newMonster.value.gold_reward = 0
    // newMonster.value.level = 1
    fetchMonsters()
  } catch (error) {
    console.error('Sumbit error:', error.response.data)
    alert('Gagal menyimpan: ' + (error.response.data.message || 'Internal server error'))
  } finally {
    isSubmit.value = false
  }
}

const filterMonsters = computed(() => {
  let result = monsters.value.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchSearch
  })
  return result
})

onMounted(fetchMonsters)
</script>
