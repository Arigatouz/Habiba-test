<script setup lang="ts">
import { ref } from 'vue'
import { useFabricCanvas } from '@/composables/useFabricCanvas'
import CanvasToolbar from '@/components/canvas/CanvasToolbar.vue'
import CanvasControls from '@/components/canvas/CanvasControls.vue'

const canvasEl = ref<HTMLCanvasElement | null>(null)
const container = ref<HTMLElement | null>(null)

const { undo, redo, canUndo, canRedo, clear, downloadImage } = useFabricCanvas(
  canvasEl,
  container,
)
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex flex-col gap-2 border-b border-slate-200 bg-white px-3 py-2 md:flex-row md:items-center md:justify-between">
      <CanvasToolbar />
      <CanvasControls
        :can-undo="canUndo"
        :can-redo="canRedo"
        @undo="undo"
        @redo="redo"
        @clear="clear"
        @export="downloadImage"
      />
    </div>

    <!-- Canvas fills remaining space. touch-action:none stops the page scrolling while drawing. -->
    <div ref="container" class="drawing-surface relative min-h-0 flex-1 bg-white">
      <canvas ref="canvasEl" class="absolute inset-0" />
    </div>
  </div>
</template>
