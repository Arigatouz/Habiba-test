<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
const { hasKey } = storeToRefs(settings)
</script>

<template>
  <slot v-if="hasKey" />
  <div v-else class="flex h-full items-center justify-center p-6">
    <div class="max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-2xl">
        🔑
      </div>
      <h2 class="mb-1 text-lg font-semibold text-slate-800">AI features are locked</h2>
      <p class="mb-4 text-sm text-slate-500">
        Add your Anthropic API key in Settings to let Claude see your drawings and help you
        design and plan.
      </p>
      <RouterLink
        to="/settings"
        class="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Go to Settings
      </RouterLink>
    </div>
  </div>
</template>
