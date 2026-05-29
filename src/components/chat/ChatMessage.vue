<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import type { ChatMessage } from '@/types/chat'

const props = defineProps<{ message: ChatMessage }>()

const md = new MarkdownIt({ breaks: true, linkify: true })
const rendered = computed(() => md.render(props.message.content || ''))
const isUser = computed(() => props.message.role === 'user')
</script>

<template>
  <div class="flex" :class="isUser ? 'justify-end' : 'justify-start'">
    <div
      class="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm"
      :class="
        isUser
          ? 'bg-brand-600 text-white'
          : message.isError
            ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
            : 'bg-white text-slate-700 shadow-sm ring-1 ring-slate-100'
      "
    >
      <div v-if="isUser" class="whitespace-pre-wrap">{{ message.content }}</div>
      <div v-else-if="message.content" class="markdown-body" v-html="rendered" />
      <div v-else class="flex gap-1 py-1">
        <span class="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.3s]" />
        <span class="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.15s]" />
        <span class="h-2 w-2 animate-bounce rounded-full bg-slate-300" />
      </div>
      <div v-if="isUser && message.hadCanvas" class="mt-1 text-[10px] text-brand-100">
        🎨 drawing attached
      </div>
    </div>
  </div>
</template>
