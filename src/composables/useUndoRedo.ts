import { ref, computed } from 'vue'
import type * as fabric from 'fabric'

/**
 * History stack of canvas JSON snapshots. The `isRestoring` guard prevents the
 * object:added/modified/removed events fired during loadFromJSON from recording
 * new (duplicate) history entries.
 */
export function useUndoRedo(getCanvas: () => fabric.Canvas | null) {
  const history = ref<string[]>([])
  const index = ref(-1)
  let isRestoring = false

  const canUndo = computed(() => index.value > 0)
  const canRedo = computed(() => index.value < history.value.length - 1)

  function snapshot() {
    if (isRestoring) return
    const canvas = getCanvas()
    if (!canvas) return
    const json = JSON.stringify(canvas.toJSON())
    // Drop any "redo" entries past the current point.
    history.value = history.value.slice(0, index.value + 1)
    history.value.push(json)
    index.value = history.value.length - 1
  }

  async function restore(json: string) {
    const canvas = getCanvas()
    if (!canvas) return
    isRestoring = true
    await canvas.loadFromJSON(json)
    canvas.renderAll()
    isRestoring = false
  }

  async function undo() {
    if (!canUndo.value) return
    index.value -= 1
    await restore(history.value[index.value])
  }

  async function redo() {
    if (!canRedo.value) return
    index.value += 1
    await restore(history.value[index.value])
  }

  /** Seed the stack with the current canvas state (the baseline). */
  function reset() {
    history.value = []
    index.value = -1
    snapshot()
  }

  return { snapshot, undo, redo, reset, canUndo, canRedo }
}
