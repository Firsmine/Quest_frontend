<!-- post battle, history battle, recover -->

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <header class="mb-8 p-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h1 class="text-slate-800 font-extrabold text-3xl mb-1">Battle</h1>

      <div
        class="flex items-center space-x-3 bg-white p-3 rounded-xl shadow-sm border border-slate-200"
      >
        <label class="font-bold text-slate-700">Pilih Player:</label>
        <select
          v-model="selectedPlayerId"
          @change="fetchPlayerBattle"
          class="bg-slate-50 border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option disabled value="">Pilih Player</option>
          <option v-for="p in allPlayers" :key="p.id" :value="p.id">
            {{ p.name }} (ID: {{ p.id }})
          </option>
        </select>
      </div>
    </header>

    <div
      v-if="selectedPlayerId && battleData"
      class="mb-8 flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4"
    >
      <div class="flex flex-col">
        <span class="text-slate-500 text-sm font-semibold uppercase tracking-wider">Player</span>
        <h2 class="text-slate-800 font-black text-3xl">{{ battleData.player_name }}</h2>
      </div>
      <div class="flex space-x-4 mt-2">
        <span class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
          Current HP: {{ battleData.current_hp }}
        </span>
        <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
          Win: {{ battleData.total_win }}
        </span>
        <span class="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-bold">
          Lose: {{ battleData.total_lose }}
        </span>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="recoverPlayer"
          :disabled="isRecovering"
          class="bg-emerald-600 text-white px-4 py-2 shadow-md rounded-lg hover:bg-emerald-700 transition-all hover:translate-y-0.5"
        >
          <span>{{ isRecovering ? '...' : 'Recover HP' }}</span>
        </button>
        <button
          @click="openBattleModal"
          class="bg-blue-600 text-white px-4 py-2 shadow-md rounded-lg hover:bg-blue-700 transition-all hover:translate-y-0.5"
        >
          <span>+ Get In A Battle</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <div
      v-else-if="!selectedPlayerId"
      class="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400"
    >
      Silakan pilih player terlebih dahulu untuk melihat histori battle.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-vols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="battle in battleData.battles"
        :key="battle.id"
        class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div
          :class="battle.result === 'win' ? 'bg-emerald-500' : 'bg-rose-500'"
          class="py-2 px-4 text-center text-white font-black uppercase text-sm tracking-widest"
        >
          {{ battle.result }}
        </div>

        <div class="p-6">
          <div class="mb-4">
            <h3 class="text-slate-400 text-xs font-bold uppercase">Opponent</h3>
            <p class="text-xl font-bold text-slate-800">
              {{ battle.monster?.name || 'Unknown Monster' }}
            </p>
            <span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
              >Lvl {{ battle.monster?.level }}</span
            >
          </div>

          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <p class="text-[10px] text-slate-400 font-bold uppercase">Player Dmg</p>
              <p class="font-bold text-blue-600">{{ battle.player_dmg }}</p>
            </div>
            <div class="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <p class="text-[10px] text-slate-400 font-bold uppercase">Monster Dmg</p>
              <p class="font-bold text-rose-600">{{ battle.monster_dmg }}</p>
            </div>
          </div>

          <div class="border-t border-slate-100 pt-4 mt-4 space-y-2">
            <div class="flex justify-between text-xs">
              <span class="text-slate-400">Monster HP/ATK/DEF</span>
              <span class="font-bold text-slate-700">
                {{ battle.monster?.hp }} / {{ battle.monster?.attack }} /
                {{ battle.monster?.defense }}
              </span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-slate-400">XP Gained</span>
              <span class="font-bold text-emerald-600">+{{ battle.xp_gained }} XP</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-slate-400">Gold Gained</span>
              <span class="font-bold text-yellow-600">+{{ battle.gold_gained }} G</span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="showBattleModal"
        class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-200">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-black text-slate-800 text-center justify-center">
              Start New Battle
            </h2>
            <button @click="showBattleModal = false" class="text-slate-400 hover:text-slate-600">
              &times;
            </button>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-bold text-slate-700 mb-2">Pilih Lawan Anda:</label>
            <select
              v-model="selectedMonsterId"
              class="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 outline-none focus:border-blue-500 transition-all font-medium text-slate-700"
            >
              <option disabled value="">Pilih Monster</option>
              <option v-for="m in allMonsters" :key="m.id" :value="m.id">
                {{ m.name }} (Lvl {{ m.level }})
              </option>
            </select>
          </div>

          <div
            v-if="selectedMonster"
            class="bg-blue-50 border-2 border-blue-100 rounded-2xl p-5 mb-8 animate-in fade-in zoom-in duration-300"
          >
            <h3 class="text-blue-800 font-bold mb-3 flex items-center">Monster Stats</h3>
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center">
                <p class="text-[10px] text-blue-400 font-black uppercase">HP</p>
                <p class="text-lg font-bold text-blue-700">{{ selectedMonster.hp }}</p>
              </div>
              <div class="text-center border-x border-blue-200">
                <p class="text-[10px] text-blue-400 font-black uppercase">ATK</p>
                <p class="text-lg font-bold text-blue-700">{{ selectedMonster.attack }}</p>
              </div>
              <div class="text-center">
                <p class="text-[10px] text-blue-400 font-black uppercase">DEF</p>
                <p class="text-lg font-bold text-blue-700">{{ selectedMonster.defense }}</p>
              </div>
            </div>
            <div
              class="mt-4 pt-3 border-t border-blue-200 flex justify-between text-xs font-bold text-blue-500"
            >
              <span>Reward: {{ selectedMonster.gold_reward }} Gold</span>
              <span>XP: {{ selectedMonster.xp_reward }}</span>
            </div>
          </div>

          <div class="flex flex-col space-y-3">
            <button
              @click="startBattle"
              :disabled="!selectedMonsterId || isSubmitting"
              class="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all"
            >
              {{ isSubmitting ? 'Fighting...' : 'ATTACK!' }}
            </button>
            <button
              @click="showBattleModal = false"
              class="w-full text-slate-400 font-bold py-2 hover:text-slate-600"
            >
              Give Up
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

