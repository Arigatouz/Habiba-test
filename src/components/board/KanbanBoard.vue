<script setup lang="ts">
import { useBoardStore } from '@/stores/board'
import KanbanColumn from '@/components/board/KanbanColumn.vue'

const board = useBoardStore()
</script>

<template>
  <div class="scroll-thin flex h-full gap-4 overflow-x-auto p-4 md:overflow-x-hidden">
    <KanbanColumn v-for="column in board.columns" :key="column.id" :column="column" />
  </div>
</template>
