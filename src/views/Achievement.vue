<!-- get achievement, add achievement, update achievement -->

<template>
  <div class="p-8 bg-slate-50 min-h-screen">
    <!-- header -->
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-slate-800 font-extrabold text-3xl mb-1">Achievements</h1>
      <button
        @click="openModal()"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:translate-y-0.5 transition-all"
      >
        + New Achievement
      </button>
    </header>

    <!-- loading -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- search & filter bar -->
    <div v-else class="p-8">
      <div class="flex gap-4 mb-6">
        <Searchbar v-model="searchAchieve" placeholder="Cari achievement..." />

        <select v-model="sortXp" class="border p-2 rounded-lg">
          <option value="high">XP Terbesar</option>
          <option value="low">XP Terkecil</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="item in filtered"
          :key="item.id"
          class="bg-white p-6 rounded-2xl border border-slate-200 shadow-md hover:translate-y-0.5 transition-all"
        >
          <div
            class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl mb-4"
          >
            🏆
          </div>
          <h3 class="font-bold text-lg">{{ item.title }}</h3>
          <p class="text-slate-500 text-sm mb-3">{{ item.description }}</p>
          <span class="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded"
            >Required: {{ item.xp_required }} XP</span
          >
          <button
            @click="openModal(item)"
            class="block mt-4 text-amber-600 font-semibold text-sm bg-amber-100 shadow-md p-2 rounded-md hover:bg-amber-200 hover:translate-y-0.5 transition-all"
          >
            Edit Achievement
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-m flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200">
        <h2 class="text-xl font-bold text-slate-800 mb-4">
          {{ isEdit ? 'Edit Achievement' : 'Add New Achievement' }}
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Title</label>
            <input
              v-model="form.title"
              type="text"
              class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Master Explorer"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              v-model="form.description"
              class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              rows="3"
              placeholder="Description of achievement..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">XP Required</label>
            <input
              v-model="form.xp_required"
              type="number"
              class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showModal = false"
            class="text-slate-500 hover:text-slate-700 font-medium"
          >
            Cancel
          </button>
          <button
            @click="submitAchievement"
            class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-bold shadow-md transition-all hover:translate-y-0.5"
          >
            {{ isEdit ? 'Update' : 'Save' }} Achievement
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

const achievements = ref([])
const loading = ref(true)

const showModal = ref(false)
const isEdit = ref(false)
const form = ref({
  id: null,
  title: '',
  description: '',
  xp_required: 0,
})

const searchAchieve = ref('')
const sortXp = ref('high')
const filtered = computed(() => {
  return achievements.value
    .filter((a) => {
      const matchSearch = a.title.toLowerCase().includes(searchAchieve.value.toLowerCase())
      return matchSearch
    })
    .sort((a, b) => {
      if (sortXp.value === 'high') return b.xp_required - a.xp_required
      if (sortXp.value === 'low') return a.xp_required - b.xp_required
    })
})

const fetchAchievements = async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:8000/api/achievements')
    achievements.value = res.data.data
  } catch (error) {
    console.error('Fetch error:', error)
  } finally {
    loading.value = false
  }
}

const openModal = (item = null) => {
  if (item) {
    isEdit.value = true
    form.value = { ...item }
  } else {
    isEdit.value = false
    form.value = { id: null, title: '', description: '', xp_required: 0 }
  }
  showModal.value = true
}

const submitAchievement = async () => {
  try {
    if (isEdit.value) {
      await axios.put(`http://localhost:8000/api/achievements/${form.value.id}`, form.value)
    } else {
      await axios.post('http://localhost:8000/api/achievements', form.value)
    }
    showModal.value = false
    fetchAchievements()
  } catch (error) {
    console.error('Submit error:', error.response?.data)
    alert('Gagal menyimpan achievement: ' + (error.response?.data?.message || 'Error'))
  }
}

onMounted(fetchAchievements)
</script>
