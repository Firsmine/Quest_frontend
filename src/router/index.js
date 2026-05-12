import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
    },
    {
      path: '/player',
      name: 'player',
      component: () => import('../views/PlayerDetail.vue'),
    },
    {
      path: '/quest',
      name: 'quest',
      component: () => import('../views/QuestBoard.vue'),
    },
    {
      path: '/achievement',
      name: 'achievement',
      component: () => import('../views/Achievement.vue'),
    },
    {
      path: '/myquest',
      name: 'myquest',
      component: () => import('../views/MyQuest.vue'),
    },
    {
      path: '/monster',
      name: 'monster',
      component: () => import('../views/Monster.vue'),
    },
    {
      path: '/battle',
      name: 'battle',
      component: () => import('../views/Battle.vue'),
    },
  ],
})

export default router
