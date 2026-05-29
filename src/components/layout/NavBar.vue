<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
const { hasKey } = storeToRefs(settings)

const tabs = [
  { to: '/board', label: 'Board', icon: '📋' },
  { to: '/draw', label: 'Draw', icon: '🎨' },
  { to: '/assistant', label: 'Assistant', icon: '✨' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
] as const
</script>

<template>
  <nav
    class="z-30 flex shrink-0 border-slate-200 bg-white
           max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:border-t
           md:h-full md:w-56 md:flex-col md:border-r md:py-4"
  >
    <div class="hidden px-5 pb-4 md:block">
      <span class="text-lg font-bold text-slate-800">Flow<span class="text-brand-600">Board</span></span>
      <p class="text-xs text-slate-400">Kanban · Draw · AI</p>
    </div>

    <ul class="flex flex-1 justify-around md:flex-col md:justify-start md:gap-1 md:px-2">
      <li v-for="tab in tabs" :key="tab.to" class="flex-1 md:flex-none">
        <RouterLink
          :to="tab.to"
          class="relative flex flex-col items-center gap-0.5 px-2 py-2 text-xs text-slate-500 transition
                 md:flex-row md:gap-3 md:rounded-lg md:px-3 md:py-2.5 md:text-sm"
          active-class="text-brand-600 md:bg-brand-50 md:text-brand-700 md:font-medium"
        >
          <span class="text-lg md:text-base">{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.to === '/settings' && !hasKey"
            class="absolute right-3 top-1.5 h-2 w-2 rounded-full bg-red-500 md:static md:ml-auto"
            title="API key not set"
          />
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
