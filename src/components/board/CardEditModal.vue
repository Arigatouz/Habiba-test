<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps<{
  open: boolean
  initialTitle?: string
  initialDescription?: string
}>()
const emit = defineEmits<{ save: [title: string, description: string]; close: [] }>()

const title = ref('')
const description = ref('')

watch(
  () => props.open,
  (open) => {
    if (open) {
      title.value = props.initialTitle ?? ''
      description.value = props.initialDescription ?? ''
    }
  },
)

function save() {
  if (!title.value.trim()) return
  emit('save', title.value, description.value)
}
</script>

<template>
  <BaseModal :open="open" title="Edit card" @close="emit('close')">
    <form class="space-y-3" @submit.prevent="save">
      <div>
        <label class="mb-1 block text-xs font-medium text-slate-500">Title</label>
        <input
          v-model="title"
          autofocus
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="Card title"
        />
      </div>
      <div>
        <label class="mb-1 block text-xs font-medium text-slate-500">Description</label>
        <textarea
          v-model="description"
          rows="4"
          class="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="Add more detail…"
        />
      </div>
      <div class="flex justify-end gap-2 pt-1">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton type="submit" :disabled="!title.trim()">Save</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
