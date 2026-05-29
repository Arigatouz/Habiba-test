<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'
import type { Card, ColumnData } from '@/types/board'
import { useBoardStore } from '@/stores/board'
import KanbanCard from '@/components/board/KanbanCard.vue'
import CardEditModal from '@/components/board/CardEditModal.vue'

const props = defineProps<{ column: ColumnData }>()
const board = useBoardStore()

const addingCard = ref(false)
const newTitle = ref('')
const editingCard = ref<Card | null>(null)

const accent: Record<string, string> = {
  todo: 'bg-slate-400',
  'in-progress': 'bg-amber-400',
  done: 'bg-emerald-400',
}

function submitNew() {
  const title = newTitle.value.trim()
  if (!title) return
  board.addCard(props.column.id, title)
  newTitle.value = ''
}

function saveEdit(title: string, description: string) {
  if (editingCard.value) {
    board.updateCard(editingCard.value.id, { title, description })
  }
  editingCard.value = null
}
</script>

<template>
  <section
    class="flex h-full min-h-0 w-72 shrink-0 flex-col rounded-xl bg-slate-100 md:w-auto md:flex-1"
  >
    <header class="flex items-center gap-2 px-3 pt-3 pb-2">
      <span class="h-2.5 w-2.5 rounded-full" :class="accent[column.id]" />
      <h2 class="text-sm font-semibold text-slate-700">{{ column.title }}</h2>
      <span class="rounded-full bg-white px-2 py-0.5 text-xs text-slate-400">
        {{ column.cards.length }}
      </span>
    </header>

    <draggable
      v-model="column.cards"
      :group="{ name: 'kanban' }"
      item-key="id"
      class="scroll-thin flex-1 space-y-2 overflow-y-auto px-3 pb-2"
      ghost-class="opacity-40"
      :animation="150"
    >
      <template #item="{ element }">
        <KanbanCard
          :card="element"
          @edit="editingCard = element"
          @delete="board.deleteCard(element.id)"
        />
      </template>
    </draggable>

    <div class="px-3 pb-3">
      <form v-if="addingCard" @submit.prevent="submitNew">
        <textarea
          v-model="newTitle"
          rows="2"
          autofocus
          placeholder="Card title…"
          class="w-full resize-none rounded-lg border border-slate-300 px-2.5 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          @keydown.enter.exact.prevent="submitNew"
        />
        <div class="mt-1.5 flex gap-2">
          <button
            type="submit"
            class="rounded-md bg-brand-600 px-3 py-1 text-xs font-medium text-white hover:bg-brand-700"
          >
            Add
          </button>
          <button
            type="button"
            class="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-200"
            @click="((addingCard = false), (newTitle = ''))"
          >
            Cancel
          </button>
        </div>
      </form>
      <button
        v-else
        class="w-full rounded-lg px-2 py-2 text-left text-sm text-slate-500 transition hover:bg-slate-200"
        @click="addingCard = true"
      >
        + Add a card
      </button>
    </div>

    <CardEditModal
      :open="editingCard !== null"
      :initial-title="editingCard?.title"
      :initial-description="editingCard?.description"
      @save="saveEdit"
      @close="editingCard = null"
    />
  </section>
</template>
