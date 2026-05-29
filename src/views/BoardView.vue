<script setup lang="ts">
import KanbanBoard from '@/components/board/KanbanBoard.vue'
</script>

<template>
  <div class="flex h-full flex-col">
    <header class="border-b border-slate-200 bg-white px-4 py-3">
      <h1 class="text-base font-semibold text-slate-800">Board</h1>
      <p class="text-xs text-slate-400">Drag cards between Todo · In Progress · Done</p>
    </header>
    <div class="min-h-0 flex-1">
      <KanbanBoard />
    </div>
  </div>
</template>
