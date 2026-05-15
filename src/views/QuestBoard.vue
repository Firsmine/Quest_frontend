<!-- get quest, add quest, delete quest -->

<template>
  <div class="p-8 bg-slate-50 min-h-screen">
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-slate-800 font-extrabold text-3xl mb-1">Quest Board</h1>
      <button
        @click="openModal()"
        class="bg-blue-600 text-white px-4 py-2 shadow-md rounded-lg hover:bg-blue-700 transition-all hover:translate-y-0.5"
      >
        + New Quest
      </button>
    </header>

    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <div v-else class="p-8">
      <div class="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm">
        <Searchbar v-model="searchQuest" placeholder="Cari judul misi..." />

        <select v-model="filterDifficulty" class="border p-2 rounded-lg">
          <option value="all">Semua Kesulitan</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          v-for="quest in filteredQuests"
          :key="quest.id"
          class="bg-white p-5 rounded-xl shadow-md border border-slate-200 shadow-fm flex justify-between items-center transition-all hover:translate-y-0.5"
        >
          <div>
            <h3 class="font-bold text-slate-800">{{ quest.title }}</h3>
            <h5 class="font-xl text-slate-800">{{ quest.description }}</h5>
            <p class="text-sm text-slate-500">{{ quest.xp_reward }} XP</p>
            <span
              :class="difficultyColor(quest.difficult)"
              class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
            >
              {{ quest.difficult }}
            </span>
          </div>
          <div class="flex space-x-2">
            <button
              @click="openModal(quest)"
              class="p-2 shadow-md text-blue-950 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Edit
            </button>
            <button
              @click="deleteQuest(quest.id)"
              class="p-2 shadow-md text-red-950 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 shadow-lg"
      >
        <div class="bg-blue-50 rounded-xl p-6 w-full max-w-lg shadow-lg">
          <h2 class="text-xl font-bold text-slate-800 mb-4">
            {{ isEdit ? 'Update' : 'Add' }} Quest
          </h2>
          <div class="space-y-4">
            <input
              v-model="form.title"
              type="text"
              placeholder="Quest Title"
              class="w-full border p-2 rounded-lg"
            />
            <textarea
              v-model="form.description"
              placeholder="Description"
              class="w-full border p-2 rounded-lg"
            ></textarea>
            <input
              v-model="form.xp_reward"
              type="number"
              placeholder="XP Reward"
              class="w-full border p-2 rounded-lg"
            />
            <select v-model="form.difficult" class="w-full border p-2 rounded-lg">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div class="flex justify-end mt-6 space-x-3">
            <button @click="showModal = false" class="text-slate-500">Cancel</button>
            <button @click="submitQuest" class="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Searchbar from '@/components/Searchbar.vue'

const quests = ref([])
const searchQuest = ref('')
const filterDifficulty = ref('all')
const showModal = ref(false)
const isEdit = ref(false)
const form = ref({ title: '', description: '', xp_reward: 0, difficult: 'easy' })
const loading = ref(true)

const filteredQuests = computed(() => {
  return quests.value.filter((q) => {
    const matchSearch = q.title.toLowerCase().includes(searchQuest.value.toLowerCase())
    const matchDiff = filterDifficulty.value === 'all' || q.difficult === filterDifficulty.value
    return matchSearch && matchDiff
  })
})

const openModal = (data = null) => {
  isEdit.value = !!data
  form.value = data ? { ...data } : { title: '', description: '', xp_reward: 0, difficult: 'easy' }
  showModal.value = true
}

const submitQuest = async () => {
  try {
    if (isEdit.value) {
      await axios.put(`http://localhost:8000/api/quests/${form.value.id}`, form.value)
    } else {
      await axios.post('http://localhost:8000/api/quests', form.value)
    }
    showModal.value = false
    fetchQuests()
  } catch (error) {
    console.error('Submit error:', error.response.data)
    alert('Gagal menyimpan: ' + (error.response.data.message || 'Internal server error'))
  }
}

const deleteQuest = async (id) => {
  if (confirm('Hapus quest ini?')) {
    try {
      await axios.delete(`http://localhost:8000/api/quests/${id}`)
      fetchQuests()
    } catch (error) {
      console.error('Delete error:', error.response)
    }
  }
}

const difficultyColor = (level) => {
  if (level === 'easy') return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
  if (level === 'medium') return 'bg-amber-100 text-amber-700 border border-amber-200'
  if (level === 'hard') return 'bg-red-100 text-red-700 border border-red-200'
}

const fetchQuests = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:8000/api/quests')
    quests.value = res.data.data
  } catch (error) {
    console.error('Fetch quest error:', error.response)
  } finally {
    loading.value = false
  }
}

onMounted(fetchQuests)
</script>
