import { defineStore } from 'pinia'

interface SettingsState {
  apiKey: string
  model: string
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    apiKey: '',
    model: 'claude-opus-4-5',
  }),
  getters: {
    hasKey: (state): boolean => state.apiKey.trim().length > 0,
  },
  actions: {
    setApiKey(key: string) {
      this.apiKey = key.trim()
    },
    clearApiKey() {
      this.apiKey = ''
    },
    setModel(model: string) {
      this.model = model
    },
  },
  persist: {
    key: 'prod-app-settings',
  },
})
