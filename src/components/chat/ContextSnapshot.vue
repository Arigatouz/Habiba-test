<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import { useCanvasStore } from '@/stores/canvas'
import { useBoardStore } from '@/stores/board'
import { snapshotToBase64 } from '@/composables/useCanvasExport'

const chat = useChatStore()
const canvas = useCanvasStore()
const board = useBoardStore()
const { includeCanvas, includeBoard } = storeToRefs(chat)

const thumbnail = ref('')

watch(
  () => canvas.snapshotJson,
  async (json) => {
    thumbnail.value = await snapshotToBase64(json)
  },
  { immediate: true },
)
</script>

<template>
  <div class="border-b border-slate-200 bg-slate-50 px-3 py-2">
    <p class="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
      Context sent to Claude
    </p>
    <div class="flex items-center gap-3">
      <label class="flex cursor-pointer items-center gap-1.5 text-xs text-slate-600">
        <input v-model="includeCanvas" type="checkbox" class="accent-brand-600" />
        Drawing
      </label>
      <label class="flex cursor-pointer items-center gap-1.5 text-xs text-slate-600">
        <input v-model="includeBoard" type="checkbox" class="accent-brand-600" />
        Board ({{ board.totalCards }} cards)
      </label>

      <div class="ml-auto">
        <img
          v-if="includeCanvas && thumbnail"
          :src="`data:image/png;base64,${thumbnail}`"
          alt="canvas preview"
          class="h-10 w-16 rounded border border-slate-200 object-contain"
        />
        <span v-else-if="includeCanvas" class="text-[11px] text-slate-400">no drawing yet</span>
      </div>
    </div>
  </div>
</template>
