<script setup lang="ts">
import { ref } from 'vue'
import type { Card } from '@/types/board'

defineProps<{ card: Card }>()
const emit = defineEmits<{ edit: []; delete: [] }>()

const menuOpen = ref(false)
</script>

<template>
  <div
    class="group relative cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing"
  >
    <div class="flex items-start justify-between gap-2">
      <h3 class="text-sm font-medium text-slate-800 break-words">{{ card.title }}</h3>
      <button
        class="shrink-0 rounded p-1 text-slate-400 opacity-0 transition hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100 max-md:opacity-100"
        aria-label="Card menu"
        @click.stop="menuOpen = !menuOpen"
      >
        ⋯
      </button>
    </div>
    <p v-if="card.description" class="mt-1 whitespace-pre-wrap text-xs text-slate-500">
      {{ card.description }}
    </p>

    <div
      v-if="menuOpen"
      class="absolute right-2 top-9 z-10 w-28 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg"
    >
      <button
        class="block w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50"
        @click.stop="((menuOpen = false), emit('edit'))"
      >
        Edit
      </button>
      <button
        class="block w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50"
        @click.stop="((menuOpen = false), emit('delete'))"
      >
        Delete
      </button>
    </div>
  </div>
</template>
