<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCanvasStore } from '@/stores/canvas'
import type { DrawingTool } from '@/types/canvas'
import ColorPicker from '@/components/canvas/ColorPicker.vue'

const canvas = useCanvasStore()
const { activeTool, strokeWidth } = storeToRefs(canvas)

const tools: { id: DrawingTool; icon: string; label: string }[] = [
  { id: 'select', icon: '🖱️', label: 'Select / move' },
  { id: 'pen', icon: '✏️', label: 'Pen' },
  { id: 'eraser', icon: '🧽', label: 'Eraser' },
  { id: 'line', icon: '╱', label: 'Line' },
  { id: 'arrow', icon: '↗', label: 'Arrow' },
  { id: 'rectangle', icon: '▭', label: 'Rectangle' },
  { id: 'circle', icon: '◯', label: 'Circle' },
  { id: 'text', icon: 'T', label: 'Text' },
]
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
    <div class="scroll-thin flex items-center gap-1 overflow-x-auto">
      <button
        v-for="tool in tools"
        :key="tool.id"
        :title="tool.label"
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base transition"
        :class="
          activeTool === tool.id
            ? 'bg-brand-600 text-white shadow'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        "
        @click="canvas.setTool(tool.id)"
      >
        {{ tool.icon }}
      </button>
    </div>

    <div class="flex items-center gap-2">
      <span class="text-xs text-slate-400">Size</span>
      <input
        type="range"
        min="1"
        max="40"
        :value="strokeWidth"
        class="w-24 accent-brand-600"
        @input="canvas.setStrokeWidth(Number(($event.target as HTMLInputElement).value))"
      />
      <span class="w-6 text-xs tabular-nums text-slate-500">{{ strokeWidth }}</span>
    </div>

    <ColorPicker />
  </div>
</template>
