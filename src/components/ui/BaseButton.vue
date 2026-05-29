<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    type?: 'button' | 'submit'
    disabled?: boolean
    title?: string
  }>(),
  { variant: 'primary', type: 'button', disabled: false, title: '' },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :title="title"
    class="inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
    :class="{
      'bg-brand-600 text-white hover:bg-brand-700': variant === 'primary',
      'bg-slate-100 text-slate-700 hover:bg-slate-200': variant === 'secondary',
      'text-slate-600 hover:bg-slate-100': variant === 'ghost',
      'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
    }"
  >
    <slot />
  </button>
</template>
