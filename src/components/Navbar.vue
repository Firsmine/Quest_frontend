// Navigasi: dashboard, player, quest, achievement, myQuest

<template>
  <nav class="bg-slate-800 text-white shadow-xl sticky top-0 w-full pl-9 pr-9">
    <div class="flex justify-between items-center h-16">
      <div class="flex items-center">
        <router-link to="/" class="font-bold texl-xl tracking-tight text-blue-400">
          QUEST <span class="text-white">API</span>
        </router-link>
      </div>

      <ul class="flex items-center gap-6">
        <li>
          <router-link
            to="/"
            class="hover:text-blue-400 transition-colors"
            active-class="text-blue-400"
          >
            Dashboard
          </router-link>
        </li>
        <li>
          <router-link
            to="/player"
            class="hover:text-blue-400 transition-colors"
            active-class="text-blue-400"
          >
            Player
          </router-link>
        </li>
        <li>
          <router-link
            to="/quest"
            class="hover:text-blue-400 transition-colors"
            active-class="text-blue-400"
          >
            Quest
          </router-link>
        </li>
        <li>
          <router-link
            to="/achievement"
            class="hover:text-blue-400 transition-colors"
            active-class="text-blue-400"
          >
            Achievement
          </router-link>
        </li>
        <li>
          <router-link
            to="/myquest"
            class="hover:text-blue-400 transition-colors"
            active-class="text-blue-400"
          >
            My Quest
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup></script>
