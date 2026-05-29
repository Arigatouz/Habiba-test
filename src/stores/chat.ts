import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import type { ChatMessage, MessageRole } from '@/types/chat'

interface ChatStoreState {
  messages: ChatMessage[]
  isLoading: boolean
  includeCanvas: boolean
  includeBoard: boolean
}

export const useChatStore = defineStore('chat', {
  state: (): ChatStoreState => ({
    messages: [],
    isLoading: false,
    includeCanvas: true,
    includeBoard: true,
  }),
  actions: {
    addMessage(
      role: MessageRole,
      content: string,
      extra: Partial<Pick<ChatMessage, 'hadCanvas' | 'isError'>> = {},
    ): string {
      const id = nanoid()
      this.messages.push({
        id,
        role,
        content,
        timestamp: Date.now(),
        ...extra,
      })
      return id
    },
    appendToMessage(id: string, chunk: string) {
      const msg = this.messages.find((m) => m.id === id)
      if (msg) msg.content += chunk
    },
    setMessageContent(id: string, content: string, isError = false) {
      const msg = this.messages.find((m) => m.id === id)
      if (msg) {
        msg.content = content
        msg.isError = isError
      }
    },
    setLoading(loading: boolean) {
      this.isLoading = loading
    },
    clear() {
      this.messages = []
    },
  },
  persist: {
    key: 'prod-app-chat',
    pick: ['messages', 'includeCanvas', 'includeBoard'],
  },
})
