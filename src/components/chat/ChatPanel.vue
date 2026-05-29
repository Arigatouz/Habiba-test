<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import { useAnthropic } from '@/composables/useAnthropic'
import ChatMessage from '@/components/chat/ChatMessage.vue'
import ContextSnapshot from '@/components/chat/ContextSnapshot.vue'

const chat = useChatStore()
const { messages, isLoading } = storeToRefs(chat)
const { send } = useAnthropic()

const draft = ref('')
const listEl = ref<HTMLElement | null>(null)

async function scrollToBottom() {
  await nextTick()
  if (listEl.value) listEl.value.scrollTop = listEl.value.scrollHeight
}

watch(() => messages.value.map((m) => m.content).join('|'), scrollToBottom)

async function submit() {
  const text = draft.value
  if (!text.trim() || isLoading.value) return
  draft.value = ''
  await send(text)
}

const suggestions = [
  'What did I draw? How can I improve it?',
  'Turn my sketch into kanban tasks.',
  'Help me prioritize my Todo column.',
]
</script>

<template>
  <div class="flex h-full flex-col bg-slate-50">
    <header class="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      <div>
        <h1 class="text-base font-semibold text-slate-800">AI Assistant</h1>
        <p class="text-xs text-slate-400">Claude can see your drawing & board</p>
      </div>
      <button
        v-if="messages.length"
        class="rounded-lg px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100"
        @click="chat.clear()"
      >
        Clear chat
      </button>
    </header>

    <ContextSnapshot />

    <div ref="listEl" class="scroll-thin flex-1 space-y-3 overflow-y-auto p-4">
      <div v-if="!messages.length" class="flex h-full flex-col items-center justify-center text-center">
        <div class="mb-2 text-4xl">✨</div>
        <p class="mb-4 max-w-xs text-sm text-slate-500">
          Ask Claude to review your drawing, brainstorm, or break ideas into tasks.
        </p>
        <div class="flex flex-col gap-2">
          <button
            v-for="s in suggestions"
            :key="s"
            class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:border-brand-300 hover:text-brand-700"
            @click="((draft = s), submit())"
          >
            {{ s }}
          </button>
        </div>
      </div>
      <ChatMessage v-for="m in messages" :key="m.id" :message="m" />
    </div>

    <form class="border-t border-slate-200 bg-white p-3" @submit.prevent="submit">
      <div class="flex items-end gap-2">
        <textarea
          v-model="draft"
          rows="1"
          placeholder="Message Claude…"
          class="scroll-thin max-h-32 flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          @keydown.enter.exact.prevent="submit"
        />
        <button
          type="submit"
          :disabled="isLoading || !draft.trim()"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-40"
        >
          <span v-if="isLoading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span v-else>↑</span>
        </button>
      </div>
    </form>
  </div>
</template>
