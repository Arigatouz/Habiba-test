import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import BoardView from '@/views/BoardView.vue'
import DrawView from '@/views/DrawView.vue'
import AssistantView from '@/views/AssistantView.vue'
import SettingsView from '@/views/SettingsView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/board' },
  { path: '/board', name: 'board', component: BoardView },
  { path: '/draw', name: 'draw', component: DrawView },
  { path: '/assistant', name: 'assistant', component: AssistantView },
  { path: '/settings', name: 'settings', component: SettingsView },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
