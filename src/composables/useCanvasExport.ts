import * as fabric from 'fabric'

/** Trigger a browser download of the canvas as a high-res PNG. */
export function exportPNG(canvas: fabric.Canvas, filename = 'drawing.png') {
  const dataUrl = canvas.toDataURL({
    format: 'png',
    multiplier: 2,
    enableRetinaScaling: true,
  })
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/** Raw base64 PNG (data-URI prefix stripped) for the Anthropic vision API. */
export function getBase64(canvas: fabric.Canvas): string {
  const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 1 })
  return dataUrl.split(',')[1] ?? ''
}

/**
 * Render a stored canvas JSON snapshot to a base64 PNG without needing a live,
 * on-DOM canvas. Used by the assistant view to "see" the drawing made on the
 * separate Draw tab. Returns an empty string for empty / invalid snapshots.
 */
export async function snapshotToBase64(json: string | null): Promise<string> {
  if (!json) return ''
  let parsed: { objects?: unknown[] }
  try {
    parsed = JSON.parse(json)
  } catch {
    return ''
  }
  if (!Array.isArray(parsed.objects) || parsed.objects.length === 0) return ''

  const el = document.createElement('canvas')
  const staticCanvas = new fabric.StaticCanvas(el, {
    width: 1280,
    height: 800,
    backgroundColor: '#ffffff',
  })
  try {
    await staticCanvas.loadFromJSON(json)
    staticCanvas.renderAll()
    const dataUrl = staticCanvas.toDataURL({ format: 'png', multiplier: 1 })
    return dataUrl.split(',')[1] ?? ''
  } finally {
    staticCanvas.dispose()
  }
}
