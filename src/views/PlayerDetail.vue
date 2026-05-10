// get players, add players, detail 1 player

<template>
  <div class="p-8 bg-slate-50 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-slate-800 font-extrabold text-3xl mb-1">Player Management</h1>
      <button
        @click="showModal = true"
        class="bg-blue-600 text-white px-4 py-2 shadow-md rounded-lg hover:bg-blue-700 transition-all hover:translate-y-0.5"
      >
        + Add Player
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-blue-400 text-slate-800 uppercase text-xs font-semibold">
          <tr>
            <th class="px-6 py-3">Name</th>
            <th class="px-6 py-3">Total XP</th>
            <th class="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="player in players" :key="player.id" class="hover:bg-slate-50">
            <td class="px-6 py-4 font-medium text-slate-800">{{ player.name }}</td>
            <td class="px-6 py-4 text-slate-500">{{ player.total_xp }} XP</td>
            <td class="px-6 py-4">
              <button
                @click="viewDetail(player.id)"
                class="text-blue-600 hover:underline font-medium"
              >
                View Detail
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl border border-slate-200">
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-2xl font-bold text-slate-800">Player Detail</h2>
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

        <div v-else-if="selectedPlayer" class="space-y-4">
          <div class="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <div
              class="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold"
            >
              {{ selectedPlayer.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-slate-500 text-sm">Player Name</p>
              <p class="text-xl font-bold text-slate-800">{{ selectedPlayer.name }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 border border-slate-100 rounded-lg">
              <p class="text-slate-500 text-sm font-medium">Gender</p>
              <p
                class="text-lg font-bold text-blue-600"
                :class="genderStyle(selectedPlayer.gender)"
              >
                {{ selectedPlayer.gender }}
              </p>
            </div>
            <div class="p-4 border border-slate-100 rounded-lg">
              <p class="text-slate-500 text-sm font-medium">Role</p>
              <p class="text-lg font-bold text-blue-600" :class="roleStyle(selectedPlayer.role)">
                {{ selectedPlayer.role }}
              </p>
            </div>
            <div class="p-4 border border-slate-100 rounded-lg">
              <p class="text-slate-500 text-sm font-medium">Total XP</p>
              <p class="text-lg font-bold text-blue-600">{{ selectedPlayer.total_xp }} XP</p>
            </div>
            <div class="p-4 border border-slate-100 rounded-lg">
              <p class="text-slate-500 text-sm font-medium">Status</p>
              <p class="text-lg font-bold text-emerald-600">Active</p>
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

    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-blue-50 rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 class="text-xl font-bold text-slate-800 mb-4">Add New Player</h2>
        <label text-md text-slate-800 mb-5>Player Name:</label>
        <input
          v-model="newPlayer.name"
          type="text"
          placeholder="Player Name"
          class="w-full border border-slate-300 rounded-lg p-2 mb-4 mt-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <label text-md text-slate-800 mb-5>Player Gender:</label>
        <select
          v-model="newPlayer.gender"
          class="w-full border border-slate-300 rounded-lg p-2 mb-4 mt-3 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <label text-md text-slate-800 mb-5>Player Role:</label>
        <select
          v-model="newPlayer.role"
          class="w-full border border-slate-300 rounded-lg p-2 mb-4 mt-3 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="fighter">Fighter</option>
          <option value="mage">Mage</option>
          <option value="marksman">Marksman</option>
          <option value="support">Support</option>
          <option value="tank">Tank</option>
        </select>
        <div class="flex justify-end space-x-3">
          <button @click="showModal = false" class="text-slate-500 hover:text-slate-700">
            Cancel
          </button>
          <button
            @click="savePlayer"
            :disabled="isSubmit"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 hover:translate-y-0.5 transition-all"
          >
            Save Player
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const players = ref([])
const loading = ref(true)

// modal add player
const showModal = ref(false)
const newPlayer = ref({ name: '', gender: 'male', role: 'fighter' })
const isSubmit = ref(false)

// detail player
const showDetailModal = ref(false)
const selectedPlayer = ref(null)
const detailLoading = ref(false)

const fetchPlayers = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/players')
    players.value = res.data.data
  } catch (error) {
    console.error('Gagal memuat data player', error)
  } finally {
    loading.value = false
  }
}

const viewDetail = async (id) => {
  showDetailModal.value = true
  detailLoading.value = true
  try {
    const res = await axios.get(`http://localhost:8000/api/players/${id}`)
    selectedPlayer.value = res.data.data
  } catch (error) {
    console.error('Gagal mengambil detail player', error)
    alert('Data player tidak ditemukan')
    showDetailModal.value = false
  } finally {
    detailLoading.value = false
  }
}

const savePlayer = async () => {
  if (isSubmit.value) return
  isSubmit.value = true
  try {
    if (showModal.value) {
      await axios.post('http://localhost:8000/api/players', newPlayer.value)
    }
    showModal.value = false
    newPlayer.value.name = ''
    newPlayer.value.gender = 'male'
    newPlayer.value.role = 'fighter'
    fetchPlayers()
  } catch (error) {
    console.error('Submit error:', error.response.data)
    alert('Gagal menyimpan: ' + (error.response.data.message || 'Internal server error'))
  } finally {
    isSubmit.value = false
  }
}

const genderStyle = (gender) => {
  return gender?.toLowerCase() === 'male' ? 'text-blue-600' : 'text-pink-500'
}

const roleStyle = (role) => {
  switch (role?.toLowerCase()) {
    case 'fighter':
      return 'text-orange-600'
    case 'support':
      return 'text-emerald-500'
    case 'marksman':
      return 'text-red-500'
    case 'mage':
      return 'text-purple-600'
    case 'tank':
      return 'text-slate-700'
    default:
      return 'text-slate-600'
  }
}

onMounted(fetchPlayers)
</script>
