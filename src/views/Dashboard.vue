<!-- list player -->
<!-- To do: tambahkan button ke page monster dan battle, ubah susunan jadi -->

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <header class="mb-8">
      <h1 class="text-slate-800 font-extrabold text-3xl mb-1 p-3">Dashboard</h1>
    </header>

    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6 justify-center">
      <div
        class="bg-blue-100 border border-slate-500 justify-center text-center shadow-xl h-80 p-5 m-5 rounded-xl hover:shadow-2xl hover:bg-indigo-100 hover:translate-y-0.5 transition-all"
      >
        <h2 class="text-slate-800 font-bold text-2xl mb-5 text-center mt-3">Player Management</h2>
        <p class="text-slate-900 text-center mb-5">
          See all players, add a player, and see all the details.
        </p>
        <button
          class="justify-center mt-7 bg-blue-500 w-50 rounded-md p-3 shadow-md hover:bg-blue-600 transition-colors w-33"
        >
          <router-link
            to="/player"
            class="hover:text-blue-100 transition-colors"
            active-class="text-blue-400"
          >
            Manage Players
          </router-link>
        </button>
      </div>

      <div
        class="bg-blue-100 border border-slate-500 justify-center text-center shadow-xl h-80 p-5 m-5 rounded-xl hover:shadow-2xl hover:bg-indigo-100 hover:translate-y-0.5 transition-all"
      >
        <h2 class="text-slate-800 font-bold text-2xl mb-5 text-center mt-2 p-4">Quest Board</h2>
        <p class="text-slate-900 text-center mb-5">
          See all the quests, add a quest, edit it, and delete it if it's necessary.
        </p>
        <button
          class="justify-center mt-2 bg-blue-500 w-50 rounded-md p-3 shadow-md hover:bg-blue-600 transition-colors w-33"
        >
          <router-link
            to="/quest"
            class="hover:text-blue-100 transition-colors"
            active-class="text-blue-400"
          >
            Manage Quests
          </router-link>
        </button>
      </div>

      <div
        class="bg-blue-100 border border-slate-500 justify-center text-center shadow-xl h-80 p-5 m-5 rounded-xl hover:shadow-2xl hover:bg-indigo-100 hover:translate-y-0.5 transition-all"
      >
        <h2 class="text-slate-800 font-bold text-2xl mb-5 text-center mt-3 p-4">Achievements</h2>
        <p class="text-slate-900 text-center mb-5">See all achievements, add one, and update it.</p>
        <button
          class="justify-center mt-7 bg-blue-500 w-50 rounded-md p-3 shadow-md hover:bg-blue-600 transition-colors w-33"
        >
          <router-link
            to="/achievement"
            class="hover:text-blue-100 transition-colors"
            active-class="text-blue-400"
          >
            See Achievement
          </router-link>
        </button>
      </div>

      <div
        class="bg-blue-100 border border-slate-500 justify-center text-center shadow-xl h-80 p-5 m-5 rounded-xl hover:shadow-2xl hover:bg-indigo-100 hover:translate-y-0.5 transition-all"
      >
        <h2 class="text-slate-800 font-bold text-2xl mb-5 text-center mt-3 p-4">Player's Quest</h2>
        <p class="text-slate-900 text-center mb-5">
          See all players, add a player, and see all the details.
        </p>
        <button
          class="justify-center mt-7 bg-blue-500 w-50 rounded-md p-3 shadow-md hover:bg-blue-600 transition-colors w-33"
        >
          <router-link
            to="/myquest"
            class="hover:text-blue-100 transition-colors"
            active-class="text-blue-400"
          >
            See My Quest
          </router-link>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup></script>
