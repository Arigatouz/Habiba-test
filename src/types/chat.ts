export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  hadCanvas?: boolean
  isError?: boolean
}

export const CLAUDE_MODELS = [
  { id: 'claude-opus-4-5', label: 'Claude Opus 4.5 (most capable)' },
  { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5 (balanced)' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 (fastest)' },
] as const
