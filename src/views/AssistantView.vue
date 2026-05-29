<script setup lang="ts">
import ApiKeyGuard from '@/components/ui/ApiKeyGuard.vue'
import ChatPanel from '@/components/chat/ChatPanel.vue'
</script>

<template>
  <ApiKeyGuard>
    <ChatPanel />
  </ApiKeyGuard>
</template>
