import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import type { Card, ColumnData, ColumnId } from '@/types/board'

function makeDefaultColumns(): ColumnData[] {
  return [
    { id: 'todo', title: 'Todo', cards: [] },
    { id: 'in-progress', title: 'In Progress', cards: [] },
    { id: 'done', title: 'Done', cards: [] },
  ]
}

interface BoardState {
  columns: ColumnData[]
}

export const useBoardStore = defineStore('board', {
  state: (): BoardState => ({
    columns: makeDefaultColumns(),
  }),
  getters: {
    totalCards: (state): number =>
      state.columns.reduce((sum, c) => sum + c.cards.length, 0),
    columnById: (state) => {
      return (id: ColumnId): ColumnData | undefined =>
        state.columns.find((c) => c.id === id)
    },
  },
  actions: {
    addCard(columnId: ColumnId, title: string, description = '') {
      const trimmed = title.trim()
      if (!trimmed) return
      const column = this.columns.find((c) => c.id === columnId)
      if (!column) return
      const now = Date.now()
      const card: Card = {
        id: nanoid(),
        title: trimmed,
        description: description.trim() || undefined,
        createdAt: now,
        updatedAt: now,
      }
      column.cards.push(card)
    },
    updateCard(cardId: string, patch: Partial<Pick<Card, 'title' | 'description'>>) {
      for (const column of this.columns) {
        const card = column.cards.find((c) => c.id === cardId)
        if (card) {
          if (patch.title !== undefined) card.title = patch.title.trim()
          if (patch.description !== undefined)
            card.description = patch.description.trim() || undefined
          card.updatedAt = Date.now()
          return
        }
      }
    },
    deleteCard(cardId: string) {
      for (const column of this.columns) {
        const idx = column.cards.findIndex((c) => c.id === cardId)
        if (idx !== -1) {
          column.cards.splice(idx, 1)
          return
        }
      }
    },
    resetBoard() {
      this.columns = makeDefaultColumns()
    },
  },
  persist: {
    key: 'prod-app-board',
  },
})
