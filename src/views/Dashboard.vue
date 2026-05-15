<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <!-- header -->
    <header class="mb-8 flex justify-between items-center px-2">
      <div>
        <h1 class="text-slate-800 font-black text-4xl tracking-tight">Dashboard</h1>
      </div>
    </header>

    <!-- loading animation -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- navigation cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="(item, index) in navigationCards"
        :key="index"
        class="bg-blue-100 p-8 rounded-[2rem] border border-slate-100 shadow-lg hover:shadow-2xl transition-all"
      >
        <h2 class="text-slate-800 font-bold text-2xl mb-2">{{ item.title }}</h2>
        <p class="text-slate-500 text-sm mb-6">{{ item.desc }}</p>
        <router-link
          :to="item.link"
          class="block w-full py-3 px-4 bg-blue-400 text-slate-800 font-bold rounded-xl text-center hover:bg-blue-600 hover:text-white transition-all"
        >
          Explore
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
const navigationCards = [
  {
    title: 'Player Management',
    desc: 'See all players, add a player, and see all the details.',
    link: '/player',
    btnText: 'Manage Players',
  },
  {
    title: 'Quest Board',
    desc: 'See all the quests, add a quest, edit it, and delete it.',
    link: '/quest',
    btnText: 'Manage Quests',
  },
  {
    title: 'Achievements',
    desc: 'See all achievements, add one, and update it.',
    link: '/achievement',
    btnText: 'See Achievements',
  },
  {
    title: "Player's Quest",
    desc: 'See all players, add a player, and see all the details.',
    link: '/myquest',
    btnText: 'See My Quest',
  },
  {
    title: 'Monsters',
    desc: "See all monsters' detail and add a new monster.",
    link: '/monster',
    btnText: 'See All Monsters',
  },
  {
    title: 'Battle Arena',
    desc: 'See all battle history, get in a battle, and recover.',
    link: '/battle',
    btnText: 'Get In A Battle',
  },
]
</script>
