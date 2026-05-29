<script setup lang="ts">
defineProps<{ open: boolean; title?: string }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
        @click.self="emit('close')"
      >
        <div
          class="w-full max-w-lg rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
          @click.stop
        >
          <header
            v-if="title"
            class="flex items-center justify-between border-b border-slate-100 px-5 py-3.5"
          >
            <h2 class="text-base font-semibold text-slate-800">{{ title }}</h2>
            <button
              class="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close"
              @click="emit('close')"
            >
              ✕
            </button>
          </header>
          <div class="p-5">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
