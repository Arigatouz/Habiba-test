import type { ColumnData } from '@/types/board'

/** Format the kanban board as a markdown string for the AI context. */
export function buildBoardSummary(columns: ColumnData[]): string {
  const lines: string[] = ['# Current Kanban Board']
  for (const column of columns) {
    lines.push('', `## ${column.title} (${column.cards.length})`)
    if (column.cards.length === 0) {
      lines.push('- _(empty)_')
      continue
    }
    for (const card of column.cards) {
      const desc = card.description ? ` — ${card.description}` : ''
      lines.push(`- **${card.title}**${desc}`)
    }
  }
  return lines.join('\n')
}
