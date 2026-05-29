import { defineStore } from 'pinia'
import type { DrawingTool } from '@/types/canvas'

interface CanvasStoreState {
  activeTool: DrawingTool
  strokeColor: string
  strokeWidth: number
  /** Latest serialized Fabric canvas (JSON string), persisted so the
   *  assistant can "see" the drawing across full-screen tab switches. */
  snapshotJson: string | null
}

export const useCanvasStore = defineStore('canvas', {
  state: (): CanvasStoreState => ({
    activeTool: 'pen',
    strokeColor: '#1e293b',
    strokeWidth: 4,
    snapshotJson: null,
  }),
  getters: {
    hasDrawing: (state): boolean => {
      if (!state.snapshotJson) return false
      try {
        const parsed = JSON.parse(state.snapshotJson)
        return Array.isArray(parsed.objects) && parsed.objects.length > 0
      } catch {
        return false
      }
    },
  },
  actions: {
    setTool(tool: DrawingTool) {
      this.activeTool = tool
    },
    setColor(color: string) {
      this.strokeColor = color
    },
    setStrokeWidth(width: number) {
      this.strokeWidth = width
    },
    saveSnapshot(json: string | null) {
      this.snapshotJson = json
    },
  },
  persist: {
    key: 'prod-app-canvas',
    // The active tool is transient UI state; only persist the drawing itself.
    pick: ['snapshotJson', 'strokeColor', 'strokeWidth'],
  },
})
