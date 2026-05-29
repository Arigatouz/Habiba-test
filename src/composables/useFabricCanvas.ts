import { onMounted, onUnmounted, shallowRef, watch, type Ref } from 'vue'
import * as fabric from 'fabric'
import { useCanvasStore } from '@/stores/canvas'
import { useUndoRedo } from '@/composables/useUndoRedo'
import { exportPNG, getBase64 } from '@/composables/useCanvasExport'
import {
  createArrow,
  createEllipse,
  createLine,
  createRectangle,
  createText,
  resizeShape,
  type ShapeStyle,
} from '@/lib/canvasHelpers'

const WHITE = '#ffffff'

export function useFabricCanvas(
  canvasElRef: Ref<HTMLCanvasElement | null>,
  containerRef: Ref<HTMLElement | null>,
) {
  const store = useCanvasStore()
  const fabricCanvas = shallowRef<fabric.Canvas | null>(null)
  const history = useUndoRedo(() => fabricCanvas.value)

  let resizeObserver: ResizeObserver | null = null

  // Shape-drawing state machine (used for rectangle/circle/line/arrow).
  let isDrawingShape = false
  let startX = 0
  let startY = 0
  let activeShape: fabric.Object | null = null

  function currentStyle(): ShapeStyle {
    return { stroke: store.strokeColor, strokeWidth: store.strokeWidth }
  }

  /** Persist to the store (for cross-tab/assistant access) and push history. */
  function record() {
    history.snapshot()
    const c = fabricCanvas.value
    if (c) store.saveSnapshot(JSON.stringify(c.toJSON()))
  }

  function applyTool() {
    const canvas = fabricCanvas.value
    if (!canvas) return
    const tool = store.activeTool

    if (tool === 'pen' || tool === 'eraser') {
      canvas.isDrawingMode = true
      canvas.selection = false
      const brush = new fabric.PencilBrush(canvas)
      brush.color = tool === 'eraser' ? WHITE : store.strokeColor
      brush.width = tool === 'eraser' ? store.strokeWidth * 3 : store.strokeWidth
      canvas.freeDrawingBrush = brush
    } else {
      canvas.isDrawingMode = false
      const selectMode = tool === 'select'
      canvas.selection = selectMode
      canvas.forEachObject((obj) => {
        obj.selectable = selectMode
        obj.evented = selectMode
      })
      canvas.defaultCursor = selectMode ? 'default' : 'crosshair'
      canvas.discardActiveObject()
      canvas.requestRenderAll()
    }
  }

  function onMouseDown(opt: fabric.TPointerEventInfo<fabric.TPointerEvent>) {
    const canvas = fabricCanvas.value
    if (!canvas) return
    const tool = store.activeTool
    if (tool === 'select' || tool === 'pen' || tool === 'eraser') return

    const p = canvas.getScenePoint(opt.e)
    startX = p.x
    startY = p.y

    if (tool === 'text') {
      const text = createText(startX, startY, currentStyle())
      canvas.add(text)
      canvas.setActiveObject(text)
      text.enterEditing()
      text.selectAll()
      return
    }

    isDrawingShape = true
    if (tool === 'rectangle') activeShape = createRectangle(startX, startY, currentStyle())
    else if (tool === 'circle') activeShape = createEllipse(startX, startY, currentStyle())
    else activeShape = createLine(startX, startY, currentStyle()) // line + arrow share a line preview

    if (activeShape) {
      activeShape.selectable = false
      activeShape.evented = false
      canvas.add(activeShape)
    }
  }

  function onMouseMove(opt: fabric.TPointerEventInfo<fabric.TPointerEvent>) {
    const canvas = fabricCanvas.value
    if (!canvas || !isDrawingShape || !activeShape) return
    const p = canvas.getScenePoint(opt.e)
    resizeShape(activeShape, startX, startY, p.x, p.y)
    canvas.requestRenderAll()
  }

  function onMouseUp(opt: fabric.TPointerEventInfo<fabric.TPointerEvent>) {
    const canvas = fabricCanvas.value
    if (!canvas || !isDrawingShape) return
    isDrawingShape = false

    const tool = store.activeTool
    if (tool === 'arrow' && activeShape) {
      // Replace the preview line with a proper arrow group.
      const p = canvas.getScenePoint(opt.e)
      canvas.remove(activeShape)
      const arrow = createArrow(startX, startY, p.x, p.y, currentStyle())
      if (arrow) {
        arrow.selectable = false
        arrow.evented = false
        canvas.add(arrow)
      }
    } else if (activeShape) {
      // Discard zero-size shapes (a plain click with no drag).
      const w = activeShape.width ?? 0
      const h = activeShape.height ?? 0
      const isLine = activeShape instanceof fabric.Line
      const lineLen = isLine
        ? Math.hypot(
            (activeShape as fabric.Line).x2 - (activeShape as fabric.Line).x1,
            (activeShape as fabric.Line).y2 - (activeShape as fabric.Line).y1,
          )
        : 0
      if (!isLine && w < 2 && h < 2) canvas.remove(activeShape)
      else if (isLine && lineLen < 3) canvas.remove(activeShape)
    }

    activeShape = null
    canvas.requestRenderAll()
    record()
  }

  onMounted(() => {
    const el = canvasElRef.value
    const container = containerRef.value
    if (!el || !container) return

    const { width, height } = container.getBoundingClientRect()
    const canvas = new fabric.Canvas(el, {
      width: Math.max(width, 1),
      height: Math.max(height, 1),
      backgroundColor: WHITE,
      preserveObjectStacking: true,
      isDrawingMode: true,
    })
    fabricCanvas.value = canvas

    // Restore any previously saved drawing, then seed the history baseline.
    const restore = async () => {
      if (store.snapshotJson) {
        await canvas.loadFromJSON(store.snapshotJson)
        canvas.renderAll()
      }
      history.reset()
      applyTool()
    }
    void restore()

    // Free-draw strokes complete via path:created.
    canvas.on('path:created', () => record())
    // Moving / resizing existing objects in select mode.
    canvas.on('object:modified', () => record())
    canvas.on('mouse:down', onMouseDown)
    canvas.on('mouse:move', onMouseMove)
    canvas.on('mouse:up', onMouseUp)
    // Drop empty text boxes; record edits.
    canvas.on('text:editing:exited', (e) => {
      const target = e.target as fabric.IText | undefined
      if (target && target.text?.trim() === '') canvas.remove(target)
      record()
    })

    resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (!rect) return
      canvas.setDimensions({
        width: Math.max(rect.width, 1),
        height: Math.max(rect.height, 1),
      })
      canvas.renderAll()
    })
    resizeObserver.observe(container)
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
    const canvas = fabricCanvas.value
    if (canvas) {
      // Final persistence so the assistant sees the latest drawing.
      store.saveSnapshot(JSON.stringify(canvas.toJSON()))
      void canvas.dispose()
    }
    fabricCanvas.value = null
  })

  // React to tool / color / width changes from the toolbar.
  watch(
    () => [store.activeTool, store.strokeColor, store.strokeWidth],
    () => applyTool(),
  )

  function clear() {
    const canvas = fabricCanvas.value
    if (!canvas) return
    canvas.remove(...canvas.getObjects())
    canvas.backgroundColor = WHITE
    canvas.renderAll()
    record()
  }

  function downloadImage() {
    if (fabricCanvas.value) exportPNG(fabricCanvas.value)
  }

  function toBase64(): string {
    return fabricCanvas.value ? getBase64(fabricCanvas.value) : ''
  }

  return {
    fabricCanvas,
    undo: history.undo,
    redo: history.redo,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    clear,
    downloadImage,
    toBase64,
  }
}
