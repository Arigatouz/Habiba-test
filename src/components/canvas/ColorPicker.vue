<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores/canvas'

const canvas = useCanvasStore()
const { strokeColor } = storeToRefs(canvas)
const nativeInput = ref<HTMLInputElement | null>(null)

const presets = [
  '#1e293b', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6',
  '#ec4899', '#ffffff',
]

function pick(color: string) {
  canvas.setColor(color)
}
</script>

<template>
  <div class="flex items-center gap-1.5">
    <!-- Full-gamut native picker, revealed via the swatch button (mobile friendly). -->
    <button
      class="relative h-8 w-8 shrink-0 rounded-full border-2 border-white shadow ring-1 ring-slate-300"
      :style="{ backgroundColor: strokeColor }"
      title="Pick any color"
      @click="nativeInput?.click()"
    >
      <input
        ref="nativeInput"
        type="color"
        :value="strokeColor"
        class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        @input="pick(($event.target as HTMLInputElement).value)"
      />
    </button>
    <div class="flex flex-wrap gap-1">
      <button
        v-for="c in presets"
        :key="c"
        class="h-6 w-6 rounded-full ring-1 ring-slate-300 transition hover:scale-110"
        :class="{ 'ring-2 ring-brand-600': c === strokeColor }"
        :style="{ backgroundColor: c }"
        :title="c"
        @click="pick(c)"
      />
    </div>
  </div>
</template>
