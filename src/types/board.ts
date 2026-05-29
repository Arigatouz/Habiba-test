export type ColumnId = 'todo' | 'in-progress' | 'done'

export interface Card {
  id: string
  title: string
  description?: string
  createdAt: number
  updatedAt: number
}

export interface ColumnData {
  id: ColumnId
  title: string
  cards: Card[]
}
