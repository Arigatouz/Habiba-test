<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'
import { useAnthropic } from '@/composables/useAnthropic'
import { CLAUDE_MODELS } from '@/types/chat'
import BaseButton from '@/components/ui/BaseButton.vue'

const settings = useSettingsStore()
const { model, hasKey } = storeToRefs(settings)
const { verifyKey } = useAnthropic()

const keyInput = ref(settings.apiKey)
const showKey = ref(false)
const saved = ref(false)
const verifying = ref(false)
const verifyResult = ref<{ ok: boolean; error?: string } | null>(null)

function save() {
  settings.setApiKey(keyInput.value)
  saved.value = true
  verifyResult.value = null
  setTimeout(() => (saved.value = false), 2000)
}

function clear() {
  settings.clearApiKey()
  keyInput.value = ''
  verifyResult.value = null
}

async function verify() {
  if (!keyInput.value.trim()) return
  verifying.value = true
  verifyResult.value = null
  verifyResult.value = await verifyKey(keyInput.value.trim(), model.value)
  verifying.value = false
}
</script>

<template>
  <div class="scroll-thin h-full overflow-y-auto">
    <div class="mx-auto max-w-xl p-4 md:p-8">
      <h1 class="mb-1 text-xl font-semibold text-slate-800">Settings</h1>
      <p class="mb-6 text-sm text-slate-400">Configure the Anthropic API for AI features.</p>

      <section class="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Anthropic API key</label>
          <div class="flex gap-2">
            <div class="relative flex-1">
              <input
                v-model="keyInput"
                :type="showKey ? 'text' : 'password'"
                placeholder="sk-ant-…"
                autocomplete="off"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 pr-16 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
                @click="showKey = !showKey"
              >
                {{ showKey ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>
          <p class="mt-1.5 text-xs text-slate-400">
            Stored only in this browser (localStorage). Requests go directly from your browser to
            api.anthropic.com — get a key at
            <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener" class="text-brand-600 underline">console.anthropic.com</a>.
          </p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Model</label>
          <select
            :value="model"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            @change="settings.setModel(($event.target as HTMLSelectElement).value)"
          >
            <option v-for="m in CLAUDE_MODELS" :key="m.id" :value="m.id">{{ m.label }}</option>
          </select>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <BaseButton @click="save">Save</BaseButton>
          <BaseButton variant="secondary" :disabled="!keyInput.trim() || verifying" @click="verify">
            {{ verifying ? 'Verifying…' : 'Verify key' }}
          </BaseButton>
          <BaseButton v-if="hasKey" variant="ghost" @click="clear">Clear key</BaseButton>
          <span v-if="saved" class="text-sm text-emerald-600">✓ Saved</span>
        </div>

        <p v-if="verifyResult?.ok" class="text-sm text-emerald-600">✓ Key works.</p>
        <p v-else-if="verifyResult?.error" class="text-sm text-red-600">{{ verifyResult.error }}</p>

        <div
          class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
          :class="hasKey ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'"
        >
          <span>{{ hasKey ? '✓' : '⚠️' }}</span>
          <span>{{ hasKey ? 'AI features are enabled.' : 'No key set — AI features are locked.' }}</span>
        </div>
      </section>
    </div>
  </div>
</template>
