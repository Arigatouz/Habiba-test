<script setup lang="ts">
defineProps<{ canUndo: boolean; canRedo: boolean }>()
const emit = defineEmits<{ undo: []; redo: []; clear: []; export: [] }>()

function clearWithConfirm() {
  if (confirm('Clear the entire canvas? This cannot be undone after you leave.')) {
    emit('clear')
  }
}
</script>

<template>
  <div class="flex items-center gap-1">
    <button
      class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-200 disabled:opacity-30"
      title="Undo"
      :disabled="!canUndo"
      @click="emit('undo')"
    >
      ↶
    </button>
    <button
      class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-200 disabled:opacity-30"
      title="Redo"
      :disabled="!canRedo"
      @click="emit('redo')"
    >
      ↷
    </button>
    <button
      class="flex h-9 items-center justify-center rounded-lg px-3 text-sm text-red-600 transition hover:bg-red-50"
      title="Clear canvas"
      @click="clearWithConfirm"
    >
      Clear
    </button>
    <button
      class="flex h-9 items-center justify-center rounded-lg bg-slate-100 px-3 text-sm text-slate-700 transition hover:bg-slate-200"
      title="Export as PNG"
      @click="emit('export')"
    >
      ⬇ Export
    </button>
  </div>
</template>
