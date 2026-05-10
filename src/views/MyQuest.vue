// get player's quest, add player's quest, complete quest (patch)

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <header class="mb-8 p-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h1 class="text-slate-800 font-extrabold text-3xl mb-1">Player Quest Management</h1>

      <div
        class="flex items-center space-x-3 bg-white p-3 rounded-xl shadow-sm border border-slate-200"
      >
        <label class="font-bold text-slate-700">Pilih Player:</label>
        <select
          v-model="selectedPlayerId"
          @change="fetchPlayerQuests"
          class="bg-slate-50 border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option disabled value="">Pilih Player</option>
          <option v-for="p in allPlayers" :key="p.id" :value="p.id">
            {{ p.name }} (ID: {{ p.id }})
          </option>
        </select>
      </div>
    </header>

    <div v-if="selectedPlayerId" class="mb-6 flex justify-end">
      <button
        @click="openTakeQuestModal"
        class="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
      >
        <span>+ Take New Quest</span>
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <div
      v-else-if="!selectedPlayerId"
      class="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400"
    >
      Silakan pilih player terlebih dahulu untuk melihat quest.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in playerQuests"
        :key="item.id"
        class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="p-5">
          <div class="flex justify-between items-start mb-3">
            <span
              :class="statusClass(item.status)"
              class="px-2 py-1 rounded text-xs font-bold uppercase"
            >
              {{ item.status }}
            </span>
            <span class="text-emerald-600 font-bold text-sm">+{{ item.quest.xp_reward }} XP</span>
          </div>

          <h3 class="text-lg font-bold text-slate-800 mb-2">{{ item.quest.title }}</h3>
          <p class="text-slate-600 text-sm line-clamp-2 mb-4">{{ item.quest.description }}</p>

          <button
            v-if="item.status === 'active'"
            @click="completeQuest(item.id)"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>Selesaikan Misi</span>
            <span>🏆</span>
          </button>
        </div>

        <div class="bg-slate-50 px-5 py-3 border-t border-slate-100">
          <span class="text-xs text-slate-400 italic font-medium">
            Tingkat Kesulitan: {{ item.quest.difficult }}
          </span>
        </div>
      </div>

      <div
        v-if="showTakeQuestModal"
        class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-200">
          <h2 class="text-xl font-bold text-slate-800 mb-4">Pilih Misi Baru</h2>

          <div class="max-h-96 overflow-y-auto space-y-3 mb-6">
            <div
              v-for="q in allAvailableQuests"
              :key="q.id"
              @click="selectedQuestId = q.id"
              :class="selectedQuestId === q.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200'"
              class="p-4 border-2 rounded-xl cursor-pointer hover:bg-slate-50 transition-all"
            >
              <div class="flex justify-between items-center">
                <h4 class="font-bold text-slate-800">{{ q.title }}</h4>
                <span class="text-xs font-bold text-blue-600">{{ q.difficulty }}</span>
              </div>
              <p class="text-sm text-slate-500 line-clamp-1">{{ q.description }}</p>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button @click="showTakeQuestModal = false" class="text-slate-500 font-medium">
              Batal
            </button>
            <button
              @click="takeQuest"
              :disabled="!selectedQuestId"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50"
            >
              Ambil Misi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const allPlayers = ref([])
const playerQuests = ref([])
const selectedPlayerId = ref('')
const loading = ref(false)

const showTakeQuestModal = ref(false)
const allAvailableQuests = ref([])
const selectedQuestId = ref(null)

const fetchAllPlayers = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/players')
    allPlayers.value = res.data.data
  } catch (error) {
    console.error('Error fetching players', error)
  }
}

const fetchPlayerQuests = async () => {
  if (!selectedPlayerId.value) return
  loading.value = true
  try {
    const res = await axios.get(`http://localhost:8000/api/player/${selectedPlayerId.value}/quests`)
    playerQuests.value = res.data.data
  } catch (error) {
    console.error('Gagal memuat data misi', error)
  } finally {
    loading.value = false
  }
}

const openTakeQuestModal = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/quests')
    allAvailableQuests.value = res.data.data
    showTakeQuestModal.value = true
  } catch (error) {
    alert('Failed to load all quests')
  }
}

const takeQuest = async () => {
  try {
    await axios.post(`http://localhost:8000/api/player/${selectedPlayerId.value}/quests`, {
      quest_id: selectedQuestId.value,
    })
    showTakeQuestModal.value = false
    selectedQuestId.value = null
    fetchPlayerQuests() // refesh list
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to take the quest')
  }
}

const completeQuest = async (pqId) => {
  try {
    const res = await axios.patch(
      `http://localhost:8000/api/player/${selectedPlayerId.value}/quests/${pqId}/complete`,
    )
    alert(
      `Quest Berhasil! Anda mendapat ${res.data.xp_gained} XP. Total XP sekarang: ${res.data.total_xp}`,
    )

    // Cek achievement yang baru terbuka
    if (res.data.achievements_unlocked.length > 0) {
      alert('Hebat! Kamu membuka Achievement baru!')
    }

    fetchPlayerQuests()
  } catch (error) {
    console.error(error)
    alert(error.response?.data?.message || 'Terjadi kesalahan')
  }
}

// warna status
const statusClass = (status) => {
  if (status === 'active') return 'bg-blue-100 text-blue-600'
  if (status === 'completed') return 'bg-emerald-100 text-emerald-600'
}

onMounted(fetchAllPlayers)
</script>