const allPlayers = ref([])
const selectedPlayerId = ref('')
const loading = ref(false)
const battleData = ref(null)

const showBattleModal = ref(false)
const allMonsters = ref([])
const selectedMonsterId = ref('')
const isRecovering = ref(false)
const isSubmitting = ref(false)

const selectedMonster = computed(() => {
  return allMonsters.value.find((m) => m.id === selectedMonsterId.value) || null
})

const fetchAllPlayers = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/players')
    allPlayers.value = res.data.data
  } catch (error) {
    console.error('Error fetching players', error)
  }
}

const fetchAllMonsters = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/monsters')
    allMonsters.value = res.data.data
  } catch (error) {
    console.error('Error fetching players', error)
  }
}

const fetchPlayerBattle = async () => {
  if (!selectedPlayerId.value) {
    battleData.value = null
    return
  }
  loading.value = true
  try {
    const res = await axios.get(
      `http://localhost:8000/api/players/${selectedPlayerId.value}/battles`,
    )
    console.log('Cek Data dari API:', res.data)
    battleData.value = {
      player_name: res.data.player,
      current_hp: res.data.current_hp,
      total_win: res.data.total_win,
      total_lose: res.data.total_lose,
      battles: res.data.battles || [],
    }
  } catch (error) {
    console.error('Gagal memuat data misi', error)
    battleData.value = null
  } finally {
    loading.value = false
  }
}

const recoverPlayer = async () => {
  if (!selectedPlayerId.value) return
  isRecovering.value = true
  try {
    const res = await axios.post(
      `http://localhost:8000/api/players/${selectedPlayerId.value}/recover`,
    )
    alert(res.data.message || 'HP Berhasil dipulihkan!')
    // update tampilan HP
    await fetchPlayerBattle()
  } catch (error) {
    console.error('Recover error:', error)
    alert('Gagal melakukan recover')
  } finally {
    isRecovering.value = false
  }
}

const openBattleModal = async () => {
  if (!selectedPlayerId.value) return alert('Pilih player dulu!')
  fetchAllMonsters() //refresh list monster
  selectedMonsterId.value = ''
  showBattleModal.value = true
}

const startBattle = async () => {
  if (!selectedPlayerId.value || !selectedMonsterId.value) return

  isSubmitting.value = true
  try {
    const res = await axios.post(
      `http://localhost:8000/api/players/${selectedPlayerId.value}/battle`,
      {
        monster_id: selectedMonsterId.value,
      },
    )
    // feedback hasil battle
    const result = res.data.result
    if (result === 'win') {
      alert(`MENANG! Anda mendapatkan ${res.data.battle_log.player_attack} XP.`)
    } else {
      alert(`KALAH! HP berkurang.`)
    }
    // achievement atau level up
    if (res.data.level_up_info) alert('LEVEL UP! Stats Anda meningkat.')
    if (res.data.new_achievement) alert(res.data.new_achievement)
    // tutup modal, refresh history & info player
    showBattleModal.value = false
    fetchPlayerBattle() // Fungsi refresh history yang kita buat di prompt sebelumnya
  } catch (error) {
    if (error.response && error.response.status === 403) {
      alert(error.response.data.message) // Pesan player kritis/mati
    } else {
      console.error('Battle Error:', error)
      alert('Terjadi kesalahan saat battle.')
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(fetchAllPlayers)
</script>
