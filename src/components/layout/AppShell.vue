<script setup lang="ts">
import NavBar from '@/components/layout/NavBar.vue'
</script>

<template>
  <div class="flex h-full w-full flex-col bg-slate-50 md:flex-row">
    <NavBar />
    <!-- Full-screen view area. Bottom padding on mobile clears the fixed nav bar. -->
    <main class="min-h-0 flex-1 overflow-hidden pb-16 md:pb-0">
      <RouterView v-slot="{ Component }">
        <component :is="Component" class="h-full" />
      </RouterView>
    </main>
  </div>
</template>
